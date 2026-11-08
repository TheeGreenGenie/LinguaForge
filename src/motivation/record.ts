// Records an answer: updates the FSRS card, review log, and today's XP/streak data.
import { db, getMeta, setMeta, type DayRecord } from '../data/db';
import type { LangCode } from '../data/types';
import { review, ratingFor, type StoredCard } from '../srs/scheduler';
import type { ErrorType } from '../lang/grade';
import { xpForAnswer, localDate, currentStreak, freezesEarned, settleFreezes } from './streaks';

async function bumpDay(lang: LangCode, delta: Partial<DayRecord>, now = Date.now()): Promise<DayRecord> {
  const date = localDate(now);
  const d: DayRecord = (await db.days.get(date)) ?? { date, xp: 0, reviews: 0, correct: 0, newItems: 0, seconds: 0, langs: [] };
  d.xp += delta.xp ?? 0;
  d.reviews += delta.reviews ?? 0;
  d.correct += delta.correct ?? 0;
  d.newItems += delta.newItems ?? 0;
  d.seconds += delta.seconds ?? 0;
  if (!d.langs.includes(lang)) d.langs.push(lang);
  await db.days.put(d);
  return d;
}

export async function recordAnswer(card: StoredCard, correct: boolean, errorType: ErrorType, opts: { ms?: number; isNewItem?: boolean; goal: number }): Promise<{ xp: number; card: StoredCard }> {
  const now = Date.now();
  const before = await streakNow(opts.goal);
  const updated = review(card, ratingFor(correct, errorType, opts.ms), errorType, now);
  await db.cards.put(updated);
  await db.reviews.add({ lang: card.lang, cardId: card.id, at: now, correct, errorType, ms: opts.ms });
  const xp = xpForAnswer(correct, errorType, !!opts.isNewItem);
  await bumpDay(card.lang, { xp, reviews: 1, correct: correct ? 1 : 0, newItems: opts.isNewItem ? 1 : 0, seconds: Math.min(60, Math.round((opts.ms ?? 0) / 1000)) }, now);
  const after = await streakNow(opts.goal);
  if (after > before) {
    const held = await getMeta<number>('freezes', 0);
    await setMeta('freezes', freezesEarned(before, after, held));
  }
  return { xp, card: updated };
}

export async function awardXp(lang: LangCode, xp: number) {
  await bumpDay(lang, { xp });
}

export async function allDays(): Promise<Map<string, DayRecord>> {
  return new Map((await db.days.toArray()).map((d) => [d.date, d]));
}

export async function streakNow(goal: number): Promise<number> {
  return currentStreak(await allDays(), localDate(), goal);
}

/** On app open: spend streak freezes on missed days if that saves the streak. */
export async function settleOnOpen(goal: number): Promise<string[]> {
  const days = await allDays();
  const held = await getMeta<number>('freezes', 0);
  const { freezeDates, freezesLeft } = settleFreezes(days, localDate(), goal, held);
  for (const date of freezeDates) {
    await db.days.put({ date, xp: 0, reviews: 0, correct: 0, newItems: 0, seconds: 0, langs: [], freezeUsed: true });
  }
  if (freezeDates.length) await setMeta('freezes', freezesLeft);
  return freezeDates;
}

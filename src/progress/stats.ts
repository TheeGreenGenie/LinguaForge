// Progress statistics: known words, error-type accuracy, level readiness.
import { db } from '../data/db';
import type { LangCode } from '../data/types';
import type { LangData } from '../data/repo';
import { isMature } from '../srs/scheduler';
import { LEVELS, wordTarget, workingLevel } from './levels';
import { passedLevels } from '../srs/session';

export interface LangStats {
  introduced: number;
  known: number; // mature both directions
  knownIds: Set<string>;
  knownChars: number;
  target: number;
  workingLevel: number;
  passed: number[];
  due: number;
  toneAccuracy: number | null;
  registerAccuracy: number | null;
  errorCounts: Record<string, number>;
  totalReviews: number;
}

export async function langStats(data: LangData): Promise<LangStats> {
  const lang = data.lang;
  const cards = await db.cards.where('lang').equals(lang).toArray();
  const byWord = new Map<string, { recog?: boolean; prod?: boolean }>();
  for (const c of cards) {
    if (c.itemType !== 'word') continue;
    const e = byWord.get(c.itemId) ?? {};
    if (c.dir === 'recog') e.recog = isMature(c);
    if (c.dir === 'prod') e.prod = isMature(c);
    byWord.set(c.itemId, e);
  }
  const knownIds = new Set([...byWord.entries()].filter(([, v]) => v.recog && v.prod).map(([k]) => k));
  const chars = new Set<string>();
  if (lang === 'zh') for (const id of knownIds) { const w = data.words.get(id); if (w) for (const ch of w.lemma) if (/\p{Script=Han}/u.test(ch)) chars.add(ch); }
  const passed = await passedLevels(lang);
  const wl = workingLevel(passed);
  const reviews = await db.reviews.where('lang').equals(lang).toArray();
  const errorCounts: Record<string, number> = {};
  for (const r of reviews) errorCounts[r.errorType] = (errorCounts[r.errorType] ?? 0) + 1;
  // tone accuracy: share of tone-bearing answers without a tone error, on cards of tonal items
  const toneCards = new Set(lang === 'yo' || lang === 'zh' ? cards.map((c) => c.id) : []);
  const toneRelevant = reviews.filter((r) => toneCards.has(r.cardId) && (r.correct || r.errorType === 'tone' || r.errorType === 'underdot'));
  const toneAccuracy = lang === 'yo' || lang === 'zh'
    ? toneRelevant.length ? toneRelevant.filter((r) => r.errorType !== 'tone' && r.errorType !== 'underdot').length / toneRelevant.length : null
    : null;
  const regCardIds = new Set(cards.filter((c) => c.itemType === 'exercise' ? data.lessons.some((l) => l.kind === 'register' && l.exercises.some((e) => e.id === c.itemId)) : c.itemType === 'sentence' && !!data.sentences.get(c.itemId)?.register).map((c) => c.id));
  const regReviews = reviews.filter((r) => regCardIds.has(r.cardId));
  const registerAccuracy = regReviews.length ? regReviews.filter((r) => r.errorType !== 'register').length / regReviews.length : null;
  const due = await db.cards.where('[lang+due]').between([lang, 0], [lang, Date.now()]).count();
  return {
    introduced: byWord.size,
    known: knownIds.size,
    knownIds,
    knownChars: chars.size,
    target: wordTarget(Math.max(1, Math.min(6, wl)) as 1, data.words.size),
    workingLevel: wl,
    passed,
    due,
    toneAccuracy,
    registerAccuracy,
    errorCounts,
    totalReviews: reviews.length,
  };
}

/** Exam N (1..5) unlocks when known words reach that level's target and its lessons are done. */
export function examReady(stats: LangStats, level: number, data: LangData, lessonsDone: Set<string>): { ready: boolean; reason?: string } {
  if (level === 0) return { ready: true };
  if (!stats.passed.includes(level - 1)) return { ready: false, reason: `Pass the Level ${level - 1} exam first.` };
  const target = wordTarget(level as 1, data.words.size);
  if (stats.known < target) return { ready: false, reason: `Know ${target} words in both directions (you know ${stats.known}). "Known" means remembered for 21+ days.` };
  const pending = data.lessons.filter((l) => l.level === level && !lessonsDone.has(l.id));
  if (pending.length) return { ready: false, reason: `Finish the Level ${level} lessons: ${pending.map((l) => l.title).join(', ')}` };
  return { ready: true };
}

export async function lessonsDone(lang: LangCode): Promise<Set<string>> {
  return new Set((await db.lessonProgress.where('lang').equals(lang).toArray()).map((l) => l.id));
}

export { LEVELS };

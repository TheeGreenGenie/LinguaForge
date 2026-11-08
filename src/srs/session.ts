// Builds a study session: due reviews + new words + new sentences, balanced
// along Nation's Four Strands, with a review-debt gate on new material.
import { db } from '../data/db';
import type { LangCode, Exercise, Sentence, Word } from '../data/types';
import type { LangData, Settings } from '../data/repo';
import { newCard, isNew, cardId, type StoredCard } from './scheduler';
import { localDate } from '../motivation/streaks';
import { tokenize } from '../lang/tokenize';
import { canon, MARK, stripToneMarks } from '../lang/unicode';
import { workingLevel } from '../progress/levels';

export type TaskMode = 'intro' | 'mc' | 'type' | 'tiles' | 'exercise';

export interface Task {
  key: string;
  card: StoredCard;
  mode: TaskMode;
  word?: Word;
  sentence?: Sentence;
  exercise?: Exercise;
  options?: string[];
  tiles?: string[];
  isNewItem: boolean;
}

export interface SessionPlan {
  tasks: Task[];
  dueCount: number;
  debt: number;
  newBlocked: 'debt' | 'daily-limit' | null;
  level0Passed: boolean;
}

const LEVEL0_PREVIEW_WORDS = 50; // ROADMAP hole #15: don't get stuck only on drills

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Tone variants of a Yoruba word: same letters, different tone marks (for distractors). */
export function yorubaToneVariants(word: string, max = 3): string[] {
  const chars = [...canon(stripToneMarks(word))];
  const vowelIdx = chars.map((c, i) => (/[aeiou]/i.test(c) ? i : -1)).filter((i) => i >= 0);
  const variants = new Set<string>();
  const marks = ['', MARK.ACUTE, MARK.GRAVE];
  const target = canon(word).normalize('NFC');
  for (let attempt = 0; attempt < 30 && variants.size < max; attempt++) {
    const out = [...chars];
    for (const vi of [...vowelIdx].reverse()) {
      const m = marks[Math.floor(Math.random() * 3)];
      if (m) out.splice(vi + 1, 0, m);
    }
    const v = out.join('').normalize('NFC');
    if (v !== target) variants.add(v);
  }
  return [...variants];
}

export function wordOptions(data: LangData, w: Word, dir: 'recog' | 'prod'): string[] {
  const all = [...data.words.values()];
  const near = all.filter((x) => x.id !== w.id && Math.abs((x.freqRank ?? 9999) - (w.freqRank ?? 9999)) < 400);
  const pool = near.length >= 6 ? near : all.filter((x) => x.id !== w.id);
  if (dir === 'recog') {
    const samePos = pool.filter((x) => x.pos === w.pos);
    const src = samePos.length >= 3 ? samePos : pool;
    const opts = new Set<string>([w.gloss[0]]);
    for (const x of shuffle(src)) { if (opts.size >= 4) break; if (!w.gloss.includes(x.gloss[0])) opts.add(x.gloss[0]); }
    return shuffle([...opts]);
  }
  const opts = new Set<string>([w.lemma]);
  if (data.lang === 'yo') {
    // real minimal pairs first (same letters, different tones), then generated variants
    const bare = stripToneMarks(w.lemma).normalize('NFC');
    for (const x of all) if (x.id !== w.id && stripToneMarks(x.lemma).normalize('NFC') === bare) opts.add(x.lemma);
    for (const v of yorubaToneVariants(w.lemma)) { if (opts.size >= 4) break; opts.add(v); }
  }
  for (const x of shuffle(pool)) { if (opts.size >= 4) break; opts.add(x.lemma); }
  return shuffle([...opts].slice(0, 4));
}

export function sentenceTiles(data: LangData, s: Sentence): string[] {
  const toks = tokenize(s.text, data.lang).filter((t) => t.isWord).map((t) => t.text);
  const extras = shuffle([...data.words.values()].filter((w) => (w.freqRank ?? 9e9) < 800 && !toks.includes(w.lemma))).slice(0, 2).map((w) => w.lemma);
  return shuffle([...toks, ...extras]);
}

export function makeTask(data: LangData, card: StoredCard, isNewItem: boolean): Task | null {
  const base = { key: card.id + ':' + Math.random().toString(36).slice(2, 6), card, isNewItem };
  if (card.itemType === 'word') {
    const w = data.words.get(card.itemId);
    if (!w) return null;
    if (isNewItem && card.dir === 'recog') return { ...base, mode: 'intro', word: w };
    const early = card.fsrs.reps < 2;
    if (card.dir === 'recog') return early ? { ...base, mode: 'mc', word: w, options: wordOptions(data, w, 'recog') } : { ...base, mode: 'type', word: w };
    return early ? { ...base, mode: 'mc', word: w, options: wordOptions(data, w, 'prod') } : { ...base, mode: 'type', word: w };
  }
  if (card.itemType === 'sentence') {
    const s = data.sentences.get(card.itemId);
    if (!s) return null;
    if (card.dir === 'prod' && card.fsrs.reps < 3) return { ...base, mode: 'tiles', sentence: s, tiles: sentenceTiles(data, s) };
    return { ...base, mode: 'type', sentence: s };
  }
  // exercise drill
  for (const l of data.lessons) {
    const e = l.exercises.find((x) => x.id === card.itemId);
    if (e) return { ...base, mode: 'exercise', exercise: e };
  }
  return null;
}

export async function passedLevels(lang: LangCode): Promise<number[]> {
  const certs = await db.certs.where('lang').equals(lang).toArray();
  return [...new Set(certs.map((c) => c.level))];
}

export async function buildSession(data: LangData, settings: Settings, size = 20, now = Date.now()): Promise<SessionPlan> {
  const lang = data.lang;
  const due = await db.cards.where('[lang+due]').between([lang, 0], [lang, now]).toArray();
  due.sort((a, b) => a.due - b.due);
  const debt = due.filter((c) => !isNew(c)).length;
  const passed = await passedLevels(lang);
  const level0Passed = passed.includes(0);
  const today = await db.days.get(localDate(now));
  const newToday = today?.newItems ?? 0;

  const tasks: Task[] = [];
  for (const c of due.slice(0, Math.max(0, size - 4))) {
    const t = makeTask(data, c, false);
    if (t) tasks.push(t);
  }

  let newBlocked: SessionPlan['newBlocked'] = null;
  if (debt > settings.reviewDebtLimit) newBlocked = 'debt';
  else if (newToday >= settings.newPerDay) newBlocked = 'daily-limit';

  if (!newBlocked) {
    const room = Math.min(settings.newPerDay - newToday, Math.max(3, size - tasks.length));
    const existing = new Set((await db.cards.where('lang').equals(lang).primaryKeys()) as string[]);
    const wl = workingLevel(passed);
    const maxLevel = level0Passed ? Math.max(1, wl) : 1;
    let candidates = [...data.words.values()]
      .filter((w) => (w.level ?? 1) <= maxLevel && !existing.has(cardId('word', w.id, 'recog')))
      .sort((a, b) => (a.freqRank ?? 9e9) - (b.freqRank ?? 9e9));
    if (!level0Passed) {
      const introduced = [...existing].filter((k) => k.startsWith('word|')).length / 2;
      candidates = candidates.slice(0, Math.max(0, LEVEL0_PREVIEW_WORDS - introduced));
    }
    const newWords = candidates.slice(0, Math.ceil(room * 0.75));
    const fresh: StoredCard[] = [];
    for (const w of newWords) {
      const r = newCard(lang, 'word', w.id, 'recog', now);
      const p = { ...newCard(lang, 'word', w.id, 'prod', now), due: now + 10 * 60 * 1000 };
      fresh.push(r, p);
      const t = makeTask(data, r, true);
      if (t) tasks.push(t);
    }
    // meaning-focused input: sentences whose words are mostly already introduced
    if (level0Passed || existing.size > 40) {
      const known = new Set([...existing].filter((k) => k.startsWith('word|')).map((k) => k.split('|')[1]));
      const sentCands = [...data.sentences.values()].filter((s) => (s.level ?? 1) <= maxLevel && !existing.has(cardId('sentence', s.id, 'recog')));
      let added = 0;
      for (const s of shuffle(sentCands).slice(0, 300)) {
        if (added >= Math.max(1, room - newWords.length)) break;
        const toks = tokenize(s.text, lang).filter((t) => t.isWord && !t.exempt);
        const ok = toks.filter((t) => data.index.lookup(t.text).some((id) => known.has(id))).length;
        if (toks.length && ok / toks.length >= 0.8) {
          const r = newCard(lang, 'sentence', s.id, 'recog', now);
          const p = { ...newCard(lang, 'sentence', s.id, 'prod', now), due: now + 60 * 60 * 1000 };
          fresh.push(r, p);
          const t = makeTask(data, r, true);
          if (t) tasks.push(t);
          added++;
        }
      }
    }
    if (fresh.length) await db.cards.bulkPut(fresh);
  }

  // interleave: keep intros before their own reviews, otherwise mix
  const intros = tasks.filter((t) => t.mode === 'intro');
  const rest = shuffle(tasks.filter((t) => t.mode !== 'intro'));
  const mixed: Task[] = [];
  while (intros.length || rest.length) {
    if (intros.length) mixed.push(intros.shift()!);
    if (rest.length) mixed.push(rest.shift()!);
    if (rest.length) mixed.push(rest.shift()!);
  }
  return { tasks: mixed.slice(0, size + 6), dueCount: due.length, debt, newBlocked, level0Passed };
}

/** When a lesson is completed, its exercises become drill cards for spaced review. */
export async function addLessonDrills(lang: LangCode, exercises: Exercise[], now = Date.now()) {
  const cards = exercises.map((e) => ({ ...newCard(lang, 'exercise', e.id, 'drill', now), due: now + 24 * 3600 * 1000 }));
  const existing = new Set((await db.cards.bulkGet(cards.map((c) => c.id))).filter(Boolean).map((c) => c!.id));
  await db.cards.bulkPut(cards.filter((c) => !existing.has(c.id)));
}

// Data access: installs packs into IndexedDB and serves corrected (overlaid) items.
import { db, getMeta, setMeta } from './db';
import type { LangCode, Lesson, Pack, Passage, Sentence, Word } from './types';
import { applyCorrections, changesContent, type Correction, type Overlaid } from './corrections';
import { LemmaIndex } from '../progress/coverage';
import { resetCard } from '../srs/scheduler';

export interface PackIndexEntry { lang: LangCode; version: string; bytes: number; words: number; sentences: number; passages: number }

export async function fetchPackIndex(): Promise<Record<string, PackIndexEntry>> {
  const res = await fetch('./packs/index.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Could not load pack index');
  return res.json();
}

export async function installedVersion(lang: LangCode): Promise<string | undefined> {
  return (await db.packs.get(lang))?.version;
}

/** Download (or read from the offline cache) a pack and store it in IndexedDB. */
export async function installPack(lang: LangCode, onProgress?: (msg: string) => void): Promise<void> {
  onProgress?.('Downloading…');
  const res = await fetch(`./packs/${lang}.json`);
  if (!res.ok) throw new Error(`Pack ${lang} not available (${res.status})`);
  const pack: Pack = await res.json();
  onProgress?.('Saving to your phone…');
  await db.transaction('rw', [db.packData, db.packs], async () => {
    await db.packData.put({ lang, version: pack.version, pack });
    await db.packs.put({ lang, version: pack.version, name: pack.name, credits: pack.credits, installedAt: Date.now() });
  });
  cache.delete(lang);
  onProgress?.('Done');
}

// ------------------------------------------------------------------ cache
export interface LangData {
  lang: LangCode;
  words: Map<string, Word>;
  sentences: Map<string, Sentence>;
  passages: Map<string, Passage>;
  lessons: Lesson[];
  index: LemmaIndex;
  corrections: Map<string, Correction[]>;
  overlay: Map<string, Overlaid<any>>;
  conflicts: { targetId: string; field: string; packValue: unknown; yourValue: unknown }[];
}

const cache = new Map<LangCode, LangData>();

function overlayAll<T extends { id: string }>(items: T[], corr: Map<string, Correction[]>, overlay: Map<string, Overlaid<any>>, conflicts: LangData['conflicts']): Map<string, T> {
  const out = new Map<string, T>();
  for (const it of items) {
    const list = corr.get(it.id);
    if (list?.length) {
      const o = applyCorrections(it, list);
      overlay.set(it.id, o);
      for (const c of o.conflicts) conflicts.push({ targetId: it.id, ...c });
      if (!o.removed) out.set(it.id, o.item);
    } else out.set(it.id, it);
  }
  return out;
}

export async function loadLang(lang: LangCode, force = false): Promise<LangData> {
  if (!force && cache.has(lang)) return cache.get(lang)!;
  const [stored, userWords, corrections] = await Promise.all([
    db.packData.get(lang),
    db.words.where('lang').equals(lang).toArray(),
    db.corrections.where('lang').equals(lang).toArray(),
  ]);
  if (!stored) throw new Error(`${lang} pack is not installed`);
  const { sentences, passages, lessons } = stored.pack;
  // user-imported words override pack words with the same id
  const userIds = new Set(userWords.map((w) => w.id));
  const words = [...stored.pack.words.filter((w) => !userIds.has(w.id)), ...userWords];
  const corr = new Map<string, Correction[]>();
  for (const c of corrections) corr.set(c.targetId, [...(corr.get(c.targetId) ?? []), c]);
  const overlay = new Map<string, Overlaid<any>>();
  const conflicts: LangData['conflicts'] = [];
  const W = overlayAll(words, corr, overlay, conflicts);
  const S = overlayAll(sentences, corr, overlay, conflicts);
  const P = overlayAll(passages, corr, overlay, conflicts);
  // lessons: overlay each exercise
  const L = lessons
    .map((l) => ({
      ...l,
      exercises: l.exercises
        .map((e) => {
          const list = corr.get(e.id);
          if (!list?.length) return e;
          const o = applyCorrections(e, list);
          overlay.set(e.id, o);
          return o.removed ? null : o.item;
        })
        .filter(Boolean) as Lesson['exercises'],
    }))
    .sort((a, b) => a.level - b.level || a.order - b.order);
  const data: LangData = { lang, words: W, sentences: S, passages: P, lessons: L, index: new LemmaIndex([...W.values()]), corrections: corr, overlay, conflicts };
  cache.set(lang, data);
  return data;
}

export function invalidate(lang: LangCode) {
  cache.delete(lang);
}

/** Accepted / rejected answers added by the learner for an item. */
export function userAnswers(data: LangData, itemId: string): { accepted: string[]; rejected: string[] } {
  const o = data.overlay.get(itemId);
  return { accepted: o?.accepted ?? [], rejected: o?.rejected ?? [] };
}

/** Save a correction; resets affected review cards when content changed. */
export async function saveCorrection(c: Correction): Promise<number> {
  const id = await db.corrections.add(c);
  if (changesContent(c)) {
    const cards = await db.cards.where('itemId').equals(c.targetId).toArray();
    await db.cards.bulkPut(cards.map((card) => resetCard(card)));
  }
  invalidate(c.lang);
  return id;
}

export async function undoCorrection(id: number): Promise<void> {
  const c = await db.corrections.get(id);
  if (!c) return;
  await db.corrections.update(id, { undone: true });
  invalidate(c.lang);
}

// ------------------------------------------------------------------ settings
export interface Settings {
  activeLang: LangCode | null;
  dailyGoal: number;
  strictAccents: boolean;
  newPerDay: number;
  reviewDebtLimit: number;
  apiKey: string;
  aiModel: string;
  reminderHour: number;
  reminderMinute: number;
  pledge: string;
}

export const DEFAULT_SETTINGS: Settings = {
  activeLang: null,
  dailyGoal: 100,
  strictAccents: false,
  newPerDay: 12,
  reviewDebtLimit: 120,
  apiKey: '',
  aiModel: 'claude-opus-5-5',
  reminderHour: 19,
  reminderMinute: 0,
  pledge: '',
};

export async function loadSettings(): Promise<Settings> {
  return { ...DEFAULT_SETTINGS, ...(await getMeta<Partial<Settings>>('settings', {})) };
}

export async function saveSettings(s: Settings): Promise<void> {
  await setMeta('settings', s);
}

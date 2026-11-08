// IndexedDB (via Dexie). All progress lives on the phone.
import Dexie, { type Table } from 'dexie';
import type { LangCode, Lesson, Pack, Passage, Sentence, Word } from './types';
import type { StoredCard } from '../srs/scheduler';
import type { Correction } from './corrections';
import type { ErrorType } from '../lang/grade';

export interface ReviewRecord {
  id?: number;
  lang: LangCode;
  cardId: string;
  at: number;
  correct: boolean;
  errorType: ErrorType;
  ms?: number;
}

export interface DayRecord {
  date: string; // local YYYY-MM-DD
  xp: number;
  reviews: number;
  correct: number;
  newItems: number;
  seconds: number;
  langs: LangCode[];
  freezeUsed?: boolean;
}

export interface LessonProgress {
  id: string; // lesson id
  lang: LangCode;
  completedAt: number;
  score: number; // 0..1
}

export interface Certification {
  id?: number;
  lang: LangCode;
  level: number;
  at: number;
  score: number;
  method: 'ai' | 'self-verified' | 'self-corrected' | 'auto';
  details?: unknown;
}

export interface PackMeta {
  lang: LangCode;
  version: string;
  name: string;
  credits: string[];
  installedAt: number;
}

export class LinguaDB extends Dexie {
  words!: Table<Word, string>;
  sentences!: Table<Sentence, string>;
  passages!: Table<Passage, string>;
  lessons!: Table<Lesson, string>;
  packs!: Table<PackMeta, string>;
  /** Whole language pack stored as ONE record (fast install on any device). */
  packData!: Table<{ lang: LangCode; version: string; pack: Pack }, string>;
  cards!: Table<StoredCard, string>;
  reviews!: Table<ReviewRecord, number>;
  corrections!: Table<Correction, number>;
  days!: Table<DayRecord, string>;
  lessonProgress!: Table<LessonProgress, string>;
  certs!: Table<Certification, number>;
  meta!: Table<{ key: string; value: unknown }, string>;

  constructor(name = 'linguaforge') {
    super(name);
    this.version(1).stores({
      words: '&id, lang, freqRank, lemma',
      sentences: '&id, lang, level',
      passages: '&id, lang, level',
      lessons: '&id, lang, [lang+order]',
      packs: '&lang',
      cards: '&id, lang, due, itemId, [lang+due]',
      reviews: '++id, lang, cardId, at',
      corrections: '++id, lang, targetId, createdAt',
      days: '&date',
      lessonProgress: '&id, lang',
      certs: '++id, lang',
      meta: '&key',
    });
    // v2: packs stored as single records; words table now only holds user-imported words
    this.version(2).stores({ packData: '&lang' }).upgrade(async (tx) => {
      await tx.table('words').filter((w: Word) => w.source !== 'user-csv' && w.source !== 'user').delete();
      await tx.table('sentences').clear();
      await tx.table('passages').clear();
      await tx.table('lessons').clear();
      await tx.table('packs').clear();
    });
  }
}

export const db = new LinguaDB();

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const row = await db.meta.get(key);
  return (row?.value as T) ?? fallback;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await db.meta.put({ key, value });
}

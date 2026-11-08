// Helpers for authoring content. Every authored item is verified:false until
// a native speaker reviews it (ROADMAP hole #11).
import type { Exercise, LangCode, Lesson, Level, Register, Seniority, Sentence, Word } from '../src/data/types';

type ExInput = Omit<Exercise, 'id'> & { id?: string };

export function lesson(
  lang: LangCode,
  id: string,
  level: Level,
  order: number,
  kind: Lesson['kind'],
  title: string,
  body: string,
  exercises: ExInput[],
  sources: string[] = [],
): Lesson {
  const lid = `${lang}:l:${id}`;
  return {
    id: lid,
    lang,
    level,
    order,
    kind,
    title,
    body: body.trim().replace(/^ +/gm, ''),
    exercises: exercises.map((e, i) => ({ ...e, id: e.id ?? `${lid}:e${i + 1}` })),
    sources,
    verified: false,
  };
}

export function word(
  lang: LangCode,
  lemma: string,
  gloss: string | string[],
  pos: string,
  extra: Partial<Word> = {},
): Word {
  return {
    id: `${lang}:w:${lemma.normalize('NFC')}#${pos}`,
    lang,
    lemma: lemma.normalize('NFC'),
    pos,
    gloss: Array.isArray(gloss) ? gloss : [gloss],
    level: 1,
    source: 'authored',
    verified: false,
    ...extra,
  };
}

let sentCounter = 0;
export function sentence(
  lang: LangCode,
  text: string,
  en: string,
  extra: Partial<Sentence> & { register?: Register; seniority?: Seniority } = {},
): Sentence {
  sentCounter++;
  const slug = text.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').slice(0, 40);
  return {
    id: `${lang}:s:${slug}`,
    lang,
    text: text.normalize('NFC'),
    en,
    level: 1,
    source: 'authored',
    verified: false,
    ...extra,
  };
}

export function _count() { return sentCounter; }

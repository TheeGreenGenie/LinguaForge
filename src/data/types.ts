import type { LangCode } from '../lang/grade';
export type { LangCode };

export type Register = 'neutral' | 'casual' | 'formal' | 'honorific';
export type Seniority = 'elder' | 'peer' | 'younger' | 'group';
export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Where a piece of data came from, so the app can show trust level. */
export type Source = 'authored' | 'wiktionary' | 'cedict' | 'tatoeba' | 'menyo' | 'flores' | 'fsi' | 'openslr' | 'ud' | 'user-csv' | 'user';

export interface Word {
  id: string; // stable: `${lang}:w:${lemma}#${pos}`
  lang: LangCode;
  lemma: string; // headword in target language (hanzi for zh)
  pos: string;
  gloss: string[]; // English meanings, most common first
  forms?: string[]; // inflected forms mapping to this lemma
  ipa?: string;
  respell?: string;
  pinyin?: string; // zh
  traditional?: string; // zh
  register?: Register;
  freqRank?: number;
  level?: Level;
  tags?: string[];
  /** Native-speaker recordings of sentences containing this word (OpenSLR-86 for Yoruba). */
  clips?: { src: string; text: string }[];
  source: Source;
  verified: boolean;
}

export interface Sentence {
  id: string;
  lang: LangCode;
  text: string;
  en: string;
  altEn?: string[]; // other accepted English translations
  altText?: string[]; // other accepted target-language versions
  pinyin?: string;
  register?: Register;
  seniority?: Seniority;
  level?: Level;
  audio?: string; // relative url
  source: Source;
  verified: boolean;
}

export interface Passage {
  id: string;
  lang: LangCode;
  title: string;
  paragraphs: string[]; // target language
  en: string[]; // reference English, same paragraph count
  level: Level;
  source: Source;
  verified: boolean;
}

export type ExerciseType = 'mc' | 'type' | 'tone-id' | 'minimal-pair' | 'register-scene' | 'letter-sound';

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string; // shown to learner
  /** What the learner should produce/select. */
  answer: string;
  accept?: string[];
  options?: string[];
  side?: 'target' | 'english'; // language of the answer for 'type'
  hint?: string;
  explanation?: string; // shown after answering
  register?: Register;
  seniority?: Seniority;
  audio?: string;
  wordId?: string;
}

export interface Lesson {
  id: string;
  lang: LangCode;
  level: Level;
  order: number;
  kind: 'script' | 'tone' | 'register' | 'grammar' | 'vocab';
  title: string;
  /** Simple markdown-ish text: paragraphs separated by blank lines, **bold** allowed. */
  body: string;
  exercises: Exercise[];
  sources?: string[];
  verified: boolean;
}

export interface Pack {
  lang: LangCode;
  version: string;
  name: string;
  words: Word[];
  sentences: Sentence[];
  passages: Passage[];
  lessons: Lesson[];
  credits: string[];
}

export const LANG_NAMES: Record<LangCode, string> = {
  pt: 'Portuguese (Brazil)',
  yo: 'Yorùbá',
  zh: 'Mandarin Chinese',
  es: 'Spanish',
  fr: 'French',
};

export const SPEECH_LOCALE: Record<LangCode, string | null> = {
  pt: 'pt-BR',
  yo: null, // no iOS Yoruba voice — recorded audio only
  zh: 'zh-CN',
  es: 'es-ES',
  fr: 'fr-FR',
};

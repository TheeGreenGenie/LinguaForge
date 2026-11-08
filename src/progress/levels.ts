// Mastery levels (ROADMAP Part 3).
import type { LangCode, Level } from '../data/types';

export interface LevelDef {
  level: Level;
  name: string;
  cefr: string;
  words: number; // known-word target
  chars?: number; // zh only
  exam: string;
}

export const LEVELS: LevelDef[] = [
  { level: 0, name: 'Script & Sounds', cefr: 'Pre-A1', words: 0, chars: 0, exam: 'Alphabet, diacritics and tones: score at least 90%' },
  { level: 1, name: 'Beginner', cefr: 'A1', words: 600, chars: 300, exam: 'Words, basic grammar, greetings and register' },
  { level: 2, name: 'Elementary', cefr: 'A2', words: 1200, chars: 600, exam: 'Sentence translation in both directions' },
  { level: 3, name: 'Intermediate', cefr: 'B1', words: 2500, chars: 1200, exam: 'Short paragraph reading and writing' },
  { level: 4, name: 'Upper-Intermediate', cefr: 'B2', words: 4500, chars: 2000, exam: 'One-paragraph translations both ways' },
  { level: 5, name: 'Advanced', cefr: 'C1', words: 8000, chars: 3000, exam: 'Two-paragraph translations both ways' },
  { level: 6, name: 'Certified Mastery', cefr: 'C2*', words: 8000, chars: 3000, exam: '3 + 3 passages of 2–3 paragraphs, every word covered' },
];

/** Targets are capped to what the language pack can support (Yoruba). */
export function wordTarget(level: Level, availableWords: number): number {
  const t = LEVELS[level].words;
  if (!availableWords) return t;
  return Math.min(t, Math.floor(availableWords * (0.15 + 0.13 * level)));
}

export const LEVEL_PASS = { level0: 0.9, levelN: 0.8, certification: 0.85 } as const;

export function currentLevel(passedLevels: number[]): Level {
  let l = -1;
  for (let i = 0; i <= 6; i++) if (passedLevels.includes(i)) l = i; else break;
  return Math.max(0, l + 0) as Level;
}

/** Level the learner is working toward (the first not yet passed). */
export function workingLevel(passedLevels: number[]): Level {
  for (let i = 0; i <= 6; i++) if (!passedLevels.includes(i)) return i as Level;
  return 6;
}

export function langUsesChars(lang: LangCode): boolean {
  return lang === 'zh';
}

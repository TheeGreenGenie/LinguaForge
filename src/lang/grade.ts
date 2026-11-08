// Answer grading with error classification.
// Error types are tracked separately on the progress screen so the learner
// sees *what kind* of mistakes they make (tones vs accents vs vocabulary).
import { basicNormalize, stripToneMarks, stripAllMarks, levenshtein, hasHan, canon, MARK } from './unicode';
import { yorubaInput } from './yoruba';
import { normalizePinyin } from './pinyin';

export type LangCode = 'pt' | 'yo' | 'zh' | 'es' | 'fr';
export type AnswerSide = 'target' | 'english';

export type ErrorType =
  | 'none'
  | 'typo' // accepted, but flagged
  | 'tone' // right letters, wrong/missing tone (yo, zh)
  | 'underdot' // Yoruba ẹ/ọ/ṣ missing
  | 'accent' // es/fr/pt accent missing or wrong
  | 'register' // right meaning, wrong formality (set by register exercises)
  | 'wrong';

export interface GradeResult {
  correct: boolean;
  errorType: ErrorType;
  matched?: string; // which accepted answer matched (normalized display form)
}

export interface GradeOptions {
  lang: LangCode;
  side: AnswerSide;
  /** Strict = accents/tones must be exact. Always true for yo/zh tones. */
  strictAccents?: boolean;
  /** Answers the user explicitly rejected via "Fix this". */
  rejected?: string[];
  /** For zh: pinyin of each accepted answer, so pinyin typing can be graded. */
  pinyin?: string[];
}

function prepTarget(lang: LangCode, s: string): string {
  if (lang === 'yo') return basicNormalize(yorubaInput(s));
  return basicNormalize(s);
}

function prepEnglish(s: string): string {
  return basicNormalize(s)
    .replace(/^(to|the|a|an) /, '')
    .replace(/\b(i am|i'm)\b/g, 'im')
    .replace(/\b(it is|it's)\b/g, 'its')
    .replace(/\b(do not|don't)\b/g, 'dont');
}

export function gradeAnswer(given: string, accepted: string[], opts: GradeOptions): GradeResult {
  const g = given.trim();
  if (!g) return { correct: false, errorType: 'wrong' };
  const rejected = new Set((opts.rejected ?? []).map((r) => (opts.side === 'english' ? prepEnglish(r) : prepTarget(opts.lang, r))));

  if (opts.side === 'english') {
    const gn = prepEnglish(g);
    if (rejected.has(gn)) return { correct: false, errorType: 'wrong' };
    for (const a of accepted) if (prepEnglish(a) === gn) return { correct: true, errorType: 'none', matched: a };
    for (const a of accepted) {
      const an = prepEnglish(a);
      if (an.length >= 5 && levenshtein(an, gn) <= 1) return { correct: true, errorType: 'typo', matched: a };
    }
    return { correct: false, errorType: 'wrong' };
  }

  // Chinese typed as pinyin
  if (opts.lang === 'zh' && !hasHan(g)) {
    const gp = normalizePinyin(g);
    const pins = opts.pinyin ?? [];
    for (const p of pins) if (normalizePinyin(p) === gp) return { correct: true, errorType: 'none', matched: p };
    for (const p of pins) if (stripToneMarks(normalizePinyin(p)) === stripToneMarks(gp)) return { correct: false, errorType: 'tone', matched: p };
    return { correct: false, errorType: 'wrong' };
  }

  const gn = prepTarget(opts.lang, g);
  if (rejected.has(gn)) return { correct: false, errorType: 'wrong' };
  for (const a of accepted) if (prepTarget(opts.lang, a) === gn) return { correct: true, errorType: 'none', matched: a };

  for (const a of accepted) {
    const an = prepTarget(opts.lang, a);
    if (opts.lang === 'yo') {
      if (stripToneMarks(an) === stripToneMarks(gn)) return { correct: false, errorType: 'tone', matched: a };
      const noDot = (x: string) => canon(x).replace(new RegExp(MARK.DOT_BELOW, 'g'), '');
      if (stripToneMarks(noDot(an)) === stripToneMarks(noDot(gn))) return { correct: false, errorType: 'underdot', matched: a };
    } else if (opts.lang === 'zh') {
      // Hanzi mismatch: no partial categories
    } else {
      if (stripAllMarks(an) === stripAllMarks(gn)) {
        return opts.strictAccents ? { correct: false, errorType: 'accent', matched: a } : { correct: true, errorType: 'accent', matched: a };
      }
    }
    // typo tolerance only on letters, never hides a tone/diacritic difference
    if (opts.lang !== 'zh' && an.length >= 5 && levenshtein(stripAllMarks(an), stripAllMarks(gn)) === 1) {
      const marksA = canon(an).replace(/[^\p{M}]/gu, '');
      const marksG = canon(gn).replace(/[^\p{M}]/gu, '');
      if (marksA === marksG) return { correct: true, errorType: 'typo', matched: a };
    }
  }
  return { correct: false, errorType: 'wrong' };
}

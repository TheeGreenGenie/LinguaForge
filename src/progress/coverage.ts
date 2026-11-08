// Lemma coverage: which words of a text the learner "knows" (mature both ways).
import type { LangCode, Word } from '../data/types';
import { tokenize, lookupKey, type Token } from '../lang/tokenize';

export class LemmaIndex {
  private map = new Map<string, string[]>();
  constructor(words: Word[]) {
    for (const w of words) {
      for (const f of [w.lemma, ...(w.forms ?? []), ...(w.traditional ? [w.traditional] : [])]) {
        const k = lookupKey(f);
        const arr = this.map.get(k);
        if (arr) { if (!arr.includes(w.id)) arr.push(w.id); } else this.map.set(k, [w.id]);
      }
    }
  }
  lookup(form: string): string[] {
    return this.map.get(lookupKey(form)) ?? [];
  }
}

export interface CoverageToken extends Token {
  wordIds: string[];
  known: boolean;
}

export interface CoverageReport {
  tokens: CoverageToken[];
  required: number; // non-exempt word tokens
  known: number;
  unknownWordIds: string[];
  unmatched: string[]; // words not in the dictionary at all
  ratio: number;
}

/**
 * For Chinese, Intl.Segmenter may split differently from the dictionary, so an
 * unmatched multi-character token falls back to per-character lookup.
 */
export function coverage(text: string, lang: LangCode, index: LemmaIndex, knownIds: Set<string>, exempt: string[] = []): CoverageReport {
  const tokens: CoverageToken[] = [];
  const unknown = new Set<string>();
  const unmatched = new Set<string>();
  let required = 0;
  let known = 0;
  for (const t of tokenize(text, lang, exempt)) {
    if (!t.isWord || t.exempt) { tokens.push({ ...t, wordIds: [], known: true }); continue; }
    let ids = index.lookup(t.text);
    if (!ids.length && lang === 'zh' && t.text.length > 1) {
      const per = [...t.text].map((ch) => index.lookup(ch));
      if (per.every((p) => p.length)) ids = per.flat();
    }
    required++;
    const isKnown = ids.length > 0 && ids.some((id) => knownIds.has(id));
    if (isKnown) known++;
    else if (ids.length) ids.forEach((id) => unknown.add(id));
    else unmatched.add(t.text);
    tokens.push({ ...t, wordIds: ids, known: isKnown });
  }
  return { tokens, required, known, unknownWordIds: [...unknown], unmatched: [...unmatched], ratio: required ? known / required : 1 };
}

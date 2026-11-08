// Word tokenization for coverage checks. Intl.Segmenter handles Chinese
// (no spaces) on iPhone Safari 14.1+ and in Node.
import type { LangCode } from '../data/types';

export interface Token {
  text: string;
  index: number;
  isWord: boolean;
  exempt: boolean; // numbers, proper names → not required for the "every word" rule
}

const segCache = new Map<string, Intl.Segmenter>();
function segmenter(lang: LangCode): Intl.Segmenter {
  let s = segCache.get(lang);
  if (!s) {
    s = new Intl.Segmenter(lang === 'zh' ? 'zh-Hans' : lang, { granularity: 'word' });
    segCache.set(lang, s);
  }
  return s;
}

export function tokenize(text: string, lang: LangCode, exemptList: string[] = []): Token[] {
  const exemptSet = new Set(exemptList.map((e) => e.normalize('NFC')));
  const out: Token[] = [];
  let sentenceStart = true;
  for (const seg of segmenter(lang).segment(text.normalize('NFC'))) {
    const t = seg.segment;
    const isWord = !!seg.isWordLike || /[\p{L}\p{M}]/u.test(t);
    if (!isWord) {
      if (/[.!?。！？]/.test(t)) sentenceStart = true;
      out.push({ text: t, index: seg.index, isWord: false, exempt: true });
      continue;
    }
    const isNumber = /^[\p{N}.,]+$/u.test(t);
    const isProper = lang !== 'zh' && !sentenceStart && /^\p{Lu}/u.test(t);
    out.push({ text: t, index: seg.index, isWord: true, exempt: isNumber || isProper || exemptSet.has(t) });
    sentenceStart = false;
  }
  return out;
}

/** Key used to look words up: lowercase NFC — tone marks and accents are KEPT. */
export function lookupKey(s: string): string {
  return s.normalize('NFC').toLowerCase().replace(/[’']/g, "'");
}

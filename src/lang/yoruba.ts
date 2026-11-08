// Yoruba orthography helpers: input conversion, tone extraction,
// respelling, and a diacritic-quality validator for corpus text.
import { MARK, canon } from './unicode';

/**
 * Convert lenient learner input into standard Nigerian orthography.
 *  - Benin-Republic letters: ɛ → ẹ, ɔ → ọ, sh → ṣ
 *  - ASCII shortcuts: e. o. s. → ẹ ọ ṣ ; vowel + "/" → high, vowel + "\" → low
 *  - Old vertical-line-below → dot-below (handled by canon)
 */
export function yorubaInput(raw: string): string {
  let s = raw
    .replace(/ɛ/g, 'e' + MARK.DOT_BELOW)
    .replace(/Ɛ/g, 'E' + MARK.DOT_BELOW)
    .replace(/ɔ/g, 'o' + MARK.DOT_BELOW)
    .replace(/Ɔ/g, 'O' + MARK.DOT_BELOW)
    .replace(/sh/g, 's' + MARK.DOT_BELOW)
    .replace(/Sh|SH/g, 'S' + MARK.DOT_BELOW)
    .replace(/([eosEOS])\./g, `$1${MARK.DOT_BELOW}`);
  // Tone shortcuts: apply to the preceding vowel / syllabic nasal (with any marks).
  s = s.replace(/([aeiouAEIOUnmNM]\p{M}*)\//gu, `$1${MARK.ACUTE}`);
  s = s.replace(/([aeiouAEIOUnmNM]\p{M}*)\\/gu, `$1${MARK.GRAVE}`);
  return canon(s).normalize('NFC');
}

export type Tone = 'H' | 'M' | 'L';

const VOWEL = /[aeiou]/i;

/**
 * Tone pattern of a Yoruba word from its spelling.
 * Every vowel carries a tone; acute = H, grave = L, unmarked = M.
 * A syllabic nasal (n/m not followed by a vowel, carrying a mark or standing alone) is also tone-bearing.
 */
export function tonePattern(word: string): Tone[] {
  const chars = [...canon(word.toLowerCase())];
  const tones: Tone[] = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const marks: string[] = [];
    let j = i + 1;
    while (j < chars.length && /\p{M}/u.test(chars[j])) marks.push(chars[j++]);
    const nextBase = chars[j];
    const isVowel = VOWEL.test(c);
    // Nasal vowels (an, ẹn, in, ọn, un): the n after a vowel is not a separate syllable.
    const prevBase = i > 0 ? baseBefore(chars, i) : undefined;
    const isSyllabicNasal =
      (c === 'n' || c === 'm') &&
      (marks.includes(MARK.ACUTE) || marks.includes(MARK.GRAVE) || marks.includes(MARK.MACRON) ||
        ((!nextBase || !VOWEL.test(nextBase)) && (!prevBase || !VOWEL.test(prevBase))));
    if (isVowel || isSyllabicNasal) {
      tones.push(marks.includes(MARK.ACUTE) ? 'H' : marks.includes(MARK.GRAVE) ? 'L' : 'M');
    }
    i = j - 1;
  }
  return tones;
}

function baseBefore(chars: string[], i: number): string | undefined {
  let k = i - 1;
  while (k >= 0 && /\p{M}/u.test(chars[k])) k--;
  return k >= 0 ? chars[k] : undefined;
}

export const TONE_NAMES: Record<Tone, string> = { H: 'high', M: 'mid', L: 'low' };

export function describeTones(word: string): string {
  return word
    .split(/\s+/)
    .map((w) => tonePattern(w).map((t) => TONE_NAMES[t]).join('-'))
    .join(' | ');
}

/** English-style respelling. Yoruba spelling is phonemic, so this is rule-based. */
export function yorubaRespell(word: string): string {
  const s = canon(word.toLowerCase()).replace(/[̀́̄]/g, '');
  const D = MARK.DOT_BELOW;
  const rules: [RegExp, string][] = [
    [new RegExp(`e${D}n`, 'g'), 'ehn'],
    [new RegExp(`o${D}n`, 'g'), 'awn'],
    [/an(?![aeiou])/g, 'ahn'],
    [/in(?![aeiou])/g, 'een'],
    [/un(?![aeiou])/g, 'oon'],
    [/gb/g, 'gb'],
    [/kp/g, 'kp'],
    [new RegExp(`s${D}`, 'g'), 'sh'],
    [new RegExp(`e${D}`, 'g'), 'eh'],
    [new RegExp(`o${D}`, 'g'), 'aw'],
    [/p/g, 'kp'],
    [/a/g, 'ah'],
    [/e(?!h)/g, 'ay'],
    [/i/g, 'ee'],
    [/o(?!o|n)/g, 'oh'],
    [/u/g, 'oo'],
  ];
  let out = s;
  // Apply rules in a single left-to-right tokenizing pass to avoid re-matching outputs.
  const pieces: string[] = [];
  let i = 0;
  outer: while (i < out.length) {
    for (const [re, rep] of rules) {
      re.lastIndex = 0;
      const sticky = new RegExp(re.source, 'y');
      sticky.lastIndex = i;
      const m = sticky.exec(out);
      if (m && m.index === i && m[0].length > 0) {
        pieces.push(rep);
        i += m[0].length;
        continue outer;
      }
    }
    pieces.push(out[i]);
    i++;
  }
  out = pieces.join('');
  return out;
}

/**
 * Heuristic quality check for corpus text: well-marked Yoruba has tone marks on
 * a substantial share of vowels (mid tone is unmarked, so not all) and no
 * letters outside the Yoruba alphabet (c q v x z) except in loanwords.
 */
export function validateYorubaText(text: string): { ok: boolean; reasons: string[]; markedRatio: number } {
  const c = canon(text.toLowerCase());
  const chars = [...c];
  let vowels = 0;
  let marked = 0;
  for (let i = 0; i < chars.length; i++) {
    if (VOWEL.test(chars[i])) {
      vowels++;
      let j = i + 1;
      let toned = false;
      while (j < chars.length && /\p{M}/u.test(chars[j])) {
        if (chars[j] === MARK.ACUTE || chars[j] === MARK.GRAVE) toned = true;
        j++;
      }
      if (toned) marked++;
    }
  }
  const markedRatio = vowels ? marked / vowels : 0;
  const reasons: string[] = [];
  if (vowels >= 6 && markedRatio < 0.2) reasons.push('too few tone marks');
  const foreign = (c.match(/[cqvxz]/g) || []).length;
  if (foreign > 2) reasons.push('letters outside Yoruba alphabet');
  const words = c.split(/\s+/).filter(Boolean).length;
  const dotted = (c.match(new RegExp(MARK.DOT_BELOW, 'g')) || []).length;
  if (words >= 8 && dotted === 0) reasons.push('no underdots (ẹ ọ ṣ) in a long text');
  return { ok: reasons.length === 0, reasons, markedRatio };
}

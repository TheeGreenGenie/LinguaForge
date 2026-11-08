// Pinyin helpers: numbered ↔ tone-marked conversion, tone extraction, sandhi.
import { MARK, canon } from './unicode';

const TONE_COMBINING = ['', MARK.MACRON, MARK.ACUTE, MARK.CARON, MARK.GRAVE];

/** Convert one numbered syllable (e.g. "lv4", "zhong1", "ma5") to marked form. */
export function numberedSyllableToMarked(syl: string): string {
  const m = /^([a-zü:v]+?)([0-5])?$/i.exec(syl);
  if (!m) return syl;
  let body = m[1].replace(/u:|v/gi, (x) => (x[0] === x[0].toUpperCase() ? 'Ü' : 'ü'));
  const tone = m[2] ? Number(m[2]) : 5;
  if (tone === 5 || tone === 0) return body;
  const lower = body.toLowerCase();
  let idx: number;
  if (lower.includes('a')) idx = lower.indexOf('a');
  else if (lower.includes('e')) idx = lower.indexOf('e');
  else if (lower.includes('ou')) idx = lower.indexOf('o');
  else {
    idx = -1;
    for (let i = lower.length - 1; i >= 0; i--) if ('aeiouü'.includes(lower[i])) { idx = i; break; }
  }
  if (idx < 0) return body; // e.g. "m2", "ng" – leave as is
  const ch = body[idx].normalize('NFD');
  return (body.slice(0, idx) + ch + TONE_COMBINING[tone] + body.slice(idx + 1)).normalize('NFC');
}

/** "ni3 hao3" or "ni3hao3" → "nǐ hǎo" / "nǐhǎo" */
export function numberedToMarked(s: string): string {
  return s.replace(/[a-zü:v]+[0-5]/gi, (syl) => numberedSyllableToMarked(syl));
}

export type ZhTone = 1 | 2 | 3 | 4 | 5;

/** Tone of a marked syllable (5 = neutral). */
export function syllableTone(syl: string): ZhTone {
  const d = canon(syl);
  if (d.includes(MARK.MACRON)) return 1;
  if (d.includes(MARK.ACUTE)) return 2;
  if (d.includes(MARK.CARON)) return 3;
  if (d.includes(MARK.GRAVE)) return 4;
  return 5;
}

export const ZH_TONE_NAMES: Record<ZhTone, string> = {
  1: '1st (high, flat)',
  2: '2nd (rising)',
  3: '3rd (dipping)',
  4: '4th (falling)',
  5: 'neutral (light)',
};

/** Normalize pinyin answer for comparison: numbers→marks, lowercase, no spaces/apostrophes. */
export function normalizePinyin(s: string): string {
  return canon(numberedToMarked(s.trim()).toLowerCase()).replace(/[\s'’-]/g, '');
}

/**
 * Third-tone sandhi on a sequence of syllable tones: 3-3 → 2-3 (applied right to left
 * in pairs), and the 不 / 一 rules when the character is supplied.
 */
export function applySandhi(tones: ZhTone[], chars?: string[]): ZhTone[] {
  const out = [...tones];
  for (let i = out.length - 2; i >= 0; i--) {
    if (out[i] === 3 && out[i + 1] === 3) out[i] = 2;
  }
  if (chars) {
    for (let i = 0; i < chars.length - 1; i++) {
      const next = tones[i + 1];
      if (chars[i] === '不' && next === 4) out[i] = 2;
      if (chars[i] === '一') out[i] = next === 4 ? 2 : next === 5 ? out[i] : 4;
    }
  }
  return out;
}

/** Rough English-style respelling for a pinyin syllable string (for the pronunciation card). */
export function pinyinRespell(pinyin: string): string {
  const table: [RegExp, string][] = [
    [/zh/g, 'j'], [/ch/g, 'ch'], [/sh/g, 'sh'], [/^x/g, 'sh'], [/^q/g, 'ch'], [/^j/g, 'j'],
    [/^c/g, 'ts'], [/^z/g, 'dz'], [/^r/g, 'r'],
    [/iang$/, 'yahng'], [/uang$/, 'wahng'], [/ian$/, 'yen'], [/iao$/, 'yow'], [/ing$/, 'eeng'],
    [/ong$/, 'oong'], [/ang$/, 'ahng'], [/eng$/, 'uhng'], [/ai$/, 'eye'], [/ei$/, 'ay'],
    [/ao$/, 'ow'], [/ou$/, 'oh'], [/an$/, 'ahn'], [/en$/, 'uhn'], [/in$/, 'een'], [/un$/, 'oon'],
    [/ü/g, 'ew'], [/a$/, 'ah'], [/e$/, 'uh'], [/i$/, 'ee'], [/o$/, 'aw'], [/u$/, 'oo'],
  ];
  return pinyin
    .split(/\s+/)
    .map((syl) => {
      const tone = syllableTone(syl);
      let base = canon(syl.toLowerCase()).replace(/[̀́̄̌]/g, '').normalize('NFC');
      for (const [re, rep] of table) base = base.replace(re, rep);
      return `${base} (${ZH_TONE_NAMES[tone].split(' ')[0]})`;
    })
    .join(' ');
}

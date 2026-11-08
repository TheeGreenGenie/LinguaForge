// Unicode helpers shared by every language module.
// We compare text in NFD (decomposed) form so that "ẹ́" typed as one
// precomposed char, or as e + U+0323 + U+0301 in any order, compares equal.

export const MARK = {
  ACUTE: '́', // high tone (yo), accent (es/fr/pt), tone 2 (zh)
  GRAVE: '̀', // low tone (yo), tone 4 (zh)
  MACRON: '̄', // mid tone on syllabic nasal (yo), tone 1 (zh)
  CARON: '̌', // tone 3 (zh)
  DOT_BELOW: '̣', // ẹ ọ ṣ (yo)
  VERTICAL_LINE_BELOW: '̩', // old-style Yoruba underdot
  DIAERESIS: '̈', // ü (zh), ë (fr)
  CIRCUMFLEX: '̂',
  TILDE: '̃',
  CEDILLA: '̧',
} as const;

const TONE_MARKS = new Set<string>([MARK.ACUTE, MARK.GRAVE, MARK.MACRON, MARK.CARON]);

/** Canonical NFD with marks on each base char sorted (dot-below before tone). */
export function canon(s: string): string {
  const d = s.normalize('NFD').replace(new RegExp(MARK.VERTICAL_LINE_BELOW, 'g'), MARK.DOT_BELOW);
  // Sort runs of combining marks so order differences don't matter.
  return d.replace(/\p{M}+/gu, (run) => [...run].sort().join(''));
}

export function stripToneMarks(s: string): string {
  return [...canon(s)].filter((c) => !TONE_MARKS.has(c)).join('');
}

export function stripAllMarks(s: string): string {
  return canon(s).replace(/\p{M}/gu, '');
}

/** lowercase, trim, collapse whitespace, remove punctuation (keeps marks). */
export function basicNormalize(s: string): string {
  return canon(s)
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[\p{P}\p{S}]/gu, (ch) => (ch === "'" ? "'" : ' '))
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Edit distance counting an adjacent swap ("teh" → "the") as one edit. */
export function levenshtein(a: string, b: string): number {
  const A = [...a];
  const B = [...b];
  const d: number[][] = Array.from({ length: A.length + 1 }, (_, i) =>
    Array.from({ length: B.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && A[i - 1] === B[j - 2] && A[i - 2] === B[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[A.length][B.length];
}

export function hasHan(s: string): boolean {
  return /\p{Script=Han}/u.test(s);
}

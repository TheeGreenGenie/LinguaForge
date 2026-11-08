// chrF (Popović 2015): character n-gram F-score, n = 1..6, beta = 2.
// Diacritics are kept, so a Yoruba translation with wrong tones scores lower.

function ngrams(s: string, n: number): Map<string, number> {
  const chars = [...s.normalize('NFC').replace(/\s+/g, ' ').trim()];
  const m = new Map<string, number>();
  for (let i = 0; i + n <= chars.length; i++) {
    const g = chars.slice(i, i + n).join('');
    m.set(g, (m.get(g) ?? 0) + 1);
  }
  return m;
}

export function chrF(hypothesis: string, reference: string, maxN = 6, beta = 2): number {
  let precSum = 0;
  let recSum = 0;
  let count = 0;
  for (let n = 1; n <= maxN; n++) {
    const h = ngrams(hypothesis.toLowerCase(), n);
    const r = ngrams(reference.toLowerCase(), n);
    const hTotal = [...h.values()].reduce((a, b) => a + b, 0);
    const rTotal = [...r.values()].reduce((a, b) => a + b, 0);
    if (!hTotal || !rTotal) continue;
    let match = 0;
    for (const [g, c] of h) match += Math.min(c, r.get(g) ?? 0);
    precSum += match / hTotal;
    recSum += match / rTotal;
    count++;
  }
  if (!count) return 0;
  const p = precSum / count;
  const r = recSum / count;
  if (p + r === 0) return 0;
  const b2 = beta * beta;
  return ((1 + b2) * p * r) / (b2 * p + r);
}

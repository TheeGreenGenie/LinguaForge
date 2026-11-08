// Dictionary parsers: kaikki.org (Wiktextract JSONL), CC-CEDICT, CSV/TSV.
// All produce the common Word shape and run in Node and in the browser.
import type { LangCode, Register, Word } from '../data/types';
import { readLines } from './lines';
import { numberedToMarked } from '../lang/pinyin';

export type DictFormat = 'kaikki' | 'cedict' | 'csv';

const DROP_TAGS = new Set(['archaic', 'obsolete', 'rare', 'dated', 'vulgar', 'offensive', 'derogatory', 'historical', 'misspelling', 'nonstandard', 'Internet', 'slang']);
const FUNCTION_POS = new Set(['det', 'pron', 'article', 'prep', 'contraction', 'conj', 'particle']);
const SKIP_POS = new Set(['name', 'proper noun', 'character', 'symbol', 'abbrev', 'romanization', 'suffix', 'prefix', 'infix', 'affix', 'phrase']);

function registerFromTags(tags: string[]): Register | undefined {
  if (tags.includes('honorific')) return 'honorific';
  if (tags.includes('formal')) return 'formal';
  if (tags.includes('informal') || tags.includes('colloquial')) return 'casual';
  return undefined;
}

export function wordId(lang: LangCode, lemma: string, pos: string): string {
  return `${lang}:w:${lemma.normalize('NFC')}#${pos}`;
}

/** Parse one kaikki/wiktextract JSON line. Returns null for entries we skip. */
export function parseKaikkiLine(line: string, lang: LangCode): Word | null {
  if (!line.trim()) return null;
  let e: any;
  try { e = JSON.parse(line); } catch { return null; }
  // Wiktionary titles Yoruba pages WITHOUT tone marks (ọkọ = husband/hoe/vehicle page).
  // The toned spelling lives in forms[tags=canonical]; use it so tonal minimal
  // pairs stay separate words.
  const canonicals: string[] = Array.isArray(e.forms)
    ? e.forms.filter((f: any) => (f.tags ?? []).includes('canonical') && typeof f.form === 'string').map((f: any) => f.form)
    : [];
  const lemma: string | undefined = canonicals[0] ?? e.word;
  const pos: string = e.pos ?? 'unknown';
  if (!lemma || SKIP_POS.has(pos)) return null;
  const senses: any[] = Array.isArray(e.senses) ? e.senses : [];
  const glosses: string[] = [];
  const allTags: string[] = [];
  let formOf = false;
  for (const s of senses) {
    const tags: string[] = s.tags ?? [];
    if (s.form_of || s.alt_of || tags.includes('form-of') || tags.includes('alt-of')) {
      formOf = true;
      // Function words are often "forms" of another (es "mi" = apocopic form of "mío"); keep those senses.
      const g0 = (s.glosses ?? [])[0];
      if (FUNCTION_POS.has(pos) && typeof g0 === 'string' && g0.length < 120 && !glosses.includes(g0)) glosses.push(g0);
      continue;
    }
    if (tags.some((t) => DROP_TAGS.has(t))) continue;
    if (tags.includes('letter')) continue;
    allTags.push(...tags);
    const g = (s.glosses ?? s.raw_glosses ?? [])[0];
    if (typeof g === 'string' && /name of the .* letter|letter of the .* alphabet|^(the )?(Latin|Roman) (script )?letter/i.test(g)) continue;
    if (typeof g === 'string' && g.length < 120 && !glosses.includes(g)) glosses.push(g);
  }
  if (!glosses.length) return formOf ? null : null;
  const sounds: any[] = Array.isArray(e.sounds) ? e.sounds : [];
  const ipa = sounds.find((s) => typeof s.ipa === 'string')?.ipa;
  const pinyin = lang === 'zh' ? sounds.find((s) => (s.tags ?? []).includes('Pinyin') || (s.tags ?? []).includes('Mandarin'))?.zh_pron : undefined;
  const forms: string[] = Array.isArray(e.forms)
    ? [...new Set<string>(
        e.forms
          .filter((f: any) => !(f.tags ?? []).includes('canonical') || f.form !== lemma)
          .filter((f: any) => !(f.tags ?? []).some((t: string) => ['romanization', 'table-tags', 'inflection-template'].includes(t)))
          .map((f: any) => f.form)
          .filter((f: any) => typeof f === 'string' && f !== lemma && !/\s/.test(f) && f.length < 40),
      )].slice(0, 60)
    : [];
  return {
    id: wordId(lang, lemma, pos),
    lang,
    lemma: lemma.normalize('NFC'),
    pos,
    gloss: glosses.slice(0, 4),
    forms: forms.length ? forms : undefined,
    ipa,
    pinyin,
    register: registerFromTags(allTags),
    source: 'wiktionary',
    verified: false,
  };
}

/** CC-CEDICT line: `傳統 传统 [chuan2 tong3] /tradition/traditional/` */
export function parseCedictLine(line: string): Word | null {
  if (!line || line.startsWith('#')) return null;
  const m = /^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/\s*$/.exec(line);
  if (!m) return null;
  const [, trad, simp, pin, defs] = m;
  const gloss = defs.split('/').filter((d) => d && !/^(variant of|old variant|see |CL:|surname )/i.test(d));
  if (!gloss.length) return null;
  const pinyin = numberedToMarked(pin.replace(/u:/g, 'ü').toLowerCase());
  return {
    id: wordId('zh', simp, pin),
    lang: 'zh',
    lemma: simp,
    traditional: trad !== simp ? trad : undefined,
    pos: 'unknown',
    gloss: gloss.slice(0, 4),
    pinyin,
    // sense count + proper-noun flag help pick the common reading among homographs
    tags: [`senses:${gloss.length}`, ...(/^[A-Z]/.test(pin) ? ['proper'] : []), ...(gloss.some((g) => /particle/i.test(g)) ? ['particle'] : [])],
    source: 'cedict',
    verified: false,
  };
}

/** Minimal CSV/TSV split supporting quoted fields. */
export function splitDelimited(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === delim) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/**
 * CSV template columns (header row required, order free):
 * word, translation, pos, ipa, register, notes, pinyin
 * "translation" may hold several meanings separated by ";".
 */
export async function* parseCsv(stream: ReadableStream<Uint8Array>, lang: LangCode): AsyncGenerator<Word> {
  let header: string[] | null = null;
  let delim = ',';
  for await (const line of readLines(stream)) {
    if (!line.trim()) continue;
    if (!header) {
      delim = line.includes('\t') ? '\t' : ',';
      header = splitDelimited(line.replace(/^\uFEFF/, ''), delim).map((h) => h.toLowerCase());
      continue;
    }
    const cells = splitDelimited(line, delim);
    const get = (k: string) => { const i = header!.indexOf(k); return i >= 0 ? cells[i] ?? '' : ''; };
    const lemma = get('word');
    const tr = get('translation');
    if (!lemma || !tr) continue;
    const pos = get('pos') || 'unknown';
    const reg = get('register') as Register;
    yield {
      id: wordId(lang, lemma, pos),
      lang,
      lemma: lemma.normalize('NFC'),
      pos,
      gloss: tr.split(';').map((s) => s.trim()).filter(Boolean),
      ipa: get('ipa') || undefined,
      pinyin: get('pinyin') ? numberedToMarked(get('pinyin')) : undefined,
      register: ['neutral', 'casual', 'formal', 'honorific'].includes(reg) ? reg : undefined,
      tags: get('notes') ? [get('notes')] : undefined,
      source: 'user-csv',
      verified: false,
    };
  }
}

export function detectFormat(fileName: string, firstLine: string): DictFormat {
  if (/\.jsonl?$/i.test(fileName) || firstLine.trim().startsWith('{')) return 'kaikki';
  if (/cedict/i.test(fileName) || /^#\s*CC-CEDICT/i.test(firstLine) || /^\S+\s+\S+\s+\[[^\]]+\]\s+\//.test(firstLine)) return 'cedict';
  return 'csv';
}

/**
 * Stream any supported dictionary into Words, merging duplicate lemma+pos.
 * `onProgress` receives the number of lines processed.
 */
export async function importDictionary(
  stream: ReadableStream<Uint8Array>,
  opts: { lang: LangCode; format: DictFormat; onProgress?: (n: number) => void },
): Promise<Word[]> {
  const byId = new Map<string, Word>();
  const add = (w: Word | null) => {
    if (!w) return;
    const prev = byId.get(w.id);
    if (!prev) { byId.set(w.id, w); return; }
    for (const g of w.gloss) if (!prev.gloss.includes(g) && prev.gloss.length < 6) prev.gloss.push(g);
    prev.ipa ??= w.ipa;
    prev.pinyin ??= w.pinyin;
    if (w.forms) prev.forms = [...new Set([...(prev.forms ?? []), ...w.forms])];
  };
  let n = 0;
  if (opts.format === 'csv') {
    for await (const w of parseCsv(stream, opts.lang)) { add(w); if (++n % 2000 === 0) opts.onProgress?.(n); }
  } else {
    for await (const line of readLines(stream)) {
      add(opts.format === 'kaikki' ? parseKaikkiLine(line, opts.lang) : parseCedictLine(line));
      if (++n % 2000 === 0) opts.onProgress?.(n);
    }
  }
  opts.onProgress?.(n);
  return [...byId.values()];
}

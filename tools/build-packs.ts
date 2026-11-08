// Build language packs: authored content + dictionary + frequency + corpora.
// Usage: npm run build:packs [-- yo zh ...]
// Inputs (optional; missing ones are skipped with a warning) under data/raw/<lang>/:
//   kaikki-<lang>.jsonl   Wiktextract dictionary (yo/es/fr/pt)
//   cedict.txt            CC-CEDICT (zh)
//   freq.txt              "word count" frequency list (es/fr/pt/zh)
//   menyo-*.tsv           MENYO-20k (yo)
//   ../flores/flores200_dataset/{dev,devtest}/<code>.{dev,devtest}
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { Readable } from 'node:stream';
import { importDictionary } from '../src/import/parsers';
import type { LangCode, Lesson, Level, Pack, Passage, Sentence, Word } from '../src/data/types';
import { respell } from '../src/lang/respell';
import { validateYorubaText } from '../src/lang/yoruba';
import { tokenize, lookupKey } from '../src/lang/tokenize';
import { LEVELS } from '../src/progress/levels';
import { yoLessons, yoWords, yoSentences } from '../content/yo';
import { zhLessons, zhWords, zhSentences } from '../content/zh';
import { esLessons, esWords, esSentences, frLessons, frWords, frSentences, ptLessons, ptWords, ptSentences } from '../content/romance';
import { esCurriculum } from '../content/lessons/es';
import { frCurriculum } from '../content/lessons/fr';
import { ptCurriculum } from '../content/lessons/pt';
import { zhCurriculum } from '../content/lessons/zh';
import { yoCurriculum } from '../content/lessons/yo';

const RAW = 'data/raw';
const OUT = 'public/packs';
const VERSION = new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.1';
const MAX_WORDS: Record<LangCode, number> = { yo: 99999, zh: 15000, es: 15000, fr: 15000, pt: 15000 };
const FLORES_CODE: Record<LangCode, string> = { yo: 'yor_Latn', zh: 'zho_Hans', es: 'spa_Latn', fr: 'fra_Latn', pt: 'por_Latn' };

const AUTHORED: Record<LangCode, { lessons: Lesson[]; words: Word[]; sentences: Sentence[] }> = {
  yo: { lessons: [...yoLessons, ...yoCurriculum], words: yoWords, sentences: yoSentences },
  zh: { lessons: [...zhLessons, ...zhCurriculum], words: zhWords, sentences: zhSentences },
  es: { lessons: [...esLessons, ...esCurriculum], words: esWords, sentences: esSentences },
  fr: { lessons: [...frLessons, ...frCurriculum], words: frWords, sentences: frSentences },
  pt: { lessons: [...ptLessons, ...ptCurriculum], words: ptWords, sentences: ptSentences },
};

const CREDITS: Record<LangCode, string[]> = {
  yo: ['Native audio: OpenSLR-86 Yoruba speech corpus, Google (CC BY-SA 4.0)', 'Wiktionary contributors via kaikki.org (CC BY-SA 4.0)', 'MENYO-20k, Adelani et al. 2021 (CC BY-NC 4.0)', 'FLORES-200, NLLB Team (CC BY-SA 4.0); Yoruba passages flagged: no published quality audit'],
  zh: ['Stroke order: hanzi-writer / Make Me a Hanzi data (Arphic Public License)', 'CC-CEDICT (CC BY-SA 4.0)', 'FrequencyWords by Hermit Dave (CC BY-SA 4.0), OpenSubtitles', 'FLORES-200, NLLB Team (CC BY-SA 4.0)'],
  es: ['Wiktionary contributors via kaikki.org (CC BY-SA 4.0)', 'FrequencyWords by Hermit Dave (CC BY-SA 4.0)', 'FLORES-200, NLLB Team (CC BY-SA 4.0)'],
  fr: ['Wiktionary contributors via kaikki.org (CC BY-SA 4.0)', 'FrequencyWords by Hermit Dave (CC BY-SA 4.0)', 'FLORES-200, NLLB Team (CC BY-SA 4.0)'],
  pt: ['Wiktionary contributors via kaikki.org (CC BY-SA 4.0)', 'FrequencyWords by Hermit Dave (CC BY-SA 4.0)', 'FLORES-200, NLLB Team (CC BY-SA 4.0)'],
};

function webStream(path: string): ReadableStream<Uint8Array> {
  return Readable.toWeb(createReadStream(path)) as ReadableStream<Uint8Array>;
}

function readFreq(path: string): Map<string, number> {
  const m = new Map<string, number>();
  if (!existsSync(path)) return m;
  readFileSync(path, 'utf8').split('\n').forEach((line, i) => {
    const w = line.split(' ')[0];
    if (w && !m.has(lookupKey(w))) m.set(lookupKey(w), i + 1);
  });
  return m;
}

function menyoPairs(): { yo: string; en: string; file: string; line: number }[] {
  const out: { yo: string; en: string; file: string; line: number }[] = [];
  for (const f of ['train', 'dev', 'test']) {
    const p = `${RAW}/yo/menyo-${f}.tsv`;
    if (!existsSync(p)) continue;
    readFileSync(p, 'utf8').split('\n').slice(1).forEach((line, i) => {
      const [en, yo] = line.split('\t');
      if (en && yo) out.push({ en: en.trim(), yo: yo.replace(/^﻿/, '').trim().normalize('NFC'), file: f, line: i });
    });
  }
  return out;
}

/** Yoruba frequency counted from the MENYO-20k Yoruba side. */
function yorubaFreq(pairs: { yo: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const p of pairs) for (const t of tokenize(p.yo, 'yo')) if (t.isWord && !t.exempt) counts.set(lookupKey(t.text), (counts.get(lookupKey(t.text)) ?? 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return new Map(ranked.map(([w], i) => [w, i + 1]));
}

function levelForRank(rank: number | undefined): Level {
  if (rank === undefined) return 5;
  for (let l = 1; l <= 5; l++) if (rank <= LEVELS[l].words) return l as Level;
  return 5;
}

function difficulty(text: string, lang: LangCode, rankOf: (form: string) => number | undefined): number {
  const rankTok = (t: string) => rankOf(t) ?? (lang === 'zh' && t.length > 1 ? Math.max(...[...t].map((c) => rankOf(c) ?? 60000)) : 60000);
  const ranks = tokenize(text, lang).filter((t) => t.isWord && !t.exempt).map((t) => rankTok(t.text)).sort((a, b) => a - b);
  if (!ranks.length) return 0;
  return ranks[Math.floor(ranks.length * 0.9)] ?? ranks[ranks.length - 1];
}

function floresDocs(lang: LangCode): { url: string; target: string[]; en: string[] }[] {
  const base = `${RAW}/flores/flores200_dataset`;
  const docs = new Map<string, { url: string; target: string[]; en: string[] }>();
  for (const split of ['dev', 'devtest']) {
    const meta = `${base}/metadata_${split}.tsv`;
    const tgt = `${base}/${split}/${FLORES_CODE[lang]}.${split}`;
    const eng = `${base}/${split}/eng_Latn.${split}`;
    if (!existsSync(meta) || !existsSync(tgt) || !existsSync(eng)) continue;
    const urls = readFileSync(meta, 'utf8').trim().split('\n').slice(1).map((l) => l.split('\t')[0]);
    const T = readFileSync(tgt, 'utf8').trim().split('\n');
    const E = readFileSync(eng, 'utf8').trim().split('\n');
    urls.forEach((u, i) => {
      const d = docs.get(u) ?? { url: u, target: [], en: [] };
      d.target.push(T[i].normalize('NFC'));
      d.en.push(E[i]);
      docs.set(u, d);
    });
  }
  return [...docs.values()];
}

const TATOEBA_CODE: Partial<Record<LangCode, string>> = { zh: 'cmn', es: 'spa', fr: 'fra', pt: 'por' };

/** manythings.org Tatoeba export: "English\tTarget\tattribution". Groups multiple English versions. */
function tatoebaPairs(lang: LangCode): { id: string; text: string; en: string[] }[] {
  const code = TATOEBA_CODE[lang];
  const path = `${RAW}/tatoeba/${code}/${code}.txt`;
  if (!code || !existsSync(path)) { console.warn(`  no Tatoeba file for ${lang}`); return []; }
  const byText = new Map<string, { id: string; text: string; en: string[] }>();
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const [en, text, attr] = line.split('\t');
    if (!en || !text) continue;
    const t = text.trim().normalize('NFC');
    const id = /#(\d+)\s*\([^)]*\)\s*$/.exec(attr ?? '')?.[1] ?? String(byText.size);
    const rec = byText.get(t) ?? { id, text: t, en: [] };
    if (!rec.en.includes(en.trim())) rec.en.push(en.trim());
    byText.set(t, rec);
  }
  return [...byText.values()];
}

/** Approximate sentence pinyin from segmented words (CEDICT readings, most frequent first). */
function makePinyinizer(words: Word[]): (s: string) => string {
  const best = new Map<string, string>();
  // Prefer particle readings (吧 ba, 了 le, 的 de) for single characters, else most frequent.
  const isParticle = (w: Word) => w.gloss.some((g) => /particle|modal/i.test(g));
  for (const w of words) if (w.pinyin && w.lemma.length === 1 && isParticle(w)) best.set(w.lemma, w.pinyin);
  for (const w of words) if (w.pinyin && !best.has(w.lemma)) best.set(w.lemma, w.pinyin);
  return (s: string) =>
    tokenize(s, 'zh')
      .map((t) => {
        if (!t.isWord) return t.text.replace(/[。！？，、]/g, (c) => ({ '。': '.', '！': '!', '？': '?', '，': ',', '、': ',' })[c] ?? c);
        if (best.has(t.text)) return best.get(t.text)!.replace(/\s+/g, '');
        return [...t.text].map((ch) => best.get(ch) ?? ch).join('');
      })
      .join(' ')
      .replace(/\s+([.,!?])/g, '$1')
      .trim();
}

function chunkParagraphs(sents: string[], per: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < sents.length; i += per) out.push(sents.slice(i, i + per).join(' '));
  return out;
}

async function buildLang(lang: LangCode) {
  console.log(`\n=== ${lang} ===`);
  const authored = AUTHORED[lang];
  const menyo = lang === 'yo' ? menyoPairs() : [];
  const freq = lang === 'yo' ? yorubaFreq(menyo) : readFreq(`${RAW}/${lang}/freq.txt`);
  console.log(`frequency entries: ${freq.size}`);

  // ---- dictionary
  let dict: Word[] = [];
  const kaikki = `${RAW}/${lang}/kaikki-${lang}.jsonl`;
  const cedict = `${RAW}/zh/cedict.txt`;
  if (lang === 'zh' && existsSync(cedict)) dict = await importDictionary(webStream(cedict), { lang, format: 'cedict' });
  else if (existsSync(kaikki) && statSync(kaikki).size > 1000) dict = await importDictionary(webStream(kaikki), { lang, format: 'kaikki', onProgress: (n) => n % 200000 === 0 && process.stdout.write(`  ${n} lines\r`) });
  else console.warn(`  no dictionary found for ${lang} — authored words only`);
  console.log(`dictionary words: ${dict.length}`);

  // Rank by the headword's own frequency. Inflected forms count only when they are not
  // themselves headwords (so "taire" doesn't inherit the rank of its form "tu"), with a penalty.
  const headwords = new Set(dict.map((w) => lookupKey(w.lemma)));
  // strings that are inflected forms of some other headword ("est" is a form of "être")
  const isFormOfOther = new Set<string>();
  for (const w of dict) for (const f of w.forms ?? []) if (lookupKey(f) !== lookupKey(w.lemma)) isFormOfOther.add(lookupKey(f));
  // Function-word senses are the frequent ones for very common spellings ("pas" = not, not "step")
  const POS_PRIORITY: Record<string, number> = { article: 0, det: 0, pron: 0, prep: 0, conj: 0, particle: 0, contraction: 0, adv: 1, verb: 1, intj: 2, num: 2, adj: 3, noun: 3 };
  const order = new Map<string, Word[]>();
  for (const w of dict) { const k = lookupKey(w.lemma); order.set(k, [...(order.get(k) ?? []), w]); }
  const zhScore = (w: Word) => {
    const t = w.tags ?? [];
    const senses = Number(t.find((x) => x.startsWith('senses:'))?.slice(7) ?? 1);
    return (t.includes('particle') ? -100 : 0) + (t.includes('proper') ? 100 : 0) - senses;
  };
  for (const list of order.values()) {
    list.sort((a, b) => lang === 'zh' ? zhScore(a) - zhScore(b) : (POS_PRIORITY[a.pos] ?? 4) - (POS_PRIORITY[b.pos] ?? 4));
  }
  const rankOfWord = (w: Word) => {
    const k = lookupKey(w.lemma);
    const own = freq.get(k);
    const viaForms = Math.min(Infinity, ...(w.forms ?? []).filter((f) => !headwords.has(lookupKey(f))).map((f) => (freq.get(lookupKey(f)) ?? Infinity) * 2 + 200));
    let r = Math.min(own ?? Infinity, viaForms);
    if (!Number.isFinite(r)) return r;
    const content = (POS_PRIORITY[w.pos] ?? 4) >= 2 && w.pos !== 'num';
    if (content && isFormOfOther.has(k)) r = r * 4 + 2000; // "est" (east) vs "est" (is)
    if (/\p{Lu}/u.test(w.lemma) && headwords.has(k) && w.lemma !== w.lemma.toLowerCase()) r = r * 3 + 1000; // "CE" vs "ce"
    // later entries for the same spelling (rarer senses/etymologies) rank lower
    const n = (order.get(k) ?? []).indexOf(w);
    if (n > 0) r = r * (1 + n) + 1500 * n;
    return r;
  };
  // curated core words come first; dictionary words follow in frequency order
  const offset = authored.words.length;
  for (const w of dict) { const r = rankOfWord(w); w.freqRank = Number.isFinite(r) ? r + offset : undefined; }

  // For zh, CEDICT has many rare duplicates: keep entries present in the frequency list.
  let kept = dict.filter((w) => lang === 'yo' || w.freqRank !== undefined);
  kept.sort((a, b) => (a.freqRank ?? 1e9) - (b.freqRank ?? 1e9));
  kept = kept.slice(0, MAX_WORDS[lang]);

  // ---- merge authored words (authored gloss first, dictionary supplies IPA/forms)
  const byLemma = new Map<string, Word[]>();
  for (const w of kept) { const k = lookupKey(w.lemma); byLemma.set(k, [...(byLemma.get(k) ?? []), w]); }
  const finalById = new Map<string, Word>(kept.map((w) => [w.id, w]));
  authored.words.forEach((a, i) => {
    const matches = (byLemma.get(lookupKey(a.lemma)) ?? []);
    const allDict = matches.length ? matches : dict.filter((d) => lookupKey(d.lemma) === lookupKey(a.lemma));
    const match = allDict.find((d) => d.pos === a.pos) ?? allDict.find((d) => !a.pinyin || d.pinyin === a.pinyin) ?? allDict[0];
    const merged: Word = {
      ...(match ?? {}),
      ...a,
      gloss: [...a.gloss, ...(match?.gloss ?? []).filter((g) => !a.gloss.includes(g))].slice(0, 5),
      ipa: a.ipa ?? match?.ipa,
      forms: match?.forms,
      freqRank: i + 1,
      source: 'authored',
    };
    if (match && match.id !== a.id) finalById.delete(match.id);
    finalById.set(a.id, merged);
  });

  const words = [...finalById.values()];
  for (const w of words) {
    w.level ??= levelForRank(w.freqRank);
    if (w.level === undefined || w.source !== 'authored') w.level = levelForRank(w.freqRank);
    w.respell ??= respell(w);
    if (w.freqRank === Infinity) delete w.freqRank;
  }
  words.sort((a, b) => (a.freqRank ?? 1e9) - (b.freqRank ?? 1e9));
  // attach curated native audio (tools/build-audio.ts)
  const audioIndex = `public/audio/${lang}/index.json`;
  if (existsSync(audioIndex)) {
    const idx: Record<string, { src: string; text: string }[]> = JSON.parse(readFileSync(audioIndex, 'utf8'));
    for (const w of words) if (idx[w.id]) w.clips = idx[w.id];
    console.log(`words with native audio: ${words.filter((w) => w.clips).length}`);
  }
  console.log(`pack words: ${words.length} (with IPA: ${words.filter((w) => w.ipa).length})`);

  // ---- sentences
  const formRank = new Map<string, number>();
  for (const w of words) for (const f of [w.lemma, ...(w.forms ?? [])]) { const k = lookupKey(f); if (!formRank.has(k) || (w.freqRank ?? 1e9) < formRank.get(k)!) formRank.set(k, w.freqRank ?? 60000); }
  const rankOf = (form: string) => formRank.get(lookupKey(form)) ?? freq.get(lookupKey(form));

  const sentences: Sentence[] = [...authored.sentences];
  let rejected = 0;
  if (lang === 'yo') {
    for (const p of menyo) {
      const nWords = p.yo.split(/\s+/).length;
      if (nWords < 3 || nWords > 18 || p.file !== 'train') continue; // dev/test reserved for passages/exams
      if (!validateYorubaText(p.yo).ok) { rejected++; continue; }
      const d = difficulty(p.yo, 'yo', rankOf);
      sentences.push({
        id: `yo:s:menyo-${p.file}-${p.line}`, lang, text: p.yo, en: p.en, level: levelForRank(d), source: 'menyo', verified: false,
      });
    }
    console.log(`MENYO sentences kept: ${sentences.length - authored.sentences.length}, rejected by diacritic validator: ${rejected}`);
  } else {
    const tat = tatoebaPairs(lang);
    // spread across difficulty: bucket by level, cap each
    const perLevel = new Map<number, number>();
    const pinyinOf = lang === 'zh' ? makePinyinizer(words) : undefined;
    for (const p of tat) {
      const n = lang === 'zh' ? [...p.text].length / 2 : p.text.split(/\s+/).length;
      if (n < 2 || n > 14) continue;
      const lvl = levelForRank(difficulty(p.text, lang, rankOf));
      if ((perLevel.get(lvl) ?? 0) >= 2000) continue;
      perLevel.set(lvl, (perLevel.get(lvl) ?? 0) + 1);
      sentences.push({
        id: `${lang}:s:tatoeba-${p.id}`, lang, text: p.text, en: p.en[0], altEn: p.en.slice(1, 6),
        pinyin: pinyinOf?.(p.text), level: lvl, source: 'tatoeba', verified: false,
      });
    }
    console.log(`Tatoeba sentences kept: ${sentences.length - authored.sentences.length} of ${tat.length}`);
  }

  // ---- passages
  const passages: Passage[] = [];
  for (const doc of floresDocs(lang)) {
    if (doc.target.length < 4) continue;
    let flagged = false;
    if (lang === 'yo') flagged = doc.target.some((s) => !validateYorubaText(s).ok);
    const per = doc.target.length >= 9 ? 3 : 2;
    const paragraphs = chunkParagraphs(doc.target, per).slice(0, 3);
    const en = chunkParagraphs(doc.en, per).slice(0, 3);
    const d = difficulty(paragraphs.join(' '), lang, rankOf);
    const title = decodeURIComponent(doc.url.split('/').pop() ?? 'Passage').replace(/_/g, ' ');
    passages.push({
      id: `${lang}:p:flores-${passages.length}`, lang, title: flagged ? `${title} ⚠` : title, paragraphs, en,
      level: (paragraphs.length >= 2 ? Math.max(4, Math.min(6, levelForRank(d) + 1)) : 4) as Level,
      source: 'flores', verified: false,
    });
  }
  if (lang === 'yo') {
    // MENYO dev/test: consecutive validated lines form passages (professionally checked diacritics)
    const block = menyo.filter((p) => p.file !== 'train');
    for (let i = 0; i + 6 <= block.length; i += 9) {
      const chunk = block.slice(i, i + 6);
      if (chunk.some((c) => !validateYorubaText(c.yo).ok || c.yo.split(/\s+/).length > 40)) continue;
      passages.push({
        id: `yo:p:menyo-${chunk[0].file}-${chunk[0].line}`, lang, title: `MENYO passage ${passages.length + 1}`,
        paragraphs: chunkParagraphs(chunk.map((c) => c.yo), 3), en: chunkParagraphs(chunk.map((c) => c.en), 3),
        level: 6, source: 'menyo', verified: false,
      });
    }
  }
  console.log(`passages: ${passages.length}${lang === 'yo' ? ` (FLORES flagged ⚠: ${passages.filter((p) => p.title.endsWith('⚠')).length})` : ''}`);

  // Chinese stroke-order data for characters in Levels 1-2 (hanzi-writer-data, Arphic Public License)
  if (lang === 'zh' && existsSync('node_modules/hanzi-writer-data')) {
    mkdirSync('public/hanzi', { recursive: true });
    const chars = new Set<string>();
    for (const w of words) if ((w.level ?? 9) <= 2 || w.source === 'authored') for (const ch of w.lemma) if (/\p{Script=Han}/u.test(ch)) chars.add(ch);
    let copied = 0;
    for (const ch of chars) {
      const src = `node_modules/hanzi-writer-data/${ch}.json`;
      if (existsSync(src)) { writeFileSync(`public/hanzi/${ch}.json`, readFileSync(src)); copied++; }
    }
    writeFileSync('public/hanzi/ARPHICPL.TXT', readFileSync('node_modules/hanzi-writer-data/ARPHICPL.TXT'));
    console.log(`stroke data copied for ${copied} characters`);
  }

  const pack: Pack = {
    lang, version: VERSION, name: lang, words, sentences, passages,
    lessons: authored.lessons, credits: CREDITS[lang],
  };
  mkdirSync(OUT, { recursive: true });
  const json = JSON.stringify(pack);
  writeFileSync(`${OUT}/${lang}.json`, json);
  console.log(`wrote ${OUT}/${lang}.json (${(json.length / 1e6).toFixed(2)} MB)`);
  return { lang, version: VERSION, bytes: json.length, words: words.length, sentences: sentences.length, passages: passages.length };
}

const langs = (process.argv.slice(2).length ? process.argv.slice(2) : ['yo', 'zh', 'es', 'fr', 'pt']) as LangCode[];
const indexPath = `${OUT}/index.json`;
const index: Record<string, unknown> = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : {};
for (const l of langs) index[l] = await buildLang(l);
writeFileSync(indexPath, JSON.stringify(index, null, 2));
console.log('\nindex:', index);

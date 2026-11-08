// Curate native-speaker Yoruba audio from OpenSLR-86 (Google, CC BY-SA 4.0).
// For each core word (and every tone minimal-pair word), pick the shortest
// recorded sentence containing it, transcode to small AAC files, and write
// public/audio/yo/index.json (wordId → clips) for build-packs to attach.
// Requires: data/raw/yo/openslr/{yo_ng_female.zip,yo_ng_male.zip,line_index_*.tsv}, ffmpeg on PATH.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { tokenize, lookupKey } from '../src/lang/tokenize';
import { validateYorubaText } from '../src/lang/yoruba';

const RAW = 'data/raw/yo/openslr';
const OUT = 'public/audio/yo';
const TOP_WORDS = 800;
const CLIPS_PER_WORD = 2;
const MAX_REUSE = 3;
mkdirSync(OUT, { recursive: true });
mkdirSync(`${RAW}/wav`, { recursive: true });

interface Clip { id: string; zip: string; text: string; keys: Set<string>; used: number }
const clips: Clip[] = [];
for (const g of ['female', 'male']) {
  for (const line of readFileSync(`${RAW}/line_index_${g}.tsv`, 'utf8').trim().split('\n')) {
    const [id, raw] = line.split('\t');
    const text = (raw ?? '').replace(/\[[^\]]*\]\s*/g, '').trim().normalize('NFC');
    if (!id || !text || !validateYorubaText(text).ok) continue;
    clips.push({ id, zip: `${RAW}/yo_ng_${g}.zip`, text, keys: new Set(tokenize(text, 'yo').filter((t) => t.isWord).map((t) => lookupKey(t.text))), used: 0 });
  }
}
clips.sort((a, b) => a.text.length - b.text.length); // prefer short sentences

const pack = JSON.parse(readFileSync('public/packs/yo.json', 'utf8'));
const MINIMAL = ['ọkọ', 'ọkọ́', 'ọkọ̀', 'igbá', 'igba', 'ìgbà', 'ìgbá', 'èdè', 'edé'];
const targets = [
  ...pack.words.filter((w: any) => MINIMAL.includes(w.lemma)),
  ...pack.words.slice(0, TOP_WORDS),
];
const index: Record<string, { src: string; text: string }[]> = {};
const chosen = new Map<string, Clip>();
for (const w of targets) {
  if (index[w.id]) continue;
  const key = lookupKey(w.lemma);
  const matching = clips.filter((c) => c.keys.has(key) && c.used < MAX_REUSE);
  // prefer different sentences; fall back to the same sentence in the other voice
  const distinct = matching.filter((c, i) => matching.findIndex((x) => x.text === c.text) === i);
  const picks = [...distinct, ...matching.filter((c) => !distinct.includes(c))].slice(0, CLIPS_PER_WORD);
  if (!picks.length) continue;
  index[w.id] = picks.map((c) => { c.used++; chosen.set(c.id, c); return { src: `./audio/yo/${c.id}.m4a`, text: c.text }; });
}
console.log(`words with audio: ${Object.keys(index).length}, unique clips: ${chosen.size}`);

// extract + transcode
const zipListing = new Map<string, string>(); // id → path inside zip
for (const zip of [`${RAW}/yo_ng_female.zip`, `${RAW}/yo_ng_male.zip`]) {
  const list = execFileSync('unzip', ['-Z1', zip], { maxBuffer: 64 * 1024 * 1024 }).toString().split('\n');
  for (const p of list) { const m = /([^/]+)\.wav$/.exec(p.trim()); if (m) zipListing.set(m[1], p.trim()); }
}
let n = 0;
for (const c of chosen.values()) {
  const out = `${OUT}/${c.id}.m4a`;
  if (existsSync(out)) continue;
  const inner = zipListing.get(c.id);
  if (!inner) { console.warn('missing in zip', c.id); continue; }
  const wav = `${RAW}/wav/${c.id}.wav`;
  if (!existsSync(wav)) writeFileSync(wav, execFileSync('unzip', ['-p', c.zip, inner], { maxBuffer: 64 * 1024 * 1024 }));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', '-ac', '1', '-ar', '22050', '-c:a', 'aac', '-b:a', '32k', out]);
  if (++n % 50 === 0) console.log(`  transcoded ${n}`);
}
writeFileSync(`${OUT}/index.json`, JSON.stringify(index));
const total = [...chosen.keys()].reduce((a, id) => a + (existsSync(`${OUT}/${id}.m4a`) ? statSync(`${OUT}/${id}.m4a`).size : 0), 0);
console.log(`audio total ${(total / 1e6).toFixed(1)} MB`);

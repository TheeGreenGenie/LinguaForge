import { describe, it, expect } from 'vitest';
import { importDictionary, parseCedictLine, parseKaikkiLine, detectFormat } from '../src/import/parsers';
import { stringStream } from '../src/import/lines';

const yoHusband = JSON.stringify({ word: 'ọkọ', pos: 'noun', sounds: [{ ipa: '/ɔ̄.kɔ̄/' }], senses: [{ glosses: ['husband'] }] });
const yoHoe = JSON.stringify({ word: 'ọkọ', pos: 'noun', forms: [{ form: 'ọkọ́', tags: ['canonical'] }], sounds: [{ ipa: '/ɔ̄.kɔ́/' }], senses: [{ glosses: ['hoe'] }] });
const frAller = JSON.stringify({
  word: 'aller', pos: 'verb', sounds: [{ ipa: '/a.le/' }],
  forms: [{ form: 'allons' }, { form: 'va' }, { form: 'irai' }],
  senses: [{ glosses: ['to go'] }, { glosses: ['old sense'], tags: ['obsolete'] }],
});
const frVous = JSON.stringify({ word: 'vous', pos: 'pron', senses: [{ glosses: ['you (formal singular)'], tags: ['formal'] }] });
const formOf = JSON.stringify({ word: 'allons', pos: 'verb', senses: [{ glosses: ['first-person plural of aller'], form_of: [{ word: 'aller' }] }] });

describe('kaikki parser', () => {
  it('uses the toned canonical form so Yoruba minimal pairs stay separate', async () => {
    const words = await importDictionary(stringStream([yoHusband, yoHoe].join('\n')), { lang: 'yo', format: 'kaikki' });
    expect(words.map((w) => w.lemma).sort()).toEqual(['ọkọ', 'ọkọ́'].sort());
    expect(words.find((w) => w.lemma === 'ọkọ́')?.gloss).toEqual(['hoe']);
  });
  it('keeps forms, IPA, drops obsolete senses and form-of entries', () => {
    const w = parseKaikkiLine(frAller, 'fr')!;
    expect(w.gloss).toEqual(['to go']);
    expect(w.forms).toContain('allons');
    expect(w.ipa).toBe('/a.le/');
    expect(parseKaikkiLine(formOf, 'fr')).toBeNull();
  });
  it('reads register tags', () => {
    expect(parseKaikkiLine(frVous, 'fr')!.register).toBe('formal');
  });
});

describe('cedict parser', () => {
  it('parses a line with tone-marked pinyin', () => {
    const w = parseCedictLine('傳統 传统 [chuan2 tong3] /tradition/traditional/')!;
    expect(w.lemma).toBe('传统');
    expect(w.traditional).toBe('傳統');
    expect(w.pinyin).toBe('chuán tǒng');
    expect(w.gloss).toEqual(['tradition', 'traditional']);
  });
  it('skips comments and pure variant entries', () => {
    expect(parseCedictLine('# CC-CEDICT')).toBeNull();
    expect(parseCedictLine('於 於 [Yu1] /surname Yu/')).toBeNull();
  });
});

describe('csv parser', () => {
  it('reads the template with quoted fields and multiple meanings', async () => {
    const csv = 'word,translation,pos,register\n"Ẹ káàárọ̀","good morning (to an elder); good morning (respectful)",phrase,honorific\nomi,water,noun,\n';
    const words = await importDictionary(stringStream(csv), { lang: 'yo', format: 'csv' });
    expect(words).toHaveLength(2);
    expect(words[0].gloss).toHaveLength(2);
    expect(words[0].register).toBe('honorific');
  });
  it('detects formats', () => {
    expect(detectFormat('x.jsonl', '{')).toBe('kaikki');
    expect(detectFormat('cedict_ts.u8', '# CC-CEDICT')).toBe('cedict');
    expect(detectFormat('mine.csv', 'word,translation')).toBe('csv');
  });
});

describe('kaikki letter names', () => {
  it('drops "name of the letter" senses', () => {
    const line = JSON.stringify({ word: 'ti', pos: 'noun', forms: [{ form: 'tí', tags: ['canonical'] }], senses: [{ glosses: ['The name of the Latin script letter T/t.'] }] });
    expect(parseKaikkiLine(line, 'yo')).toBeNull();
  });
});

describe('function-word form-of senses', () => {
  it('keeps es "mi" (apocopic form of mío) as a determiner', () => {
    const line = JSON.stringify({ word: 'mi', pos: 'det', senses: [{ glosses: ['apocopic form of mío; my'], form_of: [{ word: 'mío' }] }] });
    expect(parseKaikkiLine(line, 'es')?.gloss[0]).toContain('my');
  });
});

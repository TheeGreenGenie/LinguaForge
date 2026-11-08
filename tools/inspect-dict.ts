// Usage: tsx tools/inspect-dict.ts <file> <lang> [format] [word...]
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { importDictionary, type DictFormat } from '../src/import/parsers';
import type { LangCode } from '../src/data/types';

const [file, lang, fmt = 'kaikki', ...look] = process.argv.slice(2);
const stream = Readable.toWeb(createReadStream(file)) as ReadableStream<Uint8Array>;
const words = await importDictionary(stream, { lang: lang as LangCode, format: fmt as DictFormat });
const pos: Record<string, number> = {};
for (const w of words) pos[w.pos] = (pos[w.pos] ?? 0) + 1;
console.log('words kept:', words.length, 'with IPA:', words.filter((w) => w.ipa).length, 'with register:', words.filter((w) => w.register).length);
console.log('by pos:', pos);
for (const l of look) console.log(JSON.stringify(words.filter((w) => w.lemma === l.normalize('NFC')), null, 0));

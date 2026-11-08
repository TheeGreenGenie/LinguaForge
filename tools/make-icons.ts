// Generates simple PNG app icons (no image libraries): green tile with a white
// open book and a tone-mark accent.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

function crc32(buf: Buffer) {
  let c = ~0;
  for (const b of buf) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return ~c >>> 0;
}
function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size: number, pixel: (x: number, y: number) => [number, number, number]) {
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) { const [r, g, b] = pixel(x / size, y / size); raw.set([r, g, b], y * (size * 3 + 1) + 1 + x * 3); }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const GREEN: [number, number, number] = [31, 111, 92];
const WHITE: [number, number, number] = [247, 245, 239];
const ORANGE: [number, number, number] = [251, 146, 60];
const pix = (x: number, y: number): [number, number, number] => {
  // tone accent (acute) above the book
  const ax = 0.5 + (0.23 - y) * 0.6;
  if (y > 0.16 && y < 0.3 && Math.abs(x - ax) < 0.035) return ORANGE;
  // open book: two pages
  const inBook = y > 0.36 && y < 0.78;
  const left = x > 0.2 && x < 0.485 && y > 0.36 + (0.485 - x) * 0.12 && y < 0.78;
  const right = x > 0.515 && x < 0.8 && y > 0.36 + (x - 0.515) * 0.12 && y < 0.78;
  if (inBook && (left || right)) {
    const line = ((y - 0.46) % 0.08 + 0.08) % 0.08 < 0.022 && y > 0.45 && y < 0.72 && ((x > 0.25 && x < 0.45) || (x > 0.55 && x < 0.75));
    return line ? GREEN : WHITE;
  }
  return GREEN;
};
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]] as const) writeFileSync(`public/${name}`, png(size, pix));
writeFileSync('public/icon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#1f6f5c"/><path d="M20 38 L48.5 41 V78 L20 78Z M51.5 41 L80 38 V78 L51.5 78Z" fill="#f7f5ef"/><path d="M55 16 L45 30" stroke="#fb923c" stroke-width="7" stroke-linecap="round"/></svg>`);
console.log('icons written');

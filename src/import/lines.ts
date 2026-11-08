// Stream a byte stream line by line. Works with web ReadableStream (browser
// File.stream() on iPhone) and Node (Readable.toWeb / fs streams).

export async function* readLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder('utf-8');
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).replace(/\r$/, '');
      buf = buf.slice(nl + 1);
      yield line;
    }
  }
  buf += decoder.decode();
  if (buf.length) yield buf.replace(/\r$/, '');
}

export function stringStream(s: string): ReadableStream<Uint8Array> {
  const bytes = new TextEncoder().encode(s);
  return new ReadableStream({
    start(c) {
      // emit in small chunks to exercise chunk-boundary handling
      for (let i = 0; i < bytes.length; i += 7) c.enqueue(bytes.slice(i, i + 7));
      c.close();
    },
  });
}

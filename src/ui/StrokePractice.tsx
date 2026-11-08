// Chinese stroke-order practice (hanzi-writer). Data is bundled offline in ./hanzi/.
import { useEffect, useRef, useState } from 'preact/hooks';

export function StrokePractice({ text, onClose }: { text: string; onClose: () => void }) {
  const chars = [...text].filter((c) => /\p{Script=Han}/u.test(c));
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState('Draw each stroke in order. A hint appears after 3 misses.');
  const [missing, setMissing] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!box.current || !chars[i]) return;
      box.current.innerHTML = '';
      setMissing(false);
      const { default: HanziWriter } = await import('hanzi-writer');
      if (cancelled) return;
      const writer = HanziWriter.create(box.current, chars[i], {
        width: 260, height: 260, padding: 10, showOutline: true, showCharacter: false,
        strokeColor: '#1f6f5c', radicalColor: '#c2410c', highlightColor: '#fb923c', drawingWidth: 28,
        charDataLoader: (c: string, onLoad: (d: any) => void, onError: (e: any) => void) => {
          fetch(`./hanzi/${encodeURIComponent(c)}.json`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then(onLoad).catch((e) => { setMissing(true); onError(e); });
        },
      });
      writerRef.current = writer;
      writer.quiz({
        showHintAfterMisses: 3,
        onComplete: (s: { totalMistakes: number }) => setMsg(s.totalMistakes === 0 ? 'Perfect!' : `Done, with ${s.totalMistakes} mistake(s).`),
      });
    })();
    return () => { cancelled = true; };
  }, [i]);

  return (
    <div class="modal-back" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div class="modal center" role="dialog" aria-label="Stroke practice">
        <div class="row spread"><h2 style="margin:0">Write {chars[i]}</h2><button class="ghost" onClick={onClose}>Close</button></div>
        <p class="muted">{missing ? 'Stroke data for this character is not bundled yet (only characters from Levels 1–2 are).' : msg}</p>
        <div ref={box} style="margin:0 auto;width:260px;height:260px;border:1px dashed var(--line);border-radius:12px;touch-action:none" />
        <div class="row" style="margin-top:12px">
          <button class="grow" onClick={() => writerRef.current?.animateCharacter()}>Show me</button>
          <button class="grow" onClick={() => { setMsg('Draw each stroke in order.'); writerRef.current?.quiz({ showHintAfterMisses: 3 }); }}>Try again</button>
          {chars.length > 1 && <button class="grow primary" onClick={() => setI((i + 1) % chars.length)}>Next char</button>}
        </div>
      </div>
    </div>
  );
}

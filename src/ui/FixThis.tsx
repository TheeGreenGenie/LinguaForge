// ✎ Fix this — correct any sentence, word, exercise or passage. The app stores
// the fix as an overlay, uses it next time, and resets affected review cards.
import { useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { makeEdit, proposeSpread, type Correction, type CorrectionTarget } from '../data/corrections';
import { saveCorrection } from '../data/repo';
import type { Exercise, Passage, Sentence, Word } from '../data/types';

type Target =
  | { type: 'word'; item: Word }
  | { type: 'sentence'; item: Sentence }
  | { type: 'exercise'; item: Exercise }
  | { type: 'passage'; item: Passage };

interface Field { key: string; label: string; multiline?: boolean; list?: 'semicolon' | 'lines' | 'paragraphs' }

const FIELDS: Record<CorrectionTarget, Field[]> = {
  word: [
    { key: 'lemma', label: 'Word (target language, with tone marks/accents)' },
    { key: 'gloss', label: 'English meanings (separate with ;)', list: 'semicolon' },
    { key: 'pinyin', label: 'Pinyin (Chinese only)' },
    { key: 'ipa', label: 'IPA pronunciation' },
    { key: 'register', label: 'Register: neutral, casual, formal or honorific' },
  ],
  sentence: [
    { key: 'text', label: 'Sentence (target language)', multiline: true },
    { key: 'en', label: 'English translation', multiline: true },
    { key: 'pinyin', label: 'Pinyin (Chinese only)' },
    { key: 'register', label: 'Register: neutral, casual, formal or honorific' },
  ],
  exercise: [
    { key: 'prompt', label: 'Question', multiline: true },
    { key: 'answer', label: 'Correct answer' },
    { key: 'options', label: 'Choices (one per line)', multiline: true, list: 'lines' },
    { key: 'explanation', label: 'Explanation', multiline: true },
  ],
  passage: [
    { key: 'paragraphs', label: 'Passage (blank line between paragraphs)', multiline: true, list: 'paragraphs' },
    { key: 'en', label: 'English reference (blank line between paragraphs)', multiline: true, list: 'paragraphs' },
  ],
};

function toText(v: unknown, f: Field): string {
  if (v === undefined || v === null) return '';
  if (Array.isArray(v)) return v.join(f.list === 'semicolon' ? '; ' : f.list === 'paragraphs' ? '\n\n' : '\n');
  return String(v);
}

function fromText(s: string, f: Field): unknown {
  if (f.list === 'semicolon') return s.split(';').map((x) => x.trim()).filter(Boolean);
  if (f.list === 'lines') return s.split('\n').map((x) => x.trim()).filter(Boolean);
  if (f.list === 'paragraphs') return s.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  const t = s.trim().normalize('NFC');
  return t === '' ? undefined : t;
}

export function FixThis({ target, givenAnswer, wasCorrect, fromExam, onClose }: {
  target: Target;
  givenAnswer?: string;
  wasCorrect?: boolean;
  fromExam?: boolean;
  onClose: (changed: boolean) => void;
}) {
  const { lang, data, reload, toast } = useApp();
  const fields = FIELDS[target.type].filter((f) => (f.key !== 'pinyin' || lang === 'zh') && (f.key !== 'options' || (target.item as Exercise).options));
  const current = target.item as unknown as Record<string, unknown>;
  const [vals, setVals] = useState<Record<string, string>>(Object.fromEntries(fields.map((f) => [f.key, toText(current[f.key], f)])));
  const [note, setNote] = useState('');
  const [spread, setSpread] = useState<{ id: string; before: string; after: string; on: boolean }[] | null>(null);
  const [busy, setBusy] = useState(false);
  if (!lang) return null;

  const base = { lang, targetType: target.type, targetId: target.item.id, createdAt: Date.now(), note: note || undefined, fromExam } as const;

  const simple = async (kind: Correction['kind'], answer?: string) => {
    setBusy(true);
    await saveCorrection({ ...base, kind, answer });
    await reload();
    toast(kind === 'accept' ? 'Saved. That answer will be accepted from now on.' : kind === 'reject' ? 'Saved. That answer will be marked wrong from now on.' : 'Removed. It won’t appear again.');
    onClose(true);
  };

  const saveEdit = async () => {
    const next: Record<string, unknown> = {};
    for (const f of fields) next[f.key] = fromText(vals[f.key], f);
    const c = makeEdit(lang, target.type, target.item.id, current, next, note || undefined);
    if (!c) { onClose(false); return; }
    setBusy(true);
    await saveCorrection({ ...c, fromExam });
    // Word spelling fixed → offer to fix the same word in sentences
    if (target.type === 'word' && typeof c.patch?.lemma === 'string' && data) {
      const props = proposeSpread(String(current.lemma), String(c.patch.lemma), [...data.sentences.values()]);
      if (props.length) { setSpread(props.slice(0, 200).map((p) => ({ ...p, on: true }))); setBusy(false); return; }
    }
    await reload();
    toast('Fixed. The app will use your version from now on, and review of this item starts again.');
    onClose(true);
  };

  const applySpread = async () => {
    setBusy(true);
    for (const p of spread!.filter((x) => x.on)) {
      const c = makeEdit(lang, 'sentence', p.id, { text: p.before }, { text: p.after }, `spread from word fix: ${note}`);
      if (c) await saveCorrection(c);
    }
    await reload();
    toast(`Fixed the word and ${spread!.filter((x) => x.on).length} sentences.`);
    onClose(true);
  };

  return (
    <div class="modal-back" onClick={(e) => e.target === e.currentTarget && onClose(false)}>
      <div class="modal" role="dialog" aria-label="Fix this">
        {spread ? (
          <>
            <h2>Also fix these sentences?</h2>
            <p class="muted">These sentences use the old spelling as a whole word. Untick any that don't refer to the same word.</p>
            {spread.map((p, i) => (
              <label key={p.id} class="card row" style="font-weight:400">
                <input type="checkbox" checked={p.on} onChange={() => setSpread(spread.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))} />
                <span class="grow"><s class="muted">{p.before}</s><br />{p.after}</span>
              </label>
            ))}
            <button class="primary block" disabled={busy} onClick={applySpread}>Apply</button>
          </>
        ) : (
          <>
            <div class="row spread"><h2 style="margin:0">✎ Fix this</h2><button class="ghost" onClick={() => onClose(false)}>Close</button></div>
            <p class="muted">Found a mistake (wrong tone mark, bad translation, unnatural sentence)? Fix it here. Your fix is kept even when the app updates.</p>
            {givenAnswer && !wasCorrect && (
              <button class="block" disabled={busy} onClick={() => simple('accept', givenAnswer)}>✓ My answer “{givenAnswer}” was right: accept it</button>
            )}
            {givenAnswer && wasCorrect && (
              <button class="block" disabled={busy} onClick={() => simple('reject', givenAnswer)}>✗ “{givenAnswer}” should NOT be accepted</button>
            )}
            {fromExam && <p><small class="pill warn">Exam fix: applies from now on. Any score change is re-checked by AI or marked “self-corrected”.</small></p>}
            <hr />
            {fields.map((f) => (
              <div key={f.key}>
                <label>{f.label}</label>
                {f.multiline
                  ? <textarea value={vals[f.key]} onInput={(e) => setVals({ ...vals, [f.key]: (e.target as HTMLTextAreaElement).value })} />
                  : <input type="text" value={vals[f.key]} autocapitalize="off" autocorrect="off" spellcheck={false} onInput={(e) => setVals({ ...vals, [f.key]: (e.target as HTMLInputElement).value })} />}
              </div>
            ))}
            <label>Why? (optional note, e.g. “should be low tone”)</label>
            <input type="text" value={note} onInput={(e) => setNote((e.target as HTMLInputElement).value)} />
            <div class="stack" style="margin-top:14px">
              <button class="primary block" disabled={busy} onClick={saveEdit}>Save fix</button>
              <button class="block danger" disabled={busy} onClick={() => confirm('Hide this item from all lessons and exams?') && simple('remove')}>Remove this item. It's wrong or unnatural.</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export type { Target as FixTarget };

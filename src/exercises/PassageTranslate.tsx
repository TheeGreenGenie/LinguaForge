// Long translation with the "every word" rule (ROADMAP Part 3):
//  1. learner translates the passage
//  2. word-by-word review: every word of the source must be tapped and confirmed
//  3. hybrid grading: chrF vs reference + paragraph self-grade, optional AI grade
import { useRef, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import type { Passage } from '../data/types';
import { tokenize } from '../lang/tokenize';
import { chrF } from '../progress/chrf';
import { DiacriticBar } from '../ui/DiacriticBar';
import { gradeWithAi, aiErrorMessage, type AiGrade } from '../progress/ai';
import { FixThis } from '../ui/FixThis';

export interface PassageResult {
  passageId: string;
  direction: 'to-english' | 'to-target';
  chrf: number;
  selfScore: number;
  ai?: AiGrade;
  aiError?: string;
  coverageComplete: boolean;
  translation: string;
}

type TokState = 'pending' | 'covered' | 'missed';

export function PassageTranslate({ passage, direction, passMark, onDone }: {
  passage: Passage;
  direction: 'to-english' | 'to-target';
  passMark: number;
  onDone: (r: PassageResult) => void;
}) {
  const { data, lang, settings } = useApp();
  const [stage, setStage] = useState<'translate' | 'review' | 'grade' | 'ai'>('translate');
  const [text, setText] = useState('');
  const [toks, setToks] = useState<Record<number, TokState>>({});
  const [open, setOpen] = useState<number | null>(null);
  const [self, setSelf] = useState<Record<number, number>>({});
  const [ai, setAi] = useState<AiGrade | null>(null);
  const [aiErr, setAiErr] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [fix, setFix] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  if (!data || !lang) return null;

  const sourceParas = direction === 'to-english' ? passage.paragraphs : passage.en;
  const refParas = direction === 'to-english' ? passage.en : passage.paragraphs;
  const sourceText = sourceParas.join('\n\n');
  const tokens = sourceParas.map((p) => tokenize(p, direction === 'to-english' ? lang : 'es'));
  let flat = 0;
  const indexed = tokens.map((para) => para.map((t) => ({ ...t, n: t.isWord ? flat++ : -1 })));
  const wordCount = flat;
  const coveredCount = Object.values(toks).filter((s) => s === 'covered').length;
  const missed = Object.values(toks).filter((s) => s === 'missed').length;
  const allCovered = coveredCount === wordCount;
  const learnerParas = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  const glossFor = (word: string) => {
    if (direction !== 'to-english') return null;
    const ids = data.index.lookup(word);
    const w = ids.map((id) => data.words.get(id)).filter(Boolean);
    return w.length ? w.map((x) => `${x!.lemma}: ${x!.gloss.slice(0, 3).join('; ')}`).join(' | ') : 'Not in the dictionary. Check the context.';
  };

  // learner's target-language words not found in the dictionary (possible tone/spelling slips)
  const suspicious = direction === 'to-target'
    ? [...new Set(tokenize(text, lang).filter((t) => t.isWord && !t.exempt && !data.index.lookup(t.text).length).map((t) => t.text))]
    : [];

  if (stage === 'translate') {
    return (
      <div>
        <div class="prompt-label">Translate into {direction === 'to-english' ? 'English' : 'the language'}: every sentence, every word</div>
        <div class="card passage">{sourceParas.map((p, i) => <p key={i}>{p}</p>)}</div>
        <textarea ref={ref} lang={direction === 'to-english' ? 'en' : lang} value={text} placeholder="Your translation (leave a blank line between paragraphs)" autocapitalize="sentences" spellcheck={false} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} style="min-height:220px" />
        {direction === 'to-target' && <DiacriticBar lang={lang} target={ref} value={text} onChange={setText} />}
        <button class="primary block" disabled={text.trim().length < 10} onClick={() => setStage('review')}>Next: word-by-word review</button>
      </div>
    );
  }

  if (stage === 'review') {
    return (
      <div>
        <div class="prompt-label">Word-by-word review: {coveredCount}/{wordCount} words confirmed</div>
        <p class="muted">Tap every underlined word. Confirm you translated it, or mark it missed and go back to fix your translation. All words must be confirmed before you can submit.</p>
        <div class="bar"><span style={`width:${Math.round((coveredCount / Math.max(1, wordCount)) * 100)}%`} /></div>
        <div class="card passage">
          {indexed.map((para, pi) => (
            <p key={pi}>
              {para.map((t, ti) => t.n < 0 || !t.isWord
                ? <span key={ti}>{t.text}</span>
                : <span key={ti} class={`tok ${toks[t.n] === 'covered' ? 'covered' : toks[t.n] === 'missed' ? 'unknown' : 'pending'}`} onClick={() => setOpen(t.n)}>{t.text}</span>)}
            </p>
          ))}
        </div>
        {open !== null && (() => {
          const t = indexed.flat().find((x) => x.n === open)!;
          return (
            <div class="card">
              <b style="font-size:1.2rem">{t.text}</b>
              {direction === 'to-english' && <p class="muted">{glossFor(t.text)}</p>}
              <div class="row">
                <button class="grow primary" onClick={() => { setToks({ ...toks, [open]: 'covered' }); const next = indexed.flat().find((x) => x.n > open && x.isWord && toks[x.n] !== 'covered'); setOpen(next ? next.n : null); }}>✓ I translated it</button>
                <button class="grow" onClick={() => { setToks({ ...toks, [open]: 'missed' }); setOpen(null); }}>✗ I missed it</button>
              </div>
            </div>
          );
        })()}
        <div class="card"><b>Your translation</b><p style="white-space:pre-wrap">{text}</p></div>
        {suspicious.length > 0 && <div class="feedback warn">These words in your translation aren't in the dictionary. Check the spelling and tone marks: {suspicious.slice(0, 15).join(', ')}</div>}
        {missed > 0 && <div class="feedback bad">{missed} word(s) marked missed. Edit your translation, then confirm them.</div>}
        <div class="row">
          <button class="grow" onClick={() => setStage('translate')}>Edit translation</button>
          <button class="grow" onClick={() => { const all: Record<number, TokState> = {}; indexed.flat().forEach((x) => { if (x.n >= 0) all[x.n] = toks[x.n] ?? 'pending'; }); setOpen(indexed.flat().find((x) => x.n >= 0 && all[x.n] !== 'covered')?.n ?? null); }}>Next unconfirmed</button>
        </div>
        <button class="primary block" style="margin-top:10px" disabled={!allCovered} onClick={() => setStage('grade')}>{allCovered ? 'Submit for grading' : `Confirm all words first (${wordCount - coveredCount} left)`}</button>
      </div>
    );
  }

  const chrf = chrF(text, refParas.join('\n\n'));
  const selfScore = refParas.length ? refParas.reduce((a, _, i) => a + (self[i] ?? 0), 0) / refParas.length : 0;
  const selfDone = refParas.every((_, i) => self[i] !== undefined);

  const runAi = async () => {
    setAiBusy(true); setAiErr(null);
    try {
      setAi(await gradeWithAi({ apiKey: settings.apiKey, model: settings.aiModel, lang, direction, source: sourceText, reference: refParas.join('\n\n'), learner: text, passMark: passMark * 100 }));
    } catch (e) { setAiErr(aiErrorMessage(e)); }
    setAiBusy(false);
  };

  return (
    <div>
      <div class="prompt-label">Compare with the reference</div>
      <p class="muted">Rate each paragraph honestly: does yours say the same thing, with correct spelling{lang === 'yo' ? ', tone marks and respect forms' : lang === 'zh' ? ' and characters' : ' and accents'}?</p>
      {refParas.map((r, i) => (
        <div class="card" key={i}>
          <small class="muted">Yours</small>
          <p style="white-space:pre-wrap">{learnerParas[i] ?? (i === 0 ? text : '—')}</p>
          <small class="muted">Reference</small>
          <p><b>{r}</b></p>
          <div class="row">
            {[['Same meaning, correct', 1], ['Small errors', 0.7], ['Wrong / missing', 0]].map(([label, v]) => (
              <button key={label} class={`grow small ${self[i] === v ? 'primary' : ''}`} onClick={() => setSelf({ ...self, [i]: v as number })}>{label}</button>
            ))}
          </div>
        </div>
      ))}
      <div class="card row">
        <div class="stat"><b>{Math.round(chrf * 100)}</b><small>similarity (chrF)</small></div>
        <div class="stat"><b>{selfDone ? Math.round(selfScore * 100) : '…'}</b><small>self-grade</small></div>
        {ai && <div class="stat"><b>{ai.score}</b><small>AI grade</small></div>}
      </div>
      {settings.apiKey ? (
        <button class="block" disabled={aiBusy} onClick={runAi}>{aiBusy ? 'AI is grading…' : ai ? 'Re-grade with AI' : 'Grade with AI (online, uses your key)'}</button>
      ) : <p><small class="muted">Add a Claude API key in Settings for AI grading. Without it this result is marked "self-verified".</small></p>}
      {aiErr && <div class="feedback bad">{aiErr}</div>}
      {ai && (
        <div class={`feedback ${ai.passed ? 'good' : 'bad'}`}>
          <div>{ai.summary}</div>
          <small>accuracy {ai.accuracy} · grammar {ai.grammar} · spelling/tones {ai.orthography} · register {ai.register}</small>
          {ai.errors.slice(0, 8).map((e, i) => <div key={i} style="color:var(--text)"><small>“{e.quote}”: {e.problem} → <b>{e.fix}</b></small></div>)}
        </div>
      )}
      <button class="ghost" onClick={() => setFix(true)}>✎ Fix this passage or reference</button>
      <button class="primary block" disabled={!selfDone || aiBusy} onClick={() => onDone({ passageId: passage.id, direction, chrf, selfScore, ai: ai ?? undefined, aiError: aiErr ?? undefined, coverageComplete: allCovered, translation: text })}>Continue</button>
      {fix && <FixThis target={{ type: 'passage', item: passage }} fromExam onClose={() => setFix(false)} />}
    </div>
  );
}

import { useEffect, useRef, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import type { Task } from '../srs/session';
import { checkAnswer, type CheckResult } from './check';
import { DiacriticBar, TYPING_HELP } from '../ui/DiacriticBar';
import { PronunciationCard } from '../ui/Pronunciation';
import { FixThis, type FixTarget } from '../ui/FixThis';
import { StrokePractice } from '../ui/StrokePractice';
import type { ErrorType } from '../lang/grade';

const ERROR_TEXT: Record<ErrorType, string> = {
  none: 'Correct!',
  typo: 'Correct, with a small typo.',
  accent: 'Correct, but check the accent marks.',
  tone: 'Right letters, wrong tone. In this language that’s a different word.',
  underdot: 'Missing an underdot (ẹ ọ ṣ). That changes the letter.',
  register: 'Right meaning, wrong formality for this person.',
  wrong: 'Not quite.',
};

const SENIORITY_HINT: Record<string, string> = { elder: 'to an elder / respected person', peer: 'to a friend or peer', younger: 'to someone younger', group: 'to a group' };

export function TaskView({ task, onDone, fromExam = false, hideFix = false }: {
  task: Task;
  onDone: (r: { correct: boolean; errorType: ErrorType; ms: number; given: string; skipped?: boolean }) => void;
  fromExam?: boolean;
  hideFix?: boolean;
}) {
  const { data, settings, lang } = useApp();
  const [given, setGiven] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [chosenTiles, setChosenTiles] = useState<number[]>([]);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [selfOk, setSelfOk] = useState<boolean | null>(null);
  const [fix, setFix] = useState(false);
  const [stroke, setStroke] = useState(false);
  const started = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGiven(''); setPicked(null); setChosenTiles([]); setResult(null); setSelfOk(null); started.current = Date.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [task.key]);

  if (!data || !lang) return null;
  const { word: w, sentence: s, exercise: e, card } = task;
  const recog = card.dir === 'recog';

  const submit = (answer: string) => {
    if (result) return;
    const r = checkAnswer(task, answer, data, settings);
    setResult(r);
  };

  const finish = (override?: boolean) => {
    if (!result) return;
    const correct = override ?? (result.needsSelfCheck ? !!selfOk : result.correct);
    onDone({ correct, errorType: correct ? (result.errorType === 'wrong' ? 'none' : result.errorType) : result.errorType, ms: Date.now() - started.current, given: picked ?? (task.mode === 'tiles' ? tilesText() : given) });
  };

  const tilesText = () => chosenTiles.map((i) => task.tiles![i]).join(lang === 'zh' ? '' : ' ');

  // ------------------------------------------------------------ intro (new word)
  if (task.mode === 'intro' && w) {
    return (
      <div>
        <div class="prompt-label">New word</div>
        <div class={`big-target ${lang === 'zh' ? 'zh' : ''}`}>{w.lemma}</div>
        <PronunciationCard lang={lang} text={w.lemma} ipa={w.ipa} pinyin={w.pinyin} clips={w.clips} />
        <div class="card">
          <b>{w.gloss.join('; ')}</b> <span class="pill">{w.pos}</span>
          {w.register && w.register !== 'neutral' && <span class="pill warn" style="margin-left:6px">{w.register}</span>}
          {!w.verified && <div><small class="muted">Unverified source ({w.source}). Tap ✎ if something looks wrong.</small></div>}
        </div>
        <button class="primary block" onClick={() => onDone({ correct: true, errorType: 'none', ms: Date.now() - started.current, given: '' })}>Got it</button>
        {lang === 'zh' && <button class="ghost" onClick={() => setStroke(true)}>✍ Practice writing it</button>}
        {!hideFix && <button class="ghost" onClick={() => setFix(true)}>✎ Fix this</button>}
        {fix && <FixThis target={{ type: 'word', item: w }} onClose={(changed) => { setFix(false); if (changed) onDone({ correct: true, errorType: 'none', ms: 0, given: '', skipped: true }); }} />}
        {stroke && <StrokePractice text={w.lemma} onClose={() => setStroke(false)} />}
      </div>
    );
  }

  // ------------------------------------------------------------ prompt
  let promptLabel = '';
  let promptMain: preact.ComponentChild = null;
  let showPron = false;
  if (w) {
    promptLabel = recog ? 'What does this mean?' : `Write in ${lang === 'zh' ? 'Chinese' : 'the language'}`;
    promptMain = recog ? w.lemma : w.gloss.slice(0, 2).join('; ');
    showPron = recog;
  } else if (s) {
    promptLabel = recog ? 'Translate into English' : 'Translate';
    promptMain = recog ? s.text : s.en;
    showPron = recog && lang !== 'yo' ? false : recog;
  } else if (e) {
    promptLabel = e.type === 'tone-id' ? 'Which tones?' : e.type === 'register-scene' ? 'Choose the right words for this person' : e.type === 'letter-sound' ? 'Sounds' : '';
    promptMain = e.prompt;
  }
  const targetShown = (w && recog) || (s && recog) || e?.type === 'tone-id';
  const fixTarget: FixTarget | null = w ? { type: 'word', item: w } : s ? { type: 'sentence', item: s } : e ? { type: 'exercise', item: e } : null;
  const options = task.options ?? e?.options;
  const isMc = task.mode === 'mc' || !!(e && e.options?.length);
  const typedSide = w ? (recog ? 'english' : 'target') : s ? (recog ? 'english' : 'target') : e?.side ?? 'target';

  return (
    <div>
      {promptLabel && <div class="prompt-label">{promptLabel}</div>}
      <div class={`big-target ${lang === 'zh' && targetShown ? 'zh' : ''}`} style={typeof promptMain === 'string' && promptMain.length > 40 ? 'font-size:1.35rem' : ''}>{promptMain}</div>
      {s?.seniority && !recog && <div class="pill warn">{SENIORITY_HINT[s.seniority]}</div>}
      {s?.register && s.register !== 'neutral' && recog && <div class="pill warn">{s.register}</div>}
      {showPron && w && <PronunciationCard lang={lang} text={w.lemma} ipa={w.ipa} pinyin={w.pinyin} clips={w.clips} />}
      {showPron && s && lang === 'yo' && <PronunciationCard lang={lang} text={s.text} audio={s.audio} />}
      {e?.type === 'tone-id' && <PronunciationCard lang={lang} text={lang === 'zh' ? '' : e.prompt} pinyin={lang === 'zh' ? e.prompt : undefined} clips={lang === 'yo' ? data.index.lookup(e.prompt).map((id) => data.words.get(id)?.clips ?? []).flat().filter((c, i, a) => a.findIndex((x) => x.src === c.src) === i).slice(0, 2) : undefined} />}
      {s && recog && lang === 'zh' && s.pinyin && <details><summary>Show pinyin</summary><PronunciationCard lang="zh" text={s.text} pinyin={s.pinyin} autoPinyin={s.source !== 'authored'} /></details>}

      {isMc && options && (
        <div class="options">
          {options.map((o) => {
            const cls = result ? (o === result.expected ? 'right' : o === picked ? 'wrong' : '') : o === picked ? 'picked' : '';
            return <button key={o} class={cls} disabled={!!result} onClick={() => { setPicked(o); submit(o); }}>{o}</button>;
          })}
        </div>
      )}

      {task.mode === 'tiles' && task.tiles && (
        <>
          <div class="tiles answer">
            {chosenTiles.map((i, k) => <button key={k} disabled={!!result} onClick={() => setChosenTiles(chosenTiles.filter((_, j) => j !== k))}>{task.tiles![i]}</button>)}
          </div>
          <div class="tiles">
            {task.tiles.map((t, i) => <button key={i} disabled={!!result || chosenTiles.includes(i)} style={chosenTiles.includes(i) ? 'visibility:hidden' : ''} onClick={() => setChosenTiles([...chosenTiles, i])}>{t}</button>)}
          </div>
          {!result && <button class="primary block" disabled={!chosenTiles.length} onClick={() => submit(tilesText())}>Check</button>}
        </>
      )}

      {!isMc && task.mode !== 'tiles' && (
        <form onSubmit={(ev) => { ev.preventDefault(); result ? finish() : submit(given); }}>
          <input
            ref={inputRef}
            type="text"
            value={given}
            disabled={!!result}
            lang={typedSide === 'english' ? 'en' : lang}
            placeholder={typedSide === 'english' ? 'Type in English' : 'Type your answer'}
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            spellcheck={false}
            onInput={(ev) => setGiven((ev.target as HTMLInputElement).value)}
          />
          {typedSide === 'target' && !result && <DiacriticBar lang={lang} target={inputRef} value={given} onChange={setGiven} />}
          {typedSide === 'target' && !result && <small class="muted">{TYPING_HELP[lang]}</small>}
          {!result && <button class="primary block" style="margin-top:10px" type="submit" disabled={!given.trim()}>Check</button>}
        </form>
      )}

      {result && (
        <>
          {result.needsSelfCheck && selfOk === null ? (
            <div class="feedback warn">
              <div>Close. Compare your answer with the reference:</div>
              <div class="answer">{result.expected}</div>
              <div class="row" style="margin-top:10px">
                <button class="grow" onClick={() => setSelfOk(true)}>Mine means the same</button>
                <button class="grow" onClick={() => setSelfOk(false)}>Mine was wrong</button>
              </div>
            </div>
          ) : (
            <div class={`feedback ${(result.needsSelfCheck ? selfOk : result.correct) ? (result.errorType === 'none' ? 'good' : 'warn') : 'bad'}`}>
              <div>{result.needsSelfCheck ? (selfOk ? 'Marked correct (self-checked).' : 'Marked wrong.') : ERROR_TEXT[result.errorType]}</div>
              {(!result.correct || result.errorType !== 'none') && <div class="answer">{result.expected}</div>}
              {result.alternatives.length > 0 && <small>Also accepted: {result.alternatives.slice(0, 3).join(' · ')}</small>}
              {e?.explanation && <p style="color:var(--text)">{e.explanation}</p>}
            </div>
          )}
          {w && !recog && <PronunciationCard lang={lang} text={w.lemma} ipa={w.ipa} pinyin={w.pinyin} clips={w.clips} />}
          {(!result.needsSelfCheck || selfOk !== null) && (
            <button class="primary block" onClick={() => finish()} autoFocus>Continue</button>
          )}
          {lang === 'zh' && w && <button class="ghost" onClick={() => setStroke(true)}>✍ Practice writing</button>}
          {stroke && w && <StrokePractice text={w.lemma} onClose={() => setStroke(false)} />}
          {!hideFix && fixTarget && <button class="ghost" onClick={() => setFix(true)}>✎ Fix this</button>}
        </>
      )}
      {fix && fixTarget && (
        <FixThis
          target={fixTarget}
          givenAnswer={(picked ?? (task.mode === 'tiles' ? tilesText() : given)) || undefined}
          wasCorrect={result?.correct}
          fromExam={fromExam}
          onClose={(changed) => { setFix(false); if (changed) onDone({ correct: true, errorType: 'none', ms: Date.now() - started.current, given, skipped: true }); }}
        />
      )}
    </div>
  );
}

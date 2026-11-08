// Certified Mastery (Level 6): 3 passages language→English + 3 English→language,
// 2–3 paragraphs each. Every word in them must already be known (unlock gate),
// and every word must be confirmed in the word-by-word review.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { db } from '../data/db';
import type { Passage } from '../data/types';
import { coverage } from '../progress/coverage';
import { langStats, type LangStats } from '../progress/stats';
import { LEVEL_PASS } from '../progress/levels';
import { PassageTranslate, type PassageResult } from '../exercises/PassageTranslate';
import { newCard, cardId } from '../srs/scheduler';
import { awardXp } from '../motivation/record';
import { XP } from '../motivation/streaks';

interface Candidate { passage: Passage; unknown: string[]; unmatched: string[] }

export function Certify() {
  const { data, lang, go, toast } = useApp();
  const [stats, setStats] = useState<LangStats | null>(null);
  const [step, setStep] = useState(-1);
  const [results, setResults] = useState<PassageResult[]>([]);

  useEffect(() => { if (data) langStats(data).then(setStats); }, [data?.lang]);

  const candidates: Candidate[] = useMemo(() => {
    if (!data || !stats) return [];
    const ps = [...data.passages.values()].filter((p) => p.level >= 5 && p.paragraphs.length >= 2 && !p.title.endsWith('⚠'));
    return ps.map((p) => {
      const r = coverage(p.paragraphs.join(' '), data.lang, data.index, stats.knownIds);
      return { passage: p, unknown: r.unknownWordIds, unmatched: r.unmatched };
    }).sort((a, b) => a.unknown.length - b.unknown.length);
  }, [stats, data?.lang]);

  if (!data || !lang) return null;
  if (!stats) return <main><p>Checking your vocabulary…</p></main>;

  const ready = candidates.filter((c) => c.unknown.length === 0);
  const chosen = ready.slice(0, 6);
  const level5 = stats.passed.includes(5);
  const canStart = level5 && chosen.length >= 6;

  const addMissing = async (c: Candidate[]) => {
    const ids = [...new Set(c.flatMap((x) => x.unknown))];
    const existing = new Set((await db.cards.bulkGet(ids.map((id) => cardId('word', id, 'recog')))).filter(Boolean).map((x) => x!.itemId));
    const fresh = ids.filter((id) => !existing.has(id)).flatMap((id) => [newCard(lang, 'word', id, 'recog'), newCard(lang, 'word', id, 'prod')]);
    await db.cards.bulkPut(fresh);
    toast(`${fresh.length / 2} words added to your reviews.`);
  };

  if (step === -1) {
    const nearest = candidates.slice(0, 6);
    return (
      <main>
        <button class="ghost" onClick={() => go({ name: 'progress' })}>← Back</button>
        <h1>Certified Mastery</h1>
        <div class="card">
          <p>The final test: <b>3 passages from the language into English</b> and <b>3 from English into the language</b>, each 2–3 paragraphs.</p>
          <p class="muted">Before it unlocks, every word in the chosen passages must be known (remembered 21+ days, both directions). In the exam you confirm every word one by one. Pass mark: {Math.round(LEVEL_PASS.certification * 100)}%. AI grading is used if you have a key; otherwise the result is marked self-verified.</p>
        </div>
        {!level5 && <div class="feedback warn">Pass the Level 5 exam first.</div>}
        <div class="card">
          <b>Passages ready: {ready.length} / 6 needed</b>
          {chosen.length < 6 && nearest.length > 0 && (
            <>
              <p class="muted">Closest passages and the words you still need:</p>
              {nearest.map((c) => (
                <details key={c.passage.id}>
                  <summary>{c.passage.title}: {c.unknown.length} words to learn</summary>
                  <small>{c.unknown.slice(0, 40).map((id) => data.words.get(id)?.lemma).filter(Boolean).join(', ')}</small>
                  {c.unmatched.length > 0 && <div><small class="muted">Not in the dictionary (checked in the exam review): {c.unmatched.slice(0, 20).join(', ')}</small></div>}
                </details>
              ))}
              <button class="block" onClick={() => addMissing(nearest)}>Add these words to my reviews</button>
            </>
          )}
        </div>
        <button class="primary block" disabled={!canStart} onClick={() => setStep(0)}>Begin certification</button>
      </main>
    );
  }

  if (step < 6) {
    const direction = step < 3 ? 'to-english' : 'to-target';
    return (
      <main>
        <div class="row"><b>Certification {step + 1}/6</b><div class="bar grow"><span style={`width:${Math.round((step / 6) * 100)}%`} /></div></div>
        <PassageTranslate key={step} passage={chosen[step].passage} direction={direction} passMark={LEVEL_PASS.certification}
          onDone={(r) => { setResults([...results, r]); setStep(step + 1); }} />
      </main>
    );
  }

  // results
  const allAi = results.every((r) => r.ai);
  const score = results.reduce((a, r) => a + (r.ai ? r.ai.score / 100 : r.selfScore), 0) / results.length;
  const chrfOk = results.every((r) => r.chrf >= (r.direction === 'to-english' ? 0.35 : 0.3));
  const coverageOk = results.every((r) => r.coverageComplete);
  const passed = score >= LEVEL_PASS.certification && coverageOk && (allAi || chrfOk);
  const method = allAi ? 'ai' : 'self-verified';

  const save = async () => {
    if (passed) {
      await db.certs.add({ lang, level: 6, at: Date.now(), score, method, details: results.map((r) => ({ id: r.passageId, dir: r.direction, chrf: r.chrf, self: r.selfScore, ai: r.ai?.score })) });
      await awardXp(lang, XP.examPassed * 4);
    }
    go({ name: 'progress' });
  };

  return (
    <main>
      <h1>{passed ? '🎓 Certified!' : 'Not certified yet'}</h1>
      <div class="card row">
        <div class="stat"><b>{Math.round(score * 100)}%</b><small>score</small></div>
        <div class="stat"><b>{coverageOk ? '100%' : 'incomplete'}</b><small>word coverage</small></div>
        <div class="stat"><b>{method}</b><small>grading</small></div>
      </div>
      {!chrfOk && !allAi && <div class="feedback warn">At least one translation is very different from its reference. Without AI grading, this can't be certified on self-grading alone.</div>}
      {results.map((r, i) => (
        <div class="card" key={i}><small>{r.direction === 'to-english' ? '→ English' : '→ ' + lang}</small> · self {Math.round(r.selfScore * 100)} · chrF {Math.round(r.chrf * 100)}{r.ai ? ` · AI ${r.ai.score}` : ''}</div>
      ))}
      <button class="primary block" onClick={save}>{passed ? 'Save certificate' : 'Back to progress'}</button>
    </main>
  );
}

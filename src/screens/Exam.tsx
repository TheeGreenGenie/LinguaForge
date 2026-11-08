// Level exams 0–5 (ROADMAP Part 3).
import { useEffect, useMemo, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { db } from '../data/db';
import { newCard } from '../srs/scheduler';
import { makeTask, type Task } from '../srs/session';
import { TaskView } from '../exercises/TaskView';
import { PassageTranslate, type PassageResult } from '../exercises/PassageTranslate';
import { LEVELS, LEVEL_PASS } from '../progress/levels';
import { langStats, examReady, lessonsDone } from '../progress/stats';
import { awardXp } from '../motivation/record';
import { XP } from '../motivation/streaks';

function sample<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
}

export function Exam({ level }: { level: number }) {
  const { data, lang, go } = useApp();
  const [gate, setGate] = useState<{ ready: boolean; reason?: string } | null>(null);
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [fixedDuring, setFixedDuring] = useState(false);
  const [passageRes, setPassageRes] = useState<PassageResult | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!data || !lang) return;
    Promise.all([langStats(data), lessonsDone(lang)]).then(([s, done]) => setGate(examReady(s, level, data, done)));
  }, [data?.lang, level]);

  const tasks: Task[] = useMemo(() => {
    if (!data || !lang) return [];
    if (level === 0) {
      const ex = data.lessons.filter((l) => l.level === 0).flatMap((l) => l.exercises);
      return sample(ex, 20).map((e) => ({ key: e.id, card: newCard(lang, 'exercise', e.id, 'drill'), mode: 'exercise' as const, exercise: e, isNewItem: false }));
    }
    const words = sample([...data.words.values()].filter((w) => (w.level ?? 1) === level), 12);
    const sents = sample([...data.sentences.values()].filter((s) => (s.level ?? 1) <= level), level >= 3 ? 4 : 8);
    const out: Task[] = [];
    words.forEach((w, k) => {
      const c = { ...newCard(lang, 'word', w.id, k % 2 ? 'recog' : 'prod'), fsrs: { ...newCard(lang, 'word', w.id, 'recog').fsrs, reps: 5 } };
      const t = makeTask(data, c, false); if (t) out.push(t);
    });
    sents.forEach((s, k) => {
      const c = { ...newCard(lang, 'sentence', s.id, k % 2 ? 'recog' : 'prod'), fsrs: { ...newCard(lang, 'sentence', s.id, 'recog').fsrs, reps: 5 } };
      const t = makeTask(data, c, false); if (t) out.push(t);
    });
    return sample(out, out.length);
  }, [data?.lang, level, started]);

  const passage = useMemo(() => {
    if (!data || level < 3) return null;
    const cands = [...data.passages.values()].filter((p) => p.level <= Math.max(4, level) && !p.title.endsWith('⚠'));
    const p = sample(cands, 1)[0];
    if (!p) return null;
    const paras = level === 5 ? 2 : 1;
    return { ...p, paragraphs: p.paragraphs.slice(0, paras), en: p.en.slice(0, paras) };
  }, [data?.lang, level, started]);

  if (!data || !lang) return null;
  const def = LEVELS[level];
  const passMark = level === 0 ? LEVEL_PASS.level0 : LEVEL_PASS.levelN;

  if (!started) {
    return (
      <main>
        <button class="ghost" onClick={() => go({ name: 'learn' })}>← Back</button>
        <h1>Level {level} exam: {def.name}</h1>
        <div class="card"><p>{def.exam}</p><p class="muted">Pass mark: {Math.round(passMark * 100)}%. {tasks.length} questions{passage ? ' + 1 passage translation' : ''}.</p></div>
        {gate && !gate.ready && <div class="feedback warn">{gate.reason}</div>}
        <button class="primary block" disabled={!gate?.ready || !tasks.length} onClick={() => setStarted(true)}>Start exam</button>
      </main>
    );
  }

  const finish = async (finalCorrect: number, pr: PassageResult | null) => {
    const itemScore = tasks.length ? finalCorrect / tasks.length : 0;
    const pScore = pr ? (pr.ai ? pr.ai.score / 100 : (pr.selfScore * 0.7 + Math.min(1, pr.chrf / 0.6) * 0.3)) : null;
    const total = pScore === null ? itemScore : itemScore * 0.7 + pScore * 0.3;
    setScore(total);
    setFinished(true);
    if (total >= passMark) {
      const method = pr?.ai ? 'ai' : fixedDuring ? 'self-corrected' : pr ? 'self-verified' : 'auto';
      await db.certs.add({ lang, level, at: Date.now(), score: total, method, details: { items: tasks.length, passage: pr?.passageId } });
      await awardXp(lang, XP.examPassed);
    }
  };

  if (finished) {
    const passed = score >= passMark;
    return (
      <main>
        <h1>{passed ? `Level ${level} passed!` : 'Not yet'}</h1>
        <div class="card row"><div class="stat"><b>{Math.round(score * 100)}%</b><small>score</small></div><div class="stat"><b>{Math.round(passMark * 100)}%</b><small>needed</small></div></div>
        <p class="muted">{passed ? (level < 6 ? `Level ${level + 1} is now your goal.` : '') : 'Keep reviewing. Your mistakes are back in your reviews. Try again any time.'}</p>
        {fixedDuring && <p><small class="pill warn">You fixed items during this exam, so the result is marked “self-corrected”.</small></p>}
        <button class="primary block" onClick={() => go({ name: 'learn' })}>Done</button>
      </main>
    );
  }

  if (i < tasks.length) {
    return (
      <main>
        <div class="row" style="margin-bottom:12px"><b>Exam</b><div class="bar grow"><span style={`width:${Math.round((i / (tasks.length + (passage ? 1 : 0))) * 100)}%`} /></div><small>{i + 1}/{tasks.length}</small></div>
        <TaskView task={tasks[i]} fromExam onDone={(r) => {
          if (r.skipped) setFixedDuring(true);
          const c = score + (r.correct ? 1 : 0);
          setScore(c);
          if (i + 1 >= tasks.length && !passage) finish(c, null); else setI(i + 1);
        }} />
      </main>
    );
  }

  if (passage && !passageRes) {
    return (
      <main>
        <h2>Final part: translation</h2>
        <PassageTranslate passage={passage} direction={Math.random() < 0.5 ? 'to-english' : 'to-target'} passMark={passMark} onDone={(r) => { setPassageRes(r); finish(score, r); }} />
      </main>
    );
  }
  return null;
}

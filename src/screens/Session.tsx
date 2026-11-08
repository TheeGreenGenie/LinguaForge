import { useEffect, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { buildSession, makeTask, type SessionPlan, type Task } from '../srs/session';
import { TaskView } from '../exercises/TaskView';
import { recordAnswer, streakNow } from '../motivation/record';
import { db } from '../data/db';
import type { ErrorType } from '../lang/grade';

export function Session() {
  const { data, settings, go, lang } = useApp();
  const [plan, setPlan] = useState<SessionPlan | null>(null);
  const [queue, setQueue] = useState<Task[]>([]);
  const [done, setDone] = useState(0);
  const [stats, setStats] = useState({ xp: 0, correct: 0, total: 0, errors: {} as Partial<Record<ErrorType, number>> });
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    if (!data) return;
    buildSession(data, settings).then((p) => { setPlan(p); setQueue(p.tasks); });
  }, [data?.lang]);

  const current = queue[0];
  const finished = !!plan && !current;
  useEffect(() => {
    if (!finished || !lang) return;
    streakNow(settings.dailyGoal).then(setStreak);
    if ('setAppBadge' in navigator) {
      db.cards.where('[lang+due]').between([lang, 0], [lang, Date.now()]).count().then((n) => (navigator as any).setAppBadge?.(n)?.catch?.(() => {}));
    }
  }, [finished]);

  if (!data || !lang) return null;
  if (!plan) return <main><p>Preparing your session…</p></main>;


  if (finished) {
    const acc = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <main>
        <h1>{stats.total ? 'Session complete' : 'Nothing due right now'}</h1>
        {plan.newBlocked === 'debt' && <div class="feedback warn">New words are paused: you have {plan.debt} overdue reviews. Clear them first so you don't forget what you learned.</div>}
        {plan.newBlocked === 'daily-limit' && <div class="feedback warn">You've reached today's limit for new items. Reviews still count. Come back tomorrow for more new words.</div>}
        <div class="card row">
          <div class="stat"><b>+{stats.xp}</b><small>XP</small></div>
          <div class="stat"><b>{acc}%</b><small>accuracy</small></div>
          <div class="stat"><b>{streak ?? '…'}🔥</b><small>day streak</small></div>
        </div>
        {Object.entries(stats.errors).filter(([k]) => k !== 'none').length > 0 && (
          <div class="card">
            <b>Mistake types this session</b>
            <div class="row wrap" style="margin-top:6px">
              {Object.entries(stats.errors).filter(([k]) => k !== 'none' && k !== 'typo').map(([k, v]) => <span key={k} class="pill bad">{k}: {v}</span>)}
            </div>
          </div>
        )}
        <div class="card">
          <b>Balance your practice</b>
          <p class="muted">Reading text you mostly know builds speed. Paul Nation calls this the <i>fluency</i> strand.</p>
          <button class="block" onClick={() => go({ name: 'read' })}>Read a passage</button>
        </div>
        <button class="primary block" onClick={() => go({ name: 'home' })}>Done</button>
      </main>
    );
  }

  const onDone = async (r: { correct: boolean; errorType: ErrorType; ms: number; given: string; skipped?: boolean }) => {
    const t = current;
    let rest = queue.slice(1);
    if (t.mode === 'intro') {
      // after introducing a new word, test it a few items later
      const test = makeTask(data, t.card, false);
      if (test) { test.mode = 'mc'; test.isNewItem = true; rest = [...rest.slice(0, 2), test, ...rest.slice(2)]; }
      setQueue(rest);
      return;
    }
    if (!r.skipped) {
      const { xp, card } = await recordAnswer(t.card, r.correct, r.errorType, { ms: r.ms, isNewItem: t.isNewItem, goal: settings.dailyGoal });
      setStats((s) => ({ xp: s.xp + xp, correct: s.correct + (r.correct ? 1 : 0), total: s.total + 1, errors: { ...s.errors, [r.errorType]: (s.errors[r.errorType] ?? 0) + 1 } }));
      // wrong answers come back later in this session (learning step)
      if (!r.correct && card.due - Date.now() < 20 * 60 * 1000) {
        const again = makeTask(data, card, false);
        if (again) rest = [...rest.slice(0, 4), again, ...rest.slice(4)];
      }
    }
    setDone(done + 1);
    setQueue(rest);
  };

  const progress = done / (done + queue.length);
  return (
    <main>
      <div class="row" style="margin-bottom:12px">
        <button class="ghost" onClick={() => go({ name: 'home' })} aria-label="Quit session">✕</button>
        <div class="bar grow"><span style={`width:${Math.round(progress * 100)}%`} /></div>
        <small>{stats.xp} XP</small>
      </div>
      <TaskView task={current} onDone={onDone} />
    </main>
  );
}

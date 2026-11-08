import { useEffect, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { langStats, type LangStats } from '../progress/stats';
import { LEVELS } from '../progress/levels';
import { allDays } from '../motivation/record';
import { currentStreak, localDate } from '../motivation/streaks';
import { getMeta } from '../data/db';
import { LANG_NAMES, type LangCode } from '../data/types';

export function Home() {
  const { data, settings, go, lang, updateSettings } = useApp();
  const [stats, setStats] = useState<LangStats | null>(null);
  const [today, setToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const [missedYesterday, setMissed] = useState(false);
  const [backupDue, setBackupDue] = useState(false);

  useEffect(() => {
    if (!data) return;
    langStats(data).then(setStats);
    allDays().then((days) => {
      const t = localDate();
      setToday(days.get(t)?.xp ?? 0);
      setStreak(currentStreak(days, t, settings.dailyGoal));
      const y = new Date(); y.setDate(y.getDate() - 1);
      setMissed(days.size > 0 && !(days.get(localDate(y))?.xp ?? 0) && !days.get(localDate(y))?.freezeUsed);
    });
    getMeta<number>('freezes', 0).then(setFreezes);
    getMeta<number>('lastBackup', 0).then((t) => setBackupDue(Date.now() - t > 7 * 864e5));
  }, [data?.lang]);

  if (!data || !lang) return null;
  const goalPct = Math.min(100, Math.round((today / settings.dailyGoal) * 100));
  const level = stats ? stats.workingLevel : 0;
  const def = LEVELS[Math.min(6, level)];
  return (
    <main>
      <div class="row spread">
        <h1 style="margin:0">{LANG_NAMES[lang]}</h1>
        <select style="width:auto" value={lang} onChange={(e) => updateSettings({ activeLang: (e.target as HTMLSelectElement).value as LangCode })} aria-label="Switch language">
          {(Object.keys(LANG_NAMES) as LangCode[]).map((l) => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}
        </select>
      </div>

      <div class="card row">
        <div class="stat"><b>{streak}🔥</b><small>day streak</small></div>
        <div class="stat"><b>{today}/{settings.dailyGoal}</b><small>XP today</small></div>
        <div class="stat"><b>{freezes}🧊</b><small>streak freezes</small></div>
      </div>
      <div class="bar" aria-label="Daily goal"><span style={`width:${goalPct}%`} /></div>
      {missedYesterday && settings.pledge && <div class="feedback warn">You missed yesterday. Your pledge: <i>“{settings.pledge}”</i></div>}

      <button class="primary block" style="margin-top:14px;font-size:1.1rem" onClick={() => go({ name: 'session' })}>
        {stats?.due ? `Study now · ${stats.due} reviews due` : 'Study now'}
      </button>

      {stats && (
        <div class="card">
          <div class="row spread"><b>Level {level}: {def.name}</b><span class="pill accent">{def.cefr}</span></div>
          {level === 0 ? (
            <p class="muted">Learn the script and sounds first. Open <b>Lessons</b> and work through Level 0, then take its exam. Your first 50 words are available meanwhile.</p>
          ) : (
            <>
              <p class="muted" style="margin-bottom:4px">{stats.known} of {stats.target} words known (both directions, remembered 21+ days)</p>
              <div class="bar"><span style={`width:${Math.min(100, Math.round((stats.known / Math.max(1, stats.target)) * 100))}%`} /></div>
            </>
          )}
          <div class="row wrap" style="margin-top:10px">
            {stats.toneAccuracy !== null && <span class="pill">tone accuracy {Math.round(stats.toneAccuracy * 100)}%</span>}
            {stats.registerAccuracy !== null && <span class="pill">formality accuracy {Math.round(stats.registerAccuracy * 100)}%</span>}
            <span class="pill">{stats.introduced} words started</span>
          </div>
        </div>
      )}

      {stats && stats.due > settings.reviewDebtLimit && (
        <div class="feedback warn">Review debt: {stats.due} reviews waiting. New words pause until you're under {settings.reviewDebtLimit}.</div>
      )}
      {data.conflicts.length > 0 && (
        <div class="feedback warn">An update changed {data.conflicts.length} item(s) you had fixed. Your fixes are still in use. <button class="small" onClick={() => go({ name: 'corrections' })}>Review</button></div>
      )}
      {backupDue && <div class="feedback warn">It's been over a week since your last backup. <button class="small" onClick={() => go({ name: 'settings' })}>Back up now</button></div>}

      <div class="row" style="margin-top:8px">
        <button class="grow" onClick={() => go({ name: 'learn' })}>Lessons</button>
        <button class="grow" onClick={() => go({ name: 'read' })}>Read</button>
      </div>
    </main>
  );
}

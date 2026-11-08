import { useEffect, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { langStats, type LangStats } from '../progress/stats';
import { LEVELS, wordTarget } from '../progress/levels';
import { allDays } from '../motivation/record';
import { addDays, localDate, selfLeague } from '../motivation/streaks';
import { db, type DayRecord, type Certification } from '../data/db';

const ERR_LABEL: Record<string, string> = { tone: 'tone', underdot: 'underdot (ẹ ọ ṣ)', accent: 'accent', register: 'formality', wrong: 'wrong word', typo: 'typo' };

export function Progress() {
  const { data, lang, go, settings } = useApp();
  const [stats, setStats] = useState<LangStats | null>(null);
  const [days, setDays] = useState<Map<string, DayRecord>>(new Map());
  const [certs, setCerts] = useState<Certification[]>([]);
  useEffect(() => {
    if (!data || !lang) return;
    langStats(data).then(setStats);
    allDays().then(setDays);
    db.certs.where('lang').equals(lang).toArray().then(setCerts);
  }, [data?.lang]);
  if (!data || !lang) return null;
  const today = localDate();
  const cells = Array.from({ length: 18 * 7 }, (_, i) => addDays(today, -(18 * 7 - 1 - i)));
  const league = selfLeague(days, today);
  const best = (lvl: number) => certs.filter((c) => c.level === lvl).sort((a, b) => b.score - a.score)[0];
  return (
    <main>
      <h1>Progress</h1>
      <h2>Mastery path</h2>
      {LEVELS.map((l) => {
        const c = best(l.level);
        const target = wordTarget(l.level as 1, data.words.size);
        const pct = stats && l.level > 0 ? Math.min(100, Math.round((stats.known / Math.max(1, target)) * 100)) : c ? 100 : 0;
        return (
          <div key={l.level} class={`card ${stats && l.level > stats.workingLevel ? 'lock' : ''}`}>
            <div class="row spread">
              <b>{l.level}. {l.name} <small class="muted">{l.cefr}</small></b>
              {c ? <span class="pill accent">✓ {Math.round(c.score * 100)}% · {c.method}</span> : stats?.workingLevel === l.level ? <span class="pill warn">current</span> : null}
            </div>
            {l.level > 0 && <small class="muted">{Math.min(stats?.known ?? 0, target)} / {target} words{lang === 'zh' && l.chars ? ` · ${stats?.knownChars ?? 0} / ${l.chars} characters` : ''}</small>}
            <div class="bar" style="margin-top:4px"><span style={`width:${pct}%`} /></div>
            <small class="muted">{l.exam}</small>
            {l.level < 6 && stats?.workingLevel === l.level && <div><button class="small" style="margin-top:6px" onClick={() => go({ name: 'exam', level: l.level })}>Go to exam</button></div>}
            {l.level === 6 && <div><button class="small" style="margin-top:6px" onClick={() => go({ name: 'certify' })}>Open certification</button></div>}
          </div>
        );
      })}

      {stats && (
        <>
          <h2>Accuracy by mistake type</h2>
          <div class="card">
            {stats.toneAccuracy !== null && <p>Tone accuracy: <b>{Math.round(stats.toneAccuracy * 100)}%</b></p>}
            {stats.registerAccuracy !== null && <p>Formality (register) accuracy: <b>{Math.round(stats.registerAccuracy * 100)}%</b></p>}
            <div class="row wrap">
              {Object.entries(stats.errorCounts).filter(([k]) => k !== 'none').map(([k, v]) => <span key={k} class="pill">{ERR_LABEL[k] ?? k}: {v}</span>)}
            </div>
            <small class="muted">{stats.totalReviews} answers recorded</small>
          </div>
        </>
      )}

      <h2>Activity</h2>
      <div class="card">
        <div class="heatmap" role="img" aria-label="Daily activity, last 18 weeks">
          {cells.map((d) => {
            const r = days.get(d);
            const lv = !r || !r.xp ? '' : r.xp < settings.dailyGoal / 2 ? 'l1' : r.xp < settings.dailyGoal ? 'l2' : 'l3';
            return <span key={d} title={`${d}: ${r?.xp ?? 0} XP`} class={`${lv} ${r?.freezeUsed ? 'frz' : ''}`} />;
          })}
        </div>
        <small class="muted">Blue outline = streak freeze used</small>
      </div>

      <h2>Weekly league (you vs. you)</h2>
      <div class="card">
        <p>This week you're <b>#{league.rank}</b> of your last 5 weeks.</p>
        {league.weeks.map((xp, i) => (
          <div key={i} class="row"><small style="width:90px">{i === 0 ? 'This week' : `${i} week${i > 1 ? 's' : ''} ago`}</small>
            <div class="bar grow"><span style={`width:${Math.round((xp / Math.max(1, ...league.weeks)) * 100)}%`} /></div><small style="width:56px;text-align:right">{xp}</small></div>
        ))}
      </div>
    </main>
  );
}

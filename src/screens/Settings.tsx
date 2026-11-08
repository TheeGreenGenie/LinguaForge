import { useEffect, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { db } from '../data/db';
import { exportBackup, importBackup, saveFile } from '../data/backup';
import { fetchPackIndex, installPack, invalidate, undoCorrection, type PackIndexEntry } from '../data/repo';
import { importDictionary, detectFormat } from '../import/parsers';
import { reminderIcs } from '../motivation/streaks';
import { correctionsToCsv, type Correction } from '../data/corrections';
import { LANG_NAMES, type LangCode } from '../data/types';
import type { PackMeta } from '../data/db';
import { respell } from '../lang/respell';

const REPO = typeof __REPO_URL__ === 'string' ? __REPO_URL__ : '';

export function Settings() {
  const { settings, updateSettings, lang, go, toast, reload, data } = useApp();
  const [packs, setPacks] = useState<PackMeta[]>([]);
  const [index, setIndex] = useState<Record<string, PackIndexEntry> | null>(null);
  const [storage, setStorage] = useState<{ usage?: number; quota?: number; persisted?: boolean }>({});
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    db.packs.toArray().then(setPacks);
    fetchPackIndex().then(setIndex).catch(() => setIndex(null));
    (async () => {
      const est = await navigator.storage?.estimate?.();
      const persisted = await navigator.storage?.persisted?.();
      setStorage({ usage: est?.usage, quota: est?.quota, persisted });
    })();
  }, []);

  const mb = (n?: number) => (n ? `${(n / 1e6).toFixed(1)} MB` : '?');

  const doImportDict = async (file: File) => {
    if (!lang) return;
    setBusy('Reading dictionary…');
    try {
      const head = await file.slice(0, 2000).text();
      const format = detectFormat(file.name, head.split('\n')[0]);
      if (file.size > 150e6 && !confirm(`This file is ${mb(file.size)}. Importing it on a phone can take many minutes. Continue?`)) { setBusy(null); return; }
      const words = await importDictionary(file.stream() as ReadableStream<Uint8Array>, { lang, format, onProgress: (n) => setBusy(`Read ${n.toLocaleString()} lines…`) });
      setBusy(`Merging ${words.length} words…`);
      const existing = new Map([...(data?.words.values() ?? [])].map((w) => [w.id, w]));
      const maxRank = Math.max(0, ...[...existing.values()].map((w) => w.freqRank ?? 0));
      const merged = words.map((w, i) => {
        const prev = existing.get(w.id);
        if (prev) return { ...prev, gloss: [...new Set([...prev.gloss, ...w.gloss])].slice(0, 6), ipa: prev.ipa ?? w.ipa, forms: [...new Set([...(prev.forms ?? []), ...(w.forms ?? [])])] };
        return { ...w, source: 'user-csv' as const, freqRank: maxRank + i + 1, level: 5 as const, respell: respell(w) };
      });
      await db.words.bulkPut(merged);
      invalidate(lang);
      await reload();
      toast(`Imported ${words.length} entries (${merged.filter((w) => !existing.has(w.id)).length} new words).`);
    } catch (e) { toast(`Import failed: ${(e as Error).message}`); }
    setBusy(null);
  };

  const exportIcs = () => saveFile(new Blob([reminderIcs(settings.reminderHour, settings.reminderMinute, location.href.split('#')[0])], { type: 'text/calendar' }), 'linguaforge-reminder.ics');

  const backupNow = async () => {
    await saveFile(await exportBackup(), `linguaforge-backup-${new Date().toISOString().slice(0, 10)}.json`);
    await db.meta.put({ key: 'lastBackup', value: Date.now() });
    toast('Backup created. Save it to Files or iCloud Drive.');
  };

  return (
    <main>
      <h1>Settings</h1>
      {busy && <div class="feedback warn">{busy}</div>}

      <h2>Study</h2>
      <div class="card">
        <label>Daily goal (XP)</label>
        <select value={settings.dailyGoal} onChange={(e) => updateSettings({ dailyGoal: Number((e.target as HTMLSelectElement).value) })}>
          {[50, 100, 150, 250, 400].map((v) => <option key={v} value={v}>{v} XP{v === 100 ? ' (recommended)' : ''}</option>)}
        </select>
        <label>New items per day</label>
        <input type="number" min={3} max={40} value={settings.newPerDay} onChange={(e) => updateSettings({ newPerDay: Number((e.target as HTMLInputElement).value) || 12 })} />
        <label>Pause new words when overdue reviews exceed</label>
        <input type="number" min={20} max={1000} value={settings.reviewDebtLimit} onChange={(e) => updateSettings({ reviewDebtLimit: Number((e.target as HTMLInputElement).value) || 120 })} />
        <label class="row" style="font-weight:400"><input type="checkbox" checked={settings.strictAccents} onChange={() => updateSettings({ strictAccents: !settings.strictAccents })} /> Strict accents (Spanish/French/Portuguese). Tones in Yorùbá and Chinese are always strict.</label>
      </div>

      <h2>Accountability</h2>
      <div class="card">
        <label>Daily reminder time</label>
        <input type="time" value={`${String(settings.reminderHour).padStart(2, '0')}:${String(settings.reminderMinute).padStart(2, '0')}`} onChange={(e) => { const [h, m] = (e.target as HTMLInputElement).value.split(':').map(Number); updateSettings({ reminderHour: h, reminderMinute: m }); }} />
        <button class="block" style="margin-top:8px" onClick={exportIcs}>Add daily reminder to Calendar</button>
        <small class="muted">iPhone web apps can't schedule notifications offline, so this adds a repeating Calendar event with an alert.</small>
        <label>Your commitment pledge (shown if you miss a day)</label>
        <input type="text" value={settings.pledge} placeholder="e.g. I study 15 minutes after dinner, every day" onChange={(e) => updateSettings({ pledge: (e.target as HTMLInputElement).value })} />
      </div>

      <h2>Your data</h2>
      <div class="card stack">
        <button class="block primary" onClick={backupNow}>Back up progress</button>
        <label class="btn block center" style="font-weight:400">Restore from backup…
          <input type="file" accept="application/json,.json" style="display:none" onChange={async (e) => {
            const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
            if (!confirm('Replace all progress on this phone with the backup?')) return;
            try { const r = await importBackup(f); await reload(); toast(`Restored ${r.cards} cards and ${r.corrections} corrections.`); } catch (err) { toast((err as Error).message); }
          }} />
        </label>
        <button class="block" onClick={() => go({ name: 'corrections' })}>My corrections (✎ fixes)</button>
        <button class="block" onClick={() => data && saveFile(new Blob([reviewSheet(data)], { type: 'text/csv' }), `linguaforge-review-sheet-${data.lang}.csv`)}>Export native-speaker review sheet</button>
        <p><small class="muted">Storage used: {mb(storage.usage)} of {mb(storage.quota)}. Persistent storage: {storage.persisted ? 'granted ✓' : 'not granted. Back up regularly.'}</small></p>
        {!storage.persisted && <button class="small" onClick={async () => { const ok = await navigator.storage?.persist?.(); setStorage({ ...storage, persisted: ok }); }}>Ask to keep data permanently</button>}
      </div>

      <h2>Dictionaries & language packs</h2>
      <div class="card">
        {(Object.keys(LANG_NAMES) as LangCode[]).map((l) => {
          const p = packs.find((x) => x.lang === l);
          const remote = index?.[l];
          const update = p && remote && remote.version !== p.version;
          return (
            <div key={l} class="row spread" style="margin:6px 0">
              <span class="grow">{LANG_NAMES[l]}<br /><small class="muted">{p ? `installed ${p.version}` : 'not installed'}{remote ? ` · ${remote.words} words, ${mb(remote.bytes)}` : ''}</small></span>
              <button class="small" disabled={!!busy} onClick={async () => { setBusy(`Installing ${LANG_NAMES[l]}…`); try { await installPack(l, (m) => setBusy(m)); setPacks(await db.packs.toArray()); if (l === lang) await reload(); toast('Pack installed. Your progress and fixes are kept.'); } catch (e) { toast((e as Error).message); } setBusy(null); }}>
                {!p ? 'Install' : update ? 'Update' : 'Re-install'}
              </button>
            </div>
          );
        })}
        <hr />
        <label class="btn block center" style="font-weight:400">Import a dictionary file into {lang ? LANG_NAMES[lang] : '…'}
          <input type="file" accept=".jsonl,.json,.csv,.tsv,.txt,.u8" style="display:none" onChange={(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) doImportDict(f); }} />
        </label>
        <small class="muted">Supported: kaikki.org Wiktionary JSONL, CC-CEDICT, or CSV with columns <code>word,translation,pos,ipa,register,notes</code>. Very large files (over 150 MB) are slow on a phone.</small>
      </div>

      <h2>AI grading (optional)</h2>
      <div class="card">
        <label>Your Claude API key</label>
        <input type="password" value={settings.apiKey} placeholder="sk-ant-…" autocomplete="off" onChange={(e) => updateSettings({ apiKey: (e.target as HTMLInputElement).value.trim() })} />
        <label>Model</label>
        <input type="text" value={settings.aiModel} onChange={(e) => updateSettings({ aiModel: (e.target as HTMLInputElement).value.trim() || 'claude-opus-5-5' })} />
        <small class="muted">The key is stored only on this phone and is never included in backups. Only exam translations are sent, and only when you tap "Grade with AI". If a request is declined, the API automatically tries a fallback model.</small>
      </div>

      <h2>Help improve LinguaForge</h2>
      <div class="card stack">
        <p><small>LinguaForge is open source and its lessons get better when learners and native speakers send fixes. If you speak {lang ? LANG_NAMES[lang] : 'one of these languages'} well, your ✎ corrections can help everyone.</small></p>
        <button class="block" onClick={() => go({ name: 'corrections' })}>1. Export my corrections (CSV)</button>
        {REPO && <a class="btn block center" href={`${REPO}/issues/new?template=content-correction.yml&title=${encodeURIComponent(`[${lang ?? ''}] Content corrections`)}`} target="_blank" rel="noopener">2. Send them on GitHub (attach the CSV)</a>}
        {REPO && <a class="btn block center" href={`${REPO}/issues/new?template=bug-report.yml`} target="_blank" rel="noopener">Report a bug</a>}
        {REPO && <a class="btn block center" href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener">How to contribute</a>}
        {!REPO && <small class="muted">This copy was built without a public repository link.</small>}
      </div>

      <h2>About & credits</h2>
      <div class="card">
        {packs.map((p) => <div key={p.lang}><b>{LANG_NAMES[p.lang]}</b><ul>{p.credits.map((c) => <li key={c}><small>{c}</small></li>)}</ul></div>)}
        <p><small>Method: Paul Nation's Four Strands and frequency-based vocabulary, with FSRS spaced repetition (ts-fsrs, MIT).</small></p>
        <p><small>Recommended Yorùbá textbook (read separately): <a href="https://coerll.utexas.edu/yemi/" target="_blank" rel="noopener">Yorùbá Yé Mi</a>, UT Austin COERLL (CC BY-NC-ND, so it is linked here, not copied).</small></p>
        <p><small>Lessons written for this app are marked unverified until a native speaker reviews them. Use ✎ Fix this to correct anything.</small></p>
      </div>
    </main>
  );
}

/** Everything written for the app (not from a checked corpus), for a native speaker to verify. */
function reviewSheet(data: NonNullable<ReturnType<typeof useApp>['data']>): string {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['type', 'id', 'target language', 'english / answer', 'notes', 'OK? (yes/no)', 'correction'].join(',')];
  for (const l of data.lessons) {
    rows.push(['lesson', l.id, l.title, '', l.body.replace(/\n/g, ' '), '', ''].map(esc).join(','));
    for (const e of l.exercises) rows.push(['exercise', e.id, e.prompt, e.answer, (e.options ?? []).join(' / ') + (e.explanation ? ' — ' + e.explanation : ''), '', ''].map(esc).join(','));
  }
  for (const w of data.words.values()) if (w.source === 'authored') rows.push(['word', w.id, w.lemma, w.gloss.join('; '), w.register ?? '', '', ''].map(esc).join(','));
  for (const s of data.sentences.values()) if (s.source === 'authored') rows.push(['sentence', s.id, s.text, s.en, [s.register, s.seniority].filter(Boolean).join(', '), '', ''].map(esc).join(','));
  return rows.join('\n');
}

export function Corrections() {
  const { lang, go, reload, toast } = useApp();
  const [list, setList] = useState<Correction[]>([]);
  const load = () => lang && db.corrections.where('lang').equals(lang).reverse().sortBy('createdAt').then(setList);
  useEffect(() => { load(); }, [lang]);
  return (
    <main>
      <button class="ghost" onClick={() => go({ name: 'settings' })}>← Settings</button>
      <h1>My corrections</h1>
      <p class="muted">Every fix you made. They stay in effect after app updates. Undo any of them, or export them to send to a native speaker for checking.</p>
      <button class="block" onClick={() => saveFile(new Blob([correctionsToCsv(list)], { type: 'text/csv' }), `linguaforge-corrections-${lang}.csv`)}>Export as CSV (share)</button>
      {list.map((c) => (
        <div key={c.id} class={`card ${c.undone ? 'lock' : ''}`}>
          <div class="row spread"><span class="pill">{c.kind}</span><small class="muted">{new Date(c.createdAt).toLocaleString()}</small></div>
          <small class="muted">{c.targetType}: {c.targetId}</small>
          {c.patch && Object.entries(c.patch).map(([k, v]) => <div key={k}><small>{k}: <s>{JSON.stringify(c.before?.[k] ?? '')}</s> → <b>{JSON.stringify(v)}</b></small></div>)}
          {c.answer && <div><small>answer: “{c.answer}”</small></div>}
          {c.note && <div><small>note: {c.note}</small></div>}
          {c.fromExam && <span class="pill warn">from exam</span>}
          {!c.undone && <button class="small" onClick={async () => { await undoCorrection(c.id!); await reload(); await load(); toast('Undone.'); }}>Undo</button>}
        </div>
      ))}
      {!list.length && <p class="muted">No corrections yet.</p>}
    </main>
  );
}

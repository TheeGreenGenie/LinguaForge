import { useCallback, useEffect, useState } from 'preact/hooks';
import { useRegisterSW } from 'virtual:pwa-register/preact';
import { Ctx, type Screen } from './app-context';
import { DEFAULT_SETTINGS, installPack, installedVersion, loadLang, loadSettings, saveSettings, type LangData, type Settings as S } from './data/repo';
import { LANG_NAMES, type LangCode } from './data/types';
import { settleOnOpen } from './motivation/record';
import { Home } from './screens/Home';
import { Learn, LessonView } from './screens/Learn';
import { Session } from './screens/Session';
import { Read, PassageView } from './screens/Read';
import { Progress } from './screens/Progress';
import { Exam } from './screens/Exam';
import { Certify } from './screens/Certify';
import { Settings, Corrections } from './screens/Settings';

const ICONS: Record<string, string> = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  learn: 'M4 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4zM20 5h-4a3 3 0 0 0-3 3',
  read: 'M2 6s3-2 10-2 10 2 10 2v13s-3-2-10-2S2 19 2 19z',
  progress: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 15H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9.7 4.4V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
};

function Tabs({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const tabs: [Screen['name'], string, string][] = [['home', 'Home', 'home'], ['learn', 'Lessons', 'learn'], ['read', 'Read', 'read'], ['progress', 'Progress', 'progress'], ['settings', 'Settings', 'settings']];
  const group: Record<string, string> = { lesson: 'learn', exam: 'learn', passage: 'read', certify: 'progress', corrections: 'settings' };
  const active = group[screen.name] ?? screen.name;
  return (
    <nav class="tabs">
      {tabs.map(([name, label, icon]) => (
        <button key={name} class={active === name ? 'on' : ''} onClick={() => go({ name } as Screen)} aria-current={active === name ? 'page' : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d={ICONS[icon]} /></svg>
          {label}
        </button>
      ))}
    </nav>
  );
}

function Setup({ onPick }: { onPick: (l: LangCode) => void }) {
  return (
    <main>
      <h1>Welcome to LinguaForge</h1>
      <p>Learn to <b>read and write</b> a language. Tones, alphabets and politeness are taught properly from day one.</p>
      <div class="card">
        <p class="muted" style="margin-top:0">How it works (based on Paul Nation's research on vocabulary learning):</p>
        <ul>
          <li>Start with the script and sounds (Level 0)</li>
          <li>Learn the most common words first, with spaced reviews</li>
          <li>Read real sentences and passages</li>
          <li>Progress through levels A1 to C1, then Certified Mastery</li>
        </ul>
      </div>
      <h2>Pick a language</h2>
      {(Object.keys(LANG_NAMES) as LangCode[]).map((l) => (
        <button key={l} class="card block" style="text-align:left;font-size:1.1rem" onClick={() => onPick(l)}>{LANG_NAMES[l]}</button>
      ))}
      <p><small class="muted">You can add the other languages later. Everything works offline once downloaded.</small></p>
    </main>
  );
}

export function App() {
  const [settings, setSettings] = useState<S>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<LangData | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [status, setStatus] = useState<string | null>(null);
  const [toastMsg, setToast] = useState<string | null>(null);
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, reg) { if (reg) setInterval(() => navigator.onLine && reg.update(), 60 * 60 * 1000); },
  });

  const toast = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(null), 3500); }, []);
  const go = useCallback((s: Screen) => { setScreen(s); window.scrollTo(0, 0); }, []);

  const openLang = useCallback(async (lang: LangCode) => {
    if (!(await installedVersion(lang))) {
      setStatus(`Downloading ${LANG_NAMES[lang]}…`);
      await installPack(lang, (m) => setStatus(`${LANG_NAMES[lang]}: ${m}`));
      navigator.storage?.persist?.().catch(() => {});
    }
    setStatus('Loading…');
    setData(await loadLang(lang));
    setStatus(null);
  }, []);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      setSettings(s);
      await settleOnOpen(s.dailyGoal);
      if (s.activeLang) await openLang(s.activeLang).catch((e) => setStatus(`Could not load: ${e.message}. Connect to the internet once to download the language pack.`));
      setReady(true);
    })();
  }, []);

  const updateSettings = useCallback(async (patch: Partial<S>) => {
    const next = { ...settings, ...patch };
    // Switching language: load the new pack first so the screen never mixes two languages.
    if (patch.activeLang && patch.activeLang !== settings.activeLang) {
      try {
        go({ name: 'home' });
        await openLang(patch.activeLang);
      } catch (e) {
        setStatus(`Could not load: ${(e as Error).message}`);
        return;
      }
    }
    setSettings(next);
    await saveSettings(next);
  }, [settings, openLang, go]);

  const reload = useCallback(async () => {
    if (settings.activeLang) setData(await loadLang(settings.activeLang, true));
  }, [settings.activeLang]);

  if (!ready) return <main><p>{status ?? 'Starting…'}</p></main>;

  const ctx = { settings, updateSettings, lang: settings.activeLang, data, reload, go, toast };
  let body;
  if (!settings.activeLang) body = <Setup onPick={(l) => updateSettings({ activeLang: l })} />;
  else if (status) body = <main><p>{status}</p></main>;
  else if (!data) body = <main><p>Loading…</p></main>;
  else {
    switch (screen.name) {
      case 'learn': body = <Learn />; break;
      case 'lesson': body = <LessonView id={screen.id} />; break;
      case 'session': body = <Session />; break;
      case 'read': body = <Read />; break;
      case 'passage': body = <PassageView id={screen.id} fluency={screen.fluency} />; break;
      case 'progress': body = <Progress />; break;
      case 'exam': body = <Exam level={screen.level} />; break;
      case 'certify': body = <Certify />; break;
      case 'settings': body = <Settings />; break;
      case 'corrections': body = <Corrections />; break;
      default: body = <Home />;
    }
  }
  const immersive = screen.name === 'session' || screen.name === 'exam' || screen.name === 'certify';
  return (
    <Ctx.Provider value={ctx}>
      {needRefresh && <div class="banner">Update available <button onClick={() => updateServiceWorker(true)}>Reload</button></div>}
      {body}
      {settings.activeLang && !immersive && <Tabs screen={screen} go={go} />}
      {toastMsg && <div class="feedback good" role="status" style="position:fixed;left:16px;right:16px;bottom:84px;z-index:60;box-shadow:var(--shadow)">{toastMsg}</div>}
    </Ctx.Provider>
  );
}

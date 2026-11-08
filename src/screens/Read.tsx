// Reading (meaning-focused input) and timed fluency reading.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { coverage } from '../progress/coverage';
import { langStats, type LangStats } from '../progress/stats';
import { db } from '../data/db';
import { newCard, cardId } from '../srs/scheduler';
import { awardXp } from '../motivation/record';
import { XP } from '../motivation/streaks';
import { FixThis } from '../ui/FixThis';
import { PronunciationCard } from '../ui/Pronunciation';

export function Read() {
  const { data, go } = useApp();
  const [stats, setStats] = useState<LangStats | null>(null);
  useEffect(() => { if (data) langStats(data).then(setStats); }, [data?.lang]);
  const list = useMemo(() => {
    if (!data || !stats) return [];
    const introduced = stats.knownIds;
    return [...data.passages.values()].slice(0, 400).map((p) => ({ p, cov: coverage(p.paragraphs.join(' '), data.lang, data.index, introduced).ratio }))
      .sort((a, b) => b.cov - a.cov).slice(0, 40);
  }, [stats, data?.lang]);
  if (!data) return null;
  return (
    <main>
      <h1>Read</h1>
      <p class="muted">Passages sorted by how many of their words you know. Aim for 95% or more for comfortable reading, and 98% or more for fluency practice.</p>
      {!stats && <p>Loading…</p>}
      {list.map(({ p, cov }) => (
        <button key={p.id} class="card block" style="text-align:left" onClick={() => go({ name: 'passage', id: p.id, fluency: cov >= 0.98 })}>
          <div class="row spread"><b class="grow">{p.title}</b><span class={`pill ${cov >= 0.95 ? 'accent' : cov < 0.7 ? 'bad' : ''}`}>{Math.round(cov * 100)}% known</span></div>
          <small class="muted">{p.paragraphs.length} paragraphs · {p.source}{p.title.endsWith('⚠') ? ' · tone marks not audited' : ''}</small>
        </button>
      ))}
    </main>
  );
}

export function PassageView({ id, fluency }: { id: string; fluency?: boolean }) {
  const { data, lang, go, toast } = useApp();
  const p = data?.passages.get(id);
  const [stats, setStats] = useState<LangStats | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [showEn, setShowEn] = useState(false);
  const [start] = useState(Date.now());
  const [fix, setFix] = useState(false);
  useEffect(() => { if (data) langStats(data).then(setStats); }, [data?.lang]);
  if (!p || !data || !lang) return <main><p>Not found.</p></main>;
  const reports = stats ? p.paragraphs.map((para) => coverage(para, lang, data.index, stats.knownIds)) : [];
  const words = sel ? data.index.lookup(sel).map((wid) => data.words.get(wid)!).filter(Boolean) : [];

  const addToReviews = async () => {
    const fresh = [];
    for (const w of words) {
      if (await db.cards.get(cardId('word', w.id, 'recog'))) continue;
      fresh.push(newCard(lang, 'word', w.id, 'recog'), newCard(lang, 'word', w.id, 'prod'));
    }
    await db.cards.bulkPut(fresh);
    toast(fresh.length ? 'Added to your reviews.' : 'Already in your reviews.');
  };

  const done = async () => {
    const secs = (Date.now() - start) / 1000;
    const wordCount = reports.reduce((a, r) => a + r.required, 0);
    await awardXp(lang, XP.readingComplete);
    toast(fluency ? `${Math.round((wordCount / secs) * 60)} words per minute. Read it again tomorrow and try to beat it.` : 'Reading complete: +20 XP');
    go({ name: 'read' });
  };

  return (
    <main>
      <button class="ghost" onClick={() => go({ name: 'read' })}>← Passages</button>
      <h1>{p.title}</h1>
      {fluency && <div class="pill accent">Fluency practice: read at a comfortable fast pace</div>}
      {p.title.endsWith('⚠') && <div class="feedback warn">This text failed the tone-mark check in places. Read critically and use ✎ to fix errors.</div>}
      <div class="card passage">
        {reports.length ? reports.map((r, i) => (
          <p key={i}>{r.tokens.map((t, k) => t.isWord && !t.exempt
            ? <span key={k} class={`tok ${t.known ? '' : 'unknown'}`} onClick={() => setSel(t.text)}>{t.text}</span>
            : <span key={k}>{t.text}</span>)}</p>
        )) : p.paragraphs.map((para, i) => <p key={i}>{para}</p>)}
      </div>
      {sel && (
        <div class="card">
          <div class="row spread"><b style="font-size:1.3rem">{sel}</b><button class="ghost" onClick={() => setSel(null)}>✕</button></div>
          {words.length ? words.map((w) => (
            <div key={w.id}>
              <PronunciationCard lang={lang} text={w.lemma} ipa={w.ipa} pinyin={w.pinyin} clips={w.clips} />
              <p><b>{w.lemma}</b> <span class="pill">{w.pos}</span> {w.gloss.slice(0, 3).join('; ')}</p>
            </div>
          )) : <p class="muted">Not in the dictionary. It may be a name, an inflected form, or a word to add via Settings → Import dictionary.</p>}
          {words.length > 0 && <button class="small" onClick={addToReviews}>Add to my reviews</button>}
        </div>
      )}
      <details open={showEn} onToggle={(e) => setShowEn((e.target as HTMLDetailsElement).open)}>
        <summary>English reference</summary>
        <div class="card">{p.en.map((e, i) => <p key={i}>{e}</p>)}</div>
      </details>
      <button class="ghost" onClick={() => setFix(true)}>✎ Fix this passage</button>
      <button class="primary block" onClick={done}>I've read it</button>
      {fix && <FixThis target={{ type: 'passage', item: p }} onClose={() => setFix(false)} />}
    </main>
  );
}

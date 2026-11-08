// Pronunciation card: official form (IPA / pinyin / tone-marked spelling),
// English-style respelling, tone colouring + pitch contour, and audio.
import type { LangCode } from '../data/types';
import { SPEECH_LOCALE } from '../data/types';
import { tonePattern, TONE_NAMES, type Tone } from '../lang/yoruba';
import { syllableTone, ZH_TONE_NAMES, type ZhTone } from '../lang/pinyin';
import { respellText } from '../lang/respell';
import { canon } from '../lang/unicode';

export function speak(lang: LangCode, text: string): boolean {
  const loc = SPEECH_LOCALE[lang];
  if (!loc || typeof speechSynthesis === 'undefined') return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = loc;
  u.rate = 0.85;
  const voice = speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').startsWith(loc.slice(0, 2)));
  if (voice) u.voice = voice;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  return true;
}

/** Colour each Yoruba vowel by its tone. */
function YorubaTones({ text }: { text: string }) {
  const out: preact.JSX.Element[] = [];
  const chars = [...canon(text)];
  let i = 0;
  let k = 0;
  while (i < chars.length) {
    let j = i + 1;
    while (j < chars.length && /\p{M}/u.test(chars[j])) j++;
    const grapheme = chars.slice(i, j).join('').normalize('NFC');
    const isV = /[aeiou]/i.test(chars[i]);
    if (isV) {
      const t: Tone = grapheme.normalize('NFD').includes('́') ? 'H' : grapheme.normalize('NFD').includes('̀') ? 'L' : 'M';
      out.push(<span key={k++} class={`tone-${t}`}>{grapheme}</span>);
    } else out.push(<span key={k++}>{grapheme}</span>);
    i = j;
  }
  return <>{out}</>;
}

const Y: Record<Tone, number> = { H: 6, M: 16, L: 26 };

function YorubaContour({ text }: { text: string }) {
  const tones = text.split(/\s+/).flatMap((w) => tonePattern(w));
  if (!tones.length) return null;
  const step = 34;
  const pts = tones.map((t, i) => `${12 + i * step},${Y[t]}`).join(' ');
  return (
    <svg class="contour" width={Math.min(320, 24 + (tones.length - 1) * step)} height="34" viewBox={`0 0 ${24 + (tones.length - 1) * step} 34`} role="img" aria-label={`pitch: ${tones.map((t) => TONE_NAMES[t]).join(' ')}`}>
      <polyline points={pts} fill="none" stroke="currentColor" stroke-width="2" opacity="0.5" />
      {tones.map((t, i) => <circle key={i} cx={12 + i * step} cy={Y[t]} r="5" class={`tone-${t}`} fill="currentColor" />)}
    </svg>
  );
}

const ZH_PATH: Record<ZhTone, string> = {
  1: 'M2,6 L26,6', 2: 'M2,22 L26,4', 3: 'M2,14 Q10,30 18,26 T26,8', 4: 'M2,4 L26,28', 5: 'M10,18 L18,18',
};

function ZhContour({ pinyin }: { pinyin: string }) {
  const syl = pinyin.split(/\s+/).filter(Boolean);
  return (
    <span class="row wrap" style="gap:6px">
      {syl.map((s, i) => {
        const t = syllableTone(s);
        return (
          <span key={i} class="center" title={ZH_TONE_NAMES[t]}>
            <svg width="28" height="32" viewBox="0 0 28 32" aria-label={ZH_TONE_NAMES[t]}>
              <path d={ZH_PATH[t]} fill="none" stroke="var(--tone-h)" stroke-width="3" stroke-linecap="round" />
            </svg>
            <div><small>{s}</small></div>
          </span>
        );
      })}
    </span>
  );
}

export function PronunciationCard({ lang, text, ipa, pinyin, audio, autoPinyin, clips }: {
  lang: LangCode; text: string; ipa?: string; pinyin?: string; audio?: string; autoPinyin?: boolean;
  clips?: { src: string; text: string }[];
}) {
  const res = respellText(lang, text, ipa, pinyin);
  const canSpeak = !!SPEECH_LOCALE[lang];
  const play = () => {
    if (audio) { new Audio(audio).play().catch(() => speak(lang, text)); return; }
    speak(lang, text);
  };
  return (
    <div class="pron">
      <div class="row spread">
        <div class="grow">
          {lang === 'yo' && <div style="font-size:1.25rem"><YorubaTones text={text} /></div>}
          {lang === 'zh' && pinyin && <div style="font-size:1.15rem">{pinyin} {autoPinyin && <span class="pill">auto</span>}</div>}
          {ipa && <div class="ipa muted">{ipa}</div>}
          {res && <div><small>sounds like:</small> <b>{res}</b></div>}
        </div>
        {(audio || canSpeak) && <button class="small" onClick={play} aria-label="Play pronunciation">🔊</button>}
      </div>
      {lang === 'yo' && <YorubaContour text={text} />}
      {lang === 'zh' && pinyin && !autoPinyin && pinyin.split(/\s+/).length <= 6 && <ZhContour pinyin={pinyin} />}
      {clips?.length ? (
        <div style="margin-top:6px">
          <small class="muted">Native speaker, in a sentence:</small>
          {clips.map((c) => (
            <button key={c.src} class="small block" style="text-align:left;margin-top:4px" onClick={() => new Audio(c.src).play().catch(() => {})}>🔊 {c.text} <small class="muted">({c.src.includes('/yof_') ? 'woman' : 'man'})</small></button>
          ))}
        </div>
      ) : lang === 'yo' && !audio ? <small class="muted">No recording for this item yet. iPhone has no Yoruba voice, so follow the tone marks and the pitch line.</small> : null}
    </div>
  );
}

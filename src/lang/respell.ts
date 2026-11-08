// English-style respelling ("more = m-oar") generated from the official form:
// IPA for es/fr/pt, spelling for Yoruba (phonemic), pinyin for Mandarin.
import type { LangCode, Word } from '../data/types';
import { yorubaRespell, describeTones } from './yoruba';
import { pinyinRespell } from './pinyin';

// Longest-match-first IPA → English approximations. Shared + per-language overrides.
const COMMON: [string, string][] = [
  ['t͡ʃ', 'ch'], ['tʃ', 'ch'], ['d͡ʒ', 'j'], ['dʒ', 'j'], ['ʃ', 'sh'], ['ʒ', 'zh'], ['θ', 'th'], ['ð', 'th'],
  ['ɲ', 'ny'], ['ʎ', 'ly'], ['ŋ', 'ng'], ['j', 'y'], ['w', 'w'], ['ɥ', 'w'], ['x', 'kh'], ['χ', 'kh'],
  ['ɾ', 'r'], ['r', 'rr'], ['ʁ', 'r'], ['ʀ', 'r'], ['ɣ', 'g'], ['β', 'b'], ['ɡ', 'g'], ['h', 'h'],
  ['ɐ̃', 'uhn'], ['ã', 'ahn'], ['ɑ̃', 'ahn'], ['ɛ̃', 'an'], ['ẽ', 'ayn'], ['ĩ', 'een'], ['õ', 'ohn'], ['ɔ̃', 'ohn'], ['ũ', 'oon'], ['œ̃', 'uhn'],
  ['a', 'ah'], ['ɑ', 'ah'], ['ɐ', 'uh'], ['ə', 'uh'], ['e', 'ay'], ['ɛ', 'eh'], ['i', 'ee'], ['ɪ', 'ih'],
  ['o', 'oh'], ['ɔ', 'aw'], ['u', 'oo'], ['ʊ', 'oo'], ['y', 'ew'], ['ø', 'uh'], ['œ', 'uh'],
];

function ipaToRespell(ipa: string): string {
  // take first transcription, drop slashes/brackets, keep stress
  // take only the first transcription: "/ˈɡɾaθjas/ [ˈɡɾa.θjas]" → "ˈɡɾaθjas"
  const all = ipa.match(/\/[^/]+\/|\[[^\]]+\]/g) ?? [ipa.split(/[,~\s]/)[0]];
  const first = all.find((t) => t.includes('.')) ?? all[0]; // prefer one with syllable breaks
  const core = first.replace(/[/[\]()]/g, '').replace(/[ːˑ̯]/g, '').trim();
  const syllables = core.split(/[.‿]/).flatMap((s) => s.split(/(?=ˈ)/));
  const out = syllables.map((syl) => {
    const stressed = syl.includes('ˈ');
    let s = syl.replace(/[ˈˌ]/g, '');
    let res = '';
    while (s.length) {
      let hit = false;
      for (const [k, v] of COMMON) {
        if (s.startsWith(k)) { res += v; s = s.slice(k.length); hit = true; break; }
      }
      if (!hit) {
        const ch = s[0];
        if (!/\p{M}/u.test(ch)) res += ch;
        s = s.slice(1);
      }
    }
    return stressed ? res.toUpperCase() : res;
  });
  return out.filter(Boolean).join('-');
}

export function respell(w: Pick<Word, 'lang' | 'lemma' | 'ipa' | 'pinyin'>): string | undefined {
  return respellText(w.lang, w.lemma, w.ipa, w.pinyin);
}

export function respellText(lang: LangCode, text: string, ipa?: string, pinyin?: string): string | undefined {
  if (lang === 'yo') {
    const tones = describeTones(text);
    return `${text.split(/\s+/).map(yorubaRespell).join(' ')} (${tones})`;
  }
  if (lang === 'zh') return pinyin ? pinyinRespell(pinyin) : undefined;
  return ipa ? ipaToRespell(ipa) : undefined;
}

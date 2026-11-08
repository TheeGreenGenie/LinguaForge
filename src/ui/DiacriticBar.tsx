// On-screen keys for letters/marks that are hard to type on an iPhone keyboard.
import type { RefObject } from 'preact';
import type { LangCode } from '../data/types';

const KEYS: Record<LangCode, { label: string; insert: string; combining?: boolean }[]> = {
  yo: [
    { label: 'ẹ', insert: 'ẹ' }, { label: 'ọ', insert: 'ọ' }, { label: 'ṣ', insert: 'ṣ' },
    { label: '◌́ high', insert: '́', combining: true }, { label: '◌̀ low', insert: '̀', combining: true },
    { label: 'ń', insert: 'ń' }, { label: 'ǹ', insert: 'ǹ' }, { label: 'n̄', insert: 'n̄' },
  ],
  zh: [
    { label: '1 ā', insert: '1' }, { label: '2 á', insert: '2' }, { label: '3 ǎ', insert: '3' }, { label: '4 à', insert: '4' },
    { label: 'ü', insert: 'ü' },
  ],
  es: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'].map((c) => ({ label: c, insert: c })),
  fr: ['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'î', 'û', 'ù', 'ë', 'ï', 'œ'].map((c) => ({ label: c, insert: c })),
  pt: ['á', 'â', 'ã', 'à', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', 'ç'].map((c) => ({ label: c, insert: c })),
};

export function DiacriticBar({ lang, target, value, onChange }: {
  lang: LangCode;
  target: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
}) {
  const insert = (text: string) => {
    const el = target.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = (value.slice(0, start) + text + value.slice(end)).normalize('NFC');
    onChange(next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      // NFC may shorten the string when a combining mark composes; place caret sensibly
      const pos = Math.min(next.length, start + text.length - (value.length + text.length - next.length));
      el.setSelectionRange(pos, pos);
    });
  };
  return (
    <div class="diacritics" aria-label="Special characters">
      {KEYS[lang].map((k) => (
        <button type="button" key={k.label} onMouseDown={(e) => e.preventDefault()} onClick={() => insert(k.insert)} aria-label={`insert ${k.label}`}>
          {k.label}
        </button>
      ))}
    </div>
  );
}

export const TYPING_HELP: Record<LangCode, string> = {
  yo: 'Shortcuts: e. o. s. give ẹ ọ ṣ; put / after a vowel for high tone and \\ for low tone. Benin-style ɛ ɔ sh also work.',
  zh: 'Type characters or pinyin. Tones can be numbers: ni3 hao3.',
  es: 'Accents can be left out at first, with a warning. Strict mode in Settings requires them.',
  fr: 'Accents can be left out at first, with a warning. Strict mode in Settings requires them.',
  pt: 'Accents can be left out at first, with a warning. Strict mode in Settings requires them.',
};

import { describe, it, expect } from 'vitest';
import { canon } from '../src/lang/unicode';
import { yorubaInput, tonePattern, validateYorubaText, yorubaRespell } from '../src/lang/yoruba';
import { numberedToMarked, syllableTone, applySandhi } from '../src/lang/pinyin';
import { gradeAnswer } from '../src/lang/grade';

describe('unicode canon', () => {
  it('treats every encoding of ẹ́ as equal', () => {
    const precomposedDot = 'ẹ́'; // ẹ + acute
    const decomposedA = 'ẹ́';
    const decomposedB = 'ẹ́';
    const oldStyle = 'é̩'; // vertical line below
    expect(canon(precomposedDot)).toBe(canon(decomposedA));
    expect(canon(decomposedA)).toBe(canon(decomposedB));
    expect(canon(oldStyle)).toBe(canon(decomposedA));
  });

  it('all Yoruba vowel × tone × underdot combinations round-trip', () => {
    for (const v of ['a', 'e', 'i', 'o', 'u']) {
      for (const dot of v === 'e' || v === 'o' ? ['', '̣'] : ['']) {
        for (const tone of ['', '́', '̀']) {
          const a = (v + dot + tone).normalize('NFC');
          const b = v + tone + dot;
          expect(canon(a)).toBe(canon(b));
        }
      }
    }
  });
});

describe('yoruba input conversion', () => {
  it('maps Benin-style letters to Nigerian standard', () => {
    expect(canon(yorubaInput('ɔkɔ̀'))).toBe(canon('ọkọ̀'));
    expect(canon(yorubaInput('ɛja'))).toBe(canon('ẹja'));
    expect(canon(yorubaInput('shé'))).toBe(canon('ṣé'));
  });
  it('maps ASCII shortcuts', () => {
    expect(canon(yorubaInput('o.ko.\\'))).toBe(canon('ọkọ̀'));
    expect(canon(yorubaInput('e. s.e/'))).toBe(canon('ẹ ṣé'));
  });
});

describe('yoruba tones', () => {
  it('reads tone patterns from spelling', () => {
    expect(tonePattern('ọkọ')).toEqual(['M', 'M']);
    expect(tonePattern('ọkọ́')).toEqual(['M', 'H']);
    expect(tonePattern('ọkọ̀')).toEqual(['M', 'L']);
    expect(tonePattern('ìgbà')).toEqual(['L', 'L']);
    expect(tonePattern('igbá')).toEqual(['M', 'H']);
    expect(tonePattern('káàárọ̀')).toEqual(['H', 'L', 'H', 'L']);
  });
  it('treats syllabic nasals as tone-bearing but not nasal vowels', () => {
    expect(tonePattern('ń')).toEqual(['H']);
    expect(tonePattern('ìyàn')).toEqual(['L', 'L']); // "an" is a nasal vowel
  });
  it('respells', () => {
    expect(yorubaRespell('ọmọ')).toBe('awmaw');
    expect(yorubaRespell('ṣé')).toBe('shay');
  });
  it('validator flags unmarked text and accepts marked text', () => {
    expect(validateYorubaText('Mo fẹ́ jẹ oúnjẹ ní ilé ìwé lónìí').ok).toBe(true);
    expect(validateYorubaText('Mo fe je ounje ni ile iwe lonii ati ola').ok).toBe(false);
  });
});

describe('pinyin', () => {
  it('converts numbered to marked', () => {
    expect(numberedToMarked('ni3 hao3')).toBe('nǐ hǎo');
    expect(numberedToMarked('lv4')).toBe('lǜ');
    expect(numberedToMarked('zhong1guo2')).toBe('zhōngguó');
    expect(numberedToMarked('dou1')).toBe('dōu');
    expect(numberedToMarked('ma5')).toBe('ma');
    expect(numberedToMarked('gui4')).toBe('guì');
  });
  it('reads tones', () => {
    expect(syllableTone('mā')).toBe(1);
    expect(syllableTone('má')).toBe(2);
    expect(syllableTone('mǎ')).toBe(3);
    expect(syllableTone('mà')).toBe(4);
    expect(syllableTone('ma')).toBe(5);
  });
  it('applies sandhi', () => {
    expect(applySandhi([3, 3])).toEqual([2, 3]);
    expect(applySandhi([4, 4], ['不', '是'])).toEqual([2, 4]);
    expect(applySandhi([1, 4], ['一', '个'])).toEqual([2, 4]);
    expect(applySandhi([1, 1], ['一', '天'])).toEqual([4, 1]);
  });
});

describe('gradeAnswer', () => {
  it('Yoruba: exact match, tone error, underdot error', () => {
    expect(gradeAnswer('ọkọ̀', ['ọkọ̀'], { lang: 'yo', side: 'target' }).correct).toBe(true);
    expect(gradeAnswer('ɔkɔ̀', ['ọkọ̀'], { lang: 'yo', side: 'target' }).correct).toBe(true);
    expect(gradeAnswer('ọkọ́', ['ọkọ̀'], { lang: 'yo', side: 'target' })).toMatchObject({ correct: false, errorType: 'tone' });
    expect(gradeAnswer('okò', ['ọkọ̀'], { lang: 'yo', side: 'target' })).toMatchObject({ correct: false, errorType: 'underdot' });
  });
  it('Chinese: hanzi, pinyin numbers, tone error', () => {
    expect(gradeAnswer('你好', ['你好'], { lang: 'zh', side: 'target', pinyin: ['nǐ hǎo'] }).correct).toBe(true);
    expect(gradeAnswer('ni3hao3', ['你好'], { lang: 'zh', side: 'target', pinyin: ['nǐ hǎo'] }).correct).toBe(true);
    expect(gradeAnswer('ni2 hao3', ['你好'], { lang: 'zh', side: 'target', pinyin: ['nǐ hǎo'] })).toMatchObject({ errorType: 'tone' });
  });
  it('Romance: accent leniency vs strict', () => {
    expect(gradeAnswer('cafe', ['café'], { lang: 'fr', side: 'target' })).toMatchObject({ correct: true, errorType: 'accent' });
    expect(gradeAnswer('cafe', ['café'], { lang: 'fr', side: 'target', strictAccents: true })).toMatchObject({ correct: false, errorType: 'accent' });
    expect(gradeAnswer('graciass', ['gracias'], { lang: 'es', side: 'target' })).toMatchObject({ correct: true, errorType: 'typo' });
  });
  it('English side: articles and typos', () => {
    expect(gradeAnswer('the house', ['house'], { lang: 'yo', side: 'english' }).correct).toBe(true);
    expect(gradeAnswer('to go', ['go'], { lang: 'yo', side: 'english' }).correct).toBe(true);
    expect(gradeAnswer('vehicel', ['vehicle'], { lang: 'yo', side: 'english' })).toMatchObject({ correct: true, errorType: 'typo' });
  });
  it('rejected answers stay wrong', () => {
    expect(gradeAnswer('car', ['car', 'vehicle'], { lang: 'yo', side: 'english', rejected: ['car'] }).correct).toBe(false);
  });
});

import { respellText } from '../src/lang/respell';
describe('IPA respelling', () => {
  it('uses only the first transcription', () => {
    expect(respellText('es', 'gracias', '/ˈɡɾaθjas/ [ˈɡɾa.θjas]')).toBe('GRAH-thyahs');
    expect(respellText('fr', 'merci', '/mɛʁ.si/')).toBe('mehr-see');
  });
});

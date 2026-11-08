import { describe, it, expect } from 'vitest';
import { chrF } from '../src/progress/chrf';
import { LemmaIndex, coverage } from '../src/progress/coverage';
import { currentStreak, settleFreezes, freezesEarned, addDays, selfLeague, reminderIcs, xpForAnswer } from '../src/motivation/streaks';
import { tokenize } from '../src/lang/tokenize';
import type { DayRecord } from '../src/data/db';
import type { Word } from '../src/data/types';

const w = (lang: Word['lang'], lemma: string, forms: string[] = []): Word => ({ id: `${lang}:w:${lemma}`, lang, lemma, pos: 'x', gloss: ['g'], forms, source: 'authored', verified: false });

describe('chrF', () => {
  it('is 1 for identical text and lower for tone mistakes', () => {
    expect(chrF('Mo rí ọkọ̀ náà', 'Mo rí ọkọ̀ náà')).toBeCloseTo(1, 5);
    const toneWrong = chrF('Mo ri ọkọ naa', 'Mo rí ọkọ̀ náà');
    expect(toneWrong).toBeLessThan(0.9);
    expect(toneWrong).toBeGreaterThan(chrF('totally different words', 'Mo rí ọkọ̀ náà'));
  });
});

describe('coverage', () => {
  it('maps inflected forms to lemmas and exempts names and numbers', () => {
    const words = [w('fr', 'aller', ['allons', 'va']), w('fr', 'nous'), w('fr', 'à'), w('fr', 'le', ['la'])];
    const idx = new LemmaIndex(words);
    const known = new Set(['fr:w:aller', 'fr:w:nous']);
    const r = coverage('Nous allons à Paris le 14 juillet.', 'fr', idx, known);
    expect(r.required).toBe(5); // nous allons à le juillet (Paris, 14 exempt)
    expect(r.known).toBe(2);
    expect(r.unknownWordIds.sort()).toEqual(['fr:w:le', 'fr:w:à'].sort());
    expect(r.unmatched).toEqual(['juillet']);
  });
  it('keeps Yoruba tones distinct in lookups', () => {
    const idx = new LemmaIndex([w('yo', 'ọkọ'), w('yo', 'ọkọ̀')]);
    expect(idx.lookup('ọkọ̀')).toEqual(['yo:w:ọkọ̀']);
    expect(idx.lookup('Ọkọ')).toEqual(['yo:w:ọkọ']);
  });
  it('segments Chinese', () => {
    const toks = tokenize('我喜欢学习中文。', 'zh').filter((t) => t.isWord).map((t) => t.text);
    expect(toks.join('')).toBe('我喜欢学习中文');
    expect(toks.length).toBeGreaterThan(1);
    const idx = new LemmaIndex([w('zh', '我'), w('zh', '喜欢'), w('zh', '学习'), w('zh', '中文')]);
    const r = coverage('我喜欢学习中文。', 'zh', idx, new Set(['zh:w:我', 'zh:w:喜欢', 'zh:w:学习', 'zh:w:中文']));
    expect(r.ratio).toBe(1);
  });
});

describe('streaks', () => {
  const day = (date: string, xp: number, freezeUsed = false): [string, DayRecord] => [date, { date, xp, reviews: 0, correct: 0, newItems: 0, seconds: 0, langs: [], freezeUsed }];
  it('counts consecutive goal days, alive until midnight', () => {
    const today = '2026-03-10';
    const days = new Map([day(addDays(today, -1), 50), day(addDays(today, -2), 60), day(addDays(today, -3), 10)]);
    expect(currentStreak(days, today, 30)).toBe(2);
    days.set(today, day(today, 40)[1]);
    expect(currentStreak(days, today, 30)).toBe(3);
  });
  it('spends freezes to bridge a short gap only when it saves a streak', () => {
    const today = '2026-03-10';
    const days = new Map([day(addDays(today, -2), 50), day(addDays(today, -3), 50)]);
    const r = settleFreezes(days, today, 30, 1);
    expect(r.freezeDates).toEqual([addDays(today, -1)]);
    expect(r.freezesLeft).toBe(0);
    expect(settleFreezes(new Map(), today, 30, 2).freezeDates).toEqual([]);
  });
  it('earns freezes per 7-day milestone, capped at 2', () => {
    expect(freezesEarned(6, 7, 0)).toBe(1);
    expect(freezesEarned(13, 14, 2)).toBe(2);
  });
  it('handles month boundaries', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
  it('self league ranks this week', () => {
    const today = '2026-03-10';
    const days = new Map([day(today, 100), day(addDays(today, -8), 300)]);
    expect(selfLeague(days, today).rank).toBe(2);
  });
  it('xp only for correct retrieval', () => {
    expect(xpForAnswer(false, 'tone', false)).toBe(0);
    expect(xpForAnswer(true, 'none', true)).toBeGreaterThan(xpForAnswer(true, 'typo', false));
  });
  it('builds a daily recurring ics', () => {
    const ics = reminderIcs(19, 30, 'https://example.org');
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toMatch(/DTSTART:\d{8}T193000/);
  });
});

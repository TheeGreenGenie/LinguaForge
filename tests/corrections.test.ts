import { describe, it, expect } from 'vitest';
import { applyCorrections, makeEdit, proposeSpread, changesContent, type Correction } from '../src/data/corrections';
import { newCard, review, resetCard, ratingFor, isMature } from '../src/srs/scheduler';

const sentence = { id: 's1', text: 'Mo ri ọkọ', en: 'I saw a husband' };

describe('corrections overlay', () => {
  it('applies edits, later edits win, undone ignored', () => {
    const c1 = makeEdit('yo', 'sentence', 's1', sentence, { text: 'Mo rí ọkọ̀', en: 'I saw a vehicle' }, 'tone fix', 1)!;
    const c2 = makeEdit('yo', 'sentence', 's1', sentence, { en: 'I saw the vehicle' }, undefined, 2)!;
    const c3: Correction = { ...makeEdit('yo', 'sentence', 's1', sentence, { en: 'WRONG' }, undefined, 3)!, undone: true };
    const r = applyCorrections(sentence, [c3, c2, c1]);
    expect(r.item.text).toBe('Mo rí ọkọ̀');
    expect(r.item.en).toBe('I saw the vehicle');
    expect(r.userVerified).toBe(true);
    expect(changesContent(c1)).toBe(true);
  });

  it('tracks accepted / rejected answers and remove', () => {
    const base = { lang: 'yo' as const, targetType: 'sentence' as const, targetId: 's1' };
    const r = applyCorrections(sentence, [
      { ...base, kind: 'accept', answer: 'I spotted a car', createdAt: 1 },
      { ...base, kind: 'reject', answer: 'I saw a husband', createdAt: 2 },
      { ...base, kind: 'remove', createdAt: 3 },
    ]);
    expect(r.accepted).toEqual(['I spotted a car']);
    expect(r.rejected).toEqual(['I saw a husband']);
    expect(r.removed).toBe(true);
  });

  it('survives a pack update and reports a conflict when the pack changed the same field', () => {
    const c = makeEdit('yo', 'sentence', 's1', sentence, { text: 'Mo rí ọkọ̀' }, undefined, 1)!;
    // pack update changes an unrelated field → no conflict, fix still applied
    const updatedOther = { ...sentence, en: 'I saw a husband.' };
    const r1 = applyCorrections(updatedOther, [c]);
    expect(r1.item.text).toBe('Mo rí ọkọ̀');
    expect(r1.conflicts).toHaveLength(0);
    // pack update changes the same field differently → conflict surfaced, user fix still wins
    const updatedSame = { ...sentence, text: 'Mo rí ọkọ' };
    const r2 = applyCorrections(updatedSame, [c]);
    expect(r2.item.text).toBe('Mo rí ọkọ̀');
    expect(r2.conflicts).toHaveLength(1);
  });

  it('proposes spreading a word fix only to whole-word matches', () => {
    const props = proposeSpread('ọkọ', 'ọkọ̀', [
      { id: 'a', text: 'Ọkọ mi ra ọkọ tuntun' },
      { id: 'b', text: 'Mo ní ọkọ́ kan' }, // ọkọ́ (hoe) must NOT match ọkọ
      { id: 'c', text: 'ọkọ ni.' },
    ]);
    expect(props.map((p) => p.id)).toEqual(['a', 'c']);
    expect(props[0].after).toBe('Ọkọ mi ra ọkọ̀ tuntun');
  });
});

describe('scheduler', () => {
  it('reviews, rates tone errors as Again and resets on correction', () => {
    const now = Date.UTC(2026, 0, 1);
    let c = newCard('yo', 'word', 'yo:w:ọkọ̀#noun', 'prod', now);
    c = review(c, ratingFor(true, 'none', 8000), 'none', now);
    expect(c.due).toBeGreaterThan(now);
    const toneMiss = review(c, ratingFor(false, 'tone'), 'tone', now + 1000);
    expect(toneMiss.errorCounts?.tone).toBe(1);
    const reset = resetCard(toneMiss, now + 2000);
    expect(reset.fsrs.reps).toBe(0);
    expect(reset.errorCounts?.tone).toBe(1);
    expect(isMature(reset)).toBe(false);
  });

  it('becomes mature after repeated successful spaced reviews', () => {
    let t = Date.UTC(2026, 0, 1);
    let c = newCard('es', 'word', 'es:w:casa#noun', 'recog', t);
    for (let i = 0; i < 8 && !isMature(c); i++) {
      c = review(c, ratingFor(true, 'none', 6000), 'none', t);
      t = c.due + 1000;
    }
    expect(isMature(c)).toBe(true);
  });
});

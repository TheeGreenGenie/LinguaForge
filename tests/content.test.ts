// Integrity checks for all authored lessons (every language, every level).
import { describe, it, expect } from 'vitest';
import { yoLessons } from '../content/yo';
import { zhLessons } from '../content/zh';
import { esLessons, frLessons, ptLessons } from '../content/romance';
import { esCurriculum } from '../content/lessons/es';
import { frCurriculum } from '../content/lessons/fr';
import { ptCurriculum } from '../content/lessons/pt';
import { zhCurriculum } from '../content/lessons/zh';
import { yoCurriculum } from '../content/lessons/yo';
import { gradeAnswer } from '../src/lang/grade';
import { validateYorubaText } from '../src/lang/yoruba';
import { hasHan } from '../src/lang/unicode';

const ALL = {
  yo: [...yoLessons, ...yoCurriculum],
  zh: [...zhLessons, ...zhCurriculum],
  es: [...esLessons, ...esCurriculum],
  fr: [...frLessons, ...frCurriculum],
  pt: [...ptLessons, ...ptCurriculum],
};

describe('lesson content integrity', () => {
  for (const [lang, lessons] of Object.entries(ALL)) {
    describe(lang, () => {
      it('has lessons at every level 0–5', () => {
        for (let lvl = 0; lvl <= 5; lvl++) expect(lessons.some((l) => l.level === lvl), `level ${lvl}`).toBe(true);
      });
      it('has unique lesson and exercise ids, and unique order per level', () => {
        const ids = lessons.flatMap((l) => [l.id, ...l.exercises.map((e) => e.id)]);
        expect(new Set(ids).size).toBe(ids.length);
        const orders = lessons.map((l) => `${l.level}:${l.order}`);
        expect(new Set(orders).size).toBe(orders.length);
      });
      it('every lesson has a body and at least 2 exercises', () => {
        for (const l of lessons) {
          expect(l.body.length, l.id).toBeGreaterThan(80);
          expect(l.exercises.length, l.id).toBeGreaterThanOrEqual(2);
        }
      });
      it('every multiple-choice answer is one of its options (no duplicates)', () => {
        for (const l of lessons) for (const e of l.exercises) {
          if (!e.options) continue;
          expect(e.options, `${e.id}`).toContain(e.answer);
          expect(new Set(e.options).size, `${e.id} duplicate options`).toBe(e.options.length);
        }
      });
      it('every typed answer grades as correct against itself', () => {
        for (const l of lessons) for (const e of l.exercises) {
          if (e.options) continue;
          const side = e.side ?? 'target';
          const accepted = [e.answer, ...(e.accept ?? [])];
          const r = gradeAnswer(e.answer, accepted, { lang: lang as any, side, strictAccents: true, pinyin: accepted.filter((a) => !hasHan(a)) });
          expect(r.correct, `${e.id}: "${e.answer}"`).toBe(true);
        }
      });
      if (lang === 'yo') {
        it('Yorùbá example sentences in options are tone-marked', () => {
          for (const l of lessons) for (const e of l.exercises) for (const o of e.options ?? []) {
            // Yorùbá sentences only: skip glossed options like 'jẹ + oúnjẹ (eat + food)' and English phrases
            if (o.split(/\s+/).length >= 3 && !/[(+]/.test(o) && /[ẹọṣ]|́|̀/u.test(o.normalize('NFD').replace(/̣/g, 'ẹ'))) {
              expect(validateYorubaText(o).reasons.filter((r) => r !== 'letters outside Yoruba alphabet'), `${e.id}: ${o}`).toEqual([]);
            }
          }
        });
      }
    });
  }
});

// Checks a learner's answer for any task type and classifies the error.
import type { Task } from '../srs/session';
import type { LangData, Settings } from '../data/repo';
import { userAnswers } from '../data/repo';
import { gradeAnswer, type ErrorType, type GradeResult } from '../lang/grade';
import { basicNormalize, hasHan, stripToneMarks } from '../lang/unicode';
import { yorubaInput } from '../lang/yoruba';
import { chrF } from '../progress/chrf';

export interface CheckResult extends GradeResult {
  expected: string; // main answer to display
  alternatives: string[];
  needsSelfCheck?: boolean; // free translation close to reference — learner confirms
  similarity?: number;
}

const stripParens = (s: string) => s.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

function englishVariants(list: string[]): string[] {
  const out = new Set<string>();
  for (const s of list) { out.add(s); out.add(stripParens(s)); }
  return [...out].filter(Boolean);
}

export function expectedFor(task: Task): { side: 'target' | 'english'; answers: string[]; pinyin: string[] } {
  if (task.word) {
    const w = task.word;
    return task.card.dir === 'recog'
      ? { side: 'english', answers: englishVariants(w.gloss), pinyin: [] }
      : { side: 'target', answers: [w.lemma, ...(w.traditional ? [w.traditional] : [])], pinyin: w.pinyin ? [w.pinyin] : [] };
  }
  if (task.sentence) {
    const s = task.sentence;
    return task.card.dir === 'recog'
      ? { side: 'english', answers: englishVariants([s.en, ...(s.altEn ?? [])]), pinyin: [] }
      : { side: 'target', answers: [s.text, ...(s.altText ?? [])], pinyin: s.pinyin ? [s.pinyin] : [] };
  }
  const e = task.exercise!;
  const all = [e.answer, ...(e.accept ?? [])];
  return { side: e.side ?? 'target', answers: all, pinyin: all.filter((a) => !hasHan(a)) };
}

function mcError(task: Task, lang: LangData['lang'], given: string, expected: string): ErrorType {
  const t = task.exercise?.type;
  if (t === 'register-scene') return 'register';
  if (t === 'tone-id') return 'tone';
  if (t === 'minimal-pair' && (lang === 'yo' || lang === 'zh')) return 'tone';
  if (task.word && task.card.dir === 'prod' && (lang === 'yo' || lang === 'zh') && stripToneMarks(basicNormalize(given)) === stripToneMarks(basicNormalize(expected))) return 'tone';
  return 'wrong';
}

/** Detect "right meaning, wrong formality": the answer matches a sibling sentence with another register. */
function registerSlip(data: LangData, task: Task, given: string): boolean {
  const s = task.sentence;
  if (!s?.register || task.card.dir !== 'prod') return false;
  const key = basicNormalize(stripParens(s.en));
  const g = basicNormalize(data.lang === 'yo' ? yorubaInput(given) : given);
  for (const o of data.sentences.values()) {
    if (o.id === s.id || !o.register || o.register === s.register) continue;
    if (basicNormalize(stripParens(o.en)) === key && basicNormalize(o.text) === g) return true;
  }
  return false;
}

export function checkAnswer(task: Task, given: string, data: LangData, settings: Settings): CheckResult {
  const lang = data.lang;
  const { side, answers, pinyin } = expectedFor(task);
  const ua = userAnswers(data, task.card.itemId);
  const accepted = [...answers, ...ua.accepted];
  const expected = answers[0];
  const alternatives = accepted.slice(1);

  // multiple choice / tiles: exact selection
  if (task.mode === 'mc' || (task.exercise && task.exercise.options?.length)) {
    const ok = basicNormalize(given) === basicNormalize(expected) || ua.accepted.some((a) => basicNormalize(a) === basicNormalize(given));
    return { correct: ok, errorType: ok ? 'none' : mcError(task, lang, given, expected), expected, alternatives };
  }
  if (task.mode === 'tiles') {
    const join = (s: string) => basicNormalize(s).replace(/\s+/g, lang === 'zh' ? '' : ' ');
    const ok = accepted.some((a) => join(a) === join(given));
    if (!ok && registerSlip(data, task, given)) return { correct: false, errorType: 'register', expected, alternatives };
    return { correct: ok, errorType: ok ? 'none' : 'wrong', expected, alternatives };
  }

  const g = gradeAnswer(given, accepted, { lang, side, strictAccents: settings.strictAccents, rejected: ua.rejected, pinyin: [...pinyin, ...ua.accepted.filter((a) => !hasHan(a))] });
  if (g.correct || g.errorType !== 'wrong') return { ...g, expected, alternatives };
  if (registerSlip(data, task, given)) return { correct: false, errorType: 'register', expected, alternatives };

  // free translation of sentences: similarity to the best reference
  if (task.sentence) {
    const sim = Math.max(...accepted.map((a) => chrF(given, a)));
    if (sim >= 0.8) return { correct: true, errorType: 'typo', expected, alternatives, similarity: sim };
    if (sim >= 0.45) return { correct: false, errorType: 'wrong', expected, alternatives, needsSelfCheck: true, similarity: sim };
    return { correct: false, errorType: 'wrong', expected, alternatives, similarity: sim };
  }
  return { ...g, expected, alternatives };
}

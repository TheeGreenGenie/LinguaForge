// User corrections ("✎ Fix this"). Stored as an overlay on top of pack data so
// pack updates never erase them. See ROADMAP Part 4 "User corrections".
import type { LangCode } from './types';

export type CorrectionTarget = 'word' | 'sentence' | 'exercise' | 'passage';
export type CorrectionKind = 'edit' | 'accept' | 'reject' | 'remove';

export interface Correction {
  id?: number;
  lang: LangCode;
  targetType: CorrectionTarget;
  targetId: string;
  kind: CorrectionKind;
  /** For 'edit': the new field values. */
  patch?: Record<string, unknown>;
  /** For 'edit': the field values before the edit (used to detect pack-update conflicts). */
  before?: Record<string, unknown>;
  /** For 'accept' / 'reject': the answer text. */
  answer?: string;
  note?: string;
  createdAt: number;
  undone?: boolean;
  /** Set when made from an exam result screen. */
  fromExam?: boolean;
}

/** Fields whose change means the learner was studying a wrong form → reset review cards. */
export const CONTENT_FIELDS = ['lemma', 'text', 'answer', 'gloss', 'en', 'pinyin', 'paragraphs', 'accept', 'options'];

export interface Overlaid<T> {
  item: T;
  removed: boolean;
  accepted: string[];
  rejected: string[];
  userVerified: boolean;
  conflicts: { field: string; packValue: unknown; yourValue: unknown; correctionId?: number }[];
}

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Apply all (non-undone) corrections for one item, oldest first so later ones win. */
export function applyCorrections<T extends object>(item: T, corrections: Correction[]): Overlaid<T> {
  const list = corrections.filter((c) => !c.undone).sort((a, b) => a.createdAt - b.createdAt);
  let out: T = item;
  let removed = false;
  const accepted: string[] = [];
  const rejected: string[] = [];
  const conflicts: Overlaid<T>['conflicts'] = [];
  for (const c of list) {
    if (c.kind === 'remove') removed = true;
    else if (c.kind === 'accept' && c.answer) {
      accepted.push(c.answer);
      const i = rejected.indexOf(c.answer);
      if (i >= 0) rejected.splice(i, 1);
    } else if (c.kind === 'reject' && c.answer) {
      rejected.push(c.answer);
      const i = accepted.indexOf(c.answer);
      if (i >= 0) accepted.splice(i, 1);
    } else if (c.kind === 'edit' && c.patch) {
      for (const [field, beforeVal] of Object.entries(c.before ?? {})) {
        const packVal = (item as Record<string, unknown>)[field];
        if (!sameValue(packVal, beforeVal) && !sameValue(packVal, c.patch[field])) {
          conflicts.push({ field, packValue: packVal, yourValue: c.patch[field], correctionId: c.id });
        }
      }
      out = { ...out, ...c.patch };
    }
  }
  return { item: out, removed, accepted, rejected, userVerified: list.some((c) => c.kind === 'edit'), conflicts };
}

export function changesContent(c: Correction): boolean {
  return c.kind === 'edit' && Object.keys(c.patch ?? {}).some((k) => CONTENT_FIELDS.includes(k));
}

/** Build an 'edit' correction recording only fields that actually changed. */
export function makeEdit(
  lang: LangCode,
  targetType: CorrectionTarget,
  targetId: string,
  current: Record<string, unknown>,
  next: Record<string, unknown>,
  note?: string,
  now = Date.now(),
): Correction | null {
  const patch: Record<string, unknown> = {};
  const before: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(next)) {
    if (!sameValue(current[k], v)) {
      patch[k] = v;
      before[k] = current[k];
    }
  }
  if (!Object.keys(patch).length) return null;
  return { lang, targetType, targetId, kind: 'edit', patch, before, note, createdAt: now };
}

/**
 * After a word's spelling is corrected (e.g. a tone mark), find sentences that
 * contain the old spelling as a whole word, and propose the replacement.
 * The learner confirms each one; confirmed ones become sentence edits.
 */
export function proposeSpread(
  oldForm: string,
  newForm: string,
  sentences: { id: string; text: string }[],
): { id: string; before: string; after: string }[] {
  const o = oldForm.normalize('NFC');
  const n = newForm.normalize('NFC');
  if (!o || o === n) return [];
  const esc = o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // whole-word match that respects combining marks (a following mark means a different word)
  const re = new RegExp(`(^|[^\\p{L}\\p{M}])${esc}(?![\\p{L}\\p{M}])`, 'gu');
  const out: { id: string; before: string; after: string }[] = [];
  for (const s of sentences) {
    const text = s.text.normalize('NFC');
    if (re.test(text)) {
      re.lastIndex = 0;
      out.push({ id: s.id, before: text, after: text.replace(re, (_m, pre) => pre + n) });
    }
    re.lastIndex = 0;
  }
  return out;
}

/** Export for sharing with a native speaker / folding into packs later. */
export function correctionsToCsv(list: Correction[]): string {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['date', 'lang', 'type', 'id', 'kind', 'before', 'after', 'answer', 'note'].join(',')];
  for (const c of list.filter((x) => !x.undone)) {
    rows.push([
      new Date(c.createdAt).toISOString(), c.lang, c.targetType, c.targetId, c.kind,
      JSON.stringify(c.before ?? ''), JSON.stringify(c.patch ?? ''), c.answer ?? '', c.note ?? '',
    ].map(esc).join(','));
  }
  return rows.join('\n');
}

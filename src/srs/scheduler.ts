// Spaced repetition on FSRS (ts-fsrs). Each learnable item has one card per
// direction: recognition (target → English) and production (English → target).
import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type Grade } from 'ts-fsrs';
import type { LangCode } from '../data/types';
import type { ErrorType } from '../lang/grade';

export type ItemType = 'word' | 'sentence' | 'exercise';
export type Direction = 'recog' | 'prod' | 'drill';

export interface StoredCard {
  id: string; // `${itemType}|${itemId}|${dir}`
  lang: LangCode;
  itemType: ItemType;
  itemId: string;
  dir: Direction;
  due: number; // epoch ms (indexed)
  fsrs: Omit<Card, 'due' | 'last_review'> & { last_review?: number };
  lastError?: ErrorType;
  errorCounts?: Partial<Record<ErrorType, number>>;
  createdAt: number;
}

const scheduler = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.9, maximum_interval: 3650 }));

/** Stability (days) at which a word counts as "known" (Part 3 of the roadmap). */
export const MATURE_STABILITY_DAYS = 21;

export function cardId(itemType: ItemType, itemId: string, dir: Direction): string {
  return `${itemType}|${itemId}|${dir}`;
}

export function newCard(lang: LangCode, itemType: ItemType, itemId: string, dir: Direction, now = Date.now()): StoredCard {
  const c = createEmptyCard(new Date(now));
  return {
    id: cardId(itemType, itemId, dir),
    lang,
    itemType,
    itemId,
    dir,
    due: c.due.getTime(),
    fsrs: toStored(c),
    createdAt: now,
  };
}

function toStored(c: Card): StoredCard['fsrs'] {
  const { due: _d, last_review, ...rest } = c;
  return { ...rest, last_review: last_review ? new Date(last_review).getTime() : undefined };
}

function toCard(s: StoredCard): Card {
  return { ...s.fsrs, due: new Date(s.due), last_review: s.fsrs.last_review ? new Date(s.fsrs.last_review) : undefined } as Card;
}

/**
 * Map a graded answer to an FSRS rating. A tone/underdot/register error on a
 * correct word is still "Again": in tonal languages the wrong tone is a different word.
 */
export function ratingFor(correct: boolean, errorType: ErrorType, msTaken?: number): Grade {
  if (!correct) return Rating.Again;
  if (errorType === 'typo' || errorType === 'accent') return Rating.Hard;
  if (msTaken !== undefined && msTaken < 4000) return Rating.Easy;
  return Rating.Good;
}

export function review(card: StoredCard, rating: Grade, errorType: ErrorType, now = Date.now()): StoredCard {
  const { card: next } = scheduler.next(toCard(card), new Date(now), rating);
  const errorCounts = { ...(card.errorCounts ?? {}) };
  if (errorType !== 'none') errorCounts[errorType] = (errorCounts[errorType] ?? 0) + 1;
  return { ...card, due: next.due.getTime(), fsrs: toStored(next), lastError: errorType, errorCounts };
}

/** Reset after a user correction changed the content: relearn the corrected form. */
export function resetCard(card: StoredCard, now = Date.now()): StoredCard {
  const fresh = newCard(card.lang, card.itemType, card.itemId, card.dir, now);
  return { ...fresh, errorCounts: card.errorCounts };
}

export function isMature(card: StoredCard | undefined): boolean {
  return !!card && card.fsrs.state === State.Review && card.fsrs.stability >= MATURE_STABILITY_DAYS;
}

export function isNew(card: StoredCard): boolean {
  return card.fsrs.state === State.New;
}

export { Rating, State };

// Accountability: XP, daily goal, streaks with freezes, self-league, .ics reminders.
import type { DayRecord } from '../data/db';
import type { ErrorType } from '../lang/grade';

export const XP = {
  correct: 10,
  correctNew: 12,
  typo: 7,
  lessonComplete: 15,
  readingComplete: 20,
  examPassed: 50,
} as const;

/** XP only for real retrieval — wrong answers and taps earn nothing. */
export function xpForAnswer(correct: boolean, errorType: ErrorType, wasNew: boolean): number {
  if (!correct) return 0;
  if (errorType === 'typo' || errorType === 'accent') return XP.typo;
  return wasNew ? XP.correctNew : XP.correct;
}

export function localDate(t: number | Date = Date.now()): string {
  const d = new Date(t);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n, 12); // noon avoids DST edges
  return localDate(dt);
}

export function dayMet(d: DayRecord | undefined, goal: number): boolean {
  return !!d && (d.xp >= goal || !!d.freezeUsed);
}

/**
 * Current streak: consecutive days meeting the goal ending today, or ending
 * yesterday if today isn't done yet (the streak is still alive until midnight).
 */
export function currentStreak(days: Map<string, DayRecord>, today: string, goal: number): number {
  let cursor = dayMet(days.get(today), goal) ? today : addDays(today, -1);
  let n = 0;
  while (dayMet(days.get(cursor), goal)) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

/**
 * Called when the app opens: spends freezes on missed days since the last
 * active day so a streak survives a short gap. Returns the dates to mark
 * freezeUsed and the remaining freeze count.
 */
export function settleFreezes(days: Map<string, DayRecord>, today: string, goal: number, freezes: number): { freezeDates: string[]; freezesLeft: number } {
  const missed: string[] = [];
  let cursor = addDays(today, -1);
  for (let i = 0; i < 60 && !dayMet(days.get(cursor), goal); i++) {
    missed.push(cursor);
    cursor = addDays(cursor, -1);
  }
  // only worth spending if there is a streak behind the gap and enough freezes to cover it
  const hadStreak = dayMet(days.get(cursor), goal);
  if (!missed.length || !hadStreak || missed.length > freezes) return { freezeDates: [], freezesLeft: freezes };
  return { freezeDates: missed, freezesLeft: freezes - missed.length };
}

/** 1 freeze per 7-day milestone, max 2 held. */
export function freezesEarned(prevStreak: number, newStreak: number, held: number): number {
  const earned = Math.floor(newStreak / 7) - Math.floor(prevStreak / 7);
  return Math.min(2, held + Math.max(0, earned));
}

/** Weekly league against yourself: this week's XP ranked among the last 5 weeks. */
export function selfLeague(days: Map<string, DayRecord>, today: string): { weeks: number[]; rank: number } {
  const weeks: number[] = [];
  for (let w = 0; w < 5; w++) {
    let sum = 0;
    for (let d = 0; d < 7; d++) sum += days.get(addDays(today, -(w * 7 + d)))?.xp ?? 0;
    weeks.push(sum);
  }
  const thisWeek = weeks[0];
  const rank = 1 + weeks.slice(1).filter((x) => x > thisWeek).length;
  return { weeks, rank };
}

/** A recurring daily calendar event with an alarm — the offline reminder for iPhone. */
export function reminderIcs(hour: number, minute: number, url: string, now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, minute);
  const local = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}T${pad(hour)}${pad(minute)}00`;
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LinguaForge//EN', 'BEGIN:VEVENT',
    `UID:linguaforge-daily-${stamp}@local`, `DTSTAMP:${stamp}`, `DTSTART:${local}`, 'DURATION:PT15M',
    'RRULE:FREQ=DAILY', 'SUMMARY:LinguaForge — daily practice', `DESCRIPTION:Keep your streak alive. ${url}`, `URL:${url}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Time to practise', 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}

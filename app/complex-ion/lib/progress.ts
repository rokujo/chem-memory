import { COMPLEXES } from './data';

export type ProgressEntry = {
  level: number;
  lastAt: number;
  nextDueAt: number;
  correctCount: number;
  totalCount: number;
};

export type Progress = Record<string, ProgressEntry>;

const STORAGE_KEY = 'chem-memory:complex-ion:progress:v1';

export const SRS_INTERVALS_DAYS = [1, 3, 7, 14, 30, 60];
const DAY_MS = 24 * 60 * 60 * 1000;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadProgress(): Progress {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as Progress;
    return {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Progress): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // quota exceeded / disabled — silently drop
  }
}

function emptyEntry(): ProgressEntry {
  return { level: 0, lastAt: 0, nextDueAt: 0, correctCount: 0, totalCount: 0 };
}

export function getEntry(progress: Progress, complexId: string): ProgressEntry {
  return progress[complexId] ?? emptyEntry();
}

function applyResult(prev: ProgressEntry, correct: boolean, now: number): ProgressEntry {
  const totalCount = prev.totalCount + 1;
  const correctCount = prev.correctCount + (correct ? 1 : 0);
  let level: number;
  let nextDueAt: number;
  if (correct) {
    level = Math.min(6, prev.level + 1);
    nextDueAt = now + SRS_INTERVALS_DAYS[level - 1] * DAY_MS;
  } else {
    level = Math.max(0, prev.level - 2);
    nextDueAt = now;
  }
  return { level, lastAt: now, nextDueAt, correctCount, totalCount };
}

export function recordAnswer(
  progress: Progress,
  complexId: string,
  correct: boolean,
  now: number = Date.now(),
): Progress {
  const prev = progress[complexId] ?? emptyEntry();
  return { ...progress, [complexId]: applyResult(prev, correct, now) };
}

// 今日その問題を出題してよいかを判定する。
// - 未学習 or 過去日の学習: 出題可
// - 今日不正解だった (nextDueAt == lastAt): 出題可(再挑戦)
// - 今日正解した (nextDueAt > lastAt): 出題不可
export function isEligibleToday(entry: ProgressEntry, now: number = Date.now()): boolean {
  if (entry.lastAt === 0) return true;
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  if (entry.lastAt < todayStart.getTime()) return true;
  const lastWasCorrect = entry.nextDueAt > entry.lastAt;
  return !lastWasCorrect;
}

export type LearnedStatus = 'new' | 'due' | 'learning' | 'mastered';

export function statusOf(entry: ProgressEntry, now: number = Date.now()): LearnedStatus {
  if (entry.level === 0) return 'new';
  if (entry.nextDueAt <= now) return 'due';
  if (entry.level >= 5) return 'mastered';
  return 'learning';
}

export type ProgressSummary = {
  total: number;
  newCount: number;
  dueCount: number;
  learningCount: number;
  masteredCount: number;
  accuracyPct: number;
};

export function summarize(progress: Progress, now: number = Date.now()): ProgressSummary {
  let newCount = 0, dueCount = 0, learningCount = 0, masteredCount = 0;
  let totalCorrect = 0, totalAnswers = 0;
  for (const c of COMPLEXES) {
    const e = getEntry(progress, c.id);
    totalCorrect += e.correctCount;
    totalAnswers += e.totalCount;
    const st = statusOf(e, now);
    if (st === 'new')        newCount++;
    else if (st === 'due')   dueCount++;
    else if (st === 'mastered') masteredCount++;
    else                     learningCount++;
  }
  return {
    total: COMPLEXES.length,
    newCount, dueCount, learningCount, masteredCount,
    accuracyPct: totalAnswers === 0 ? 0 : Math.round((totalCorrect / totalAnswers) * 100),
  };
}

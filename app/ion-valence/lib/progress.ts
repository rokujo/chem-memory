import { IONS } from './data';

export type ProgressEntry = {
  level: number;
  lastAt: number;
  nextDueAt: number;
  correctCount: number;
  totalCount: number;
};

export type Progress = Record<string, ProgressEntry>;

const STORAGE_KEY = 'chem-memory:ion-valence:progress:v1';

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

export function getEntry(progress: Progress, id: string): ProgressEntry {
  return progress[id] ?? emptyEntry();
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

export function recordAnswer(progress: Progress, id: string, correct: boolean, now: number = Date.now()): Progress {
  const prev = progress[id] ?? emptyEntry();
  return { ...progress, [id]: applyResult(prev, correct, now) };
}

export function recordAnswers(
  progress: Progress,
  updates: Array<{ id: string; correct: boolean }>,
  now: number = Date.now(),
): Progress {
  const next: Progress = { ...progress };
  for (const u of updates) {
    const prev = next[u.id] ?? emptyEntry();
    next[u.id] = applyResult(prev, u.correct, now);
  }
  return next;
}

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
  for (const i of IONS) {
    const entry = getEntry(progress, i.id);
    totalCorrect += entry.correctCount;
    totalAnswers += entry.totalCount;
    const st = statusOf(entry, now);
    if (st === 'new') newCount++;
    else if (st === 'due') dueCount++;
    else if (st === 'mastered') masteredCount++;
    else learningCount++;
  }
  return {
    total: IONS.length,
    newCount, dueCount, learningCount, masteredCount,
    accuracyPct: totalAnswers === 0 ? 0 : Math.round((totalCorrect / totalAnswers) * 100),
  };
}

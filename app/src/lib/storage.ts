import type { GiftInput } from './types';

const HISTORY_KEY = 'tsutsumicho.history.v1';
const QUIZ_KEY = 'tsutsumicho.quizBest.v1';
const THEME_KEY = 'tsutsumicho.theme.v1';
const MAX_HISTORY = 8;

export interface HistoryEntry {
  input: GiftInput;
  amount: number;
  savedAt: number;
}

function safeRead<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 容量超過やプライベートモードでは黙って諦める
  }
}

export function loadHistory(): HistoryEntry[] {
  const stored = safeRead<HistoryEntry[]>(HISTORY_KEY);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (e) => e && typeof e.amount === 'number' && e.input && typeof e.savedAt === 'number'
  );
}

/** 同じ条件の履歴は1件にまとめ、新しい順に MAX_HISTORY 件だけ残す。 */
export function pushHistory(input: GiftInput, amount: number): HistoryEntry[] {
  const key = JSON.stringify(input);
  const rest = loadHistory().filter((e) => JSON.stringify(e.input) !== key);
  const next = [{ input, amount, savedAt: Date.now() }, ...rest].slice(0, MAX_HISTORY);
  safeWrite(HISTORY_KEY, next);
  return next;
}

export function clearHistory(): HistoryEntry[] {
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // 何もできないので無視する
  }
  return [];
}

export function loadBestQuizScore(): number | null {
  const stored = safeRead<number>(QUIZ_KEY);
  return typeof stored === 'number' ? stored : null;
}

export function saveBestQuizScore(deviation: number): number {
  const best = loadBestQuizScore();
  const next = best === null ? deviation : Math.max(best, deviation);
  safeWrite(QUIZ_KEY, next);
  return next;
}

export type ThemePreference = 'light' | 'dark' | 'system';

export function loadTheme(): ThemePreference {
  const stored = safeRead<ThemePreference>(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

export function saveTheme(theme: ThemePreference): void {
  safeWrite(THEME_KEY, theme);
}

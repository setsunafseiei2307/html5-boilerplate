import { OCCASION_MAP, RELATION_MAP, REGION_MAP, AGE_BANDS } from './occasions';
import type { AgeBandId, AttendanceId, GiftInput, OccasionId, RegionId, RelationId } from './types';

export type Route =
  | { name: 'home' }
  | { name: 'calc'; input: Partial<GiftInput>; submitted: boolean }
  | { name: 'quiz' }
  | { name: 'quizResult'; token: string }
  | { name: 'guide' };

const ATTENDANCES: AttendanceId[] = ['attend', 'absent_before', 'absent_sameday'];

function pick<T extends string>(value: string | null, allowed: readonly T[]): T | undefined {
  if (!value) return undefined;
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

/** location.hash を Route に変換する。未知のパスはホーム扱い。 */
export function parseHash(hash: string): Route {
  const cleaned = hash.replace(/^#/, '');
  const [path, queryString] = cleaned.split('?');
  const params = new URLSearchParams(queryString ?? '');
  const normalized = path.replace(/^\/+|\/+$/g, '');

  if (normalized === 'quiz') return { name: 'quiz' };
  if (normalized === 'quiz/r') {
    const token = params.get('s') ?? '';
    return { name: 'quizResult', token };
  }
  if (normalized === 'guide') return { name: 'guide' };
  if (normalized === 'calc') {
    const occasion = pick<OccasionId>(
      params.get('o'),
      Object.keys(OCCASION_MAP) as OccasionId[]
    );
    const relation = pick<RelationId>(
      params.get('r'),
      Object.keys(RELATION_MAP) as RelationId[]
    );
    const age = pick<AgeBandId>(
      params.get('a'),
      AGE_BANDS.map((b) => b.id)
    );
    const region = pick<RegionId>(
      params.get('g'),
      Object.keys(REGION_MAP) as RegionId[]
    );
    const attendance = pick<AttendanceId>(params.get('t'), ATTENDANCES);
    const joint = params.get('j') === '1';
    const input: Partial<GiftInput> = { joint };
    if (occasion) input.occasion = occasion;
    if (relation) input.relation = relation;
    if (age) input.age = age;
    if (region) input.region = region;
    if (attendance) input.attendance = attendance;
    return { name: 'calc', input, submitted: params.get('v') === '1' };
  }
  return { name: 'home' };
}

/** 計算結果をそのまま開けるハッシュを組み立てる。 */
export function buildCalcHash(input: Partial<GiftInput>, submitted = true): string {
  const params = new URLSearchParams();
  if (input.occasion) params.set('o', input.occasion);
  if (input.relation) params.set('r', input.relation);
  if (input.age) params.set('a', input.age);
  if (input.region) params.set('g', input.region);
  if (input.attendance) params.set('t', input.attendance);
  if (input.joint) params.set('j', '1');
  if (submitted) params.set('v', '1');
  const query = params.toString();
  return query ? `#/calc?${query}` : '#/calc';
}

export function buildQuizResultHash(token: string): string {
  return `#/quiz/r?s=${encodeURIComponent(token)}`;
}

/** ハッシュから、共有できる絶対 URL を作る。 */
export function absoluteUrl(hash: string): string {
  if (typeof window === 'undefined') return hash;
  const { origin, pathname } = window.location;
  return `${origin}${pathname}${hash}`;
}

/** X（旧 Twitter）の投稿画面 URL。 */
export function buildXShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({ text, url });
  return `https://x.com/intent/post?${params.toString()}`;
}

/** LINE の共有 URL。日本の冠婚葬祭は LINE で相談されることが多い。 */
export function buildLineShareUrl(url: string): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
}

/**
 * クリップボードにコピーする。
 * navigator.clipboard は HTTPS か localhost でしか使えないため、
 * 失敗したら textarea を使った旧来の方法にフォールバックする。
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // フォールバックへ進む
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

import { describe, expect, it } from 'vitest';
import {
  buildCalcHash,
  buildLineShareUrl,
  buildQuizResultHash,
  buildXShareUrl,
  parseHash
} from '../share';
import type { GiftInput } from '../types';

const input: GiftInput = {
  occasion: 'wedding',
  relation: 'friend',
  age: '30s',
  region: 'kanto',
  attendance: 'attend',
  joint: true
};

describe('parseHash', () => {
  it('空のハッシュはホーム', () => {
    expect(parseHash('')).toEqual({ name: 'home' });
    expect(parseHash('#')).toEqual({ name: 'home' });
    expect(parseHash('#/')).toEqual({ name: 'home' });
  });

  it('未知のパスはホームに落ちる', () => {
    expect(parseHash('#/nowhere')).toEqual({ name: 'home' });
    expect(parseHash('#/../../etc/passwd')).toEqual({ name: 'home' });
  });

  it('クイズと結果を判別する', () => {
    expect(parseHash('#/quiz')).toEqual({ name: 'quiz' });
    expect(parseHash('#/quiz/r?s=abc')).toEqual({ name: 'quizResult', token: 'abc' });
  });

  it('クイズ結果のトークンが無くても落ちない', () => {
    expect(parseHash('#/quiz/r')).toEqual({ name: 'quizResult', token: '' });
  });

  it('計算条件を読み取る', () => {
    const route = parseHash('#/calc?o=wedding&r=friend&a=30s&g=kanto&t=attend&j=1&v=1');
    expect(route).toEqual({
      name: 'calc',
      input: {
        occasion: 'wedding',
        relation: 'friend',
        age: '30s',
        region: 'kanto',
        attendance: 'attend',
        joint: true
      },
      submitted: true
    });
  });

  it('不正な値は無視して部分的な入力にする', () => {
    const route = parseHash('#/calc?o=dragon&r=friend&a=999s&g=atlantis');
    expect(route.name).toBe('calc');
    if (route.name !== 'calc') return;
    expect(route.input.occasion).toBeUndefined();
    expect(route.input.relation).toBe('friend');
    expect(route.input.age).toBeUndefined();
    expect(route.input.region).toBeUndefined();
  });

  it('スクリプトを仕込んだ値を通さない', () => {
    const route = parseHash('#/calc?o=%3Cscript%3Ealert(1)%3C/script%3E&r=friend');
    expect(route.name).toBe('calc');
    if (route.name !== 'calc') return;
    expect(route.input.occasion).toBeUndefined();
  });

  it('先頭のスラッシュが多くても解釈できる', () => {
    expect(parseHash('#///quiz///')).toEqual({ name: 'quiz' });
  });

  it('v=1 がなければ未確定として扱う', () => {
    const route = parseHash('#/calc?o=wedding&r=friend');
    expect(route.name === 'calc' && route.submitted).toBe(false);
  });
});

describe('buildCalcHash', () => {
  it('往復して同じ入力に戻る', () => {
    const route = parseHash(buildCalcHash(input));
    expect(route.name).toBe('calc');
    if (route.name !== 'calc') return;
    expect(route.input).toEqual(input);
    expect(route.submitted).toBe(true);
  });

  it('joint が false ならパラメータを出さない', () => {
    expect(buildCalcHash({ ...input, joint: false })).not.toMatch('j=1');
  });

  it('空の入力でも壊れない', () => {
    expect(buildCalcHash({}, false)).toBe('#/calc');
    expect(parseHash(buildCalcHash({}, false)).name).toBe('calc');
  });
});

describe('共有 URL', () => {
  it('クイズ結果のハッシュを往復できる', () => {
    expect(parseHash(buildQuizResultHash('a3f'))).toEqual({
      name: 'quizResult',
      token: 'a3f'
    });
  });

  it('X の投稿 URL に本文と URL が入る', () => {
    const url = buildXShareUrl('テスト本文', 'https://example.com/#/quiz');
    expect(url.startsWith('https://x.com/intent/post?')).toBe(true);
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('text')).toBe('テスト本文');
    expect(params.get('url')).toBe('https://example.com/#/quiz');
  });

  it('LINE の共有 URL がエンコードされる', () => {
    const url = buildLineShareUrl('https://example.com/#/quiz/r?s=abc');
    expect(url).toContain(encodeURIComponent('https://example.com/#/quiz/r?s=abc'));
  });
});

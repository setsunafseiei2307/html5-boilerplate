import { describe, expect, it } from 'vitest';
import {
  buildResult,
  calcRange,
  formatYen,
  isValidInput,
  rawAmount,
  snapToAuspicious,
  tabooReason,
  toKanjiAmount
} from '../amount';
import { AGE_BANDS, OCCASIONS, REGIONS, relationsFor } from '../occasions';
import { buildCalcHash, parseHash } from '../share';
import { decodeCorrectness, gradeQuiz } from '../quiz';
import { buildEnvelopeGuide } from '../etiquette';
import type { GiftInput } from '../types';

const base: GiftInput = {
  occasion: 'wedding',
  relation: 'friend',
  age: '30s',
  region: 'national',
  attendance: 'attend',
  joint: false
};

describe('極端な値', () => {
  it('巨大な数でも縁起の判定が返る', () => {
    expect(typeof tabooReason(Number.MAX_SAFE_INTEGER, 'celebration')).not.toBe('undefined');
    expect(snapToAuspicious(Number.MAX_SAFE_INTEGER, 'celebration')).toBe(1000000);
  });

  it('極小の数でも最小額に収まる', () => {
    expect(snapToAuspicious(0.0001, 'condolence')).toBe(3000);
  });

  it('Infinity と NaN で落ちない', () => {
    expect(() => snapToAuspicious(Number.POSITIVE_INFINITY, 'celebration')).not.toThrow();
    expect(() => tabooReason(Number.NaN, 'celebration')).not.toThrow();
    expect(toKanjiAmount(Number.POSITIVE_INFINITY)).toBe('');
    expect(toKanjiAmount(Number.NEGATIVE_INFINITY)).toBe('');
  });

  it('小数を含む金額でも表示できる', () => {
    expect(formatYen(30000.4)).toContain('30,000');
  });
});

describe('想定外の入力', () => {
  it('null や undefined を渡しても入力検証で弾ける', () => {
    expect(isValidInput(null)).toBe(false);
    expect(isValidInput(undefined)).toBe(false);
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(isValidInput('wedding')).toBe(false);
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(isValidInput(42)).toBe(false);
  });

  it('存在しない場面と関係性の組み合わせは0円になる', () => {
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(rawAmount({ ...base, occasion: 'x', relation: 'y' })).toBe(0);
  });

  it('プロトタイプ汚染を狙う値をキーに使っても素通りしない', () => {
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(isValidInput({ ...base, relation: '__proto__' })).toBe(false);
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(isValidInput({ ...base, occasion: 'constructor' })).toBe(false);
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(rawAmount({ ...base, relation: 'toString' })).toBe(0);
  });

  it('URLに危険な値が入っていても取り込まない', () => {
    const cases = [
      '#/calc?o=__proto__&r=constructor',
      '#/calc?o=javascript:alert(1)&r=friend',
      "#/calc?o=wedding&r=friend'; DROP TABLE--",
      '#/calc?o=' + 'a'.repeat(5000)
    ];
    for (const hash of cases) {
      const route = parseHash(hash);
      expect(route.name).toBe('calc');
      if (route.name !== 'calc') continue;
      expect(['wedding', undefined]).toContain(route.input.occasion);
      expect(['friend', undefined]).toContain(route.input.relation);
    }
  });

  it('クイズのトークンに細工をしても復元されない', () => {
    const cases = ['-1', '0', 'zzzzzzzzzzzzzzzz', '__proto__', '1e10', ' vz', 'VZ'];
    for (const token of cases) {
      const decoded = decodeCorrectness(token);
      expect(decoded === null || decoded.length === 10).toBe(true);
    }
  });

  it('クイズに巨大な配列を渡しても設問数だけ採点する', () => {
    const outcome = gradeQuiz(new Array(10000).fill('a'));
    expect(outcome.correctness.length).toBe(10);
  });
});

describe('全組み合わせの網羅', () => {
  it('すべての入力の組み合わせで結果が組み立てられる', () => {
    let count = 0;
    for (const occasion of OCCASIONS) {
      for (const relation of relationsFor(occasion.id)) {
        for (const age of AGE_BANDS) {
          for (const region of REGIONS) {
            for (const attendance of ['attend', 'absent_before', 'absent_sameday'] as const) {
              for (const joint of [false, true]) {
                const input: GiftInput = {
                  occasion: occasion.id,
                  relation: relation.id,
                  age: age.id,
                  region: region.id,
                  attendance,
                  joint
                };
                const result = buildResult(input);
                count += 1;
                expect(result.range.typical).toBeGreaterThan(0);
                expect(result.omotegaki.length).toBeGreaterThan(0);
                expect(result.envelope.grade.length).toBeGreaterThan(0);
                expect(toKanjiAmount(result.range.typical).length).toBeGreaterThan(1);
                // 共有URLに載せて戻したとき、同じ金額になること
                const restored = parseHash(buildCalcHash(input));
                expect(restored.name).toBe('calc');
                if (restored.name !== 'calc') continue;
                expect(isValidInput(restored.input)).toBe(true);
                if (!isValidInput(restored.input)) continue;
                expect(calcRange(restored.input).typical).toBe(result.range.typical);
              }
            }
          }
        }
      }
    }
    expect(count).toBeGreaterThan(2000);
  });
});

describe('境界値', () => {
  it('袋の格は境界の前後で変わる', () => {
    const occasion = OCCASIONS[0];
    expect(buildEnvelopeGuide(occasion, 5000).grade).not.toBe(
      buildEnvelopeGuide(occasion, 5001).grade
    );
    expect(buildEnvelopeGuide(occasion, 30000).grade).not.toBe(
      buildEnvelopeGuide(occasion, 30001).grade
    );
    expect(buildEnvelopeGuide(occasion, 100000).grade).not.toBe(
      buildEnvelopeGuide(occasion, 100001).grade
    );
  });

  it('最年少と最年長で金額が逆転しない', () => {
    for (const occasion of OCCASIONS) {
      for (const relation of relationsFor(occasion.id)) {
        const young = calcRange({
          ...base,
          occasion: occasion.id,
          relation: relation.id,
          age: '20s'
        }).typical;
        const old = calcRange({
          ...base,
          occasion: occasion.id,
          relation: relation.id,
          age: '60plus'
        }).typical;
        expect(old).toBeGreaterThanOrEqual(young);
      }
    }
  });

  it('事前欠席は出席より必ず少なくなるか同額になる', () => {
    const attend = calcRange({ ...base, attendance: 'attend' }).typical;
    const absent = calcRange({ ...base, attendance: 'absent_before' }).typical;
    expect(absent).toBeLessThanOrEqual(attend);
  });

  it('連名は単身以上になる', () => {
    for (const occasion of OCCASIONS.filter((o) => o.asksJoint)) {
      for (const relation of relationsFor(occasion.id)) {
        const single = calcRange({
          ...base,
          occasion: occasion.id,
          relation: relation.id,
          joint: false
        }).typical;
        const joint = calcRange({
          ...base,
          occasion: occasion.id,
          relation: relation.id,
          joint: true
        }).typical;
        expect(joint).toBeGreaterThanOrEqual(single);
      }
    }
  });
});

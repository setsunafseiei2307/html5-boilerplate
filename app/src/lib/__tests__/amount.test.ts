import { describe, expect, it } from 'vitest';
import {
  AMOUNT_GRID,
  auspiciousGrid,
  ageMultiplier,
  attendanceMultiplier,
  buildResult,
  calcRange,
  formatYen,
  isAuspicious,
  isValidInput,
  nearbyTaboos,
  rawAmount,
  regionMultiplier,
  snapToAuspicious,
  stepDown,
  stepUp,
  tabooReason,
  toKanjiAmount
} from '../amount';
import { OCCASIONS, RELATIONS, AGE_BANDS, REGIONS, relationsFor } from '../occasions';
import type { GiftInput } from '../types';

const wedding: GiftInput = {
  occasion: 'wedding',
  relation: 'friend',
  age: '30s',
  region: 'national',
  attendance: 'attend',
  joint: false
};

describe('tabooReason', () => {
  it('4万円は慶弔ともに避ける', () => {
    expect(tabooReason(40000, 'celebration')).toMatch('死');
    expect(tabooReason(40000, 'condolence')).toMatch('死');
  });

  it('9万円は慶弔ともに避ける', () => {
    expect(tabooReason(90000, 'celebration')).toMatch('苦');
    expect(tabooReason(90000, 'condolence')).toMatch('苦');
  });

  it('慶事の偶数万円は避ける対象になる', () => {
    expect(tabooReason(20000, 'celebration')).not.toBeNull();
    expect(tabooReason(60000, 'celebration')).not.toBeNull();
  });

  it('弔事の偶数万円は許容する', () => {
    expect(tabooReason(20000, 'condolence')).toBeNull();
    expect(tabooReason(60000, 'condolence')).toBeNull();
  });

  it('キリのよい10万・20万・100万は慶事でも許容する', () => {
    expect(tabooReason(100000, 'celebration')).toBeNull();
    expect(tabooReason(200000, 'celebration')).toBeNull();
    expect(tabooReason(1000000, 'celebration')).toBeNull();
  });

  it('40万・90万は避ける', () => {
    expect(tabooReason(400000, 'celebration')).not.toBeNull();
    expect(tabooReason(900000, 'condolence')).not.toBeNull();
  });

  it('万に満たない額は奇数偶数の判定対象にしない', () => {
    expect(tabooReason(3000, 'celebration')).toBeNull();
    expect(tabooReason(5000, 'celebration')).toBeNull();
  });

  it('0以下は入力エラーとして扱う', () => {
    expect(tabooReason(0, 'celebration')).not.toBeNull();
    expect(tabooReason(-10000, 'condolence')).not.toBeNull();
  });
});

describe('auspiciousGrid', () => {
  it('慶事のグリッドから偶数万円が除かれる', () => {
    const grid = auspiciousGrid('celebration');
    expect(grid).not.toContain(20000);
    expect(grid).toContain(30000);
    expect(grid).toContain(100000);
  });

  it('弔事のグリッドには2万円が残る', () => {
    expect(auspiciousGrid('condolence')).toContain(20000);
  });

  it('グリッドは昇順である', () => {
    const grid = auspiciousGrid('celebration');
    const sorted = [...grid].sort((a, b) => a - b);
    expect(grid).toEqual(sorted);
  });

  it('全要素が縁起の判定を通る', () => {
    for (const ceremony of ['celebration', 'condolence'] as const) {
      for (const amount of auspiciousGrid(ceremony)) {
        expect(isAuspicious(amount, ceremony)).toBe(true);
      }
    }
  });
});

describe('snapToAuspicious', () => {
  it('近い縁起の良い額に丸める', () => {
    expect(snapToAuspicious(28000, 'celebration')).toBe(30000);
    expect(snapToAuspicious(9000, 'celebration')).toBe(10000);
  });

  it('等距離なら小さいほうを選ぶ', () => {
    // 慶事グリッドでは 10000 と 30000 が隣接し、中点は 20000
    expect(snapToAuspicious(20000, 'celebration')).toBe(10000);
  });

  it('極端に大きい値でも最大値に収まる', () => {
    expect(snapToAuspicious(99999999, 'celebration')).toBe(1000000);
  });

  it('極端に小さい値でも最小値に収まる', () => {
    expect(snapToAuspicious(1, 'celebration')).toBe(3000);
    expect(snapToAuspicious(-5000, 'condolence')).toBe(3000);
  });
});

describe('stepDown / stepUp', () => {
  it('1段階ずつ動く', () => {
    expect(stepDown(30000, 'celebration')).toBe(10000);
    expect(stepUp(30000, 'celebration')).toBe(50000);
  });

  it('端では動かない', () => {
    expect(stepDown(3000, 'celebration')).toBe(3000);
    expect(stepUp(1000000, 'celebration')).toBe(1000000);
  });

  it('グリッドにない値を渡しても壊れない', () => {
    expect(auspiciousGrid('celebration')).toContain(stepDown(12345, 'celebration'));
    expect(auspiciousGrid('celebration')).toContain(stepUp(12345, 'celebration'));
  });
});

describe('係数', () => {
  it('年代の係数は20代が最も低い', () => {
    expect(ageMultiplier('20s')).toBeLessThan(ageMultiplier('30s'));
    expect(ageMultiplier('50s')).toBeGreaterThan(ageMultiplier('30s'));
  });

  it('未知の年代は1倍にフォールバックする', () => {
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(ageMultiplier('999s')).toBe(1);
  });

  it('未知の地域は1倍にフォールバックする', () => {
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(regionMultiplier('atlantis')).toBe(1);
  });

  it('事前欠席だけ大きく下がる', () => {
    expect(attendanceMultiplier('absent_before', true)).toBeLessThan(0.5);
    expect(attendanceMultiplier('absent_sameday', true)).toBe(1);
    expect(attendanceMultiplier('attend', true)).toBe(1);
  });

  it('出欠を尋ねない場面では係数が効かない', () => {
    expect(attendanceMultiplier('absent_before', false)).toBe(1);
  });
});

describe('rawAmount', () => {
  it('30代・全国・出席の友人は基準額そのもの', () => {
    expect(rawAmount(wedding)).toBe(30000);
  });

  it('20代は基準額より低くなる', () => {
    expect(rawAmount({ ...wedding, age: '20s' })).toBeLessThan(30000);
  });

  it('連名は1.8倍になる', () => {
    expect(rawAmount({ ...wedding, joint: true })).toBe(54000);
  });

  it('その場面に存在しない関係性は0を返す', () => {
    expect(rawAmount({ ...wedding, relation: 'parent' })).toBe(0);
  });

  it('未知の場面は0を返す', () => {
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(rawAmount({ ...wedding, occasion: 'moonfestival' })).toBe(0);
  });
});

describe('calcRange', () => {
  it('友人の結婚式は3万円が中心になる', () => {
    const range = calcRange(wedding);
    expect(range.typical).toBe(30000);
    expect(range.min).toBeLessThan(range.typical);
    expect(range.max).toBeGreaterThan(range.typical);
  });

  it('事前欠席は大きく下がる', () => {
    const range = calcRange({ ...wedding, attendance: 'absent_before' });
    expect(range.typical).toBeLessThan(30000);
  });

  it('親の葬儀は10万円が中心になる', () => {
    const range = calcRange({
      occasion: 'funeral',
      relation: 'parent',
      age: '40s',
      region: 'national',
      attendance: 'attend',
      joint: false
    });
    expect(range.typical).toBe(100000);
  });

  it('すべての場面と関係性の組み合わせで縁起の良い額が返る', () => {
    for (const occasion of OCCASIONS) {
      for (const relation of relationsFor(occasion.id)) {
        for (const age of AGE_BANDS) {
          for (const region of REGIONS) {
            const range = calcRange({
              occasion: occasion.id,
              relation: relation.id,
              age: age.id,
              region: region.id,
              attendance: 'attend',
              joint: false
            });
            expect(isAuspicious(range.typical, occasion.ceremony)).toBe(true);
            expect(isAuspicious(range.min, occasion.ceremony)).toBe(true);
            expect(isAuspicious(range.max, occasion.ceremony)).toBe(true);
            expect(range.min).toBeLessThanOrEqual(range.typical);
            expect(range.typical).toBeLessThanOrEqual(range.max);
          }
        }
      }
    }
  });

  it('関係性が不正でも最小額にフォールバックする', () => {
    const range = calcRange({ ...wedding, relation: 'parent' });
    expect(range.typical).toBe(3000);
  });
});

describe('nearbyTaboos', () => {
  it('慶事のレンジ内にある4万円を拾う', () => {
    const taboos = nearbyTaboos({ min: 10000, typical: 30000, max: 50000 }, 'celebration');
    expect(taboos.map((t) => t.amount)).toContain(40000);
    expect(taboos.map((t) => t.amount)).toContain(20000);
  });

  it('弔事では偶数を拾わない', () => {
    const taboos = nearbyTaboos({ min: 10000, typical: 30000, max: 50000 }, 'condolence');
    expect(taboos.map((t) => t.amount)).toContain(40000);
    expect(taboos.map((t) => t.amount)).not.toContain(20000);
  });

  it('レンジが狭ければ何も返らないことがある', () => {
    expect(nearbyTaboos({ min: 3000, typical: 3000, max: 5000 }, 'celebration')).toEqual([]);
  });

  it('金額の昇順で返る', () => {
    const taboos = nearbyTaboos({ min: 3000, typical: 50000, max: 100000 }, 'celebration');
    const amounts = taboos.map((t) => t.amount);
    expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
  });
});

describe('isValidInput', () => {
  it('揃っていれば true', () => {
    expect(isValidInput(wedding)).toBe(true);
  });

  it('欠けていれば false', () => {
    expect(isValidInput({ occasion: 'wedding' })).toBe(false);
    expect(isValidInput({})).toBe(false);
  });

  it('場面に存在しない関係性は false', () => {
    expect(isValidInput({ ...wedding, relation: 'parent' })).toBe(false);
  });
});

describe('buildResult', () => {
  it('結果に必要な要素がすべて揃う', () => {
    const result = buildResult(wedding);
    expect(result.omotegaki).toBe('寿');
    expect(result.envelope.mizuhiki).toMatch('結び切り');
    expect(result.envelope.bill).toMatch('新札');
    expect(result.tips.length).toBeGreaterThan(0);
  });

  it('香典は新札を避ける案内になる', () => {
    const result = buildResult({
      occasion: 'funeral',
      relation: 'friend',
      age: '30s',
      region: 'national',
      attendance: 'attend',
      joint: false
    });
    expect(result.envelope.bill).toMatch('新札は避け');
    expect(result.ceremony).toBe('condolence');
  });

  it('北海道を選ぶと会費制の注意が出る', () => {
    const result = buildResult({ ...wedding, region: 'hokkaido_tohoku' });
    expect(result.notes.join('')).toMatch('会費制');
  });

  it('当日欠席の注意が出る', () => {
    const result = buildResult({ ...wedding, attendance: 'absent_sameday' });
    expect(result.notes.join('')).toMatch('当日の欠席');
  });

  it('連名の注意が出る', () => {
    const result = buildResult({ ...wedding, joint: true });
    expect(result.notes.join('')).toMatch('連名');
  });

  it('上司への慶事では現金以外の選択肢を案内する', () => {
    const result = buildResult({ ...wedding, relation: 'boss' });
    expect(result.notes.join('')).toMatch('目上');
  });
});

describe('formatYen', () => {
  it('3桁区切りで表示する', () => {
    expect(formatYen(30000)).toBe('30,000円');
    expect(formatYen(0)).toBe('0円');
    expect(formatYen(1000000)).toBe('1,000,000円');
  });
});

describe('toKanjiAmount', () => {
  it('主要な額を旧字体にする', () => {
    expect(toKanjiAmount(3000)).toBe('参仟円');
    expect(toKanjiAmount(5000)).toBe('伍仟円');
    expect(toKanjiAmount(10000)).toBe('壱萬円');
    expect(toKanjiAmount(30000)).toBe('参萬円');
    expect(toKanjiAmount(50000)).toBe('伍萬円');
    expect(toKanjiAmount(70000)).toBe('七萬円');
    expect(toKanjiAmount(100000)).toBe('拾萬円');
    expect(toKanjiAmount(150000)).toBe('拾伍萬円');
    expect(toKanjiAmount(200000)).toBe('弐拾萬円');
    expect(toKanjiAmount(300000)).toBe('参拾萬円');
    expect(toKanjiAmount(1000000)).toBe('壱佰萬円');
  });

  it('0以下と非数は空文字を返す', () => {
    expect(toKanjiAmount(0)).toBe('');
    expect(toKanjiAmount(-1)).toBe('');
    expect(toKanjiAmount(Number.NaN)).toBe('');
  });

  it('千円未満は切り捨てる', () => {
    expect(toKanjiAmount(500)).toBe('');
    expect(toKanjiAmount(30500)).toBe('参萬円');
  });

  it('グリッド上の全額が空にならない', () => {
    for (const amount of AMOUNT_GRID) {
      expect(toKanjiAmount(amount).length).toBeGreaterThan(1);
    }
  });
});

describe('マスタデータの整合性', () => {
  it('場面の基準額に使われる関係性がすべて RELATIONS に存在する', () => {
    const known = new Set(RELATIONS.map((r) => r.id));
    for (const occasion of OCCASIONS) {
      for (const key of Object.keys(occasion.base)) {
        expect(known.has(key as never)).toBe(true);
      }
    }
  });

  it('すべての場面に1つ以上の関係性がある', () => {
    for (const occasion of OCCASIONS) {
      expect(relationsFor(occasion.id).length).toBeGreaterThan(0);
    }
  });

  it('未知の場面には関係性が返らない', () => {
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(relationsFor('moonfestival')).toEqual([]);
  });

  it('場面ごとに作法メモが3件ある', () => {
    for (const occasion of OCCASIONS) {
      expect(occasion.tips.length).toBe(3);
    }
  });
});

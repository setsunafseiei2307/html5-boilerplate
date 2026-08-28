import { describe, expect, it } from 'vitest';
import {
  billRule,
  buildEnvelopeGuide,
  condolenceEnvelopeGrade,
  envelopeGrade,
  innerEnvelopeRule,
  mizuhikiDescription
} from '../etiquette';
import { OCCASIONS, OCCASION_MAP } from '../occasions';
import { DISCLOSURE, QUIZ_OFFERS, isPlaceholder, offersFor } from '../affiliate';

describe('envelopeGrade', () => {
  it('金額が上がるほど袋の格も上がる', () => {
    const grades = [3000, 10000, 50000, 300000].map(envelopeGrade);
    expect(new Set(grades).size).toBe(4);
  });

  it('境界値でも文字列が返る', () => {
    for (const amount of [0, 5000, 5001, 30000, 30001, 100000, 100001, 10 ** 9]) {
      expect(envelopeGrade(amount).length).toBeGreaterThan(0);
      expect(condolenceEnvelopeGrade(amount).length).toBeGreaterThan(0);
    }
  });
});

describe('mizuhikiDescription', () => {
  it('結婚式は結び切り', () => {
    expect(mizuhikiDescription(OCCASION_MAP.wedding, 30000)).toMatch('結び切り');
  });

  it('出産祝いは蝶結び', () => {
    expect(mizuhikiDescription(OCCASION_MAP.baby, 10000)).toMatch('蝶結び');
  });

  it('弔事は黒白か双銀', () => {
    expect(mizuhikiDescription(OCCASION_MAP.funeral, 5000)).toMatch('黒白');
    expect(mizuhikiDescription(OCCASION_MAP.funeral, 50000)).toMatch('双銀');
  });

  it('お見舞いは結び切りを案内する', () => {
    expect(mizuhikiDescription(OCCASION_MAP.sickvisit, 5000)).toMatch('結び切り');
  });

  it('すべての場面で説明が返る', () => {
    for (const occasion of OCCASIONS) {
      expect(mizuhikiDescription(occasion, 10000).length).toBeGreaterThan(0);
    }
  });
});

describe('billRule / innerEnvelopeRule', () => {
  it('弔事は新札を避ける', () => {
    expect(billRule(OCCASION_MAP.funeral)).toMatch('新札は避け');
  });

  it('慶事は新札を用意する', () => {
    expect(billRule(OCCASION_MAP.wedding)).toMatch('新札を用意');
  });

  it('弔事の中袋には住所氏名が必須と案内する', () => {
    expect(innerEnvelopeRule(OCCASION_MAP.funeral)).toMatch('香典返し');
  });
});

describe('buildEnvelopeGuide', () => {
  it('すべての場面と代表的な金額で4項目が埋まる', () => {
    for (const occasion of OCCASIONS) {
      for (const amount of [3000, 10000, 50000, 300000]) {
        const guide = buildEnvelopeGuide(occasion, amount);
        expect(guide.grade).toBeTruthy();
        expect(guide.mizuhiki).toBeTruthy();
        expect(guide.bill).toBeTruthy();
        expect(guide.inner).toBeTruthy();
      }
    }
  });
});

describe('アフィリエイト枠', () => {
  it('すべての場面に1つ以上の枠がある', () => {
    for (const occasion of OCCASIONS) {
      expect(offersFor(occasion.id).length).toBeGreaterThan(0);
    }
  });

  it('未知の場面では空配列を返す', () => {
    // @ts-expect-error 想定外の入力を意図的に渡す
    expect(offersFor('moonfestival')).toEqual([]);
  });

  it('枠の id が全体で重複していない', () => {
    const ids = OCCASIONS.flatMap((o) => offersFor(o.id).map((x) => `${o.id}:${x.id}`));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('差し替え前はすべてダミー扱いになる', () => {
    for (const occasion of OCCASIONS) {
      for (const offer of offersFor(occasion.id)) {
        expect(isPlaceholder(offer)).toBe(true);
      }
    }
    for (const offer of QUIZ_OFFERS) {
      expect(isPlaceholder(offer)).toBe(true);
    }
  });

  it('実 URL に差し替えたものはダミー扱いにならない', () => {
    expect(
      isPlaceholder({ ...QUIZ_OFFERS[0], url: 'https://example.com/affiliate' })
    ).toBe(false);
  });

  it('広告であることの表記がある', () => {
    expect(DISCLOSURE).toMatch('広告');
  });

  it('すべての枠に文言が揃っている', () => {
    const all = [...OCCASIONS.flatMap((o) => offersFor(o.id)), ...QUIZ_OFFERS];
    for (const offer of all) {
      expect(offer.title.length).toBeGreaterThan(0);
      expect(offer.body.length).toBeGreaterThan(0);
      expect(offer.cta.length).toBeGreaterThan(0);
      expect(offer.tag.length).toBeGreaterThan(0);
    }
  });
});

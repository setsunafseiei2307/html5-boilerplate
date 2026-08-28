import { describe, expect, it } from 'vitest';
import {
  QUIZ_QUESTIONS,
  QUIZ_RANKS,
  decodeCorrectness,
  encodeCorrectness,
  gradeQuiz,
  outcomeFromCorrectness,
  rankFor,
  toDeviationScore,
  topPercentile
} from '../quiz';

const allCorrect = QUIZ_QUESTIONS.map((q) => q.answerId);

describe('設問データ', () => {
  it('10問ある', () => {
    expect(QUIZ_QUESTIONS.length).toBe(10);
  });

  it('id が重複していない', () => {
    const ids = QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('各問に選択肢が4つあり、正解がその中にある', () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.choices.length).toBe(4);
      expect(q.choices.some((c) => c.id === q.answerId)).toBe(true);
      const choiceIds = q.choices.map((c) => c.id);
      expect(new Set(choiceIds).size).toBe(4);
    }
  });

  it('各問に解説がある', () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.explanation.length).toBeGreaterThan(10);
    }
  });
});

describe('toDeviationScore', () => {
  it('全問正解で75、全問不正解で30', () => {
    expect(toDeviationScore(10)).toBe(75);
    expect(toDeviationScore(0)).toBe(30);
  });

  it('単調に増加する', () => {
    for (let i = 1; i <= 10; i += 1) {
      expect(toDeviationScore(i)).toBeGreaterThan(toDeviationScore(i - 1));
    }
  });

  it('範囲外の値でも端に丸める', () => {
    expect(toDeviationScore(999)).toBe(75);
    expect(toDeviationScore(-5)).toBe(30);
  });
});

describe('rankFor', () => {
  it('最高点は最上位の称号になる', () => {
    expect(rankFor(75).title).toBe(QUIZ_RANKS[0].title);
  });

  it('最低点でも称号が返る', () => {
    expect(rankFor(0).title).toBeTruthy();
    expect(rankFor(-100).title).toBeTruthy();
  });

  it('すべての偏差値で称号が決まる', () => {
    for (let d = 0; d <= 100; d += 1) {
      expect(rankFor(d)).toBeDefined();
    }
  });

  it('称号の閾値は降順に並んでいる', () => {
    for (let i = 1; i < QUIZ_RANKS.length; i += 1) {
      expect(QUIZ_RANKS[i].from).toBeLessThan(QUIZ_RANKS[i - 1].from);
    }
  });
});

describe('topPercentile', () => {
  it('偏差値50はおよそ上位50%', () => {
    expect(topPercentile(50)).toBe(50);
  });

  it('高いほど上位のパーセンタイルになる', () => {
    expect(topPercentile(75)).toBeLessThan(topPercentile(50));
    expect(topPercentile(30)).toBeGreaterThan(topPercentile(50));
  });

  it('1〜99の範囲に収まる', () => {
    for (const d of [-100, 0, 30, 50, 75, 200]) {
      const p = topPercentile(d);
      expect(p).toBeGreaterThanOrEqual(1);
      expect(p).toBeLessThanOrEqual(99);
    }
  });
});

describe('gradeQuiz', () => {
  it('全問正解を採点できる', () => {
    const outcome = gradeQuiz(allCorrect);
    expect(outcome.correctCount).toBe(10);
    expect(outcome.deviation).toBe(75);
    expect(outcome.correctness.every(Boolean)).toBe(true);
  });

  it('全問不正解を採点できる', () => {
    const wrong = QUIZ_QUESTIONS.map(
      (q) => q.choices.find((c) => c.id !== q.answerId)!.id
    );
    const outcome = gradeQuiz(wrong);
    expect(outcome.correctCount).toBe(0);
    expect(outcome.deviation).toBe(30);
  });

  it('未回答は不正解として扱う', () => {
    const outcome = gradeQuiz([]);
    expect(outcome.correctCount).toBe(0);
    expect(outcome.correctness.length).toBe(10);
  });

  it('null を含む回答も落ちない', () => {
    const partial: (string | null)[] = [...allCorrect];
    partial[3] = null;
    partial[7] = null;
    expect(gradeQuiz(partial).correctCount).toBe(8);
  });

  it('想定外の選択肢 id は不正解になる', () => {
    const outcome = gradeQuiz(QUIZ_QUESTIONS.map(() => 'zzz'));
    expect(outcome.correctCount).toBe(0);
  });

  it('余分な回答があっても設問数だけ採点する', () => {
    const outcome = gradeQuiz([...allCorrect, 'a', 'b', 'c']);
    expect(outcome.correctness.length).toBe(10);
    expect(outcome.correctCount).toBe(10);
  });
});

describe('正誤のエンコード', () => {
  it('往復して同じ結果になる', () => {
    const patterns: boolean[][] = [
      QUIZ_QUESTIONS.map(() => true),
      QUIZ_QUESTIONS.map(() => false),
      QUIZ_QUESTIONS.map((_, i) => i % 2 === 0),
      QUIZ_QUESTIONS.map((_, i) => i === 9)
    ];
    for (const pattern of patterns) {
      const token = encodeCorrectness(pattern);
      expect(decodeCorrectness(token)).toEqual(pattern);
    }
  });

  it('全2^10通りを往復できる', () => {
    for (let mask = 0; mask < 1024; mask += 1) {
      const pattern = QUIZ_QUESTIONS.map((_, i) => (mask & (1 << i)) !== 0);
      expect(decodeCorrectness(encodeCorrectness(pattern))).toEqual(pattern);
    }
  });

  it('全問不正解でも空文字にならない', () => {
    expect(encodeCorrectness(QUIZ_QUESTIONS.map(() => false)).length).toBeGreaterThan(0);
  });

  it('壊れたトークンは null を返す', () => {
    expect(decodeCorrectness('')).toBeNull();
    expect(decodeCorrectness('!!!')).toBeNull();
    expect(decodeCorrectness('zzzzzzzz')).toBeNull();
    expect(decodeCorrectness('1')).toBeNull();
    expect(decodeCorrectness('<script>')).toBeNull();
  });
});

describe('outcomeFromCorrectness', () => {
  it('共有 URL から復元した結果が採点と一致する', () => {
    const graded = gradeQuiz(allCorrect);
    const restored = outcomeFromCorrectness(
      decodeCorrectness(encodeCorrectness(graded.correctness))!
    );
    expect(restored.correctCount).toBe(graded.correctCount);
    expect(restored.deviation).toBe(graded.deviation);
    expect(restored.rank.title).toBe(graded.rank.title);
  });
});

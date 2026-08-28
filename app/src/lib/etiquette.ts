import type { EnvelopeGuide, Occasion } from './types';

/**
 * 包む金額に対して、袋の格を合わせるのが作法。
 * 5千円の中身に金銀の豪華な袋を使うと「袋負け」して見える。
 */
export function envelopeGrade(amount: number): string {
  if (amount <= 5000) return '水引が印刷された略式の祝儀袋';
  if (amount <= 30000) return '水引が掛かった一般的な祝儀袋';
  if (amount <= 100000) return '和紙が厚く、水引が立体的な中格の袋';
  return '檀紙・多当折りの最上格の袋';
}

/** 香典袋は金額より「格」と宗派で選ぶ。 */
export function condolenceEnvelopeGrade(amount: number): string {
  if (amount <= 5000) return '水引が印刷された略式の不祝儀袋';
  if (amount <= 30000) return '黒白または双銀の水引が掛かった不祝儀袋';
  return '双銀の水引、高級和紙の不祝儀袋';
}

export function mizuhikiDescription(occasion: Occasion, amount: number): string {
  if (occasion.ceremony === 'condolence') {
    const color = amount >= 30000 ? '双銀' : '黒白';
    return `${color}・結び切り（10本）／関西では黄白を使う地域もあります`;
  }
  if (occasion.id === 'wedding') {
    const color = amount >= 30000 ? '金銀' : '紅白';
    return `${color}・結び切り（10本）／ほどけない結びで「一度きり」を表します`;
  }
  if (occasion.id === 'sickvisit') {
    return '紅白・結び切り（5本）／水引なしの白封筒でも構いません';
  }
  return '紅白・蝶結び（5本または7本）／何度あってもよいお祝いに使います';
}

export function billRule(occasion: Occasion): string {
  if (occasion.ceremony === 'condolence') {
    return '新札は避けます。新札しかないときは、縦に一度折って折り目をつけてから入れます。';
  }
  if (occasion.id === 'sickvisit') {
    return '新札で構いませんが、「用意して待っていた」印象を避けたい相手には一度折り目をつけます。';
  }
  return '新札を用意します。肖像画が表向き・上側にくるようにそろえて入れます。';
}

export function innerEnvelopeRule(occasion: Occasion): string {
  if (occasion.ceremony === 'condolence') {
    return '中袋の表に金額、裏に住所と氏名を書きます。喪家が香典返しを用意するための情報なので、必ず記入します。';
  }
  return '中袋の表中央に金額を旧字体で、裏の左下に住所と氏名を書きます。中袋がない袋は裏面に直接書きます。';
}

export function buildEnvelopeGuide(occasion: Occasion, amount: number): EnvelopeGuide {
  return {
    grade:
      occasion.ceremony === 'condolence'
        ? condolenceEnvelopeGrade(amount)
        : envelopeGrade(amount),
    mizuhiki: mizuhikiDescription(occasion, amount),
    bill: billRule(occasion),
    inner: innerEnvelopeRule(occasion)
  };
}

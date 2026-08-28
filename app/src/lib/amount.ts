import { AGE_BANDS, OCCASION_MAP, REGION_MAP, RELATION_MAP } from './occasions';
import type {
  AgeBandId,
  AmountRange,
  AttendanceId,
  Ceremony,
  GiftInput,
  GiftResult,
  RegionId,
  Taboo
} from './types';
import { buildEnvelopeGuide } from './etiquette';

/**
 * 実際にご祝儀・香典で使われる金額の刻み。
 * この配列にない額（2万5千円など）は「中途半端」とされるため候補にしない。
 */
export const AMOUNT_GRID = [
  3000, 5000, 10000, 20000, 30000, 50000, 70000, 100000, 150000, 200000, 300000,
  500000, 1000000
];

/**
 * 金額の縁起を判定する。問題があれば理由を、なければ null を返す。
 * 万単位の先頭の数字だけを見る（4万・9万は不可、3万5千円のような端数は対象外）。
 */
export function tabooReason(amount: number, ceremony: Ceremony): string | null {
  if (amount <= 0) return '金額は1円以上で指定してください。';
  const man = amount / 10000;
  if (Number.isInteger(man)) {
    if (man === 4) return '「4」は「死」を連想させるため、慶弔ともに避けます。';
    if (man === 9) return '「9」は「苦」を連想させるため、慶弔ともに避けます。';
    if (man === 40) return '「4」を含む万単位は「死」を連想させるため避けます。';
    if (man === 90) return '「9」を含む万単位は「苦」を連想させるため避けます。';
  }
  if (ceremony === 'celebration' && Number.isInteger(man) && man >= 2) {
    // 10万・20万などキリのよい額は「割れない」ものとして許容されている。
    const isRoundHundredThousand = man % 10 === 0;
    if (!isRoundHundredThousand && man % 2 === 0) {
      return `${man}万円は割り切れる偶数のため、「縁が切れる」として避ける人がいます。`;
    }
  }
  return null;
}

/** その金額が縁起のうえで使えるか。 */
export function isAuspicious(amount: number, ceremony: Ceremony): boolean {
  return tabooReason(amount, ceremony) === null;
}

/** 縁起の良い金額だけを小さい順に並べたもの。 */
export function auspiciousGrid(ceremony: Ceremony): number[] {
  return AMOUNT_GRID.filter((a) => isAuspicious(a, ceremony));
}

/**
 * 任意の金額を、最も近い「縁起の良い刻み」に丸める。
 * 同じ距離なら小さいほうを選ぶ（包みすぎて相手に気を遣わせないため）。
 */
export function snapToAuspicious(amount: number, ceremony: Ceremony): number {
  const grid = auspiciousGrid(ceremony);
  if (grid.length === 0) return amount;
  let best = grid[0];
  let bestDistance = Math.abs(amount - best);
  for (const candidate of grid) {
    const distance = Math.abs(amount - candidate);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
}

/** グリッド上で1段階だけ下の縁起の良い金額。最小値ならそのまま。 */
export function stepDown(amount: number, ceremony: Ceremony): number {
  const grid = auspiciousGrid(ceremony);
  const index = grid.indexOf(amount);
  if (index <= 0) return grid[0] ?? amount;
  return grid[index - 1];
}

/** グリッド上で1段階だけ上の縁起の良い金額。最大値ならそのまま。 */
export function stepUp(amount: number, ceremony: Ceremony): number {
  const grid = auspiciousGrid(ceremony);
  const index = grid.indexOf(amount);
  if (index < 0 || index >= grid.length - 1) return grid[grid.length - 1] ?? amount;
  return grid[index + 1];
}

export function ageMultiplier(age: AgeBandId): number {
  return AGE_BANDS.find((b) => b.id === age)?.multiplier ?? 1;
}

export function regionMultiplier(region: RegionId): number {
  return REGION_MAP[region]?.multiplier ?? 1;
}

/**
 * 結婚式の出欠による係数。
 * 欠席を事前に伝えた場合は食事・引出物の分が不要になるため大きく下がるが、
 * 当日の欠席は先方の負担が発生済みなので満額を包む。
 */
export function attendanceMultiplier(
  attendance: AttendanceId,
  asksAttendance: boolean
): number {
  if (!asksAttendance) return 1;
  switch (attendance) {
    case 'absent_before':
      return 0.35;
    case 'absent_sameday':
      return 1;
    case 'attend':
    default:
      return 1;
  }
}

/** 生の推奨額（丸める前）を返す。テストしやすいよう独立させている。 */
export function rawAmount(input: GiftInput): number {
  const occasion = OCCASION_MAP[input.occasion];
  if (!occasion) return 0;
  const base = occasion.base[input.relation];
  if (base === undefined) return 0;

  let amount = base;
  amount *= ageMultiplier(input.age);
  amount *= regionMultiplier(input.region);
  amount *= attendanceMultiplier(input.attendance, occasion.asksAttendance);
  if (input.joint && occasion.asksJoint) {
    // 連名は単純な2倍ではなく、一人あたりを少し抑えるのが通例。
    amount *= 1.8;
  }
  return Math.round(amount);
}

/** 推奨額と、その上下1段階を含むレンジを返す。 */
export function calcRange(input: GiftInput): AmountRange {
  const occasion = OCCASION_MAP[input.occasion];
  const ceremony: Ceremony = occasion?.ceremony ?? 'celebration';
  const raw = rawAmount(input);
  if (raw <= 0) {
    const grid = auspiciousGrid(ceremony);
    return { min: grid[0], typical: grid[0], max: grid[0] };
  }
  const typical = snapToAuspicious(raw, ceremony);
  return {
    min: stepDown(typical, ceremony),
    typical,
    max: stepUp(typical, ceremony)
  };
}

/** レンジの周辺で「避けるべき額」を列挙する。 */
export function nearbyTaboos(range: AmountRange, ceremony: Ceremony): Taboo[] {
  const taboos: Taboo[] = [];
  for (const amount of AMOUNT_GRID) {
    if (amount < range.min || amount > range.max) continue;
    const reason = tabooReason(amount, ceremony);
    if (reason) taboos.push({ amount, reason });
  }
  // グリッドに載らないが誤りやすい額を明示的に補う。
  for (const amount of [40000, 90000]) {
    if (amount >= range.min && amount <= range.max) {
      const reason = tabooReason(amount, ceremony);
      if (reason && !taboos.some((t) => t.amount === amount)) {
        taboos.push({ amount, reason });
      }
    }
  }
  return taboos.sort((a, b) => a.amount - b.amount);
}

/** 入力が成立するか（その場面にその関係性の基準額があるか）。 */
export function isValidInput(input: Partial<GiftInput>): input is GiftInput {
  if (!input.occasion || !input.relation || !input.age || !input.region) return false;
  const occasion = OCCASION_MAP[input.occasion];
  if (!occasion) return false;
  return occasion.base[input.relation] !== undefined;
}

/** 画面に出すすべての情報を組み立てる。 */
export function buildResult(input: GiftInput): GiftResult {
  const occasion = OCCASION_MAP[input.occasion];
  const relation = RELATION_MAP[input.relation];
  const range = calcRange(input);
  const notes: string[] = [];

  const regionNote = REGION_MAP[input.region]?.note;
  if (regionNote) notes.push(regionNote);

  if (occasion.asksAttendance && input.attendance === 'absent_before') {
    notes.push(
      '欠席を事前に伝えた場合は、出席時の3分の1程度が目安です。式の前に現金書留か手渡しで届けます。'
    );
  }
  if (occasion.asksAttendance && input.attendance === 'absent_sameday') {
    notes.push(
      '当日の欠席は、料理も引出物もすでに用意されています。出席したときと同額を包みます。'
    );
  }
  if (input.joint && occasion.asksJoint) {
    notes.push(
      '連名で包むときは、中袋に全員の氏名と、目上の人が右にくる順で書きます。3名を超える場合は代表者名＋「他一同」とし、別紙に全員の氏名を入れます。'
    );
  }
  if (input.relation === 'boss' && occasion.ceremony === 'celebration') {
    notes.push(
      '目上の方へ現金を贈るのは失礼にあたるという考え方もあります。品物やギフト券に替えると角が立ちません。'
    );
  }

  return {
    input,
    occasion,
    relation,
    range,
    ceremony: occasion.ceremony,
    omotegaki: occasion.omotegaki,
    omotegakiAlternatives: occasion.omotegakiAlternatives,
    envelope: buildEnvelopeGuide(occasion, range.typical),
    taboos: nearbyTaboos(range, occasion.ceremony),
    notes,
    tips: occasion.tips
  };
}

/** 3000 → 「3,000円」 */
export function formatYen(amount: number): string {
  return `${amount.toLocaleString('ja-JP')}円`;
}

/** 30000 → 「参萬円」。中袋に書く旧字体。 */
export function toKanjiAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return '';
  const target = Math.floor(amount);
  const digits = ['〇', '壱', '弐', '参', '四', '伍', '六', '七', '八', '九'];

  // 1〜999 を「弐佰参拾伍」のような旧字体表記にする。
  const smallToKanji = (n: number): string => {
    if (n <= 0) return '';
    const hundreds = Math.floor(n / 100);
    const tens = Math.floor((n % 100) / 10);
    const ones = n % 10;
    let out = '';
    // 百の位は1でも「壱佰」と書く。十の位は「拾」単独が慣例。
    if (hundreds > 0) out += digits[hundreds] + '佰';
    if (tens > 0) out += (tens > 1 ? digits[tens] : '') + '拾';
    if (ones > 0) out += digits[ones];
    return out;
  };

  const units: { value: number; label: string }[] = [
    { value: 100000000, label: '億' },
    { value: 10000, label: '萬' },
    { value: 1000, label: '仟' }
  ];

  let rest = target;
  let out = '';
  for (const unit of units) {
    const count = Math.floor(rest / unit.value);
    if (count > 0) {
      out += smallToKanji(count) + unit.label;
      rest -= count * unit.value;
    }
  }
  // 千円未満の端数は祝儀・不祝儀では扱わないため切り捨てる。
  return out ? `${out}円` : '';
}

/** 慶事（お祝い）か弔事（お悔やみ）か。金額の禁忌や新札の扱いが変わる。 */
export type Ceremony = 'celebration' | 'condolence';

/** 水引の結び方。繰り返してよい祝い事は蝶結び、一度きりの慶弔は結び切り。 */
export type MizuhikiKnot = 'chomusubi' | 'musubikiri';

export type OccasionId =
  | 'wedding'
  | 'funeral'
  | 'baby'
  | 'entrance'
  | 'newhome'
  | 'sickvisit'
  | 'longevity'
  | 'opening';

export type RelationId =
  | 'parent'
  | 'child'
  | 'sibling'
  | 'grandparent'
  | 'grandchild'
  | 'uncle'
  | 'nephew'
  | 'cousin'
  | 'friend'
  | 'colleague'
  | 'boss'
  | 'subordinate'
  | 'neighbor'
  | 'client';

export type AgeBandId = '20s' | '30s' | '40s' | '50s' | '60plus';

export type RegionId =
  | 'national'
  | 'hokkaido_tohoku'
  | 'kanto'
  | 'chubu'
  | 'kinki'
  | 'chugoku_shikoku'
  | 'kyushu_okinawa';

/** 出席の状態。結婚式のみ金額に影響する。 */
export type AttendanceId = 'attend' | 'absent_before' | 'absent_sameday';

export interface Occasion {
  id: OccasionId;
  /** 一覧に出す短い名前 */
  label: string;
  /** 補足の一行 */
  caption: string;
  ceremony: Ceremony;
  knot: MizuhikiKnot;
  /** 表書きの第一候補 */
  omotegaki: string;
  /** 表書きの代替候補（宗派・時期違いなど） */
  omotegakiAlternatives: { label: string; note: string }[];
  /** この場面で選べる関係性と、その基準額（円） */
  base: Partial<Record<RelationId, number>>;
  /** 出席の有無を尋ねるか */
  asksAttendance: boolean;
  /** 夫婦・連名の選択肢を出すか */
  asksJoint: boolean;
  /** 結果カードに出す作法メモ */
  tips: string[];
  /** SVG アイコンの識別子 */
  icon: 'ring' | 'incense' | 'stork' | 'satchel' | 'house' | 'flower' | 'crane' | 'noren';
}

export interface Relation {
  id: RelationId;
  label: string;
  /** 「自分から見た相手」であることを示す補足 */
  hint: string;
}

export interface AgeBand {
  id: AgeBandId;
  label: string;
  multiplier: number;
}

export interface Region {
  id: RegionId;
  label: string;
  multiplier: number;
  note?: string;
}

/** 計算の入力。すべて URL に載せられる素の値だけで構成する。 */
export interface GiftInput {
  occasion: OccasionId;
  relation: RelationId;
  age: AgeBandId;
  region: RegionId;
  attendance: AttendanceId;
  /** 夫婦・連名で包むか */
  joint: boolean;
}

export interface AmountRange {
  min: number;
  typical: number;
  max: number;
}

export interface Taboo {
  amount: number;
  reason: string;
}

export interface EnvelopeGuide {
  /** 袋の格 */
  grade: string;
  /** 水引の色と本数 */
  mizuhiki: string;
  /** 新札を使うか */
  bill: string;
  /** 中袋の書き方 */
  inner: string;
}

export interface GiftResult {
  input: GiftInput;
  occasion: Occasion;
  relation: Relation;
  range: AmountRange;
  ceremony: Ceremony;
  omotegaki: string;
  omotegakiAlternatives: { label: string; note: string }[];
  envelope: EnvelopeGuide;
  /** 避けるべき金額とその理由 */
  taboos: Taboo[];
  /** 地域や条件から出る注意書き */
  notes: string[];
  tips: string[];
}

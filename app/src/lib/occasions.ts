import type {
  AgeBand,
  Occasion,
  OccasionId,
  Region,
  Relation,
  RelationId
} from './types';

export const RELATIONS: Relation[] = [
  { id: 'parent', label: '親', hint: '自分の父・母' },
  { id: 'child', label: '子', hint: '自分の息子・娘' },
  { id: 'sibling', label: '兄弟姉妹', hint: '自分の兄・姉・弟・妹' },
  { id: 'grandparent', label: '祖父母', hint: '自分の祖父・祖母' },
  { id: 'grandchild', label: '孫', hint: '自分の孫' },
  { id: 'uncle', label: 'おじ・おば', hint: '親のきょうだい' },
  { id: 'nephew', label: '甥・姪', hint: 'きょうだいの子' },
  { id: 'cousin', label: 'いとこ・その他の親族', hint: '上記以外の親戚' },
  { id: 'friend', label: '友人', hint: '学生時代からの友人など' },
  { id: 'colleague', label: '職場の同僚', hint: '同じ立場で働く人' },
  { id: 'boss', label: '上司', hint: '自分より上の立場の人' },
  { id: 'subordinate', label: '部下・後輩', hint: '自分より下の立場の人' },
  { id: 'neighbor', label: '近所・知人', hint: 'ご近所や顔見知り' },
  { id: 'client', label: '取引先', hint: '仕事上のおつきあい' }
];

export const RELATION_MAP: Record<RelationId, Relation> = RELATIONS.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<RelationId, Relation>
);

export const AGE_BANDS: AgeBand[] = [
  { id: '20s', label: '20代', multiplier: 0.72 },
  { id: '30s', label: '30代', multiplier: 1 },
  { id: '40s', label: '40代', multiplier: 1.18 },
  { id: '50s', label: '50代', multiplier: 1.32 },
  { id: '60plus', label: '60代以上', multiplier: 1.32 }
];

export const REGIONS: Region[] = [
  { id: 'national', label: '全国平均', multiplier: 1 },
  {
    id: 'hokkaido_tohoku',
    label: '北海道・東北',
    multiplier: 0.9,
    note: '北海道は結婚式が「会費制」の地域が多く、その場合は案内状の会費をそのまま持参します。ご祝儀は不要です。'
  },
  { id: 'kanto', label: '関東', multiplier: 1.05 },
  {
    id: 'chubu',
    label: '中部・東海',
    multiplier: 1.12,
    note: '東海地方は祝儀の相場が全国より高めに出る傾向があります。周囲と足並みをそろえられるなら、そちらを優先してください。'
  },
  { id: 'kinki', label: '近畿', multiplier: 1 },
  { id: 'chugoku_shikoku', label: '中国・四国', multiplier: 0.95 },
  {
    id: 'kyushu_okinawa',
    label: '九州・沖縄',
    multiplier: 0.95,
    note: '沖縄は披露宴の規模が大きく、友人・同僚は1万円前後が一般的です。表示額より控えめでも失礼にあたりません。'
  }
];

export const REGION_MAP: Record<string, Region> = REGIONS.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<string, Region>
);

export const OCCASIONS: Occasion[] = [
  {
    id: 'wedding',
    label: '結婚祝い',
    caption: 'ご祝儀',
    ceremony: 'celebration',
    knot: 'musubikiri',
    omotegaki: '寿',
    omotegakiAlternatives: [
      { label: '御祝', note: '式に出ない場合や、贈り物に添えるときはこちら。' },
      { label: '御結婚御祝', note: '四文字を避けたいときは「御結婚お祝」と書きます。' }
    ],
    base: {
      child: 100000,
      sibling: 50000,
      grandchild: 70000,
      nephew: 50000,
      cousin: 30000,
      friend: 30000,
      colleague: 30000,
      boss: 30000,
      subordinate: 30000,
      neighbor: 30000,
      client: 30000
    },
    asksAttendance: true,
    asksJoint: true,
    tips: [
      '受付では袱紗（ふくさ）から出して、相手に文字が読める向きで両手で渡します。',
      '新札を用意し、肖像画が表・上にくるように入れます。',
      '中袋の金額は「金参萬円」のように旧字体で書くのが正式です。'
    ],
    icon: 'ring'
  },
  {
    id: 'funeral',
    label: '葬儀・法要',
    caption: '香典',
    ceremony: 'condolence',
    knot: 'musubikiri',
    omotegaki: '御霊前',
    omotegakiAlternatives: [
      { label: '御仏前', note: '四十九日の法要以降、および浄土真宗では通夜から「御仏前」を使います。' },
      { label: '御玉串料', note: '神式のとき。「御榊料」でも構いません。' },
      { label: 'お花料', note: 'キリスト教式のとき。宗派が分からなければ「御霊前」が無難です。' }
    ],
    base: {
      parent: 100000,
      child: 100000,
      sibling: 50000,
      grandparent: 10000,
      grandchild: 50000,
      uncle: 10000,
      nephew: 10000,
      cousin: 10000,
      friend: 5000,
      colleague: 5000,
      boss: 5000,
      subordinate: 5000,
      neighbor: 5000,
      client: 10000
    },
    asksAttendance: false,
    asksJoint: true,
    tips: [
      '香典は新札を避けます。新札しかないときは一度折り目をつけてから入れます。',
      '「重ね重ね」「たびたび」など繰り返す言葉は口にしません。',
      '表書きは薄墨で書きます。「涙で墨が薄まった」という弔意の表し方です。'
    ],
    icon: 'incense'
  },
  {
    id: 'baby',
    label: '出産祝い',
    caption: 'ご出産のお祝い',
    ceremony: 'celebration',
    knot: 'chomusubi',
    omotegaki: '御出産御祝',
    omotegakiAlternatives: [
      { label: '御祝', note: '短くまとめたいときはこちら。' },
      { label: '祝御出産', note: '四文字を避ける必要はなく、出産祝いでは一般的です。' }
    ],
    base: {
      child: 30000,
      sibling: 10000,
      grandchild: 30000,
      nephew: 10000,
      cousin: 5000,
      friend: 10000,
      colleague: 5000,
      boss: 5000,
      subordinate: 5000,
      neighbor: 3000
    },
    asksAttendance: false,
    asksJoint: false,
    tips: [
      '生後7日〜1か月のあいだに贈るのが目安です。退院直後は避けます。',
      '母子の体調が最優先。訪問は必ず事前に都合を確認してからにします。',
      '現金と品物を組み合わせるなら、合計が相場の範囲に収まるようにします。'
    ],
    icon: 'stork'
  },
  {
    id: 'entrance',
    label: '入学・進学祝い',
    caption: '入園・入学・卒業',
    ceremony: 'celebration',
    knot: 'chomusubi',
    omotegaki: '御入学御祝',
    omotegakiAlternatives: [
      { label: '御祝', note: '入園・卒業・就職などをまとめて贈るときに。' },
      { label: '祝御進学', note: '進学先が決まっている場合に。' }
    ],
    base: {
      child: 30000,
      grandchild: 10000,
      sibling: 10000,
      nephew: 10000,
      cousin: 5000,
      friend: 5000,
      colleague: 5000,
      neighbor: 3000
    },
    asksAttendance: false,
    asksJoint: false,
    tips: [
      '入学式の2〜3週間前までに届くように贈ります。',
      '毎年続く行事ではないので、贈る相手の範囲を決めておくと角が立ちません。',
      '本人ではなく親に渡す場合は、誰からのお祝いか分かるよう表書きに名前を入れます。'
    ],
    icon: 'satchel'
  },
  {
    id: 'newhome',
    label: '新築・引越し祝い',
    caption: '新築・改築・転居',
    ceremony: 'celebration',
    knot: 'chomusubi',
    omotegaki: '御新築御祝',
    omotegakiAlternatives: [
      { label: '御引越御祝', note: '建てたのではなく引っ越した場合。' },
      { label: '御祝', note: '事情が分からないときはこれが安全です。' }
    ],
    base: {
      child: 100000,
      sibling: 30000,
      grandchild: 30000,
      nephew: 10000,
      cousin: 10000,
      friend: 10000,
      colleague: 5000,
      boss: 10000,
      subordinate: 5000,
      neighbor: 5000
    },
    asksAttendance: false,
    asksJoint: true,
    tips: [
      '新築祝いに火を連想させるもの（ライター・灰皿・赤い品）は贈りません。',
      '新居に招かれたときに持参するのが基本です。招かれていなければ郵送で構いません。',
      '完成前に贈ると縁起が悪いとされます。入居後に渡します。'
    ],
    icon: 'house'
  },
  {
    id: 'sickvisit',
    label: 'お見舞い',
    caption: '病気・けが',
    ceremony: 'celebration',
    knot: 'musubikiri',
    omotegaki: '御見舞',
    omotegakiAlternatives: [
      { label: 'お見舞', note: '目上の方には「御伺い」を使うこともあります。' },
      { label: '祈御全快', note: '快復を願う気持ちを前に出したいとき。' }
    ],
    base: {
      parent: 10000,
      child: 10000,
      sibling: 10000,
      grandparent: 10000,
      uncle: 5000,
      nephew: 5000,
      cousin: 5000,
      friend: 5000,
      colleague: 3000,
      boss: 5000,
      subordinate: 3000,
      neighbor: 3000
    },
    asksAttendance: false,
    asksJoint: false,
    tips: [
      '水引は「繰り返さない」意味の結び切り、または水引なしの白封筒を使います。',
      '鉢植えは「根づく＝寝つく」を連想させるため贈りません。',
      '面会は短く。病室の都合を必ず病院と家族に確認してから伺います。'
    ],
    icon: 'flower'
  },
  {
    id: 'longevity',
    label: '長寿祝い',
    caption: '還暦・古稀・喜寿ほか',
    ceremony: 'celebration',
    knot: 'chomusubi',
    omotegaki: '祝御長寿',
    omotegakiAlternatives: [
      { label: '寿福', note: '格式を出したいときに。' },
      { label: '祝還暦', note: '数え年61歳のお祝い。以降は古稀70・喜寿77・傘寿80と続きます。' }
    ],
    base: {
      parent: 30000,
      grandparent: 30000,
      uncle: 10000,
      sibling: 10000,
      cousin: 5000,
      friend: 5000,
      colleague: 5000,
      neighbor: 3000
    },
    asksAttendance: false,
    asksJoint: true,
    tips: [
      '「老」「死」を思わせる言葉と品（老眼鏡・杖・櫛）は避けます。',
      '数え年で祝うのが本来ですが、近年は満年齢で祝う家庭も増えています。',
      '本人の体調に合わせ、集まりは短時間で無理のない形にします。'
    ],
    icon: 'crane'
  },
  {
    id: 'opening',
    label: '開店・開業祝い',
    caption: '独立・出店',
    ceremony: 'celebration',
    knot: 'chomusubi',
    omotegaki: '御開店御祝',
    omotegakiAlternatives: [
      { label: '御開業御祝', note: '店舗を持たない事業のとき。' },
      { label: '祈御繁栄', note: '取引先へ格式を持たせたいとき。' }
    ],
    base: {
      child: 100000,
      sibling: 30000,
      nephew: 10000,
      cousin: 10000,
      friend: 10000,
      colleague: 10000,
      boss: 10000,
      subordinate: 10000,
      neighbor: 5000,
      client: 30000
    },
    asksAttendance: false,
    asksJoint: false,
    tips: [
      '開店前日までに届けるのが理想です。当日は先方が最も忙しい時間帯を外します。',
      '飲食店へ赤い品や火を連想させるものは贈りません。',
      '胡蝶蘭を贈るときは立て札の社名表記を先方に確認しておきます。'
    ],
    icon: 'noren'
  }
];

export const OCCASION_MAP: Record<OccasionId, Occasion> = OCCASIONS.reduce(
  (acc, o) => {
    acc[o.id] = o;
    return acc;
  },
  {} as Record<OccasionId, Occasion>
);

/** その場面で選べる関係性だけを、RELATIONS の並び順で返す。 */
export function relationsFor(occasionId: OccasionId): Relation[] {
  const occasion = OCCASION_MAP[occasionId];
  if (!occasion) return [];
  return RELATIONS.filter((r) => occasion.base[r.id] !== undefined);
}

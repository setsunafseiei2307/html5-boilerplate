export interface QuizChoice {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  /** 出題の場面 */
  scene: string;
  prompt: string;
  choices: QuizChoice[];
  answerId: string;
  /** 正誤にかかわらず出す解説 */
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    scene: '通夜',
    prompt: '訃報が届いたものの、先方の宗派が分かりません。香典の表書きとして最も無難なのはどれですか。',
    choices: [
      { id: 'a', label: '御仏前' },
      { id: 'b', label: '御霊前' },
      { id: 'c', label: 'お花料' },
      { id: 'd', label: '御玉串料' }
    ],
    answerId: 'b',
    explanation:
      '「御霊前」は仏式・神式・キリスト教式のいずれでも使えます。ただし浄土真宗だけは通夜から「御仏前」を用いるため、分かっているなら合わせます。'
  },
  {
    id: 'q2',
    scene: '結婚式',
    prompt: '友人の結婚式に一人で出席します。包む金額として避けるべきなのはどれですか。',
    choices: [
      { id: 'a', label: '3万円' },
      { id: 'b', label: '4万円' },
      { id: 'c', label: '5万円' },
      { id: 'd', label: '7万円' }
    ],
    answerId: 'b',
    explanation:
      '「4」は「死」を連想させるため慶弔ともに避けます。加えて偶数は「割れる＝縁が切れる」とされ、慶事では奇数が基本です。'
  },
  {
    id: 'q3',
    scene: '通夜',
    prompt: '香典に入れるお札について、正しいものはどれですか。',
    choices: [
      { id: 'a', label: '必ず新札をそろえる' },
      { id: 'b', label: '新札は避け、折り目のあるお札を使う' },
      { id: 'c', label: '硬貨を混ぜて枚数を合わせる' },
      { id: 'd', label: '札の向きは気にしなくてよい' }
    ],
    answerId: 'b',
    explanation:
      '新札は「不幸を予期して用意していた」と受け取られます。新札しかないときは縦に一度折り、折り目をつけてから入れます。'
  },
  {
    id: 'q4',
    scene: '出産祝い',
    prompt: '出産祝いの祝儀袋に掛ける水引は、どの結び方が正しいですか。',
    choices: [
      { id: 'a', label: '結び切り' },
      { id: 'b', label: 'あわじ結び' },
      { id: 'c', label: '蝶結び' },
      { id: 'd', label: '水引は掛けない' }
    ],
    answerId: 'c',
    explanation:
      '蝶結びは何度でも結び直せるため、「繰り返してよいお祝い」に使います。結婚と弔事は一度きりであってほしいので結び切りです。'
  },
  {
    id: 'q5',
    scene: 'お見舞い',
    prompt: '入院中の友人を見舞います。持って行ってはいけないものはどれですか。',
    choices: [
      { id: 'a', label: '個包装の焼き菓子' },
      { id: 'b', label: '鉢植えの花' },
      { id: 'c', label: 'タオル' },
      { id: 'd', label: '雑誌' }
    ],
    answerId: 'b',
    explanation:
      '鉢植えは「根づく＝寝つく」を連想させるため見舞いには贈りません。生花そのものを禁止している病院も増えています。'
  },
  {
    id: 'q6',
    scene: '葬儀',
    prompt: '不祝儀袋の表書きを書くとき、正しい筆記具はどれですか。',
    choices: [
      { id: 'a', label: '濃い墨の筆ペン' },
      { id: 'b', label: '薄墨の筆ペン' },
      { id: 'c', label: '青のボールペン' },
      { id: 'd', label: '鉛筆' }
    ],
    answerId: 'b',
    explanation:
      '薄墨は「涙で墨が薄まった」「急な知らせで墨をする間もなかった」という弔意の表現です。四十九日以降の法要では濃い墨で構いません。'
  },
  {
    id: 'q7',
    scene: '結婚式',
    prompt: '出席予定だった結婚式を、当日の朝に体調不良で欠席しました。ご祝儀はどうしますか。',
    choices: [
      { id: 'a', label: '欠席したので渡さない' },
      { id: 'b', label: '出席予定だった額の3分の1を包む' },
      { id: 'c', label: '出席予定だった額をそのまま包む' },
      { id: 'd', label: '半額を包む' }
    ],
    answerId: 'c',
    explanation:
      '当日の欠席は料理も引出物もすでに用意されています。満額を包むのが礼儀です。事前に欠席を伝えていた場合は3分の1程度が目安になります。'
  },
  {
    id: 'q8',
    scene: '祝儀袋',
    prompt: '中袋に3万円と記す際、正式とされる書き方はどれですか。',
    choices: [
      { id: 'a', label: '¥30,000' },
      { id: 'b', label: '三万円' },
      { id: 'c', label: '金参萬円' },
      { id: 'd', label: '30000円' }
    ],
    answerId: 'c',
    explanation:
      '旧字体を使うのは、あとから画を書き足して改ざんされるのを防ぐためです。頭に「金」を付け、末尾に「也」を添える書き方もあります。'
  },
  {
    id: 'q9',
    scene: '新築祝い',
    prompt: '友人の新築祝いに贈るものとして、避けるべきなのはどれですか。',
    choices: [
      { id: 'a', label: '観葉植物' },
      { id: 'b', label: 'カタログギフト' },
      { id: 'c', label: 'おしゃれな灰皿' },
      { id: 'd', label: 'タオルセット' }
    ],
    answerId: 'c',
    explanation:
      '灰皿・ライター・ストーブなど火を連想させるものは、火事を思わせるため新築祝いには贈りません。赤い色の品も同じ理由で避けます。'
  },
  {
    id: 'q10',
    scene: '弔問',
    prompt: '弔問の場でかける言葉として、避けるべきなのはどれですか。',
    choices: [
      { id: 'a', label: 'このたびはご愁傷さまでございます' },
      { id: 'b', label: '心よりお悔やみ申し上げます' },
      { id: 'c', label: '重ね重ね残念でなりません' },
      { id: 'd', label: 'どうぞお力落としのないように' }
    ],
    answerId: 'c',
    explanation:
      '「重ね重ね」「たびたび」「再び」などの重ね言葉は、不幸が繰り返されることを連想させるため使いません。'
  }
];

export interface QuizRank {
  /** 下限の偏差値（この値以上で該当） */
  from: number;
  title: string;
  description: string;
}

export const QUIZ_RANKS: QuizRank[] = [
  {
    from: 71,
    title: '冠婚葬祭の主',
    description:
      '一族に一人いると全員が助かる人です。あなたが「それでいい」と言えば、その場の全員が安心できます。'
  },
  {
    from: 62,
    title: '作法の師範',
    description:
      '迷いどころをきちんと押さえています。人から相談される側にまわっても、まず間違えません。'
  },
  {
    from: 53,
    title: '気配りの人',
    description:
      '基本は身についています。宗派や地域で変わる部分だけ、その場で確認できれば十分です。'
  },
  {
    from: 44,
    title: 'ふつうの大人',
    description:
      '大きな失礼はしません。ただし当日その場で判断を迫られると、少し手が止まるかもしれません。'
  },
  {
    from: 35,
    title: '見習い',
    description:
      '知らずに損をしている可能性があります。今日ここで覚えた分だけ、次の場面が確実に楽になります。'
  },
  {
    from: 0,
    title: 'これから',
    description:
      '誰でも最初はここからです。金額と表書きの2つだけ押さえれば、当面の場面は乗り切れます。'
  }
];

/** 正解数を 30〜75 の偏差値に写像する。 */
export function toDeviationScore(correctCount: number): number {
  const total = QUIZ_QUESTIONS.length;
  const clamped = Math.max(0, Math.min(total, correctCount));
  return Math.round(30 + (clamped / total) * 45);
}

export function rankFor(deviation: number): QuizRank {
  return QUIZ_RANKS.find((r) => deviation >= r.from) ?? QUIZ_RANKS[QUIZ_RANKS.length - 1];
}

/** 上位何％にあたるかの目安。正規分布を仮定した概算値。 */
export function topPercentile(deviation: number): number {
  const z = (deviation - 50) / 10;
  // 標準正規分布の上側確率をロジスティック近似で求める
  const upper = 1 / (1 + Math.exp(1.702 * z));
  return Math.max(1, Math.min(99, Math.round(upper * 100)));
}

export interface QuizOutcome {
  /** 各問の正誤。QUIZ_QUESTIONS と同じ並び */
  correctness: boolean[];
  correctCount: number;
  deviation: number;
  rank: QuizRank;
  percentile: number;
}

/**
 * 回答（選択肢 id の配列。未回答は null）から結果を組み立てる。
 * 配列が短い場合は未回答として扱う。
 */
export function gradeQuiz(answers: (string | null)[]): QuizOutcome {
  const correctness = QUIZ_QUESTIONS.map(
    (q, i) => answers[i] !== undefined && answers[i] === q.answerId
  );
  const correctCount = correctness.filter(Boolean).length;
  const deviation = toDeviationScore(correctCount);
  return {
    correctness,
    correctCount,
    deviation,
    rank: rankFor(deviation),
    percentile: topPercentile(deviation)
  };
}

/** 正誤の並びをビットマスクにして 36 進数の短い文字列にする。 */
export function encodeCorrectness(correctness: boolean[]): string {
  let mask = 0;
  correctness.forEach((ok, i) => {
    if (ok) mask |= 1 << i;
  });
  // 全問不正解でも空文字にならないよう 1 ビット分オフセットする
  return (mask + (1 << QUIZ_QUESTIONS.length)).toString(36);
}

/** encodeCorrectness の逆変換。壊れた入力は null を返す。 */
export function decodeCorrectness(token: string): boolean[] | null {
  if (!/^[0-9a-z]{1,8}$/.test(token)) return null;
  const raw = parseInt(token, 36);
  if (!Number.isFinite(raw)) return null;
  const offset = 1 << QUIZ_QUESTIONS.length;
  const mask = raw - offset;
  if (mask < 0 || mask >= offset) return null;
  return QUIZ_QUESTIONS.map((_, i) => (mask & (1 << i)) !== 0);
}

/** 共有 URL から復元した正誤で結果を組み立てる。 */
export function outcomeFromCorrectness(correctness: boolean[]): QuizOutcome {
  const correctCount = correctness.filter(Boolean).length;
  const deviation = toDeviationScore(correctCount);
  return {
    correctness,
    correctCount,
    deviation,
    rank: rankFor(deviation),
    percentile: topPercentile(deviation)
  };
}

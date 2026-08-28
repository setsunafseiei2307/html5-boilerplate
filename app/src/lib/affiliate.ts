/**
 * 外部リンク（アフィリエイト差込口）をこの1ファイルに集約する。
 *
 * 差し替え手順:
 *   1. 各エントリの url を、発行された計測URLに置き換える
 *   2. 提携先の規約に従い disclosure の文言を調整する
 *   3. 他のファイルは一切触らない
 *
 * url が PLACEHOLDER_PREFIX で始まるあいだは「準備中」として扱い、
 * 別タブ遷移させずに枠だけ表示する。誤クリックで死んだリンクへ飛ばさないため。
 */
import type { OccasionId } from './types';

export const PLACEHOLDER_PREFIX = 'about:placeholder';

/** 広告表記。景品表示法のステルスマーケティング規制に対応するため必ず表示する。 */
export const DISCLOSURE =
  'このコーナーには広告（アフィリエイトリンク）が含まれます。掲載順は報酬額によって決めていません。';

export interface AffiliateOffer {
  id: string;
  /** 枠の見出し */
  title: string;
  /** 何が得られるかを一行で */
  body: string;
  /** ボタン文言 */
  cta: string;
  /** 差し替え対象。PLACEHOLDER_PREFIX のあいだは準備中表示になる */
  url: string;
  /** 枠の左に出す短いラベル */
  tag: string;
}

/** 場面ごとの提案。上から順に表示される。 */
const OFFERS_BY_OCCASION: Record<OccasionId, AffiliateOffer[]> = {
  wedding: [
    {
      id: 'wedding-venue',
      tag: '式場探し',
      title: '自分の式はこれから、という方へ',
      body: '式場見学の予約から成約まで、複数サイトを比べると特典の総額が数十万円変わることがあります。',
      cta: '式場探しサービスを比べる',
      url: `${PLACEHOLDER_PREFIX}/wedding-venue`
    },
    {
      id: 'wedding-gift-set',
      tag: 'ご祝儀袋',
      title: '袋と袱紗を切らしていませんか',
      body: '金額に合う格の祝儀袋と、慶事用の袱紗。当日の朝に慌てないための備えです。',
      cta: 'ご祝儀袋・袱紗を見る',
      url: `${PLACEHOLDER_PREFIX}/wedding-goods`
    },
    {
      id: 'wedding-telegram',
      tag: '祝電',
      title: '欠席するなら祝電を',
      body: '式の前日までに届けば、披露宴で読み上げてもらえます。文面のテンプレートも用意されています。',
      cta: '祝電を手配する',
      url: `${PLACEHOLDER_PREFIX}/telegram-celebration`
    }
  ],
  funeral: [
    {
      id: 'funeral-estimate',
      tag: '葬儀の見積もり',
      title: '葬儀の費用を先に把握しておく',
      body: '葬儀費用は依頼先で大きく開きます。事前に複数社の見積もりを取っておくと、慌てて決めずに済みます。',
      cta: '葬儀社の一括見積もりを見る',
      url: `${PLACEHOLDER_PREFIX}/funeral-estimate`
    },
    {
      id: 'funeral-goods',
      tag: '不祝儀袋',
      title: '薄墨の筆ペンと不祝儀袋',
      body: '訃報は急に届きます。薄墨ペン・黒白の不祝儀袋・弔事用の袱紗は常備しておくと安心です。',
      cta: '弔事用品をそろえる',
      url: `${PLACEHOLDER_PREFIX}/funeral-goods`
    },
    {
      id: 'funeral-flower',
      tag: '供花・弔電',
      title: '参列できないとき',
      body: '供花や弔電は、通夜の開始時刻に間に合うよう手配します。斎場名と喪主名の確認をお忘れなく。',
      cta: '供花・弔電を手配する',
      url: `${PLACEHOLDER_PREFIX}/condolence-flower`
    }
  ],
  baby: [
    {
      id: 'baby-insurance',
      tag: '学資・保険',
      title: '出産のタイミングで見直す人が多いもの',
      body: '学資保険や生命保険は、子どもが生まれた時点が一番の検討どきです。無料相談で試算だけ取る人もいます。',
      cta: '保険の無料相談を比べる',
      url: `${PLACEHOLDER_PREFIX}/insurance-consult`
    },
    {
      id: 'baby-gift',
      tag: 'ギフト',
      title: '現金に品物を添えるなら',
      body: 'おむつケーキや名入れギフトは、金額を抑えつつ気持ちが伝わる定番です。',
      cta: '出産祝いギフトを見る',
      url: `${PLACEHOLDER_PREFIX}/baby-gift`
    }
  ],
  entrance: [
    {
      id: 'entrance-study',
      tag: '学び',
      title: '進学のタイミングで検討されるもの',
      body: '通信教育やオンライン学習は、入学前の申し込みで初月無料になることがあります。',
      cta: '教育サービスを比べる',
      url: `${PLACEHOLDER_PREFIX}/education`
    },
    {
      id: 'entrance-gift',
      tag: 'ギフト',
      title: '図書カード・文具という選択',
      body: '現金が気になる相手には、図書カードや名入れの文具が使いやすい代替になります。',
      cta: '入学祝いギフトを見る',
      url: `${PLACEHOLDER_PREFIX}/entrance-gift`
    }
  ],
  newhome: [
    {
      id: 'newhome-loan',
      tag: '住宅ローン',
      title: '贈る側・贈られる側どちらにも',
      body: '住宅ローンは借り換えで総返済額が数百万円変わることがあります。試算は無料でできます。',
      cta: '住宅ローンを比較する',
      url: `${PLACEHOLDER_PREFIX}/home-loan`
    },
    {
      id: 'newhome-gift',
      tag: 'ギフト',
      title: '新居に合うものを贈るなら',
      body: '観葉植物やカタログギフトは、好みが分からない相手にも渡しやすい定番です。',
      cta: '新築祝いギフトを見る',
      url: `${PLACEHOLDER_PREFIX}/newhome-gift`
    }
  ],
  sickvisit: [
    {
      id: 'sickvisit-insurance',
      tag: '医療保険',
      title: '入院費用が気になったら',
      body: '身近な人の入院は、自分の保障を見直すきっかけになります。相談は無料のものが多くあります。',
      cta: '医療保険の相談を比べる',
      url: `${PLACEHOLDER_PREFIX}/medical-insurance`
    },
    {
      id: 'sickvisit-gift',
      tag: 'お見舞い品',
      title: '病室に持ち込めるもの',
      body: '生花が禁止の病院も増えています。日持ちする個包装の菓子やタオルが無難です。',
      cta: 'お見舞い品を見る',
      url: `${PLACEHOLDER_PREFIX}/sickvisit-gift`
    }
  ],
  longevity: [
    {
      id: 'longevity-souzoku',
      tag: '相続・終活',
      title: '長寿祝いは家族で話す機会でもあります',
      body: '相続や遺言の準備は、元気なうちに始めるほど選べる手段が多くなります。初回相談無料の窓口があります。',
      cta: '相続の相談窓口を見る',
      url: `${PLACEHOLDER_PREFIX}/inheritance`
    },
    {
      id: 'longevity-gift',
      tag: 'ギフト',
      title: '記念に残る贈り物',
      body: '名入れの品や旅行券は、長寿祝いで喜ばれる定番です。還暦の赤いものは好みが分かれます。',
      cta: '長寿祝いギフトを見る',
      url: `${PLACEHOLDER_PREFIX}/longevity-gift`
    }
  ],
  opening: [
    {
      id: 'opening-card',
      tag: '事業カード',
      title: '開業した相手に役立つ話題',
      body: '法人・個人事業主向けのクレジットカードや会計ソフトは、開業直後に決めておくと後が楽になります。',
      cta: '開業まわりのサービスを見る',
      url: `${PLACEHOLDER_PREFIX}/business-tools`
    },
    {
      id: 'opening-flower',
      tag: '胡蝶蘭',
      title: '開店祝いの定番',
      body: '胡蝶蘭は開店前日までに届けるのが基本です。立て札の表記は先方に確認しておきます。',
      cta: '胡蝶蘭・スタンド花を見る',
      url: `${PLACEHOLDER_PREFIX}/opening-flower`
    }
  ]
};

/** クイズ結果画面に出す、場面に依存しない枠。 */
export const QUIZ_OFFERS: AffiliateOffer[] = [
  {
    id: 'quiz-manner-book',
    tag: '手元に一冊',
    title: '調べる前に開ける本',
    body: '冠婚葬祭のマナー本は、家に一冊あるだけで「これで合っているか」の不安が減ります。',
    cta: 'マナーの定番書を見る',
    url: `${PLACEHOLDER_PREFIX}/manner-book`
  },
  {
    id: 'quiz-fukusa',
    tag: '備え',
    title: '袱紗（ふくさ）は一枚で慶弔兼用にできる',
    body: '紫の袱紗はお祝いにもお悔やみにも使えます。急な連絡に備える最小限の一枚です。',
    cta: '慶弔両用の袱紗を見る',
    url: `${PLACEHOLDER_PREFIX}/fukusa`
  },
  {
    id: 'quiz-funeral-estimate',
    tag: '事前準備',
    title: 'いつか必ず来ることの準備',
    body: '葬儀の事前見積もりは無料で取れます。慌てて決めた場合との差額は小さくありません。',
    cta: '葬儀の事前見積もりを見る',
    url: `${PLACEHOLDER_PREFIX}/funeral-estimate`
  }
];

export function offersFor(occasion: OccasionId): AffiliateOffer[] {
  return OFFERS_BY_OCCASION[occasion] ?? [];
}

/** 差し替え前のダミーかどうか。 */
export function isPlaceholder(offer: AffiliateOffer): boolean {
  return offer.url.startsWith(PLACEHOLDER_PREFIX);
}

import { useMemo, useState } from 'react';
import { OCCASIONS, OCCASION_MAP, RELATION_MAP } from '../lib/occasions';
import { calcRange, formatYen } from '../lib/amount';
import { buildCalcHash } from '../lib/share';
import { clearHistory, loadHistory, type HistoryEntry } from '../lib/storage';
import { IconArrow, OccasionIcon } from './icons';
import { MizuhikiKnot } from './Mizuhiki';
import { EmptyState, MizuhikiRule } from './common';
import { MizuhikiArc } from './Mizuhiki';

function historyLabel(entry: HistoryEntry): string {
  const occasion = OCCASION_MAP[entry.input.occasion];
  const relation = RELATION_MAP[entry.input.relation];
  if (!occasion || !relation) return '過去に調べた条件';
  return `${occasion.label} ／ ${relation.label}`;
}

export default function HomePage() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  const bestKnown = useMemo(
    () =>
      calcRange({
        occasion: 'wedding',
        relation: 'friend',
        age: '30s',
        region: 'national',
        attendance: 'attend',
        joint: false
      }).typical,
    []
  );

  return (
    <>
      <section className="hero">
        <div className="hero__copy">
          <span className="eyebrow">日本の贈答の目安</span>
          <h1 className="hero__title">
            いくら包めばいいか、
            <br />
            <em>もう迷わない。</em>
          </h1>
          <p className="hero__lead">
            結婚式のご祝儀から、急な訃報の香典まで。場面と相手との関係を選ぶだけで、
            包む金額の目安と、表書き・水引・お札の向きまでが一枚のカードにまとまります。
          </p>
          <div className="hero__actions">
            <a className="btn btn--accent" href={buildCalcHash({}, false)}>
              金額を調べる
              <IconArrow size={17} />
            </a>
            <a className="btn btn--ghost" href="#/quiz">
              マナー偏差値を測る
            </a>
          </div>
        </div>

        {/* 何が出てくるのかを、実際の結果カードの縮小版で先に見せる */}
        <aside className="hero__preview" aria-label="結果カードの例">
          <div className="preview-card">
            <span className="preview-card__tag">結果の例</span>
            <MizuhikiArc className="preview-card__arc" />
            <p className="preview-card__scene">結婚祝い ／ 友人</p>
            <p className="preview-card__amount">
              {bestKnown.toLocaleString('ja-JP')}
              <small>円</small>
            </p>
            <p className="preview-card__kanji">中袋には 金参萬円 と書きます</p>
            <div className="preview-card__facts">
              <span>
                <b>寿</b>表書き
              </span>
              <span>
                <b>結び切り</b>水引
              </span>
              <span>
                <b>新札</b>お札
              </span>
            </div>
            <p className="preview-card__warn">
              <s>40,000円</s> は「死」を連想させるため避けます
            </p>
          </div>
          <span className="tategaki hero__tategaki">恥をかかない、迷わない</span>
        </aside>
      </section>

      <div className="entry-grid">
        <a className="entry rise rise--1" href={buildCalcHash({}, false)}>
          <span className="entry__figure" aria-hidden>
            <MizuhikiKnot size={150} />
          </span>
          <span className="eyebrow">金額を調べる</span>
          <span className="entry__label">つつむ金額シミュレーター</span>
          <span className="entry__desc">
            8つの場面 × 14の関係性 × 年代 × 地域。
            避けるべき数字も含めて、その場で判断できます。
          </span>
          <span className="entry__go">
            調べる
            <IconArrow size={16} />
          </span>
        </a>

        <a className="entry entry--gold rise rise--2" href="#/quiz">
          <span className="entry__figure" aria-hidden>
            <MizuhikiKnot size={150} />
          </span>
          <span className="eyebrow">腕試し</span>
          <span className="entry__label">マナー偏差値テスト</span>
          <span className="entry__desc">
            全10問。表書き、薄墨、忌み数、贈ってはいけないもの。
            あなたの作法は上位何％でしょうか。
          </span>
          <span className="entry__go">
            挑戦する
            <IconArrow size={16} />
          </span>
        </a>
      </div>

      <section style={{ marginTop: 40 }}>
        <span className="eyebrow">場面から探す</span>
        <div className="scene-strip">
          {OCCASIONS.map((occasion) => (
            <a
              className="scene-chip"
              key={occasion.id}
              href={buildCalcHash({ occasion: occasion.id }, false)}
            >
              <OccasionIcon name={occasion.icon} size={19} />
              {occasion.label}
            </a>
          ))}
        </div>
      </section>

      <section className="history">
        <div className="history__head">
          <h2 className="section-title">最近調べた条件</h2>
          {history.length > 0 ? (
            <button
              type="button"
              className="linkbtn"
              onClick={() => setHistory(clearHistory())}
            >
              履歴を消す
            </button>
          ) : null}
        </div>

        {history.length === 0 ? (
          <div style={{ marginTop: 14 }}>
            <EmptyState
              title="まだ履歴はありません"
              text="一度調べると、この場所に残ります。同じ相手・同じ場面をもう一度確認したいときにすぐ開けます。保存はこの端末の中だけで完結します。"
              action={
                <a className="btn btn--ghost btn--sm" href={buildCalcHash({}, false)}>
                  さっそく調べる
                </a>
              }
            />
          </div>
        ) : (
          <div className="history__list">
            {history.map((entry) => (
              <a
                className="history__item"
                key={`${entry.savedAt}-${entry.input.occasion}-${entry.input.relation}`}
                href={buildCalcHash(entry.input)}
              >
                <OccasionIcon
                  name={OCCASION_MAP[entry.input.occasion]?.icon ?? 'ring'}
                  size={18}
                />
                <span className="history__label">{historyLabel(entry)}</span>
                <span className="history__amount">{formatYen(entry.amount)}</span>
              </a>
            ))}
          </div>
        )}
      </section>

      <div style={{ marginTop: 44 }}>
        <MizuhikiRule />
      </div>

      <section className="closing">
        <p className="lead">
          金額は全国の一般的な目安です。地域・家・宗派によって作法は変わります。
          迷ったときは、同じ立場で参列する人と足並みをそろえるのがいちばん確実です。
        </p>
        <a className="btn btn--ghost btn--sm" href="#/guide">
          全場面の早見表を見る
        </a>
      </section>
    </>
  );
}

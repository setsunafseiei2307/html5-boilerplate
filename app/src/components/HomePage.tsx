import { useMemo, useState } from 'react';
import { OCCASIONS, OCCASION_MAP, RELATION_MAP } from '../lib/occasions';
import { calcRange, formatYen } from '../lib/amount';
import { buildCalcHash } from '../lib/share';
import { clearHistory, loadHistory, type HistoryEntry } from '../lib/storage';
import { IconArrow, IconKnot, OccasionIcon } from './icons';
import { EmptyState, MizuhikiRule } from './common';

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
        <div>
          <span className="eyebrow">日本の贈答の目安</span>
          <h1 className="hero__title">
            いくら包めばいいか、
            <br />
            <em>もう迷わない。</em>
          </h1>
          <p className="hero__lead">
            結婚式のご祝儀から、急な訃報の香典まで。場面と相手との関係を選ぶだけで、
            包む金額の目安と、表書き・水引・お札の向きまで一枚のカードにまとまります。
            友人の結婚式なら{formatYen(bestKnown)}——その根拠まで含めて、30秒で。
          </p>
        </div>
        <div className="hero__side">
          <span className="tategaki">恥をかかない、迷わない</span>
        </div>
      </section>

      <div className="entry-grid">
        <a className="entry rise rise--1" href={buildCalcHash({}, false)}>
          <span className="entry__figure" aria-hidden>
            <IconKnot size={110} />
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

        <a className="entry entry--condolence rise rise--2" href="#/quiz">
          <span className="entry__figure" aria-hidden>
            <IconKnot size={110} />
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
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
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

      <div style={{ marginTop: 44, opacity: 0.6 }}>
        <MizuhikiRule />
      </div>

      <section style={{ marginTop: 28, textAlign: 'center' }}>
        <p className="lead" style={{ maxWidth: '38em', margin: '0 auto' }}>
          金額は全国の一般的な目安です。地域・家・宗派によって作法は変わります。
          迷ったときは、同じ立場で参列する人と足並みをそろえるのがいちばん確実です。
        </p>
        <a className="btn btn--ghost btn--sm" href="#/guide" style={{ marginTop: 16 }}>
          全場面の早見表を見る
        </a>
      </section>
    </>
  );
}

import { useEffect, useMemo } from 'react';
import { buildResult, formatYen, toKanjiAmount } from '../lib/amount';
import { offersFor } from '../lib/affiliate';
import { buildCalcHash, absoluteUrl } from '../lib/share';
import { downloadCard } from '../lib/cardImage';
import { pushHistory } from '../lib/storage';
import type { GiftInput } from '../lib/types';
import {
  IconAlert,
  IconBill,
  IconBrush,
  IconEnvelope,
  IconInfo,
  IconKnot,
  OccasionIcon
} from './icons';
import { useCountUp } from '../lib/useCountUp';
import { OfferList, ShareBar } from './common';
import { MizuhikiArc } from './Mizuhiki';

export interface ResultPageProps {
  input: GiftInput;
  onCopied: () => void;
}

export default function ResultPage({ input, onCopied }: ResultPageProps) {
  const result = useMemo(() => buildResult(input), [input]);
  const { occasion, relation, range, envelope } = result;
  const displayedAmount = useCountUp(range.typical);

  useEffect(() => {
    pushHistory(input, range.typical);
  }, [input, range.typical]);

  const url = absoluteUrl(buildCalcHash(input));
  const shareText = `${occasion.label}（${relation.label}）は ${formatYen(
    range.typical
  )} が目安でした。表書きは「${result.omotegaki}」。#つつみ帖`;

  // レンジ内での推奨額の位置。min と max が同じときは中央に置く
  const span = range.max - range.min;
  const pinPercent = span > 0 ? ((range.typical - range.min) / span) * 100 : 50;

  const handleDownload = () => {
    downloadCard(
      {
        eyebrow: `${occasion.label} ／ ${relation.label}`,
        headline: formatYen(range.typical),
        subline: `目安 ${formatYen(range.min)} 〜 ${formatYen(range.max)}`,
        footnote: `表書きは「${result.omotegaki}」／ ${
          occasion.knot === 'musubikiri' ? '結び切り' : '蝶結び'
        }`,
        accent: result.ceremony === 'condolence' ? 'indigo' : 'crimson'
      },
      `tsutsumicho-${occasion.id}-${relation.id}.png`
    );
  };

  return (
    <div className="result" data-ceremony={result.ceremony}>
      <section className="result-hero rise rise--1">
        <MizuhikiArc className="result-hero__mizuhiki" />

        <p className="result-hero__scene">
          {occasion.label} ／ {relation.label}
        </p>
        <p className="result-hero__amount">
          {displayedAmount.toLocaleString('ja-JP')}
          <small>円</small>
        </p>
        <p className="result-hero__kanji">
          中袋には <b>金{toKanjiAmount(range.typical)}</b> と書きます
        </p>

        <div className="rangebar">
          <div className="rangebar__track">
            <span className="rangebar__fill" />
            <span className="rangebar__pin" style={{ left: `${pinPercent}%` }} />
          </div>
          <div className="rangebar__labels">
            <span>
              控えめ <b>{formatYen(range.min)}</b>
            </span>
            <span>
              手厚く <b>{formatYen(range.max)}</b>
            </span>
          </div>
        </div>
      </section>

      <div className="detail-grid rise rise--2">
        <div className="detail">
          <p className="detail__label">
            <IconBrush size={15} /> 表書き
          </p>
          <p className="detail__value">{result.omotegaki}</p>
          <p className="detail__note">袋の上段中央に。下段には自分の氏名を書きます。</p>
          <div className="alt-list">
            {result.omotegakiAlternatives.map((alt) => (
              <div className="alt-list__row" key={alt.label}>
                <span className="alt-list__key">{alt.label}</span>
                <span>{alt.note}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail">
          <p className="detail__label">
            <IconKnot size={15} /> 水引
          </p>
          <p className="detail__value">
            {occasion.knot === 'musubikiri' ? '結び切り' : '蝶結び'}
          </p>
          <p className="detail__note">{envelope.mizuhiki}</p>
        </div>

        <div className="detail">
          <p className="detail__label">
            <IconEnvelope size={15} /> 袋の格
          </p>
          <p className="detail__value" style={{ fontSize: 17 }}>
            {envelope.grade}
          </p>
          <p className="detail__note">{envelope.inner}</p>
        </div>

        <div className="detail">
          <p className="detail__label">
            <IconBill size={15} /> お札
          </p>
          <p className="detail__value" style={{ fontSize: 17 }}>
            {result.ceremony === 'condolence' ? '旧札を使う' : '新札を使う'}
          </p>
          <p className="detail__note">{envelope.bill}</p>
        </div>
      </div>

      {result.taboos.length > 0 ? (
        <section className="taboo rise rise--3">
          <p className="taboo__title">
            <IconAlert size={15} /> この範囲で避けたい金額
          </p>
          {result.taboos.map((taboo) => (
            <div className="taboo__row" key={taboo.amount}>
              <span className="taboo__amount">{formatYen(taboo.amount)}</span>
              <span>{taboo.reason}</span>
            </div>
          ))}
        </section>
      ) : null}

      {result.notes.length > 0 ? (
        <div className="notes rise rise--3">
          {result.notes.map((note) => (
            <p className="note" key={note}>
              <IconInfo size={16} />
              <span>{note}</span>
            </p>
          ))}
        </div>
      ) : null}

      <section className="tips rise rise--4">
        <h2 className="tips__title">
          <OccasionIcon
            name={occasion.icon}
            size={16}
            style={{ verticalAlign: '-2px', marginRight: 7 }}
          />
          当日までに押さえておくこと
        </h2>
        <ol className="tips__list">
          {result.tips.map((tip, index) => (
            <li className="tips__item" key={tip}>
              <span className="tips__num">{index + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ol>
      </section>

      <ShareBar
        title="この結果を共有する"
        subtitle="URLに条件が入っているので、開くだけで同じ結果が出ます。家族との相談にどうぞ。"
        shareText={shareText}
        url={url}
        onCopied={onCopied}
        onDownload={handleDownload}
        downloadLabel="画像を保存"
      />

      <OfferList heading="この場面で役に立つもの" offers={offersFor(occasion.id)} />

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 30,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <a className="btn btn--ghost btn--sm" href={buildCalcHash(input, false)}>
          条件を変えて調べ直す
        </a>
        <a className="btn btn--ghost btn--sm" href="#/quiz">
          マナー偏差値を測る
        </a>
        <a className="btn btn--ghost btn--sm" href="#/guide">
          早見表を見る
        </a>
      </div>
    </div>
  );
}

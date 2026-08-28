import { useEffect, useMemo, useState } from 'react';
import {
  QUIZ_QUESTIONS,
  decodeCorrectness,
  outcomeFromCorrectness
} from '../lib/quiz';
import { QUIZ_OFFERS } from '../lib/affiliate';
import { absoluteUrl, buildQuizResultHash } from '../lib/share';
import { downloadCard } from '../lib/cardImage';
import { loadBestQuizScore, saveBestQuizScore } from '../lib/storage';
import { OfferList, ShareBar } from './common';
import { IconArrow } from './icons';

const RING_RADIUS = 87;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export interface QuizResultPageProps {
  token: string;
  onCopied: () => void;
}

export default function QuizResultPage({ token, onCopied }: QuizResultPageProps) {
  const correctness = useMemo(() => decodeCorrectness(token), [token]);
  const [drawn, setDrawn] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const outcome = useMemo(
    () => (correctness ? outcomeFromCorrectness(correctness) : null),
    [correctness]
  );

  // 今回の結果を保存する前の記録を読み、比較して見せる
  useEffect(() => {
    if (!outcome) return;
    setBest(loadBestQuizScore());
    saveBestQuizScore(outcome.deviation);
  }, [outcome]);

  useEffect(() => {
    const id = window.setTimeout(() => setDrawn(true), 120);
    return () => window.clearTimeout(id);
  }, [token]);

  if (!outcome || !correctness) {
    return (
      <div className="quiz">
        <section className="quiz-card" style={{ textAlign: 'center' }}>
          <h1 className="field-legend">結果を読み取れませんでした</h1>
          <p className="lead" style={{ marginTop: 8 }}>
            共有されたURLが途中で切れているようです。もう一度テストを受けると、
            あなた自身の偏差値が出ます。
          </p>
          <a className="btn btn--accent" href="#/quiz" style={{ marginTop: 20 }}>
            テストを受ける
            <IconArrow size={17} />
          </a>
        </section>
      </div>
    );
  }

  const ratio = Math.max(0, Math.min(1, (outcome.deviation - 25) / 50));
  const offset = RING_LENGTH * (1 - (drawn ? ratio : 0));
  const url = absoluteUrl(buildQuizResultHash(token));
  const shareText = `マナー偏差値は ${outcome.deviation}「${outcome.rank.title}」でした。10問中${outcome.correctCount}問正解、上位${outcome.percentile}%。あなたは包む金額と表書き、迷わず言えますか。 #マナー偏差値 #つつみ帖`;

  const handleDownload = () => {
    downloadCard(
      {
        eyebrow: 'マナー偏差値テスト',
        headline: `偏差値 ${outcome.deviation}`,
        subline: outcome.rank.title,
        footnote: `10問中${outcome.correctCount}問正解 ／ 上位${outcome.percentile}%`,
        accent: 'crimson'
      },
      `tsutsumicho-manner-${outcome.deviation}.png`
    );
  };

  const bestIsBetter = best !== null && best > outcome.deviation;

  return (
    <div className="quiz">
      <section className="score rise rise--1">
        <span className="score__seal" aria-hidden>
          帖
        </span>
        <p className="score__kicker">マナー偏差値テスト ／ 全10問</p>
        <div className="score__ring">
          <svg viewBox="0 0 190 190" aria-hidden>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--gold-line)" />
                <stop offset="100%" stopColor="var(--crimson)" />
              </linearGradient>
            </defs>
            <circle className="score__ring-bg" cx="95" cy="95" r={RING_RADIUS} />
            <circle
              className="score__ring-fg"
              cx="95"
              cy="95"
              r={RING_RADIUS}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="score__center">
            <span className="score__label">マナー偏差値</span>
            <span className="score__value">{outcome.deviation}</span>
            <span className="score__of">10問中 {outcome.correctCount}問正解</span>
          </div>
        </div>

        <h1 className="score__title">{outcome.rank.title}</h1>
        <p className="score__desc">{outcome.rank.description}</p>

        <div className="score__meta">
          <div className="score__stat">
            <div className="score__stat-value">上位{outcome.percentile}%</div>
            <div className="score__stat-label">推定の位置</div>
          </div>
          <div className="score__stat">
            <div className="score__stat-value">{outcome.correctCount} / 10</div>
            <div className="score__stat-label">正解数</div>
          </div>
          {best !== null ? (
            <div className="score__stat">
              <div className="score__stat-value">{best}</div>
              <div className="score__stat-label">前回までの最高</div>
            </div>
          ) : null}
        </div>

        {bestIsBetter ? (
          <p className="lead" style={{ marginTop: 14, fontSize: 13 }}>
            前回のほうが高い結果でした。もう一度挑戦すると記録を更新できます。
          </p>
        ) : null}
      </section>

      <ShareBar
        title="この結果を見せる"
        subtitle="同じ10問に友人も挑戦できます。何問取れるか、聞いてみてください。"
        shareText={shareText}
        url={url}
        onCopied={onCopied}
        onDownload={handleDownload}
        downloadLabel="画像を保存"
      />

      <section className="review">
        <h2 className="section-title">あなたの回答</h2>
        <div className="review__list">
          {QUIZ_QUESTIONS.map((question, i) => {
            const ok = correctness[i];
            const answer = question.choices.find((c) => c.id === question.answerId);
            return (
              <div className="review__item" key={question.id}>
                <span className={`review__mark review__mark--${ok ? 'ok' : 'ng'}`}>
                  {ok ? '○' : '×'}
                </span>
                <div>
                  <p className="review__q">{question.prompt}</p>
                  <p className="review__a">
                    正解は <b>{answer?.label}</b>。{question.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <OfferList heading="この機会にそろえておくもの" offers={QUIZ_OFFERS} />

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 30,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <a className="btn btn--accent btn--sm" href="#/quiz">
          もう一度挑戦する
        </a>
        <a className="btn btn--ghost btn--sm" href="#/calc">
          包む金額を調べる
        </a>
      </div>
    </div>
  );
}

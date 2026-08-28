import { useMemo, useState } from 'react';
import { AGE_BANDS, OCCASIONS, relationsFor } from '../lib/occasions';
import { calcRange, formatYen } from '../lib/amount';
import { buildCalcHash } from '../lib/share';
import type { OccasionId } from '../lib/types';
import { OccasionIcon } from './icons';
import { MizuhikiRule } from './common';

export default function GuidePage() {
  const [occasionId, setOccasionId] = useState<OccasionId>('wedding');
  const occasion = OCCASIONS.find((o) => o.id === occasionId)!;
  const relations = useMemo(() => relationsFor(occasionId), [occasionId]);

  const rows = useMemo(
    () =>
      relations.map((relation) => ({
        relation,
        amounts: AGE_BANDS.map(
          (band) =>
            calcRange({
              occasion: occasionId,
              relation: relation.id,
              age: band.id,
              region: 'national',
              attendance: 'attend',
              joint: false
            }).typical
        )
      })),
    [occasionId, relations]
  );

  return (
    <div data-ceremony={occasion.ceremony}>
      <section style={{ marginBottom: 22 }}>
        <span className="eyebrow">早見表</span>
        <h1 className="hero__title" style={{ fontSize: 'clamp(24px, 5.2vw, 34px)' }}>
          全場面の目安を一覧で
        </h1>
        <p className="lead" style={{ maxWidth: '40em' }}>
          全国平均・単身・出席時の金額です。地域や連名の条件を加えたい場合は、
          シミュレーターから個別に調べてください。
        </p>
      </section>

      <div className="guide-tabs" role="group" aria-label="場面の切り替え">
        {OCCASIONS.map((item) => (
          <button
            type="button"
            className="guide-tab"
            key={item.id}
            aria-pressed={item.id === occasionId}
            onClick={() => setOccasionId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="matrix">
          <caption className="sr-only">
            {occasion.label}の、関係性と年代ごとの金額の目安
          </caption>
          <thead>
            <tr>
              <th scope="col">相手</th>
              {AGE_BANDS.map((band) => (
                <th scope="col" key={band.id}>
                  {band.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.relation.id}>
                <th scope="row">{row.relation.label}</th>
                {row.amounts.map((amount, i) => (
                  <td key={AGE_BANDS[i].id}>{formatYen(amount)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="tips" style={{ marginTop: 20 }}>
        <h2 className="tips__title">
          <OccasionIcon
            name={occasion.icon}
            size={16}
            style={{ verticalAlign: '-2px', marginRight: 7 }}
          />
          {occasion.label}の基本
        </h2>
        <ol className="tips__list">
          <li className="tips__item">
            <span className="tips__num">表</span>
            <span>
              表書きは「{occasion.omotegaki}」。
              {occasion.omotegakiAlternatives.map((a) => a.label).join('・')}
              を使う場面もあります。
            </span>
          </li>
          <li className="tips__item">
            <span className="tips__num">水</span>
            <span>
              水引は{occasion.knot === 'musubikiri' ? '結び切り' : '蝶結び'}。
              {occasion.knot === 'musubikiri'
                ? '一度きりであってほしいことに使います。'
                : '何度あってもよいお祝いに使います。'}
            </span>
          </li>
          {occasion.tips.map((tip, i) => (
            <li className="tips__item" key={tip}>
              <span className="tips__num">{i + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ol>
      </section>

      <div style={{ marginTop: 30 }}>
        <MizuhikiRule />
      </div>

      <div style={{ textAlign: 'center', marginTop: 22 }}>
        <a
          className="btn btn--accent btn--sm"
          href={buildCalcHash({ occasion: occasionId }, false)}
        >
          この場面で詳しく調べる
        </a>
      </div>
    </div>
  );
}

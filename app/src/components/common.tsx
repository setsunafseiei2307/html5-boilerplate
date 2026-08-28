import { useEffect, useState, type ReactNode } from 'react';
import { DISCLOSURE, isPlaceholder, type AffiliateOffer } from '../lib/affiliate';
import {
  IconArrow,
  IconCheck,
  IconDownload,
  IconLine,
  IconLink,
  IconSearch,
  IconX
} from './icons';
import { MizuhikiKnot } from './Mizuhiki';
import {
  buildLineShareUrl,
  buildXShareUrl,
  copyText
} from '../lib/share';

/** 水引を模した区切り線。中央に結び目を置く。 */
export function MizuhikiRule() {
  return (
    <div className="rule">
      <svg className="mizuhiki-rule" viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden>
        <path className="mizuhiki-rule__a" d="M4 17C104 5 296 5 396 17" />
        <path className="mizuhiki-rule__b" d="M4 22C104 10 296 10 396 22" />
      </svg>
      <span className="rule__knot" aria-hidden>
        <MizuhikiKnot size={54} />
      </span>
    </div>
  );
}

export function Loading({ label = '読み込んでいます' }: { label?: string }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <svg className="loading__knot" viewBox="0 0 48 48" aria-hidden>
        <circle className="k1" cx="24" cy="24" r="18" />
        <circle className="k2" cx="24" cy="24" r="11" />
      </svg>
      <span className="loading__text">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty__icon">
        <IconSearch size={30} />
      </span>
      <span className="empty__title">{title}</span>
      <p className="empty__text">{text}</p>
      {action}
    </div>
  );
}

/** 画面下に一時的に出る通知。 */
export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  return (
    <div className="toast" role="status" aria-live="polite">
      <IconCheck size={16} />
      {message}
    </div>
  );
}

export interface ShareBarProps {
  title: string;
  subtitle: string;
  shareText: string;
  url: string;
  onCopied: () => void;
  onDownload?: () => void;
  downloadLabel?: string;
}

export function ShareBar({
  title,
  subtitle,
  shareText,
  url,
  onCopied,
  onDownload,
  downloadLabel = '画像を保存'
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      onCopied();
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <section className="share">
      <h2 className="share__title">{title}</h2>
      <p className="share__sub">{subtitle}</p>
      <div className={`share__row${onDownload ? ' share__row--wide' : ''}`}>
        <a
          className="sharebtn sharebtn--x"
          href={buildXShareUrl(shareText, url)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconX size={15} />
          Xでシェア
        </a>
        <a
          className="sharebtn sharebtn--line"
          href={buildLineShareUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconLine size={17} />
          LINEで送る
        </a>
        <button
          type="button"
          className={`sharebtn${copied ? ' sharebtn--done' : ''}`}
          onClick={handleCopy}
        >
          {copied ? <IconCheck size={15} /> : <IconLink size={15} />}
          {copied ? 'コピーしました' : 'URLをコピー'}
        </button>
        {onDownload ? (
          <button type="button" className="sharebtn" onClick={onDownload}>
            <IconDownload size={15} />
            {downloadLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}

/** アフィリエイト枠の一覧。ダミーのあいだはリンクにしない。 */
export function OfferList({ heading, offers }: { heading: string; offers: AffiliateOffer[] }) {
  if (offers.length === 0) return null;
  return (
    <section className="offers">
      <div className="offers__head">
        <h2 className="section-title">{heading}</h2>
      </div>
      <p className="offers__disclosure">{DISCLOSURE}</p>
      <div className="offers__list" style={{ marginTop: 12 }}>
        {offers.map((offer) =>
          isPlaceholder(offer) ? (
            <div className="offer offer--placeholder" key={offer.id}>
              <span className="offer__tag">{offer.tag}</span>
              <div className="offer__body">
                <p className="offer__title">{offer.title}</p>
                <p className="offer__text">{offer.body}</p>
                <span className="offer__soon">準備中</span>
              </div>
            </div>
          ) : (
            <a
              className="offer"
              key={offer.id}
              href={offer.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
            >
              <span className="offer__tag">{offer.tag}</span>
              <div className="offer__body">
                <p className="offer__title">{offer.title}</p>
                <p className="offer__text">{offer.body}</p>
                <span className="offer__cta">
                  {offer.cta}
                  <IconArrow size={15} />
                </span>
              </div>
            </a>
          )
        )}
      </div>
    </section>
  );
}

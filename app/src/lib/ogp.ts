/**
 * 静的ホスティングのため、クローラ向けの OGP をサーバー側で出し分けることはできない。
 * 画面遷移に合わせて title と meta を書き換え、JavaScript を実行する共有先
 * （Slack など）とブラウザのタブ・履歴・ブックマークには正しい文言が残るようにする。
 * X のように HTML をそのまま読むクローラには、index.html の既定 OGP が使われる。
 */

export interface PageMeta {
  title: string;
  description: string;
}

export const SITE_NAME = 'つつみ帖';

export const DEFAULT_META: PageMeta = {
  title: 'つつみ帖 — ご祝儀・香典、いくら包む？',
  description:
    '結婚祝いから香典まで、場面と関係性を選ぶだけで包む金額の目安と作法が分かります。表書き・水引・新札の可否まで一枚のカードに。'
};

type MetaKey = { attr: 'name' | 'property'; key: string };

const META_TARGETS: Record<'title' | 'description', MetaKey[]> = {
  title: [
    { attr: 'property', key: 'og:title' },
    { attr: 'name', key: 'twitter:title' }
  ],
  description: [
    { attr: 'name', key: 'description' },
    { attr: 'property', key: 'og:description' },
    { attr: 'name', key: 'twitter:description' }
  ]
};

function upsertMeta(target: MetaKey, content: string): void {
  const selector = `meta[${target.attr}="${target.key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(target.attr, target.key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applyMeta(meta: PageMeta): void {
  if (typeof document === 'undefined') return;
  document.title = meta.title;
  META_TARGETS.title.forEach((t) => upsertMeta(t, meta.title));
  META_TARGETS.description.forEach((t) => upsertMeta(t, meta.description));

  const href = window.location.href;
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', href);
  upsertMeta({ attr: 'property', key: 'og:url' }, href);
}

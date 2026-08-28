/**
 * 結果を 1200×630 の画像に描き起こす。
 * 静的ホスティングでは URL ごとの OGP 画像を生成できないため、
 * 「画像として保存してから投稿する」導線をこちらで用意する。
 */

export interface CardImageSpec {
  /** 上部の小さな見出し（例: 結婚祝い ／ 友人） */
  eyebrow: string;
  /** 中央の主役の文字（例: 30,000円） */
  headline: string;
  /** 主役の下の補足（例: 目安は 10,000円 〜 50,000円） */
  subline: string;
  /** 下部の一言 */
  footnote: string;
  /** 慶事は朱、弔事は藍でアクセントを変える */
  accent: 'crimson' | 'indigo';
  /** 下部の署名。空文字を渡すと出さない */
  signature?: string;
}

const WIDTH = 1200;
const HEIGHT = 630;

const PAPER = '#f7f2e8';
const INK = '#1c1b19';
const MUTED = '#6f6a60';
const CRIMSON = '#b02b32';
const INDIGO = '#2f4858';
const GOLD = '#a8873c';

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** 水引を模した2本の弧を描く。 */
function drawMizuhiki(ctx: CanvasRenderingContext2D, accentColor: string): void {
  ctx.save();
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';

  ctx.strokeStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(90, 176);
  ctx.bezierCurveTo(360, 84, 840, 84, 1110, 176);
  ctx.stroke();

  ctx.strokeStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(90, 198);
  ctx.bezierCurveTo(360, 106, 840, 106, 1110, 198);
  ctx.stroke();
  ctx.restore();
}

/** 和紙のざらつきを点描で表現する。決定的な擬似乱数を使い、毎回同じ絵にする。 */
function drawGrain(ctx: CanvasRenderingContext2D): void {
  let seed = 20260828;
  const next = (): number => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#8b7f68';
  for (let i = 0; i < 2600; i += 1) {
    const x = next() * WIDTH;
    const y = next() * HEIGHT;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.restore();
}

const FONT_STACK =
  '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", "Shippori Mincho", serif';

export function drawCard(canvas: HTMLCanvasElement, spec: CardImageSpec): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const accentColor = spec.accent === 'crimson' ? CRIMSON : INDIGO;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawGrain(ctx);

  // 外枠
  ctx.strokeStyle = 'rgba(28,27,25,0.16)';
  ctx.lineWidth = 2;
  roundedRect(ctx, 28, 28, WIDTH - 56, HEIGHT - 56, 12);
  ctx.stroke();

  drawMizuhiki(ctx, accentColor);

  ctx.textAlign = 'center';

  // 見出し
  ctx.fillStyle = MUTED;
  ctx.font = `400 30px ${FONT_STACK}`;
  ctx.fillText(spec.eyebrow, WIDTH / 2, 262);

  // 主役
  ctx.fillStyle = INK;
  ctx.font = `700 118px ${FONT_STACK}`;
  ctx.fillText(spec.headline, WIDTH / 2, 392);

  // 補足
  ctx.fillStyle = accentColor;
  ctx.font = `700 32px ${FONT_STACK}`;
  ctx.fillText(spec.subline, WIDTH / 2, 452);

  // 脚注
  ctx.fillStyle = MUTED;
  ctx.font = `400 24px ${FONT_STACK}`;
  ctx.fillText(spec.footnote, WIDTH / 2, 510);

  // 署名
  const signature = spec.signature ?? 'つつみ帖';
  if (signature) {
    ctx.fillStyle = INK;
    ctx.font = `700 28px ${FONT_STACK}`;
    ctx.fillText(signature, WIDTH / 2, 572);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2 - 92, 586);
    ctx.lineTo(WIDTH / 2 + 92, 586);
    ctx.stroke();
  }
}

/** 画像を PNG として保存させる。 */
export function downloadCard(spec: CardImageSpec, filename: string): void {
  const canvas = document.createElement('canvas');
  drawCard(canvas, spec);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Safari が読み終える前に破棄しないよう、少し待ってから解放する
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

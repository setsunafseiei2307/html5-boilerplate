import { useEffect, useState } from 'react';

/**
 * 目標値まで数字を動かす。結果画面の金額に一拍の見せ場をつくる。
 * 動きを減らす設定の環境では、最初から目標値を返す。
 */
export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return target;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? target : 0;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      setValue(target);
      return;
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      // 終わりに向かって減速させる
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

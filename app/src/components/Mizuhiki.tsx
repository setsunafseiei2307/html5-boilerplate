/**
 * あわじ結びを模した装飾。
 * 交差する2本の弧を朱と金で重ね、水引の「ほどけない結び」を表す。
 */
export function MizuhikiKnot({
  size = 120,
  className,
  title
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 0.5}
      viewBox="0 0 120 60"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g
        strokeWidth="2.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      >
        <path
          d="M6 44C6 14 44 8 60 30C76 52 114 46 114 18"
          stroke="var(--accent)"
        />
        <path
          d="M6 28C6 52 44 46 60 24C76 4 114 12 114 40"
          stroke="var(--gold-line)"
        />
        <path d="M42 46C42 52 44 56 48 58" stroke="var(--accent)" opacity="0.55" />
        <path d="M78 46C78 52 76 56 72 58" stroke="var(--gold-line)" opacity="0.55" />
      </g>
    </svg>
  );
}

/** 結果カードの上に渡す、細い二重の水引。 */
export function MizuhikiArc({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 44"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M6 30C106 8 294 8 394 30" />
      <path d="M6 38C106 16 294 16 394 38" />
    </svg>
  );
}

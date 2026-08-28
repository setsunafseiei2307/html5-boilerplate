import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...rest
  };
}

export function IconRing(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="15" r="6" />
      <path d="M9 9 12 4l3 5" />
    </svg>
  );
}

export function IconIncense(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 14v7" />
      <path d="M8.5 21h7" />
      <path d="M12 11c2.2-1.4 2.6-3.6 1.2-5.4C15.8 6.4 17 8.6 16 11" />
      <path d="M12 11c-1.8-.9-2.4-2.6-1.6-4.2" />
    </svg>
  );
}

export function IconStork(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 15c0-4 3.2-7 7.5-7 3 0 5 1.4 6.2 3.2" />
      <path d="M17.7 11.2 21 10l-1.4 3" />
      <circle cx="14.5" cy="10.5" r=".8" fill="currentColor" stroke="none" />
      <path d="M6 15c0 3 2.4 5 5.5 5S17 18 17 15" />
    </svg>
  );
}

export function IconSatchel(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3.5" y="8" width="17" height="12" rx="2.5" />
      <path d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V8" />
      <path d="M3.5 13h17" />
    </svg>
  );
}

export function IconHouse(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      <path d="M5.5 12v8h13v-8" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function IconFlower(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="9" r="2.2" />
      <path d="M12 6.8C12 4.5 10.6 3.5 9 4.2c-1.4.6-1.5 2.4 0 3.5" />
      <path d="M12 6.8c0-2.3 1.4-3.3 3-2.6 1.4.6 1.5 2.4 0 3.5" />
      <path d="M10.2 10.3c-2 1.1-3.4.3-3.5-1.4" />
      <path d="M13.8 10.3c2 1.1 3.4.3 3.5-1.4" />
      <path d="M12 11.2V20" />
      <path d="M12 15c-1.8 0-3-1-3.4-2.6" />
    </svg>
  );
}

export function IconCrane(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 18c3-1 4.5-3 5-5.5" />
      <path d="M9 12.5 14 8l6-3-2.5 5.5L20 13l-6 1" />
      <path d="M14 14c0 3-2 5-5 5H4" />
      <circle cx="17.6" cy="6.4" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconNoren(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 6h18" />
      <path d="M4.5 6v8.5" />
      <path d="M9.5 6v8.5" />
      <path d="M14.5 6v8.5" />
      <path d="M19.5 6v8.5" />
      <path d="M4.5 14.5h15" />
    </svg>
  );
}

export function IconArrow(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12h13" />
      <path d="m13 7 5 5-5 5" />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base(p)} strokeWidth={2.2}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function IconAlert(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5" />
      <path d="M12 16.2v.2" />
    </svg>
  );
}

export function IconInfo(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.8v.2" />
    </svg>
  );
}

export function IconLink(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2" />
      <path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2" />
    </svg>
  );
}

export function IconX(p: IconProps) {
  return (
    <svg {...base(p)} strokeWidth={0} fill="currentColor">
      <path d="M17.2 3h2.9l-6.3 7.2L21 21h-5.7l-4.5-5.8L5.6 21H2.7l6.7-7.7L2.4 3h5.8l4 5.3L17.2 3Zm-1 16.2h1.6L8 4.7H6.3l9.9 14.5Z" />
    </svg>
  );
}

export function IconLine(p: IconProps) {
  return (
    <svg {...base(p)} strokeWidth={0} fill="currentColor">
      <path d="M12 3C6.9 3 2.8 6.3 2.8 10.4c0 3.6 3.2 6.7 7.6 7.3.3.1.7.2.8.5.1.3.1.6 0 .9l-.1.8c0 .2-.2.9.8.5s5.4-3.2 7.4-5.4c1.3-1.4 2-2.9 2-4.6C21.3 6.3 17.1 3 12 3ZM8.3 12.8H6.5c-.3 0-.5-.2-.5-.5V8.9c0-.3.2-.5.5-.5s.5.2.5.5v2.9h1.3c.3 0 .5.2.5.5s-.2.5-.5.5Zm2-.5c0 .3-.2.5-.5.5s-.5-.2-.5-.5V8.9c0-.3.2-.5.5-.5s.5.2.5.5v3.4Zm4.1 0c0 .2-.1.4-.3.5h-.2c-.2 0-.3-.1-.4-.2l-1.7-2.3v2c0 .3-.2.5-.5.5s-.5-.2-.5-.5V8.9c0-.2.1-.4.3-.5h.2c.1 0 .3.1.4.2l1.7 2.3v-2c0-.3.2-.5.5-.5s.5.2.5.5v3.4Zm2.9-2.2c.3 0 .5.2.5.5s-.2.5-.5.5h-1.3v.8h1.3c.3 0 .5.2.5.5s-.2.5-.5.5h-1.8c-.3 0-.5-.2-.5-.5V8.9c0-.3.2-.5.5-.5h1.8c.3 0 .5.2.5.5s-.2.5-.5.5h-1.3v.8h1.3Z" />
    </svg>
  );
}

export function IconDownload(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v10" />
      <path d="m8 10.5 4 4 4-4" />
      <path d="M5 18.5h14" />
    </svg>
  );
}

export function IconSun(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

export function IconMoon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
    </svg>
  );
}

export function IconBrush(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M15.5 4.5 19.5 8.5" />
      <path d="m17.5 6.5-8 8-4 1 1-4 8-8" />
      <path d="M5.5 19.5c1.5.6 3 .2 3.6-1" />
    </svg>
  );
}

export function IconKnot(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 14c3-4 6-6 9-6s6 2 9 6" />
      <path d="M3 17.5c3-4 6-6 9-6s6 2 9 6" />
    </svg>
  );
}

export function IconBill(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M6 10v4M18 10v4" />
    </svg>
  );
}

export function IconEnvelope(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
      <path d="M4.5 9h15" />
      <path d="M9.5 13.5h5" />
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

const OCCASION_ICONS = {
  ring: IconRing,
  incense: IconIncense,
  stork: IconStork,
  satchel: IconSatchel,
  house: IconHouse,
  flower: IconFlower,
  crane: IconCrane,
  noren: IconNoren
};

export type OccasionIconName = keyof typeof OCCASION_ICONS;

export function OccasionIcon({ name, ...rest }: IconProps & { name: OccasionIconName }) {
  const Component = OCCASION_ICONS[name] ?? IconRing;
  return <Component {...rest} />;
}

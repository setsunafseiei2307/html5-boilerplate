export type Part = "front" | "side" | "rear";

export type TierListData = {
  title: string;
  headerTitle: string;
  outro: string;
  bgm: string;
  bgmVolume: number;
  introSec: number;
  cardIntervalSec: number;
  outroSec: number;
  partLabels: Record<Part, string>;
  partColors: Record<Part, string>;
  tiers: { id: string; color: string }[];
  items: { name: string; tier: string; parts: Part[] }[];
};

import { Composition } from "remotion";
import data from "../data/tierlist.json";
import { TierList } from "./TierList";
import type { TierListData } from "./types";

export const FPS = 30;
const d = data as TierListData;

// 長さはJSONから自動計算：導入 + 種目数×間隔 + 締め
export const totalFrames = (x: TierListData) =>
  Math.round((x.introSec + x.items.length * x.cardIntervalSec + x.outroSec) * FPS);

export const Root = () => (
  <Composition
    id="TierList"
    component={TierList}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={totalFrames(d)}
    defaultProps={{ data: d }}
  />
);

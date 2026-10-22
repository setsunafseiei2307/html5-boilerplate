import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import type { Part, TierListData } from "./types";

// 外部通信なしで書き出せるよう、OS標準の日本語フォントを使う
const FONT = '"Noto Sans JP", "Yu Gothic", "Hiragino Sans", Meiryo, IPAGothic, sans-serif';

const HEADER_H = 200;
const ROW_H = 400;
const ROW_GAP = 14;
const LABEL_W = 150;
const CARD_W = 280;
const CARD_H = 360;
const PARTS: Part[] = ["front", "side", "rear"];

// 種目名を読みやすい行に分ける：「（」で改行、本体が長ければ半分に割る
const splitName = (name: string): string[] => {
  const i = name.indexOf("（");
  const main = i >= 0 ? name.slice(0, i) : name;
  const sub = i >= 0 ? name.slice(i) : "";
  const mainLines = main.length > 6
    ? [main.slice(0, Math.ceil(main.length / 2)), main.slice(Math.ceil(main.length / 2))]
    : [main];
  return sub ? [...mainLines, sub] : mainLines;
};

const Card: React.FC<{
  data: TierListData; item: TierListData["items"][number]; startFrame: number; slot: number;
}> = ({ data, item, startFrame, slot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - startFrame;
  if (t < 0) return null;
  const p = spring({ frame: t, fps, config: { damping: 11, stiffness: 120, mass: 0.9 } });
  const y = interpolate(p, [0, 1], [-1300, 0]);
  const rot = interpolate(p, [0, 1], [-18, 0]);
  const flash = interpolate(t, [0, 12], [1, 0], { extrapolateRight: "clamp" });
  const tierIdx = data.tiers.findIndex((x) => x.id === item.tier);
  const tier = data.tiers[tierIdx];
  const left = LABEL_W + 16 + slot * (CARD_W + 12);
  const top = HEADER_H + tierIdx * (ROW_H + ROW_GAP) + (ROW_H - CARD_H) / 2;
  const lines = splitName(item.name);
  const fontSize = Math.min(52, Math.floor(250 / Math.max(...lines.map((l) => l.length))));

  return (
    <div style={{
      position: "absolute", left, top, width: CARD_W, height: CARD_H,
      transform: `translateY(${y}px) rotate(${rot}deg) scale(${1 + flash * 0.12})`,
      background: "#1d2230", border: `6px solid ${tier.color}`, borderRadius: 24,
      boxShadow: `0 0 ${30 * flash}px ${tier.color}`,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "space-between", padding: "20px 12px 16px", boxSizing: "border-box",
    }}>
      <div style={{
        color: "#fff", fontWeight: 900, fontSize, lineHeight: 1.25,
        textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        {lines.map((l, i) => <div key={i} style={{ whiteSpace: "nowrap" }}>{l}</div>)}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {PARTS.map((k) => {
          const hit = item.parts.includes(k);
          return (
            <div key={k} style={{
              background: hit ? data.partColors[k] : "#2c3345",
              color: hit ? "#10131c" : "#5d667d",
              fontWeight: 900, fontSize: 28, padding: "6px 9px", borderRadius: 12, whiteSpace: "nowrap",
            }}>{data.partLabels[k]}</div>
          );
        })}
      </div>
    </div>
  );
};

export const TierList: React.FC<{ data: TierListData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const introF = Math.round(data.introSec * fps);
  const outroF = Math.round(data.outroSec * fps);
  const interval = Math.round(data.cardIntervalSec * fps);
  const bodyOpacity = interpolate(frame, [introF - 10, introF + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // 段ごとのカード位置を、JSONの登場順で割り当て
  const counts: Record<string, number> = {};
  const placed = data.items.map((item, i) => {
    const slot = (counts[item.tier] = (counts[item.tier] ?? -1) + 1);
    return { item, slot, start: introF + i * interval };
  });

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(circle at 50% 0%, #1b2140 0%, #0a0c14 70%)",
      fontFamily: FONT,
    }}>
      {data.bgm && (
        <Audio
          src={staticFile(data.bgm)}
          volume={(f) => data.bgmVolume * interpolate(f, [durationInFrames - fps, durationInFrames], [1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          })}
        />
      )}

      <div style={{ opacity: bodyOpacity }}>
        <div style={{
          position: "absolute", top: 50, width: "100%", textAlign: "center",
          color: "#fff", fontWeight: 900, fontSize: 84,
        }}>{data.headerTitle}</div>
        <div style={{
          position: "absolute", top: 150, width: "100%", display: "flex",
          justifyContent: "center", gap: 20,
        }}>
          {PARTS.map((k) => (
            <span key={k} style={{
              background: data.partColors[k], color: "#10131c", fontWeight: 900,
              fontSize: 28, padding: "2px 16px", borderRadius: 10,
            }}>{data.partLabels[k]}</span>
          ))}
        </div>
        {data.tiers.map((t, i) => (
          <div key={t.id} style={{
            position: "absolute", left: 24, right: 24,
            top: HEADER_H + i * (ROW_H + ROW_GAP), height: ROW_H,
            background: "#141824", borderRadius: 24, overflow: "hidden", display: "flex",
          }}>
            <div style={{
              width: LABEL_W, background: t.color, color: "#10131c",
              fontWeight: 900, fontSize: 140, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>{t.id}</div>
          </div>
        ))}
      </div>

      {placed.map(({ item, slot, start }) => (
        <Card key={item.name} data={data} item={item} startFrame={start} slot={slot} />
      ))}

      <Sequence from={0} durationInFrames={introF}>
        <Intro text={data.title} />
      </Sequence>
      <Sequence from={durationInFrames - outroF}>
        <Outro text={data.outro} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Intro: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10 } });
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0a0c14", justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{
        color: "#fff", fontWeight: 900, fontSize: 130, lineHeight: 1.3, textAlign: "center",
        transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, padding: "0 60px",
        textShadow: "0 0 40px #ff4d6d",
      }}>
        {text.split(" ").map((l, i) => (
          <div key={i} style={{ color: i === 0 ? "#ffd93d" : "#fff" }}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: "rgba(5,6,12,0.88)", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        color: "#fff", fontWeight: 900, fontSize: 120, lineHeight: 1.35, textAlign: "center",
        transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`, textShadow: "0 0 40px #2ec4f1",
      }}>
        {text.split("\n").map((l, i) => (
          <div key={i} style={{ color: i === 0 ? "#ffd93d" : "#fff" }}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

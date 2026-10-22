# shorts（Remotion ティア表テンプレート）

## 使い方
1. `npm install`
2. BGMを `assets/bgm.mp3` に置く（gitには入れていません）
3. `data/tierlist.json` を書き換える（タイトル・段・種目・効く部位）
4. `npm run studio` でプレビュー / `npm run render` で `out/shoulder-tier.mp4` を書き出し

## JSONの要点
- `items` の並び順 = カードが飛び込む順（段ごとの左からの位置もこの順）
- `parts`: `front`(前部) / `side`(中部) / `rear`(後部)。部位名や色は `partLabels` / `partColors`
- 動画の長さは自動計算：`introSec + 種目数 × cardIntervalSec + outroSec`
- `bgm` を空文字にするとBGMなし。`bgmVolume` は0.3、最後の1秒でフェードアウト

## ライセンス
Remotionは個人・従業員3人以下の営利組織は商用でも無料（https://github.com/remotion-dev/remotion/blob/main/LICENSE.md）

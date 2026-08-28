# つつみ帖

冠婚葬祭で「いくら包めばいいのか」を、場面と相手との関係から30秒で出すツールです。
金額だけでなく、表書き・水引・袋の格・お札の向き・避けるべき金額まで一枚のカードにまとめます。
あわせて、作法の知識を10問で測る「マナー偏差値テスト」を備えています。

完全にクライアントサイドで動きます。サーバーもデータベースもログインもありません。
入力内容が端末の外に出ることはなく、履歴の保存は localStorage だけで完結します。

## できること

| 機能 | 内容 |
| --- | --- |
| つつむ金額シミュレーター | 8場面 × 14の関係性 × 5年代 × 7地域 × 出欠 × 連名から金額の目安を算出 |
| 作法カード | 表書き（宗派別の代替つき）・水引・袋の格・新札/旧札・中袋の書き方 |
| 忌み数の判定 | 4万・9万、慶事の偶数など、その金額帯で避けるべき額を理由つきで提示 |
| マナー偏差値テスト | 全10問。解答直後に理由を表示。偏差値・称号・推定パーセンタイルを算出 |
| 早見表 | 場面ごとに、関係性 × 年代の目安を表で一覧 |
| 共有 | 条件をURLに載せて共有。X / LINE / URLコピー / 結果カードのPNG保存 |

## 使い方

トップから「金額を調べる」に進み、場面 → 相手 → 自分の条件 の3段階を選ぶと結果が出ます。

結果画面のURLには条件がすべて入っているため、そのURLを開けば同じ結果が再現されます。
家族や同僚と金額をそろえたいときは、URLをそのまま送ってください。

```
#/calc?o=wedding&r=friend&a=30s&g=kanto&t=attend&v=1
```

| パラメータ | 意味 | 値の例 |
| --- | --- | --- |
| `o` | 場面 | `wedding` `funeral` `baby` `entrance` `newhome` `sickvisit` `longevity` `opening` |
| `r` | 相手 | `friend` `colleague` `boss` `sibling` `parent` など |
| `a` | 自分の年代 | `20s` `30s` `40s` `50s` `60plus` |
| `g` | 地域 | `national` `kanto` `chubu` `kinki` など |
| `t` | 式への出欠 | `attend` `absent_before` `absent_sameday` |
| `j` | 夫婦・連名 | `1` のとき連名 |
| `v` | 結果を直接開く | `1` |

不正な値は無視され、入力画面にフォールバックします。

## 開発

```bash
npm install
npm run dev      # 開発サーバー
npm test         # Vitest（ロジックのユニットテスト）
npm run build    # 型チェック + 本番ビルド
npm run preview  # ビルド結果の確認
```

GitHub Pages のようにサブパスへ配信する場合は、ビルド時に base を渡します。

```bash
DEPLOY_BASE=/リポジトリ名/ npm run build
```

## 技術構成

- React 18 + TypeScript + Vite
- ルーティングは `location.hash` を自前で解釈（依存ライブラリなし）
- 状態管理ライブラリなし。永続化は localStorage のみ
- テストは Vitest。判定・計算・URL変換はすべて `src/lib/` の純関数

```
src/
  lib/
    types.ts        型定義
    occasions.ts    場面・関係性・年代・地域のマスタ
    amount.ts       金額の算出、忌み数の判定、旧字体への変換
    etiquette.ts    表書き・水引・袋・お札の作法ルール
    quiz.ts         設問、採点、偏差値、共有トークンの符号化
    share.ts        ハッシュルーティングと共有URLの組み立て
    affiliate.ts    外部リンク（差し替えはこのファイルだけ）
    cardImage.ts    結果カードのPNG生成（Canvas）
    ogp.ts          画面ごとの title / meta の書き換え
    storage.ts      localStorage の読み書き
    useCountUp.ts   数値のカウントアップ
  components/       画面とUI部品
  styles/global.css デザイントークンと全スタイル
```

## 収益化の差し込み口

外部リンクは `src/lib/affiliate.ts` の1ファイルに集約しています。
各エントリの `url` を実際の計測URLに置き換えるだけで有効になります。
`about:placeholder` で始まっているあいだは「準備中」として表示され、
リンクにはならないため、死んだリンクへ飛ばすことはありません。

景品表示法のステルスマーケティング規制に対応するため、
枠の上に広告表記（`DISCLOSURE`）を必ず表示しています。

## OGP について

GitHub Pages のような静的ホスティングでは、URLごとに OGP を出し分けることができません。
そのため以下の実装にしています。

- HTML には既定の OGP を静的に置く（HTMLをそのまま読むクローラはこれを使います）
- 画面遷移に合わせて `title` と `og:*` を JavaScript で書き換える
  （JavaScriptを実行する共有先、ブラウザのタブ・履歴・ブックマークには反映されます）
- 結果ごとの画像は、Canvas で生成して端末に保存する導線を用意する

結果ごとの動的OGPが必要になった場合は、Cloudflare Workers などの
エッジ関数でHTMLを差し替える構成に移行してください。

## 免責

金額と作法は地域・家・宗派によって異なります。本アプリが示すのは全国的な一般の目安です。
最終的な判断は、その場をよく知る方に確認したうえで行ってください。

## ライセンス

MIT License

同梱しているフォントは SIL Open Font License 1.1 に基づきます。
詳細は `public/fonts/LICENSE.txt` を参照してください。

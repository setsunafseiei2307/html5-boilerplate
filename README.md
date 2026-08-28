# つつみ帖

冠婚葬祭で「いくら包めばいいのか」を、場面と相手との関係から30秒で出すWebアプリです。
金額だけでなく、表書き・水引・袋の格・お札の向き・避けるべき金額まで一枚のカードにまとめます。
あわせて、作法の知識を10問で測る「マナー偏差値テスト」を備えています。

## 公開URL

**https://setsunafseiei2307.github.io/html5-boilerplate/**

上のリンクをブラウザで開くと、アプリがそのまま動きます。GitHub Pages で公開されており、
サーバーもログインも不要です。

表示されない場合は、次を確認してください。

* このリポジトリが **Private** の場合、GitHub Pages のURLは第三者には見えません
  （Settings → General → Danger Zone → Change repository visibility から Public に変更できます）。
* `Settings → Pages` で Source が `GitHub Actions` になっているか
* `Actions` タブの `つつみ帖 を GitHub Pages へ公開` ワークフローが緑色（成功）になっているか

## このリポジトリについて

このリポジトリは元々 [HTML5 Boilerplate](https://html5boilerplate.com/) のテンプレートでしたが、
現在は `app/` フォルダ以下で「つつみ帖」を開発しています。アプリ本体の技術構成・開発方法・
収益化の仕組みなどは **[app/README.md](app/README.md)** に詳しくまとめています。

```
app/    ← つつみ帖 本体（React + TypeScript + Vite）
```

ルート直下に残っている `gulpfile.mjs` や `dist/` などは元テンプレートの名残で、
つつみ帖の動作には使用していません。

## ライセンス

MIT License（[app/LICENSE](app/LICENSE) を参照）。

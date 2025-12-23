# alqa
english-word-learn-app
Next.js 15 / Tailwind CSS / shadcn/ui を使って、語源とイメージで TOEIC 語彙を定着させる学習アプリです。Figma フレームの「Header」「TopPage_Drill」「TopPage_Image」「Word_Learn」「Word_Test」「Word_Test2」を再現し、public/data と public/img のアセットを参照する構成にしています。

## フォルダ構成

- `app/` App Router ルート。`page.tsx`(TopPage_Drill)・`image/page.tsx`(TopPage_Image)・`learn/[type]/[id]/`(Word_Learn)・`test/gogen/[id]/`(Word_Test)・`test/image/[id]/`(Word_Test2)。
- `components/` レイアウトと UI。`layout/` サイドバー付き AppShell、`cards/` トップページ用カード、`learn/` 学習用グリッド、`quiz/` クイズ UI、`ui/` shadcn ベースのボタン/カードなど。
- `lib/` 共通関数と型。`data.ts` で JSON を読み込み、`types.ts` にデータ型を定義。
- `public/data/` 学習・テストデータ (`gogen.json`, `image.json`, `test_gogen.json`, `test_image.json`)。
- `public/img/` サイドバーやページで使うアイコン。
- ルート直下: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `app/globals.css`, `README.md` など設定ファイル。

## 開発コマンド

```
npm run dev       # 開発サーバー
npm run build     # 本番ビルド
npm run start     # 本番サーバー
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

## データの扱い

- 語源ドリル/クイズ: `public/data/gogen.json` と `public/data/test_gogen.json` を使用。slug は `intro` `move` `biz` `form`。
- イメージ学習/8 択テスト: `public/data/image.json` と `public/data/test_image.json` を使用。質問 ID は `img-01` など。
- 変更時はデータ構造を保ちつつ、この README と仕様を更新してください。

## 実装メモ

- サイドバー(Header)は全ページ共通で public/img のアイコンを利用。
- Tailwind v3 + shadcn/ui ベースのカスタムスタイルを globals.css で定義。
- Google Fonts (`Space Grotesk`, `Noto Sans JP`) を `next/font` で読み込み、英字/日本語の両方を整えています。

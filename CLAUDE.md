# CLAUDE.md

このファイルは、Claude Code（claude.ai/code）がこのリポジトリのコードを扱う際のガイダンスです。

## プロジェクト概要

Next.js 15のプロダクトです。個人的な商品おすすめを表示します。アプリケーションはTypeScript、Tailwind CSSを使用し、コンテンツ管理にはmicroCMSというヘッドレスCMSと連携しています。

## 開発コマンド

```bash
# Turbopackで開発サーバーを起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# ESLintの実行
npm run lint

# Prettierでコード整形
npm run format

# Prettier整形チェック
npm run format:check
```

## アーキテクチャ

### 技術

- Next.js 15（App Router使用）
- TypeScript
- Tailwind CSS（スタイリング）
- microCMS（コンテンツ管理）
- Radix UI（UIプリミティブ）
- Vercel Analytics（トラッキング）

### ディレクトリ構成

- `app/` - Next.js App RouterのページとAPIルート
  - `api/` - 商品・カテゴリ用APIルート
  - `product/[id]/` - 動的な商品詳細ページ
- `components/` - 再利用可能なUIコンポーネント（主にshadcn/ui）
- `lib/` - ユーティリティ関数やmicroCMSクライアント設定
- `types/` - TypeScript型定義
- `hooks/` - URLクエリパラメータ管理用のカスタムフック

### データフロー

1. コンテンツ管理: 商品・カテゴリ・企業情報はmicroCMSで管理
2. APIレイヤー: Next.jsのAPIルート（`/api/products`, `/api/categories`）がmicroCMSからデータ取得
3. クライアント側: ReactコンポーネントがAPIルートからデータ取得し、フィルタ・ソートを処理
4. 状態管理: カテゴリ・評価・ソートなどのフィルタはURLクエリパラメータで管理（カスタムフック使用）

### 主な機能

- 商品一覧（検索・フィルタ・ソート対応）
- 商品詳細ページ（画像ギャラリー・リッチコンテンツ）
- モバイルファーストのレスポンシブデザイン
- カテゴリ別フィルタ（URL状態管理）
- 星評価システム・価格表示

### 必要な環境変数

- `MICROCMS_SERVICE_DOMAIN` - microCMSのサービスドメイン
- `MICROCMS_API_KEY` - microCMSのAPIキー

### microCMSのコンテンツタイプ

- products - 商品データ（写真・カテゴリ・評価・価格など）
- categories - 商品カテゴリ（スラッグ付き）
- companies - 企業・ブランド情報

### カスタムフック

- `useCategoryQueryParam` - カテゴリフィルタのURL状態管理
- `useRatingQueryParam` - 評価フィルタのURL状態管理
- `useSortQueryParam` - ソート順のURL状態管理

### スタイリングの注意点

- `customBg` や `grayBadge` などのカスタムTailwindクラスを使用
- モバイル/タブレット/デスクトップ対応のレスポンシブ設計
- Next.jsのImageコンポーネントによる画像最適化

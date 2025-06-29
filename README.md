# Auto Content Creator

ブログ記事とXポストの自動作成ツール  
URL取り込み + ベクトル化（Supabase）+ Gemini Flash生成・検証・修正により、WordPress・note・Xの3フォーマットを別ボタンで生成するブラウザアプリです。

## 技術スタック

- **Next.js 14** (App Router / TypeScript)
- **Tailwind CSS** 
- **Supabase** + pgvector (無料枠)
- **Google Gemini Flash** + embedding-001
- **readability-extractor** (本文抽出)
- **langchain** (RAG ヘルパ用)

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、必要な値を設定：

```bash
cp .env.example .env.local
```

`.env.local` に以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_VERTEX_API_KEY=your_gemini_api_key
```

### 3. Supabase データベースの初期化

Supabase SQLエディタで以下のファイルを実行：

1. `supabase/init.sql` - articlesテーブル + pgvector拡張
2. `supabase/match_articles.sql` - ベクトル類似度検索用関数

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## Google Cloud APIキーの取得方法

### 1. Google Cloud Console にアクセス
- [Google Cloud Console](https://console.cloud.google.com/) にログイン

### 2. プロジェクトの作成/選択
- 新しいプロジェクトを作成、または既存のプロジェクトを選択

### 3. Gemini API の有効化
- 「APIとサービス」→「ライブラリ」
- 「Generative Language API」を検索して有効化

### 4. APIキーの作成
- 「APIとサービス」→「認証情報」
- 「認証情報を作成」→「APIキー」
- 作成されたAPIキーをコピー

### 5. APIキーの制限（推奨）
- 作成したAPIキーの「編集」をクリック
- 「APIの制限」で「Generative Language API」のみ許可
- 必要に応じてHTTPリファラーやIPアドレスの制限を設定

## 使い方

### 1. URLインポート
- 記事のURLを入力して「インポート」ボタンをクリック
- 記事内容がSupabaseにベクトル化されて保存されます

### 2. 下書き入力
- 生成したいコンテンツの下書きをテキストエリアに入力

### 3. コンテンツ生成
- 「WordPress」「note」「X (Twitter)」ボタンのいずれかをクリック
- AIが下書きを基に、RAG検索・生成・ファクトチェック・修正を自動実行

### 4. プレビュー・コピー
- 生成されたコンテンツがタブで表示されます
- Xポストは文字数制限（280文字）の警告が表示されます
- 「クリップボードにコピー」で結果をコピー可能

## 機能

- **RAG（Retrieval-Augmented Generation）**: 過去にインポートした記事から関連情報を検索
- **3段階AI生成**: 初期生成 → ファクトチェック → 修正版生成
- **フォーマット別最適化**: WordPress（長文・構造化）、note（親しみやすい）、X（短文・ハッシュタグ）
- **リアルタイム文字数カウント**: 特にXポストの280文字制限を監視
- **レスポンシブUI**: デスクトップ・モバイル対応

## ファイル構成

```
root/
├─ .env.example                # 環境変数テンプレート
├─ supabase/                   
│   ├─ init.sql               # データベース初期化
│   └─ match_articles.sql     # 類似記事検索関数
├─ src/
│   ├─ app/
│   │   ├─ page.tsx           # メインページ
│   │   ├─ layout.tsx         # レイアウト
│   │   ├─ globals.css        # グローバルスタイル
│   │   └─ api/
│   │       ├─ import/route.ts    # URLインポートAPI
│   │       └─ generate/route.ts  # コンテンツ生成API
│   ├─ components/
│   │   ├─ DraftInput.tsx         # 下書き入力
│   │   ├─ ImportUrl.tsx          # URL入力
│   │   ├─ GenerateButtons.tsx    # 生成ボタン
│   │   └─ PreviewTabs.tsx        # プレビュータブ
│   └─ lib/
│       ├─ supabase.ts        # Supabaseクライアント
│       ├─ embeddings.ts      # Gemini embedding
│       ├─ rag.ts             # RAG検索機能
│       └─ gemini.ts          # Gemini生成・ファクトチェック
└─ README.md
```

## 開発者向け情報

- TypeScript完全対応
- エラーハンドリング実装済み
- コンポーネント分離設計
- API型安全性確保

## ライセンス

MIT
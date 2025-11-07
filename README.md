# 🧭 Todo & Memo チーム開発アプリ

チームで作成したシンプルな **Todo & Memo アプリ** です。  
ログイン後、自分専用のタスク管理とメモ作成ができるようになっています。

---

## 🚀 プロジェクト概要

- **開発期間**:2025/7/25-2025/8/20(約1ヶ月)
- **目的**：チームでの開発練習
- **機能**：
  - ユーザー認証（Supabase）
  - Todoリストの追加・編集・削除
  - メモの作成・保存・表示
  - 自分のアカウントデータのみ閲覧可能
- **技術スタック**：
  - **Next.js**
  - **Supabase**（認証・データベース）
  - **Prisma ORM**
  - **TypeScript**

## 🛠️ 環境構築

### 1. リポジトリのクローン

git clone https://github.com/itc-ss24007/my_pbl_todo_supabase_2025.git 
cd my_pbl_todo_supabase_2025

### 2. パッケージのインストール

 npm install

### 3. 環境変数の設定

ルートディレクトリに .env ファイルを作成し、Supabase の情報を記入します。
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

### 4. Prisma マイグレーション

npx prisma migrate deploy

### 5. 開発サーバー起動

npm run dev
👉 ブラウザで http://localhost:3000 を開いて確認！

📦 ディレクトリ構成
/
├── README.md
├── app
│   ├── _repositories    # データ操作ロジック層
│   ├── api              # APIルート
│   ├── dashboard
│   ├── home
│   ├── login            # ログインページ
│   ├── signup           # サインアップページ
│   ├── memo             # Memo管理ページ
│   └── todo             # Todo管理ページ
│   ├── favicon.ico
│   ├── globals.css
│   ├── page.tsx
│   ├── layout.tsx
├── lib
│   ├── supabase.ts      # Supabaseクライアント設定
├── prisma
│   ├── migrations       # マイグレーション履歴
│   └── schema.prisma    # Prismaスキーマ定義

👥 チームメンバー
名前	役割
チーム　　UIデザイン
Aさん	  ユーザー認証
B、Cさん	Memo管理ページバックエンド	
あなた	Todo管理ページ,機能統合・レビュー

🌟 スクリーンショット
















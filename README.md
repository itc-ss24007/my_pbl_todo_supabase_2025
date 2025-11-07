# 🧭 Todo & Memo チーム開発アプリ

チームで作成したシンプルな **Todo & Memo アプリ** です。  
ログイン後、自分専用のタスク管理とメモ作成ができるようになっています。

---

## 🚀 プロジェクト概要

- **開発期間**:2025/7/25-2025/8/20(約 1 ヶ月)
- **目的**：チームでの開発練習
- **機能**：
  - ユーザー認証（Supabase）
  - Todo リストの追加・編集・削除
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

```
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
```

## 👥 チームメンバー / Team Members

本プロジェクトは 4 名のチームで開発されました。  
各メンバーがそれぞれの担当領域を持ち、協力してアプリ全体を完成させました。

| 名前 / Name    | 役割 / Role                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| チーム         | 🎨 UI デザイン / UI Design                                                    |
| A さん         | 🔐 ユーザー認証機能 / User Authentication                                     |
| B さん・C さん | 🧠 Memo 管理ページ（バックエンド）/ Memo Management Backend                   |
| 自分           | ✅ Todo 管理ページ、機能統合・レビュー / Todo Page, Integration & Code Review |

🌟 スクリーンショット

## 📷 スクリーンショット

![loginページ](screenshot/login.png)
![signupページ](screenshot/signup.png)
![Todo管理ページ](screenshot/todo_add.png)
![Memo 管理ページ](screenshot/memo_add.png)

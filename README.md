# Instagram投稿ジェネレーター

美容室・整体院・飲食店・ネイルサロンなど小規模店舗向けのInstagram投稿文自動生成ツールです。  
お店の特徴を入力するだけで、投稿本文・ハッシュタグ・CTAを10個まとめて生成します。

## 機能

- お店の情報を1つのテキストエリアに入力するだけで使える
- 投稿文10個（悩み共感・季節ネタ・Before/After・よくある質問など）を一括生成
- 各投稿カードに「コピー」ボタン付き・お気に入り★・ステータス管理・日付設定
- 30日投稿カレンダー表示
- 毎日の投稿リマインダー通知
- 季節テーマ自動提案
- 全投稿を一括コピーする機能
- レスポンシブデザイン（スマホ対応）
- ログイン・DB不要

## 環境変数

`.env.example` を参考に `.env.local` を作成してください。

```bash
cp .env.example .env.local
```

| 変数名 | 説明 |
|---|---|
| `OPENAI_API_KEY` | OpenAI APIキー（未設定時はサンプルデータを返します） |

APIキーは **絶対にフロント側に公開しないでください**。サーバー側（APIルート）のみで使用しています。

## ローカル開発

```bash
npm install
npm run dev
```

`http://localhost:3000` でアクセスできます。

## ビルド

```bash
npm run build
npm run start
```

## Vercelへのデプロイ

1. [Vercel](https://vercel.com) にGitHubリポジトリを連携してインポートする
2. 「Environment Variables」に `OPENAI_API_KEY` を設定する
3. デプロイする（設定は以上）

> APIキーを設定しない場合でも、サンプルのダミー投稿文10個が表示されるため、UIの確認が可能です。

## 技術スタック

- [Next.js 15](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API（gpt-4o-mini）

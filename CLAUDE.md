# sasa_tools

## プロジェクト概要

Windows 95 テーマのブラウザデスクトップ型ユーティリティツール集。
各ツールはデスクトップアイコンをクリックするとモーダルウィンドウとして開く。
GitHub Pages にデプロイされた静的 SPA。

## 開発・ビルドコマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 型チェック (tsc -b) + Vite ビルド
npm run lint     # ESLint
npm run preview  # プロダクションビルドのプレビュー
```

## デプロイ

master ブランチへの push で GitHub Actions が自動ビルド → GitHub Pages (`/sasa_tools/`) に公開。
設定: `.github/workflows/deploy.yml`、ベースパス: `vite.config.ts` の `base: '/sasa_tools/'`

## アーキテクチャ

- **SPA**、ルーティングライブラリなし（モーダルウィンドウで画面遷移を代替）
- **ツール登録**: `src/config/desktopIcons.tsx` の配列に追加するとデスクトップアイコンとして出現
- **各ツール**: `src/tools/ToolName/` に自己完結（コンポーネント + CSS Modules）
- **状態管理**: React hooks + localStorage のみ（グローバル状態ライブラリなし）
- **UI フレームワーク**: @react95/core（Windows 95 スタイルコンポーネント）

## 新規ツールの追加手順

1. `src/tools/NewTool/NewTool.tsx` を作成（`src/tools/SampleTool.tsx` を参考）
2. `src/tools/NewTool/NewTool.module.css` を作成
3. `src/config/desktopIcons.tsx` に以下の形式で登録

```tsx
{
  id: 'new-tool',
  title: 'New Tool',
  icon: <SomeIcon style={{ width: 32, height: 32 }} />,
  content: <NewTool />,
  defaultWidth: 600,
  defaultHeight: 400,
}
```

## TipsHub への Tip 追加

`src/tools/TipsHub/tips/` に Markdown ファイルを追加するだけ。ビルド時に自動ロードされる。

必須フロントマター（YAML）:

```yaml
---
title: "タイトル"
description: "概要（検索対象になる）"
tags: ["タグ名"]
---
```

- タグは複数指定可能: `tags: ["Laravel", "DB"]`
- 検索はタイトル・説明・タグに対してキーワード検索 + タグの AND フィルタリング

### Tip 執筆ルール

- 章と章の間に `---`（水平線）を入れない

## TypeScript

- strict モード有効（`noUnusedLocals`, `noUnusedParameters` 含む）
- CSS は CSS Modules を使用（`*.module.css`）
- `verbatimModuleSyntax: true` → 型のみのインポートは `import type` を使う

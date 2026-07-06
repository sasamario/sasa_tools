---
title: "Claude Code導入手順"
description: "Claude Codeの導入と設定"
tags: ["Claude"]
---

# 導入
## アカウント作成〜ログイン
1. https://claude.ai/login からGoogleアカウントでログイン（アカウントがない場合新規作成できる）
2. Proプランを選択（FreeプランだとClaude Codeが使えないため）
3. ログイン

## Claudeセットアップ
1. Claude Codeインストール。Mac: `curl -fsSL https://claude.ai/install.sh | bash`
2. `claude --version`でClaudeがインストールできたことを確認
3. `claude`で初期セットアップをする（作成したClaudeアカウントと紐づける）

※3でアカウントのログイン方法を聞かれるので「1. Claude account with subscription」を選ぶ。これは有料プランに加入したアカウントでログインということ。「2. Claude Console」はAPIキーを使った従量課金で使う場合のものなので選ばないこと。

### 参考
- [Claude Code Docs クイックスタート](https://code.claude.com/docs/ja/quickstart)
- [初心者にもわかるClaude Codeの始め方｜インストール手順を図解](https://envader.plus/article/558)

# VSCode用の拡張機能導入
ドキュメントからVSCodeの拡張機能ページに遷移できる。
Claude Codeっぽい拡張機能はいくつかあるが、必ず発行元が`anthropic.com`となっていることを確認する。

### 参考
- [VS Code で Claude Code を使用する](https://code.claude.com/docs/ja/vs-code)

# 設定
## データ利用に関するオプトアウト
デフォルトで入力内容を学習に利用する設定になっているのでオプトアウトする。
https://claude.ai/new

Web版Claudeの左下にあるアカウントを押して、設定 > プライバシーにある「AIモデルの改善にご協力ください」のトグルをオフにする。

## .envを参照しないようにする
.envなど特定のファイルを参照しないようにする。
プロジェクトに限らず設定したいのでUserスコープ（すべての場所で適用される個人設定）

Macの場合、`code ~/.claude/settings.json`で設定ファイルをVSCodeで開いて以下のように設定を追加する。
※Windowsなら、`C:\Users\ユーザー名\.claude\settings.json`にあると思う
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "theme": "dark",
  "permissions": {
    "deny": [
      "Bash(curl *)",
      "Read(**/.env)",
      "Read(**/.env.*)",
      "Bash(git push *)"
    ]
  },
  "effortLevel": "medium"
}
```
- `"$schema": "https://json.schemastore.org/claude-code-settings.json"`
  - Claude Code設定の公式JSONスキーマを指している。これによりVSCodeでオートコンプリートやインライン検証が有効になる
- permissions.denyで指定の操作をしないよう設定
  - Userスコープ（全体設定）で上記指定しているため`**/.env`のようにワイルドカードを使って階層関係なく指定している　※ただ、ドキュメントを見ると`(.env)`と`(**/.env)`は同じらしい...


**★permissions.denyの設定だと完全に防ぐことはできないようなので、上記設定は気休め程度とのこと（お願い程度）**
→より確実に防ぐためにはhooksで対応する必要があるとのこと。

### 参考
- [Claude Code の設定](https://code.claude.com/docs/ja/settings)
- [Claude Code Docs 権限ルール構文](https://code.claude.com/docs/ja/permissions#permission-rule-syntax)
- [ClaudeCodeに.envを勝手に読ませないためのベストプラクティス](https://zenn.dev/caen/articles/aa1359184dfef2)

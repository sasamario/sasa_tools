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
  "theme": "dark",
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(**/.env)",
      "Read(**/.env.*)"
    ]
  }
}
```
今回プロジェクト設定ではなくUserスコープで設定するため、`**/.env`のようにワイルドカードを使って階層関係なく.envを読まないようにしている。
軽く解説するとpermissions.denyで指定の操作をしないような設定をすることができる。

### 参考
- [Claude Code の設定](https://code.claude.com/docs/ja/settings)
- [ClaudeCodeに.envを勝手に読ませないためのベストプラクティス](https://zenn.dev/caen/articles/aa1359184dfef2)

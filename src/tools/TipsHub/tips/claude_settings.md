---
title: "Claude Codeの設定"
description: "Claude Code settings.jsonに関するTips"
tags: ["Claude"]
---

# Claude Codeの設定
Claude Codeの設定は、複数のレイヤーで構成されていて、異なるスコープの設定が優先度順にマージされる。

参考: [Claude Codeの設定](https://code.claude.com/docs/ja/settings)

## 設定スコープ一覧
優先度が高いスコープほど後勝ち（他をオーバーライドする）。上から優先度が高い順。

| 優先度 | スコープ | settings.jsonの場所 | 用途 |
|------|------|------|------|
| 1(高) | Managed（組織管理） | macOS: `/Library/Application Support/ClaudeCode/managed-settings.json` | IT/DevOpsが展開する組織全体の強制ポリシー。ユーザーやプロジェクトの設定で上書き不可 |
| 2 | コマンドライン引数 | - | そのセッション限りの一時的な上書き |
| 3 | Local（個人・プロジェクト単位） | `.claude/settings.local.json` | 特定プロジェクトにおける自分専用の設定。`.gitignore`対象でチームには共有されない |
| 4 | Project（チーム共有） | `.claude/settings.json` | リポジトリの全コラボレーターに共有したい設定。git commit対象 |
| 5(低) | User（個人・全プロジェクト共通） | `~/.claude/settings.json` | 全プロジェクトに適用したい個人設定のデフォルト |

- Managedは組織のセキュリティ要件（禁止コマンド、必須hooksなど）の強制に使う
- Local は「まだチームに共有したくない個人設定」や「自分のマシン固有の設定」を試すのに向いている
- 同じ設定項目が複数スコープに存在する場合、配列（`permissions.allow`など）はマージ、単一値（`model`など）は優先度が高い方が採用される（例外もあるらしい）

※Windows では、`~/.claude`として表示されるパスは`%USERPROFILE%\.claude`に解決される

### マージされる例（配列項目）
UserとProjectでそれぞれ`permissions.deny`に別のルールがあると、両方とも有効になる（和集合）。

```json
// User: ~/.claude/settings.json
{ "permissions": { "deny": ["Bash(git push *)"] } }

// Project: .claude/settings.json
{ "permissions": { "deny": ["Read(**/.env)"] } }

// 実際に適用される内容（両方とも効く）
// deny: ["Bash(git push *)", "Read(**/.env)"]
```

### 優先度が高い方が採用される例（単一値項目）
`model`のような単一値の項目は、優先度が高いスコープの値で上書きされる。

```json
// User: ~/.claude/settings.json
{ "model": "claude-haiku-4-5" }

// Project: .claude/settings.json
{ "model": "claude-sonnet-5" }

// 実際に適用される内容（Projectの方が優先度が高いので採用される）
// model: "claude-sonnet-5"
```


## sandboxとpermissionsの使い分け
どちらも「アクセス制御」の設定だが、防いでいる経路が異なるので、両方を意識しないと片方だけ穴が残ることがある。

### Claude Codeがファイルにアクセスする2つの経路
1. **Bashツール経由**: `cat ~/.ssh/id_rsa` のようにシェルコマンドを実行してアクセスする方法
2. **Readツール経由**: Claude Code自体が持つファイル読み取り機能で、シェルコマンドを介さず直接アクセスする方法

| 設定 | 制御対象 | 制御できる経路 |
|------|------|------|
| `sandbox.filesystem` / `sandbox.credentials` | サンドボックス化されたコマンド実行 | ①Bashツール経由のみ |
| `permissions`（`allow` / `deny`） | Claude Codeの各ツール（Read、Bash、Editなど） | ①Bashツール経由 + ②Readツール経由 |

つまり `sandbox.credentials.files` で `~/.ssh` をdenyしても、それはBashツール経由のアクセスを防ぐだけで、Readツールによる直接読み取りには効かない。
「認証情報を本当に読ませたくない」場合は、両方に同じパスを設定する必要がある。

```json
{
  "permissions": {
    "deny": [
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)"
    ]
  },
  "sandbox": {
    "enabled": true,
    "credentials": {
      "files": [
        { "path": "~/.ssh", "mode": "deny" },
        { "path": "~/.aws", "mode": "deny" }
      ]
    }
  }
}
```

■使い分け方針
- **permissions**: ツールの種類（Read/Write/Bash/Editなど）を横断して、特定のファイルやコマンドへのアクセス自体を許可/拒否/確認させたい時
- **sandbox**: サンドボックス化されたコマンド実行（ネットワークアクセスやファイル書き込みなど）を細かく制御したい時

permissionsは実行前のコマンド文字列を見て判断するだけなのに対し、sandboxは許可されたコマンドが実行中に何をしても境界の外に出さないOSレベルの強制なので、両方が独立した防御層として必要になる。


# 各スコープでの設定サンプル
## User（~/.claude/settings.json）の設定
システムレベルで、すべてのプロジェクトで保護したいものはここで設定する。

### 用途
- マシン全体のデフォルト設定
- 複数プロジェクトで共通する個人的なカスタマイズ
- グローバル環境変数の定義
- 個人用APIキーやトークン

### 設定サンプル
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "theme": "dark",
  "permissions": {
    "deny": [
      "Read(**/.env)",
      "Read(**/.env.*)",
      "Bash(git push *)",
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)"
    ]
  },
  "effortLevel": "medium",
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": false,
    "credentials": {
      "files": [
        { "path": "~/.ssh", "mode": "deny" },
        { "path": "~/.aws", "mode": "deny" }
      ]
    }
  }
}
```



## Project（.claude/settings.json）の設定
プロジェクトディレクトリに設置する。git管理対象で、チームで共有する設定。

### 用途
- チーム全体で統一したい権限ルール（permissions）
- プロジェクト固有のMCPサーバー設定
- チーム標準のhooks（lint実行、フォーマットなど）
- プロジェクト共通の環境変数
- チームで揃えたいプラグイン設定

### 設定サンプル
TODO...


## Local（.claude/settings.local.json）の設定
プロジェクトディレクトリに設置するが、`.gitignore`で自動的に除外され、リポジトリには含まれない自分専用の設定。

### 用途
- チームにまだ共有したくない個人的な設定の試し置き
- 自分のマシン固有の設定（ローカルパス、個人環境依存の権限など）
- Projectスコープの設定を一時的に上書きしたい場合
- 個人的な実験・デバッグ用の設定

### 設定サンプル
TODO...




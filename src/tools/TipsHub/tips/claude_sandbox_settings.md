---
title: "Claude Code Sandboxの設定"
description: "Claude Code Sandboxの設定に関するTips"
tags: ["Claude"]
---

# sandbox.filesystem
サンドボックス内のコマンドがファイルシステムにアクセスできる範囲を制御する設定。

## 設定例
```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["~/.kube", "~/.npm"],
      "denyRead": [".env", ".env.local"],
      "denyWrite": ["~/.ssh"],
      "allowRead": ["./config"]
    }
  }
}
```

### 各設定項目の説明
| 設定 | 説明 |
|------|------|
| `allowWrite` | ワーキングディレクトリ外への書き込みを許可するパスを指定。ツールがキャッシュやログを書き込む場所を許可 |
| `denyRead` | 読み取りをブロックするパスを指定。`.env` など秘密ファイルを保護 |
| `denyWrite` | 書き込みをブロックするパスを指定。デフォルトで必要な場面は少ない |
| `allowRead` | `denyRead` の中で特定パスだけ読み取りを許可。例：`.env` はブロックだが `./config` は許可 |

**■補足1：パス指定は`**`のようなglobではなくディレクトリ単位**
`sandbox.filesystem`のパスは、`permissions`の`Read()`/`Edit()`ルールとは異なり、globパターン（`**`など）ではなく単純なパスプレフィックスで指定する。指定したパスがディレクトリの場合、`**/`を付けなくても配下すべて（サブディレクトリ・ファイル）が自動的に対象になる。
　
例：`"denyRead": ["~/"]` と `"allowRead": ["~/projects"]` を組み合わせた場合、ホームディレクトリ配下は基本ブロックされつつ `~/projects` 配下だけ読み取り可能になる（より具体的なパスが優先される）。
　
**■補足2：denyRead と credentials.files のdeny の使い分け**
`denyRead` と `credentials.files mode: deny` は、どちらも読み取りをブロックするが、用途で使い分けるとよい。
- `denyRead` ：プロジェクト固有の秘密ファイルをブロック（`.env`、`secrets/` など）
- `credentials.files mode: deny` ：システムレベルの認証情報ファイルをブロック（`~/.ssh`、`~/.aws` など）

参考: [サンドボックス化が許可と許可モードにどのように関連するか](https://code.claude.com/docs/ja/sandboxing#how-sandboxing-relates-to-permissions-and-permission-modes)

# sandbox.credentials
## 認証情報の保護
前提として、サンドボックスにおけるデフォルトの読み取り動作は公式ドキュメントで以下のように記載されている。

> 特定の拒否ディレクトリを除く、コンピュータ全体への読み取りアクセス。このデフォルトは ~/.aws/credentials や ~/.ssh/ などの認証情報ファイルの読み取りを許可することに注意してください。sandbox.credentials を使用してこれらのファイルの読み取りをブロックし、シークレット環境変数の設定を解除するか、パスを denyRead に追加してください。
引用元: [サンドボックス化の仕組み](https://code.claude.com/docs/ja/sandboxing#how-sandboxing-works)

デフォルトではSSH鍵やAWS認証情報も読み取りが可能な状態。
仮に攻撃を受けた場合、こういった認証情報ファイルを読み取りされてしまう可能性がある。
そのため、こういった重要な認証情報に関しては読み取りアクセスを明示的にブロックする必要がある。

## sandbox.credentialsとは
> sandbox.credentials 設定は、サンドボックス化されたコマンドから保護する認証情報ファイルと環境変数を宣言します。各エントリはファイルパスまたは環境変数と mode を指定します。専用の credentials ブロックは、認証情報ルールをグループ化し、一般的なファイルシステムルールから分離します。Claude Code v2.1.187 以降が必要です。
引用元: [認証情報を保護する](https://code.claude.com/docs/ja/sandboxing#protect-credentials)

```bash
# Claude Codeのバージョン確認
claude --version
```

## credentialsの設定項目について
以下設定参考例
```json
{
  "sandbox": {
    "enabled": true,
    "credentials": {
      "files": [
        { "path": "~/.ssh", "mode": "deny" },
        { "path": "~/.aws", "mode": "deny" }
      ],
      "envVars": [
        { "name": "GH_TOKEN", "mode": "mask", "injectHosts": ["api.github.com"] },
        { "name": "NPM_TOKEN", "mode": "mask", "injectHosts": ["registry.npmjs.org"] }
      ]
    }
  }
}
```

### files（ファイル保護）
サンドボックス内のコマンドが認証情報ファイルにアクセスするのをブロックする設定。
ここで指定したファイルやディレクトリは、サンドボックス内では読み取り不可となる。

| 項目 | 説明 |
|------|------|
| `path` | 保護するファイル/ディレクトリのパス。`~/` でホームディレクトリからの相対パスを指定 |
| `mode` | 保護モード。filesでは`deny` のみサポート（ `mask` は非対応） |

ディレクトリ指定時はディレクトリ内のすべてのファイルとサブディレクトリが保護される

### envVars（環境変数保護）
サンドボックス内のコマンドが秘密の環境変数にアクセスするのをブロック、または安全に認証する設定。
ここで指定した環境変数は、指定したモードに応じてサンドボックス内で制御される。

| 項目 | 説明 |
|------|------|
| `name` | 保護する環境変数名（例：`GITHUB_TOKEN`、`NPM_TOKEN`） |
| `mode` | 保護モード。`deny` または `mask` を指定 |
| `injectHosts` | オプション。`mask` モード時に認証情報を注入するホストを指定。省略時は `network.allowedDomains` に適用 |

`injectHosts` は `mode: "mask"` の場合のみ有効で、複数のホストを配列で指定可能。

### mode（保護モード）について

環境変数の保護方法は2つのモードから選択できる。

#### ■mode: "deny"
環境変数を完全に削除する方式。

- サンドボックス内でコマンド実行時に指定した環境変数がクリア（削除）される
- 変数を参照するコマンドは実行されない、または失敗する

**メリット：** セキュリティが最も高い。認証情報が完全に隔離される
**デメリット：** 認証が必要なツール（`gh`、`npm`、`aws` など）が認証に失敗する可能性がある

#### ■mode: "mask"（v2.1.199以降）
環境変数を保護しながら、認証ツールが動作し続ける方式。

1. サンドボックス内のコマンドは実際の認証情報ではなく**代替値**を受け取る
2. コマンドが外部サーバーにリクエストを送る際、サンドボックス外のプロキシが代替値を**実際の認証情報に置き換える**
3. サーバーには実際の認証情報が送られ認証が成功するが、コマンドやログには認証情報が残らない

**メリット：** 認証情報を保護しながら認証ツールが正常に動作する
**デメリット：** 以下の設定が必須となり、セットアップが複雑
- `network.tlsTerminate: {}` の設定が必要
- `injectHosts` に指定したホストは `network.allowedDomains` に含まれている必要がある

# その他設定項目
細かい設定項目は以下確認。
- [サンドボックス化を設定する](https://code.claude.com/docs/ja/sandboxing#configure-sandboxing)
- [サンドボックス設定](https://code.claude.com/docs/ja/settings#sandbox-settings)
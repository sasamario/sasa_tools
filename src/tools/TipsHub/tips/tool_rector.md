---
title: "Rector 導入から使い方まとめ"
description: "Rectorの導入、使い方をまとめたTips"
tags: ["ツール"]
---

# Rector 導入・設定・使い方ガイド

[Rector](https://github.com/rectorphp/rector) は PHP コードの自動リファクタリング・バージョンアップグレードを行うツール。
本ドキュメントは Rector 2.x 系（2026年時点の最新系）を前提にまとめている。



## 1. Composer での導入手順

Rector は開発時のみ使用するツールのため `--dev` フラグを付けて導入します。

```bash
composer require rector/rector --dev
```

### 動作要件

- PHP 7.2 以上（Rector自体の実行環境）
- 対象コードは PHP 5.3〜8.5 相当まで解析・変換可能（静的解析のためコードは実行されない）

### フレームワーク／ライブラリ向け拡張（任意）

Symfony・Doctrine・PHPUnit などのルールセットは `rector/rector` 本体に同梱されているため、追加インストールは不要です。

```bash
composer require rector/rector --dev
```

サードパーティ拡張（例: TYPO3など）を使う場合は、拡張パッケージ側で `rector/extension-installer` を利用して自動登録されます。



## 2. 設定ファイルの作成方法・設定

### 2-1. 設定ファイルの生成

初回実行時に `rector.php` が存在しない場合、自動生成を提案してくれます。

```bash
vendor/bin/rector
```

```text
No "rector.php" config found. Should we generate it for you? [yes]:
> yes
[OK] The config is added now. Re-run command to make Rector do the work!
```

手動で作成する場合は、プロジェクト直下に `rector.php` を作成します。

### 2-2. 基本構成

Rector 2.x では `RectorConfig::configure()` によるフルエントAPIで設定します（旧バージョンの配列ベース設定とは書き方が異なるので注意）。

```php
<?php
// rector.php

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList;

return RectorConfig::configure()
    // 処理対象のパス
    ->withPaths([
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ])
    // 除外したいルール／パス（任意）
    ->withSkip([
        __DIR__ . '/src/Legacy/*',
        __DIR__ . '/tests/Fixtures',
    ])
    // 適用するルールセット（コード品質・デッドコード削除など）
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
    );
```

### 2-3. 個別ルールを指定する場合

```php
<?php

use Rector\Config\RectorConfig;
use Rector\TypeDeclaration\Rector\Property\TypedPropertyFromStrictConstructorRector;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/src'])
    ->withRules([
        TypedPropertyFromStrictConstructorRector::class,
    ]);
```

### 2-4. PHPバージョンの指定

デフォルトでは `composer.json` の `config.platform.php`、または実行環境のPHPバージョンを自動で読み取ります。明示的に指定したい場合のみ以下を記述します。

```php
<?php

use Rector\Config\RectorConfig;
use Rector\ValueObject\PhpVersion;

return RectorConfig::configure()
    ->withPhpVersion(PhpVersion::PHP_81);
```

### 2-5. フレームワーク向けセットの自動有効化

インストール済みパッケージ（Symfony / Doctrine / PHPUnit）を検知して関連セットを自動有効化できます。

```php
<?php

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/src'])
    ->withComposerBased(
        symfony: true,
        doctrine: true,
        phpunit: true,
    );
```

Symfony個別セットを直接指定する場合:

```php
<?php

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPreparedSets(symfonyCodeQuality: true);
```

### 2-6. vendor の autoload に含まれないパスを追加する

```php
<?php

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withAutoloadPaths([
        __DIR__ . '/lib',
        __DIR__ . '/vendor/legacy/package/src',
    ]);
```



## 3. 実行コマンド

### 3-1. ファイルパス指定なし（rector.php の `withPaths` 設定に従って実行）

```bash
vendor/bin/rector process
```

または（`process` は省略可能）

```bash
vendor/bin/rector
```

### 3-2. ファイルパス指定あり（特定ディレクトリ・ファイルのみ処理）

```bash
vendor/bin/rector process src/Controller
```

複数パス指定も可能です。

```bash
vendor/bin/rector process src/Controller src/Service
```

### 3-3. ドライラン（変更内容の確認のみ、実際には書き換えない）

実運用ではまず `--dry-run` で差分を確認するのが推奨です。

```bash
vendor/bin/rector process --dry-run
vendor/bin/rector process src/Controller --dry-run
```

### 3-4. デバッグ情報付きで実行

例外の詳細を出力したい場合。

```bash
vendor/bin/rector process src/Controller --dry-run --debug
```

### 3-5. 別の設定ファイルを指定して実行

```bash
vendor/bin/rector process --config=rector-custom.php
```



## 4. 推奨ワークフロー

1. `composer require rector/rector --dev` で導入
2. `vendor/bin/rector` で `rector.php` を生成
3. `withPaths` / `withSkip` / `withPreparedSets` / `withRules` を編集して対象範囲・ルールを調整
4. `vendor/bin/rector process --dry-run` で差分確認
5. 問題なければ `vendor/bin/rector process` で実際に適用
6. Gitで差分をレビューし、コミット・プルリクエスト作成



## 参考

- 公式ドキュメント: https://getrector.com/documentation
- GitHubリポジトリ: https://github.com/rectorphp/rector
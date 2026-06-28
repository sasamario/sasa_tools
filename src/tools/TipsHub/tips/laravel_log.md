---
title: "Laravel ログ設定"
description: "Laravel ログ設定に関するTips"
tags: ["Laravel"]
---

# ログの基本
Laravelではログに関する設定は、`config/logging.php`で設定することができる。設定はチャンネル単位で管理する。

■参考
- [Laravel9 ログ](https://readouble.com/laravel/9.x/ja/logging.html)

## 設定
```php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
        'days' => 14,
    ],
],
```
様々な設定があるがその中でもよく使う項目を以下に記載する。

### driver
ログメッセージが実際に記録される方法と場所の設定。色々あるのでいくつか抜粋して以下に記載する。
- single：単一ファイル
- daily：日次ローテーション
- stack：複数チャンネルに出力

### path
ログファイルの保存先の設定。

### level
出力するログの最低レベルの設定。errorと指定した場合error以上のログしか出力されなくなるため、debugなどは出力されない。

### days
driver=dailyの場合のみの設定で、何日分のログを保持するか。14の場合14日より古いログは自動で削除される。

### tap
Monolog（Laravel内部で使っているログライブラリ）をカスタマイズする仕組み。
ログの出力フォーマットを変えたい場合などに使う。

# クエリログを別途出力したいケース
通常ログとは別でクエリログを出したい場合の設定についてまとめる。
方法としてはProviderを用意して、`DB::listen()`でクエリ実行を検知してバインドされた値を実際のクエリに当てはめたものをログに出すようにする。

■参考
- [Laravel SQLの実行クエリログを出力する](https://qiita.com/ucan-lab/items/753cb9d3e4ceeb245341#3-%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%83%97%E3%83%AD%E3%83%90%E3%82%A4%E3%83%80%E3%83%BC%E3%81%AB%E7%99%BB%E9%8C%B2%E3%81%97%E3%81%A6%E3%83%AD%E3%82%B0%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AB%E8%87%AA%E5%8B%95%E5%87%BA%E5%8A%9B)

## 実装
### 1. クエリログ用のチャンネル設定を追加
`src/logging.php`
```php
'channels' => [
    'query' => [
        'driver' => 'daily',
        'path' => storage_path('logs/query.log'),
        'level' => 'debug',
        'days' => 14,
    ],
],
```

### 2. カスタムプロバイダ用意　※あくまでも例で動くかまで試していないので適宜調整して使うこと
```php
<?php
namespace App\Providers;

// use文省略...

class QueryServiceProvider
{
    private array $masking = [
        'password',
    ];

    /**
     * Register services.
     */
    public function write(): void
    {
        // 環境毎の設定で出さないようにしたい場合
        if (config('logging.sql.enable') !== true) {
            return;
        }

        // DB::listen()でクエリを検知し実際の値をバインド部分に当てはめる
        DB::listen(static function ($query): void {
            $sql = $query->sql;

            foreach ($query->bindings as $binding) {
                if (is_string($binding)) {
                    $binding = "'{$binding}'";
                } elseif (is_bool($binding)) {
                    $binding = $binding ? '1' : '0';
                } elseif (is_int($binding)) {
                    $binding = (string) $binding;
                } elseif (is_float($binding)) {
                    $binding = (string) $binding;
                } elseif ($binding === null) {
                    $binding = 'NULL';
                } elseif ($binding instanceof Carbon) {
                    $binding = "'{$binding->toDateTimeString()}'";
                } elseif ($binding instanceof DateTime) {
                    $binding = "'{$binding->format('Y-m-d H:i:s')}'";
                }

                $sql = preg_replace('/\\?/', $binding, $sql, 1);
            }

            // マスキング処理（正規表現部分などは適宜調整すること）
            foreach ($this->masking as $column) {
                $sql = preg_replace(
                  "/({$column}\s*=\s*)'[^']*'/i", // password = 'value'のようなパターンを検出
                  '$1\'****\'', // $1はキャプチャグループ（$column = ）部分で、それに続く値の部分を'****'に置き換えている
                  $sql);
            }

            // スロークエリの場合はWarning、それ以外はDebugでログ出力
            $channel = 'query';
            if ($query->time > config('logging.sql.slow_query_time')) {
                Log::channel($channel)->warning(sprintf('%.2f ms, SQL: %s;', $query->time, $sql));
            } else {
                Log::channel($channel)->debug(sprintf('%.2f ms, SQL: %s;', $query->time, $sql));
            }
        });

        // トランザクション開始、コミット、ロールバックのイベントはDB::listen()では検知できないため、イベントリスナーで検知してログ出力する
        Event::listen(static fn (TransactionBeginning $event) => Log::channel('query')->debug('START TRANSACTION'));
        Event::listen(static fn (TransactionCommitted $event) => Log::channel('query')->debug('COMMIT'));
        Event::listen(static fn (TransactionRolledBack $event) => Log::channel('query')->debug('ROLLBACK'));
    }
}
```

### 3. 用意したカスタムプロバイダをAppServiceProviderのregister()に登録
`src/app/Providers/AppServiceProviders.php`のregister()の中で呼び出すようにする

# DB::listen()について
DB::listen()は、`QueryExecuted`というSQLが実行された直後に発火するイベントをフック（自身の処理を割り込ませる仕組み）している。
ただ、トランザクションの開始、コミット、ロールバックといったイベントは検知できないのでログにこれらも出したい場合は別途対応が必要。

### QueryExecutedで持っている情報
```php
$event->sql        // プレースホルダ付きSQL
$event->bindings   // バインド値
$event->time       // 実行時間(ms)
$event->connection // 接続情報
$event->connectionName // データベース接続名
```

### 参考
- [Laravel API QueryExecuted](https://api.laravel.com/docs/9.x/Illuminate/Database/Events/QueryExecuted.html)
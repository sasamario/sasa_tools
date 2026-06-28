---
title: "さまざまなログの確認について"
description: "ログの確認方法やログ出力先の確認方法に関するTips"
tags: ["ログ", "調査"]
---

# DB
## MySQL, MariaDB
### ログ関連設定確認
```sql
-- ログ関連設定を一覧表示
SHOW VARIABLES
WHERE Variable_name IN (
  -- エラーログ出力先
  'log_error',
  -- General Logが有効か
  'general_log',
  -- General Log出力先
  'general_log_file',
  -- スロークエリログが有効か
  'slow_query_log',
  -- スロークエリ出力先
  'slow_query_log_file',
  -- ログ出力先
  'log_output',
  -- スロークエリ判定時間
  'long_query_time'
);
```
`SHOW VARIABLES`: MySQLのシステム変数（設定値）を表示するコマンド
`General Log`: MySQLが受け取ったクライアントの接続、切断情報、実行したSQlを記録するログ。実際に実行されたクエリを見たい時などによい

### 設定変更
```sql
-- General Log有効化
SET GLOBAL general_log = 'ON';

-- General Log無効化
SET GLOBAL general_log = 'OFF';
```
`SET GLOBAL`: 現在のセッションでの設定変更。再起動すると元に戻る
General Logはすべてのログを出すので量が多くなるのでデフォルトはOFFになっているみたい。ローカル環境で一時的に調査でONにする分には問題なし。

### 参考
- [MySQL8.0リファレンスマニュアル 5.1.9 システム変数の使用](https://dev.mysql.com/doc/refman/8.0/ja/using-system-variables.html)

## PostgreSQL
### ログ関連設定確認
```sql
SELECT
  name,
  setting
FROM
  pg_settings
WHERE
  name IN (
    -- ログ収集機能が有効か（on/off）
    'logging_collector',
    -- ログ出力先（stderr/csvlog/jsonlog 複数指定可能）
    'log_destination',
    -- ログ出力ディレクトリ（log）
    'log_directory',
    -- ログファイル名（postgresql-%Y-%m-%d_%H%M%S.log）
    'log_filename',
    -- 出力するSQL（none/ddl/mod/all）
    'log_statement',
    -- 指定時間以上のSQLを出力(ms) （-1無効）
    'log_min_duration_statement',
    -- 出力するログレベル（warning）
    'log_min_messages'
  )
ORDER BY
  name;
```
- logging_collector
  - on: ログ収集機能有効
  - off: ログ収集機能無効
  - logging_collectorはPostgreSQL起動時に決まる設定のようで、変更する場合は`ALTER SYSTEM`で変更後再起動が必要
- log_destination
  - stderr: 標準エラー出力。logging_collector=offの場合、Docker環境ならdocker logsにでる
  - csvlog: csv形式でログ出力
  - jsonlog: json形式でログ出力
- log_statement
  - none: 出力しない
  - ddl: DDLのみ
  - mod: 更新系SQL + DDL
  - すべてのSQL

#### ログ出力先について
ログは、`[データディレクトリ]/[log_directory]/[log_filename]` に出る。
データディレクトリとは、PostgreSQLがデータベースや設定ファイル、各種ログなどを保存しているディレクトリ。
Dockerでいう、compose.ymlでマウントしているパス（例: /var/lib/postgresql/data）

もしlog_directory=log、log_filename=postgresql-%Y-%m-%d_%H%M%S.log
→この場合、ログ出力先は`/var/lib/postgresql/data/log/postgresql-2026-06-27_105805.log` のようになる

### 設定変更
```sql
-- logging_collection変更（context=spostmasterなので、ALTER SYSTEMで設定ファイルを変更後は再起動が必要）
-- Docker使っているなら、ここはoffのままで、log_statementで対応するのが良さそう
ALTER SYSTEM SET logging_collector = 'on';
ALTER SYSTEM SET logging_collector = 'off';

-- 全SQLを出力（MySQLでいう、General Log）
SET log_statement = 'all';

-- 標準エラー出力（context=sighupなので、ALTER SYSTEMで設定ファイルを変更後はリロードが必要）
ALTER SYSTEM SET log_destination = 'stderr';
-- リロード
SELECT pg_reload_conf();
```
`ALTER SYSTEM SET`: 設定ファイルを変更。変更は永続。再起動が必要
`SET`: 現在のセッションでの設定変更。再起動すると元に戻る。設定は即時反映（再起動不要）

### 設定変更の反映タイミングについて
設定によって即時反映されるものもあれば、リロード、再起動が必要なものもある。
その判断は以下のクエリで出力されるcontextの値からわかる。
contextは、設定を「いつ」「どの方法で」変更できるかを表す属性
```sql
SELECT
  name,
  context
FROM
  pg_settings
WHERE
  name IN (
    'logging_collector', -- postmaster
    'log_destination', -- sighup
    'log_directory', -- sighup
    'log_filename', -- sighup
    'log_statement', -- superuser
    'log_min_duration_statement', -- superuser
    'log_min_messages' -- superuser
  )
ORDER BY
  name;
```
contextの種類は以下
- user
  - 誰でもSETで変更可能（即時反映）
- superuser
  - スーパーユーザーだけSETで変更可能（即時反映）
- sighup
  - SETでの変更不可。設定ファイルを変更（ALTER SYSTEM）して、リロードが必要
- postmaster
  - SETでの変更不可。設定ファイルを変更（ALTER SYSTEM）して、再起動が必要

### 参考
- [エラー報告とログ取得](https://www.postgresql.jp/docs/14/runtime-config-logging.html)
- [pg_settings](https://www.postgresql.jp/docs/14/view-pg-settings.html)
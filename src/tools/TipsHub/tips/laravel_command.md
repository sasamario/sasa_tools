---
title: "Laravel Command"
description: "Laravel Commandに関するTips"
tags: ["Laravel"]
---

# Commandについて
Laravelには、コンソールアプリケーションの実装をサポートする、Commandと呼ばれるコンポーネントがある。
Commandを利用することで、コマンドの実行や引数、オプションの設定、出力などが簡単に実装できる。

[Laravel 9.x Artisanコンソール](https://readouble.com/laravel/9.x/ja/artisan.html)

## Commandクラス作成
以下のartisanコマンドで作成できる。app/Console/Commands/[クラス名].phpが作成される。
クラス名は慣習的に、「XxxCommand」のように末尾にCommandをつける。そうすることでCommand用のクラスとわかる。
```bash
php artisan make:command [クラス名]
```

app/Console/Commands配下であれば、自動で認識されるがもしディレクトリを移動させたい場合は別途コマンドの登録が必要とのこと。
app/Console/Kernelクラスで登録する。以下のようにload()で登録する。
```php
protected function commands()
{
    $this->load(__DIR__.'/Commands');
    $this->load(__DIR__.'/../Domain/Orders/Commands');

    // ...
}
```

## Commandクラスの詳細
```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateLatLongCommand extends Command
{
    /**
     * コマンド名や引数、オプションを定義する
     * 慣習として、コマンド名は「xxx:yyy」のように、コロンで区切ることが多い
     * コロンで区切ることで、php artisan listなどのコマンドでグループ化や階層化され視認性が高い（今回の例だとlatlongというグループにupdateが属する）
     *
     * @var string
     */
    protected $signature = 'latlong:update';

    /**
     * コマンドの説明を記述する
     * この説明は、php artisan listコマンドで表示されるため、コマンドの目的や機能を簡潔に説明することが望ましい
     *
     * @var string
     */
    protected $description = '緯度経度を更新するコマンド';

    /**
     * コマンドが実行されたときの処理を記述する
     *
     * @return int
     */
    public function handle()
    {
        return Command::SUCCESS;
    }
}

```

### $signature
コマンド名や引数、オプションなどを定義するプロパティ。
慣習として「xxx:yyy」のように定義する。コロンで区切ることによって、グループ化されphp artisan listコマンドなどでわかりやすくなる。

■php artisan listでの表示
```bash
php artisan list
latlong
  latlong:update         緯度経度を更新するコマンド
```

■コマンド引数
```php
/**
 * {param}　必須引数。省略するとエラー
 * {param?}　任意引数。省略可能
 * {param=hoge}　デフォルト設定ありの引数。省略するとデフォルト値が適用
 * {param*}　引数を配列として取得。省略するとエラー
 * {param : description}　コロン以降に説明を記述できる。コロンの前後にスペース必要
 */
protected $signature = 'latlong:update {param}';
```

■オプション引数
```php
/**
 * {--option}　引数を論理値として取得。指定するとtrue、省略するとfalse
 * {--option=}　引数を文字列として取得。省略可能
 * {--option=hoge}　引数を文字列として取得。省略するとデフォルト値が適用
 * {--option=*}　引数を配列として取得。実行時に--option=1 --option=2のように指定すると['1', '2']のようになる
 * {--option : description}　コロン以降に説明を記述できる。コロンの前後にスペース必要
 */
protected $signature = 'latlong:update {--option}';
```

### handle()
コマンド実行時の処理を記述する。
DIする際は、コンストラクタではなくhandle()を介してDIを行う。

■コマンドラインに出力するためのメソッド
```php
public function handle()
    {
        $this->line('line()は、通常のテキストスタイルでコマンドラインにメッセージを出力するためのメソッド');
        $this->info('info()は、infoスタイル（緑色）のメッセージをコマンドラインに出力するためのメソッド');
        $this->error('error()は、errorスタイル（赤色）のメッセージをコマンドラインに出力するためのメソッド');
        $this->question('question()は、questionスタイル（青色）のメッセージをコマンドラインに出力するためのメソッド');
        $this->warn('warn()は、warnスタイル（黄色）のメッセージをコマンドラインに出力するためのメソッド');
        return Command::SUCCESS;
    }
```

■返り値（終了コード）
0→成功、0以外→失敗
これらはCommandクラスに定数が定義されているので一般的には以下を返す形になる。
```php
return Command::SUCCESS; // 0
return Command::FAILURE; // 1
```

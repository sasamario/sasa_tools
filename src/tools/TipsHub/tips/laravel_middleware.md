---
title: "Laravel Middleware"
description: "Laravel Middlewareに関するTips"
tags: ["Laravel"]
---

# ミドルウェア
HTTPリクエストがコントローラに到達する前、またはレスポンスが返る前に処理を挟む仕組み。
以下はLaravelのドキュメントより。
> ミドルウェアは、アプリケーションに入るHTTPリクエストを検査およびフィルタリングするための便利なメカニズムを提供します。たとえば、Laravelには、アプリケーションのユーザーが認証されていることを確認するミドルウェアが含まれています。ユーザーが認証されていない場合、ミドルウェアはユーザーをアプリケーションのログイン画面にリダイレクトします。逆に、ユーザーが認証されている場合、ミドルウェアはリクエストをアプリケーションへ進めることを許可します。
> 引用元：[Laravel9.x ミドルウェア](https://readouble.com/laravel/9.x/ja/middleware.html)

## 用途
よくある用途としては以下のものがある。
- 認証チェック
- 権限チェック
- ログ出力
- リクエストやレスポンスに含まれる値の変更や暗号化（復号化）

ミドルウェアは複数のミドルウェアを数珠繋ぎに連結できるため、それぞれのミドルウェアは1つの責務を担い、それを組み合わせて実行する。

## 作成方法
以下のartisanコマンドで作成可能。
```bash
# app/Http/Middleware/HogeHoge.php　に作成される
php artisan make:middleware HogeHoge
```

## ミドルウェア例
```php
<?php

namespace App\Http\Middleware;

use Closure;

class HogeHoge
{
    /**
     * 受信リクエストの処理
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->input('token') !== 'my-secret-token') {
            return redirect('home');
        }

        return $next($request);
    }
}
```
handlerメソッドが、ミドルウェアとして実行されるメソッド。
引数にはRequestと次に実行するクロージャ。

$nextは、次の処理へリクエストを渡すための関数。次の**ミドルウェア**または**最終的なコントローラ**を実行する。
`return $next($request);`をしないと、次の処理に進めないので指定すること。

## ミドルウェアの登録
ミドルウェアは作成後登録しないと使うことができない。

■グローバル登録
グローバル登録するとすべてのHTTPリクエストで使うことができる。ルートで指定しなくても動く。
`app/Http/Kernel.php`の`$middleware`プロパティに追加する。
```php
protected $middleware = [
    \App\Http\Middleware\HogeHoge::class,
];
```

■ルートミドルウェア登録
ミドルウェアを特定のルートで指定したい場合は、ルートミドルウェアに登録して使うこともできる。
`app/Http/Kernel.php`の`$routeMiddleware`プロパティに追加する。keyはmiddleware('check')のように指定する項目名。
```php
protected $routeMiddleware = [
    'check' => \App\Http\Middleware\HogeHoge::class,
];
```

上記のように登録すると、ルーティングで以下のようにmiddlewareメソッドで指定して使うことができる。
```php
Route::get('/', function () {
    //
})->middleware('check');
```
また、ルーティング部分で適用するのではなくコンストラクタ内で適用するということもできる。
これはルート単位ではなくコントローラ単位で指定したい場合に使う。

## ミドルウェアの種類、流れ
- グローバルミドルウェア（全リクエスト対象）
- ミドルウェアグループ（web,apiのようにグループ単位で設定。例えばVerifyCsrfTokenはwebグループに設定されている）
- ルートミドルウェア（個別ルート単位で設定）

ざっくりとした処理の流れとしては
1. ミドルウェア前処理（グローバル > グループ > ルートの順）
2. コントローラ
3. ミドルウェア後処理（ルート > グループ > グローバルの順）

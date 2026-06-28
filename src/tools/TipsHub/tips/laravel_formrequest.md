---
title: "Laravel FormRequest"
description: "Laravel FormRequestに関するTips"
tags: ["Laravel"]
---

# フォームリクエスト
フォームリクエストは`Illuminate\Foundation\Http\FormRequest`を継承したクラスで、入力値の取得に加えてバリデーションルールや認証機能などを定義できる機能。
バリデーションロジックをコントローラから分離できるため、コードの疎結合化（独立性が高い状態）できる。

## 作成コマンド
```bash
php artisan make:request HogeRequest
```
上記コマンド実行で`app/Http/Requests/HogeRequest.php`が作成される。

## メソッド
### authorize()
このリクエストを実行して良いかを判定する。
falseを返すと、403エラーになる。

### rules()
バリデーションルールを定義する。
組み込みのバリデーションルールだけでなく、カスタムバリデーションルールなども指定できる。
```php
public function rules()
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'title' => 'required|unique:posts|max:255',
    ];
}
```
配列形式、文字列をパイプラインで区切る形式でルールを指定できる。
正規表現によるバリデーションルールを利用する際、正規表現のメタ文字（パイプライン）と重複して不具合が起こりうるので、配列形式で指定する方が良い。

### attributes()
エラーメッセージ中の項目名を定義する。

### messages()
エラーメッセージをカスタマイズする。
ただ、実務では`lang/ja/valiudation.php`を用意してそこに各エラーコードのエラーメッセージを定義してそれを使うため、使うことはない。

### prepareForValidation()
バリデーションチェック前に行われる処理。
バリデーションチェック前にデータの準備、サニタイズなどする必要がある場合に使う。

```php
protected function prepareForValidation()
{
    $this->merge([
        'email' => strtolower($this->email),
    ]);
}
```
上記例だとメールアドレスを事前に小文字に変換している。あとはtrimなどしたりしたいときとか。

### withValidator()
バリデーション実行前（Validatorインスタンス生成直後）に実行される処理。
ここで`after()`というバリデーション直後に処理を割り込ませるフックを登録することで、rules()では対応しきれない複雑なチェックや、複数項目のチェックなどを行うことができる。

なので、**withValidator()自体がバリデーション直後に実行されるものではない！**

### failedValidation()
バリデーション失敗時に実行される処理。
主にエラー時の挙動をカスタマイズしたい時に使う。

### passedValidation()
バリデーション成功時に実行される処理。
検証後の値を加工したりする際に使う。


## 各メソッドの実行順
実行順 | メソッド / 処理 | 一言でいうと
-- | -- | --
1 | authorize() | このリクエストを実行してよいか判定
2 | prepareForValidation() | バリデーション前の入力値整形
3 | rules() | バリデーションルールを定義
4 | Validatorインスタンス生成 | ルールを元に検証エンジンを構築
5 | withValidator($validator) | Validator生成直後の拡張ポイント
6 | 通常ルールチェック実行 | rulesで定義したルールを検証
7 | after()（登録分）実行 | 追加バリデーション処理
8 | 成否判定 | エラー有無で分岐
9（失敗時） | failedValidation() | バリデーション失敗時の処理
9（成功時） | passedValidation() | バリデーション成功後の処理
10 | コントローラへ | 検証済みデータで処理開始

## 参考
- [Laravel9.x バリデーション](https://readouble.com/laravel/9.x/ja/validation.html)


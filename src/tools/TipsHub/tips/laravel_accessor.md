---
title: "Laravel Accessor"
description: "Laravelのアクセサに関するTips"
tags: ["Laravel"]
---

# アクセサ

## アクセサとは

アクセサとは、Eloquent モデルの属性を「取得」するときに値を加工・変換する仕組み。
Laravel 公式ドキュメント：[Eloquent：ミューテタ/キャスト](https://readouble.com/laravel/10.x/ja/eloquent-mutators.html)

### 特徴
- `$model->カラム`にアクセスした瞬間に、自動的に処理が行われる
- DB に保存されているデータを、表示や利用しやすい形に変換するために使う（例：トリム）

### 利用イメージ
- トリム（DB のカラム指定がよくなく、SQL Server の char 型のようにスペースで固定長となるようにしている場合等）
- 日付を指定の形式に変換
- ステータスコード（0/1）を文字列（無効/有効）に変換
- 姓名を結合する

## 使い方
### model
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * ユーザーの名前の取得
     */
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
        );
    }
}
```
モデルクラスの中で、カラム名（キャメルケース）のメソッドを用意する。
アクセサメソッドは`Attribute`インスタンスを返す。
例えば複数カラムに対して同じ処理を行いたい場合などは、BaseModel などを用意してそちらに処理を実装して各モデルのアクセサで呼び出して使うのが良い。

### アクセサの適用
```php
use App\Models\User;

$user = User::find(1);
$firstName = $user->first_name;
```
モデルから該当のカラムにアクセスする際にアクセサが適用される。

## 注意点
アクセサが適用されるのは、【モデル】からカラムにアクセスしたときに適用される。
例えば以下のように users と profiles を join()して取得する場合、返り値の型は「User モデル」。

### users と profiles を join()して取得する例
前提として、アクセサは User モデルと Profile モデルそれぞれに実装しているものとする。
```php
$users = User::join('profiles', 'profiles.user_id', '=', 'users.id')
    ->select([
        'users.id',
        'users.name',
        'profiles.first_name',
        'profiles.last_name',
    ])
    ->where('users.id', '1')
    ->first();

$users->name; // アクセサが適用される
$users->first_name; // アクセサが適用されない！！！
```
アクセサが適用されない理由としては、取得したのはあくまでも「User モデル」であるから。
そのため、`Userモデル`に実装したアクセサはカラムアクセス時に適用されるが、first_nameのアクセサは`Profile`モデルに実装しているため適用されない。

## 対応策
### リレーション設定をして取得する（load,with）
関連データを取得する際に、リレーションを使う方法。
結合先テーブルも Eloquent モデルとして取得されるため、そのモデルに定義したアクセサが適用される。
ただ、1度のクエリで取得できないのと指定の SQL で実装する必要がある場合などはこの方法を使うことができない。

### DB 取得後に処理を適用する
アクセサがやっていたようなことを自前で行う。各 Model や Repository で使う想定なのでそれぞれ Base クラスを用意して継承する作りにすると良い。

■トリムを行う実装例
```php
abstract class BaseModel extends Model
{
    // トリムを行いたいカラムを定義するための配列
    protected static $trims = [];

    // トリム対象カラムを取得するゲッター
    public static function getTrims(): array
    {
      return static::$trims;
    }
}

class UserModel extends BaseModel
{
    // 各Model側で対象のカラムを配列で定義
    protected static $trims = [
        'name',
        'email',
    ];
}
```

```php
abstract class BaseRepository
{
    protected function trimColumns(Model|Collection|null $data, array $trims): Model|Collection| null
    {
        // first()などで取得する際に、対象データがない場合nullが来る
        if (is_null($data)) {
            return null;
        }

        if ($data instanceof Collection) {
          foreach($data as $row) {
            $this->trimRow($row, $trims);
          }
        }

        if ($data instanceof Model) {
            $this->trimRow($data, $trims);
        }

        // 引数に指定した型以外はここに到達しないので、ここで例外を投げている
        throw new Exception();
    }

    private function trimRow(Model $row, array $trims): Model
    {
        // 自身のModelのトリム対象カラムは必ずトリムする想定としているので、ここでgetTrims()で取得したものと、パラメータとして渡した追加でトリムするものをマージしている
        $trims = array_merge($row::getTrims(), $trims);

        // $trimsでループすると、取得していないカラム分も無駄にループされるのでここでは、取得したカラムでループしている
        foreach($row->getAttributes() as $col => $val) {
            // $colが取得するカラム名。$trimsにあるか、そして値があるかチェックしている
            // もしよりパフォーマンスを考慮するならarray_key_exists()より計算量が少ないisset()とかでチェックするのもあり
            if (array_key_exists($col, $trims) && isset($val)) {
                $row[$col] = trim($val);
            }
        }
    }
}
```

```php
$users = User::join('profiles', 'profiles.user_id', '=', 'users.id')
    ->select([
        'users.id',
        'users.name',
        'profiles.first_name',
        'profiles.last_name',
    ])
    ->where('users.id', '1')
    ->first();

// トリム処理側でUserモデルのトリム対象カラムは取得するようにしているので、ここではProfileモデルのトリム対象カラムのみ渡している
return $this->trimColumns($users, Profile::getTrims());
```

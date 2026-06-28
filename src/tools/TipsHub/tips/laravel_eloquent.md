---
title: "Laravel Eloquent"
description: "LaravelのEloquentに関するTips"
tags: ["Laravel"]
---

# Eloquent
Eloquent は Laravel で標準搭載されている ORM(Object-Relational Mapping)。
ORM とは、データベースのテーブルをクラス（オブジェクト）として扱うことができる仕組み。
各テーブルに対応する「モデル」があり、モデルを使ってテーブル操作をする。

## 特徴
- SQL を書かずに DB 操作ができる
- テーブル 1 つをモデルクラスとして表現できる
- リレーションをコードで表現できる
- CRDU を直感的に描ける

# Model
Eloquent の機能とビジネスロジックを持ったクラス。
1 テーブル = 1Model で表現する。

Model の作成はコマンドまたは手動で作成する。
コマンドで作成した場合、app/Modules 配下に作成される。Model 名は単数形にするのが慣習となっている。users テーブルの場合、User モデルみたいに。
```bash
# app/Modules/User.phpが作成される
php artisan make:model User
```

## Model のサンプル
Model で指定できる基本的なプロパティと合わせて Model のサンプル。
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    # モデルに関連づけるテーブル名
    protected $table = 'users';

    # Modelの主キーとなるカラム名の指定（デフォルト:id）
    protected $primaryKey = 'user_id';

    # 主キーが自動採番（Auto Increment）かどうかを指定（デフォルト:false）
    public $incrementing = false;

    # 主キーの型指定（デフォルト:int）
    protected $keyType = 'string';

    # created_at/updated_atを自動で管理するかを指定（デフォルト:true）
    public $timestamps = false;

    # 日付カラムをDBに保存する際のフォーマットを指定（デフォルト:Y-m-d H:i:s）
    protected $dateFormat = 'Y-m-d H:i:s';
}
```

### 参考
- [Eloquent の準備 - Eloquent モデルの規約](https://readouble.com/laravel/10.x/ja/eloquent.html)


# リレーション
## 1 対 1
### hasOne

例）User モデル（親）と Profile モデル（子）が 1 対 1 の場合

```php
// namespaceやuseは省略
class User extends Model
{
    /**
     * ユーザーに関連しているプロフィールの取得
     */
    public function profile(): HasOne
    {
        // 第二引数：外部キー名（デフォルトは、xxx_id）
        // 第三引数：ローカルキー名（デフォルトは、id）
        return $this->hasOne(Profile::class, 'foreign_key', 'local_key');
    }
}
```
- hasOne()は、親側のモデルで指定する
- メソッド名は 1 対 1 の関係であれば、モデル名の単数形を指定するのが基本
- 第二引数や第三引数は Eloquent が自動で判断するカラム名のルールに則っている場合は指定不要。異なる場合は指定する必要がある

### belongsTo
hasOne の逆でどの親に属しているかを表すリレーション。子側（外部キーを持っている側）のモデルに書く。
```php
// namespaceやuseは省略
class Profile extends Model
{
    /**
     * プロフィールは1人のユーザーに属する
     */
    public function user(): BelongsTo
    {
        // 第二引数：外部キー名（デフォルトは、xxx_id）
        // 第三引数：親モデルの参照キー名（デフォルトは、id）
        return $this->belongsTo(User::class, 'foreign_key', 'owner_key');
    }
}
```
- belongsTo()は、子側のモデルで指定する
- メソッド名は 1 対 1 の関係であれば、モデル名の単数形を指定するのが基本
- 第二引数や第三引数は Eloquent が自動で判断するカラム名のルールに則っている場合は指定不要。異なる場合は指定する必要がある

### 参考
- [Eloquent：リレーション](https://readouble.com/laravel/10.x/ja/eloquent-relationships.html)

## 1 対多
TODO...

## Lazy ロードと Eager ロードについて
- Eloquent では通常関連モデルは、Lazy ロードされる
- Lazy ロードはアクセスするタイミングで取得するため、使い方によっては N+1 問題に繋がる
- Eager ロードは事前に取得するため、N+1 問題に対応できる
- ケースバイケースで使い分ける

### Lazy ロード（遅延ロード）
- 関連モデルにアクセスしたタイミングで取得する方式
- 無駄なクエリを減らせる場合がある
- ただし、ループ内で使うと N+1 問題に繋がる

```php
// 例）UserとProfile
$users = User::all();

foreach ($users as $user) {
    echo $user->profile->bio;
}
```
以下のようにクエリが発行される。users 取得後 foreach 内で都度取得のためにクエリが実行されてしまう。そのため Profile のデータ量に応じてクエリも増えてしまう（N+1問題）。
1. `select * from users;`
2. `select * from profiles where user_id = 1;`
3. `select * from profiles where user_id = 2;`
4. `select * from profiles where user_id = 3;`

### Eager ロード
- あらかじめ関連モデルのデータを取得する方式
- ループしてもクエリは増えない

```php
// 例）UserとProfile
$users = User::with('profile')->get();

foreach ($users as $user) {
    echo $user->profile->bio;
}
```
以下のように最初にまとめて profiles から取得するため、foreach 内で profiles にアクセスする際はクエリは実行されない。
1. `select * from users;`
2. `select * from profiles where user_id in (1, 2, 3, ...)`

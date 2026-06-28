---
title: "命名のコツ"
description: "変数や関数の命名のコツ"
tags: ["開発"]
---

# 変数（フラグ）
## isXxx
booleanフラグの一般的な命名。**状態や性質**などを表現するフラグで使う。
基本形は「**is + 形容詞**」だが、状態を表すような過去分詞や名詞もOK

```text
// 今の状態を表す
isActive
isOpen
isEditable
※canEditとの使い分けとしては、canEdit→人や処理（この人は編集可能か）、isEditable→対象物（このデータは編集可能か）

// 過去の結果を表す
isDeleted
isSelected

// 性質、属性を表す
isAdmin　※ユーザーの状態を表すためOK
isPublic
```

## hasXxx
何かを「持っている」ことを表現するフラグで使う。
何かを持つという意味合いであることから、基本形は「**has + 名詞**」。　※持てるもの（=名詞）
```text
// 所有・保持
hasPermission
hasRole

// データの有無
hasXxxData
hasUsers
```

## canXxx
できるか（能力、条件、権限）を表現するフラグで使う。
isXxxはその状態かどうかで、canXxxはその行動ができるかどうかを表すので使い分けるように。
基本形は「**can + 動詞**」。

```text
// 操作、アクションが可能か
canEdit
canDelete

// 権限
canView
canAccess
```

## xxxExists
存在するかどうかを表現するフラグで使う。
基本形は「**名詞 + exists**」。　※存在する対象（=名詞）

```text
// 存在するか
userExists
fileExists
```

## 参考
- [初心者プログラマーのための変数/関数/メソッドの英語命名規則](https://qiita.com/YutaManaka/items/62dda256bb7ba6c08399)

# 関数
## boolean関数
変数命名と同様にis/has/canといったprefixを関数にも使うと良い。
```text
isValid()
hasPermission()
```

## 取得処理
取得処理を安直にgetXxx()と命名しがちになるが、どこから取得するかや副作用で使い分けると良い。
DBからの取得もfetchXxx()という意見もあるようだが、個人的にはgetXxxの方が馴染みがあるのでチームに合わせる方針とする。

この辺り正解がいまいちわからない...
```text
// DBなど近いところからの取得
getUser()

// 取得というより探す
findUser()
※findの場合は、見つからなかった場合はnullなりundefinedなりを返すようなケース。LaravelならModelを返すケース？


// 外部サービス（API等）へ通信して取得する
fetchUser()
```

## 変換処理（引数から変換元が明確にわかる場合）
何かを変換するような関数で、convert[変換前]To[変換後]みたいな命名でも伝わるが長いので簡素化するのもあり。
```text
例）秒→分変換処理
// 伝わるが長い...
function convertTimeFromSecondsToMinutes(int seconds) {}

// 引数で秒を渡して、分に変換するとわかるので命名を簡素化したほうがわかりやすい
function toMinutes(int seconds) {}
```
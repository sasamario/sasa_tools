---
title: "jqコマンドについて"
description: "JSONデータを整形、抽出する際に便利なjqコマンドに関するTips"
tags: ["jq"]
---

# jqコマンドとは
JSONデータを扱うためのコマンドラインツール。
JSONを整形、抽出、変換、加工などする際に活用する。

使うにはjqコマンドをインストールする必要がある。
VSCodeを使っている場合は、vscode-jqという拡張機能があるのでそちらでも使うことができる。
vscode-jq：https://marketplace.visualstudio.com/items?itemName=dandric.vscode-jq&ssr=false#qna

# 使い方
## vscode-jq
1. VSCodeで対象のファイルを開く
2. Ctrl + Shift + Pでコマンドパレットを開き、「JSON Processor」を選択
3. jqフィルターを入力

# jqフィルター例
package-lock.json（lockfileVersion:3）を参考に例を記載。

## 1. `.`（アイデンティティ）
`.`は、現在の入力（JSONオブジェクト）全体を表す記号。
`{ "key": "value" }`というJSONがある場合、`.`がルートを表すため、`.key`とすると「value」が出力される。

## 2. `.key`（プロパティアクセス）
オブジェクトの中のキーを指定して抽出する。
`{"name":"Taro","age":28}`に対して、`.name`とすると`"Taro"`を返す。

## 3. `[]`（配列展開）
配列の各要素を1件ずつ抽出する。
`["apple", "banana", "orange"]`に対して、`.[]`とすると以下のように順に要素を返す。
```json
"apple"
"banana"
"orange"
```

## 4. `|`（パイプ）
shellのパイプと似ていて、JSONデータを次のフィルタに渡すことができる。
```json
{
  "user": {
    "name": "Taro",
    "age": 28
  }
}
```
このようなJSONがあった場合、`.user | .name`とすると以下のように処理される
1. `.user`で`{"name": "Taro", "age": 28}`を抽出
2. その結果を`|`で'.name'に渡す
3. '.name'で`"Taro"`を取得

## 5. `select()`（条件フィルター）
配列の要素を条件で絞り込む。
```json
[
  {"name": "Taro", "age": 28},
  {"name": "Hanako", "age": 22},
  {"name": "Ken", "age": 31}
]
```
上記JSONに対して、`.[] | select(.age < 30)`とすると、JSONを配列にして各要素日亜して、ageキーが30未満の条件を満たす要素のみ抽出する。以下の結果となる。
```json
{"name": "Taro", "age": 28}
{"name": "Hanako", "age": 22}
```

## 6. `map()`（配列の変換）
配列の各要素を変換して新しい配列にする。
```json
[
  {"name": "Taro"},
  {"name": "Hanako"}
]
```
上記JSONに対して、`map(.name)`とすると、nameキーの値のみを抽出した配列を返す。

## 7. `keys`（キーの一覧取得）
オブジェクトの全てのキー名を配列で返す。
```json
{ "name": "Taro", "age": 28, "city": "Tokyo" }
```
上記JSONに対して、`keys`とすると、`["name","age","city"]`を返す。

## 8. `to_entries`、`from_entries`
`to_entries`：オブジェクトを、`[{"key": キー, "value": v値}]`に変換
`from_entries`：上記の逆で配列をオブジェクトに変換

`to_entries`の例
```json
{"apple":100,"banana":200}
```
上記JSONに対して、`to_entries`をすると、以下の値を返す。
```json
[
  {
    "key": "apple",
    "value": 100
  },
  {
    "key": "banana",
    "value": 200
  }
]
```

# 参考
とりあえず何できるか知りたい場合は公式マニュアルを見ると良さそう。
- [jq公式マニュアル](https://jqlang.org/manual/)
- [jq コマンドを使う日常のご紹介](https://qiita.com/takeshinoda@github/items/2dec7a72930ec1f658af)
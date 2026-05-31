---
title: "Node Script"
description: "Nodeでスクリプトを組む際に便利なTips"
tags: ["Node", "スクリプト"]
---

# スクリプト実行
```bash
# js,mjs実行
node script.mjs

# ts-node導入済みの場合、以下コマンドでtsファイルを直接実行可能
npx ts-node script.ts
```

# コマンドライン引数の受け取り
コマンドライン引数は`process.argv`で取得できる。
```bash
node script.js aaa bbb
```
```js
const args = process.argv;
console.log(args);

// 結果
[
  '/path/node/v20.0.0/bin/node', //nodeのパス
  '/path/script.js', //実行ファイルパス
  'aaa',
  'bbb',
]
```
配列なのでargs[2]のようにアクセス可能。
また、nodeや実行ファイルパスが不要な場合、`process.argv.slice(2)`のようにしてindex(2)から取得することも可能。

# 便利な標準モジュール
## ファイル操作 fs
fsモジュールはファイルの読み込み、書き込み、削除などなどができる。fsはFile systemの略。
```js
import fs from 'fs';

// ファイル読み込み fs.readFileSync(path[, options])
const text = fs.readFileSync('sample.txt', 'utf-8');
console.log(text);

// JSONファイル読み込み
const json JSON.parse(
  fs.readFileSync('sample.json', 'utf-8')
);
console.log(json);

// ファイルへの新規書き込み fs.writeFileSync(file, data[, options])
fs.writeFileSync('output.txt', 'hogehoge', 'utf-8');

// ファイルへの追記 fs.appendFileSync(path, data[, options])
fs.appendFileSync('output.txt', 'append_hogehoge', 'utf-8');
```

■参考
- [Node.js documentation - File system](https://nodejs.org/api/fs.html)
- [Node.jsのfsモジュールの使い方](https://qiita.com/tarotaro1129/items/135ef8d8ce4c1c08c9bb)
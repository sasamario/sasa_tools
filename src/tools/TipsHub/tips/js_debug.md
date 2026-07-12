---
title: "JS デバッグ関連"
description: "JavaScriptで作られたシステムに対するデバッグに関するTips"
tags: ["JS", "調査"]
---

# console メソッド一覧

| メソッド | 用途・説明 |
|---|---|
| `console.log(...args)` | 汎用ログ出力。最もよく使う。オブジェクトや配列もインタラクティブに展開できる |
| `console.trace()` | 呼び出し元のスタックトレースを出力。どこから呼ばれたか追うときに便利 |
| `console.dir(obj)` | オブジェクトのプロパティをツリー形式で表示。DOM 要素を HTML ではなくオブジェクトとして見たいときに有効 |
| `console.table(data)` | 配列やオブジェクトの配列をテーブル形式で表示。データ一覧の確認が一目瞭然 |
| `console.group(label)` / `console.groupEnd()` | ログをグループ化して折りたたみ表示。ネスト構造のログを整理するのに便利 |
| `console.groupCollapsed(label)` | `group` と同じだが、デフォルトで折りたたまれた状態で表示される |
| `console.time(label)` / `console.timeEnd(label)` | 処理時間を計測して ms 単位で出力。ボトルネック調査に使う |
| `console.timeLog(label)` | `time` を止めずに途中経過の時間を出力 |
| `console.count(label)` | 同じラベルで何回呼ばれたかカウント。イベントの発火回数確認などに |
| `console.countReset(label)` | `count` のカウンターをリセット |
| `console.warn(...args)` | 警告レベルのログ。DevTools 上で黄色表示され、スタックトレースも付く |
| `console.error(...args)` | エラーレベルのログ。赤表示。スタックトレース付き |
| `console.info(...args)` | `log` と同等だが情報レベルの意味付け（ブラウザによってはアイコンが違う） |
| `console.assert(condition, msg)` | `condition` が falsy のときだけエラーログを出力。検証用途に |
| `console.clear()` | DevTools のコンソールをクリア |

## 使用例

```js
// 処理時間計測
console.time('fetch');
await fetchData();
console.timeEnd('fetch'); // → fetch: 123.45ms

// グループ化
console.group('ユーザー処理');
console.log('取得開始');
console.log('取得完了');
console.groupEnd();

// DOM をオブジェクトとして確認
console.dir(document.querySelector('#app'));
```

# debugger 文

## 基本的な使い方

`debugger` をコードに記述すると、DevTools が開いている状態で該当行に到達したときに実行が一時停止し、ブレークポイントと同じ効果が得られる。
ローカル環境で調査する際に便利。

```js
function calcTotal(items) {
  debugger; // ← ここで一時停止
  return items.reduce((sum, item) => sum + item.price, 0);
}
```


## フレームワーク利用時にdebuggerが効かない場合
Nuxt などのフレームワーク上で `debugger` を書いても一時停止しないことがある。

### 原因

Chrome DevTools の **Ignore List** 機能により、フレームワークや node_modules のコードが「デバッグ対象外」として扱われている。
ビルド成果物やミドルウェアがその対象に含まれてしまい、`debugger` がスキップされてしまう。

### 対処方法

**DevTools → Settings (F1) → Ignore List** を開く。

1. Custom exclusion rules を確認
2. デフォルトで `/node_modules/` 関連のパターンが登録されているので、一時的に外しておく（普段は除外していた方が良いので一時的に）

---
title: "Claude Codeのモデル使い分け"
description: "Claude Codeで使えるモデルの種類・特徴・用途と切り替え方"
tags: ["Claude"]
---

# モデル一覧と特徴

Claude Codeでは以下のモデルが利用できる。モデルIDはClaude APIを直接使う場合にも共通。

| モデル | モデルID | 特徴 |
|--------|----------|------|
| **Haiku 4.5** | `claude-haiku-4-5` | 最速・最軽量。シンプルなタスク向き |
| **Sonnet 4.6** | `claude-sonnet-4-6` | バランス型。Claude Codeのデフォルト |
| **Opus 4.8** | `claude-opus-4-8` | 最高精度。複雑・難易度の高いタスク向き |
| **Fable 5** | `claude-fable-5` | 最新モデル |

## 使い分けの目安

### Haiku
- 単純な検索・要約・翻訳
- APIコストを抑えたい場合
- 応答速度を最優先したい場合

### Sonnet（デフォルト）
- 日常的なコーディング全般
- バグ修正、機能追加、リファクタリング
- コードレビュー
- ほとんどの用途はこれで十分

### Opus
- 難しいアーキテクチャ設計・複雑なリファクタリング
- 難解なバグの調査・解析
- 精度を最優先したい場合（速度やコストより）

# モデルの切り替え方

## セッション中に切り替える（`/model`コマンド）

Claude Code内で以下のコマンドを実行するとモデルを一覧から選択できる。

```
/model
```

## 起動時に指定する（`--model`フラグ）

```bash
claude --model claude-opus-4-8
```

## 設定ファイルで固定する

`~/.claude/settings.json` に記述するとデフォルトモデルを変更できる。

```json
{
  "model": "claude-opus-4-8"
}
```

---

# Fast モード（`/fast`）

`/fast` コマンドでFastモードに切り替えると、Opusモデルをより速い出力速度で使える。
（小さいモデルへのダウングレードではなく、Opus自体が高速化される）

```
/fast
```

もう一度 `/fast` を実行するとノーマルモードに戻る。

---

# effortLevel 設定

`settings.json` の `effortLevel` でClaudeが各タスクにかける思考の深さを設定できる。

```json
{
  "effortLevel": "medium"
}
```

| 値 | 内容 |
|----|------|
| `low` | 素早く・簡潔に応答する |
| `medium` | バランス型（推奨） |
| `high` | じっくり考えて応答する（複雑なタスク向き） |

モデルの性能とeffortLevelを組み合わせることで、速度と精度のバランスを調整できる。

### 参考
- [Claude Code Docs モデルの設定](https://code.claude.com/docs/ja/settings)
- [Anthropic モデル一覧](https://docs.anthropic.com/ja/docs/about-claude/models)

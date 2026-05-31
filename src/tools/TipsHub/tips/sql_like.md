---
title: "LIKE検索時の特殊文字エスケープ処理について"
description: "LIKE検索する際にエスケープ処理が必要な特殊文字と置換処理に関するTips"
tags: ["SQL", "LIKE"]
---

# LIKE検索時の特殊文字エスケープ
`LIKE`ではいくつか特殊文字があり、特殊文字が含まれている値に対してLIKEを使う場合はエスケープする必要がある。

| DB | エスケープ推奨文字 |
|---|---|
| MySQL | `%`, `_`, `\` |
| PostgreSQL | `%`, `_`, `\` | 
| SQL Server | `%`, `_`, `[` |
| Oracle | `%`, `_`, `\` |
| SQLite | `%`, `_`, `\` |

`%` は任意文字列、`_` は任意の1文字、`\` はエスケープ文字自身

## エスケープ処理例（PHP）
```php
// MySQL, PostgreSQL等のエスケープ処理例
/// PHPで`\`自体がエスケープ文字のため、文字列の`\`として処理するために`\\`としている
function escapeLike(string $value): string
{
    return str_replace(
        ['\\', '%', '_'],
        ['\\\\', '\\%', '\\_'],
        $value
    );
}

// SQL Server用
/// []が文字クラスを表現している。[[] とすることで、[をエスケープしている
function escapeLike(string $value): string
{
    return str_replace(
        ['[', '%', '_'],
        ['[[]', '[%]', '[_]'],
        $value
    );
}
```
SQL Serverでは`[]`が文字クラスを表現しているが、`]`単体で使用する場合は文字列として扱われるため、エスケープは`[`だけで良い。
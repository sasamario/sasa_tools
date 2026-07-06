---
title: "NestJS 例外クラス一覧"
description: "NestJS に組み込まれている HTTP 例外クラスとステータスコードの一覧"
tags: ["NestJS"]
---

## 例外クラス一覧

| クラス名 | ステータスコード | 説明 |
|---|---|---|
| `BadRequestException` | 400 Bad Request | リクエストの形式・バリデーションエラー |
| `UnauthorizedException` | 401 Unauthorized | 認証が必要、または認証失敗 |
| `PaymentRequiredException` | 402 Payment Required | 支払いが必要 |
| `ForbiddenException` | 403 Forbidden | 認証済みだがアクセス権限がない |
| `NotFoundException` | 404 Not Found | リソースが見つからない |
| `MethodNotAllowedException` | 405 Method Not Allowed | 許可されていない HTTP メソッド |
| `NotAcceptableException` | 406 Not Acceptable | Accept ヘッダーに合致するレスポンスがない |
| `RequestTimeoutException` | 408 Request Timeout | リクエストがタイムアウト |
| `ConflictException` | 409 Conflict | リソースの競合（重複登録など） |
| `GoneException` | 410 Gone | リソースが恒久的に削除済み |
| `PayloadTooLargeException` | 413 Payload Too Large | リクエストボディが大きすぎる |
| `UnsupportedMediaTypeException` | 415 Unsupported Media Type | Content-Type が未対応 |
| `ImATeapotException` | 418 I'm a teapot | ティーポット（RFC 2324 ジョーク仕様） |
| `UnprocessableEntityException` | 422 Unprocessable Entity | 構文は正しいがセマンティクスエラー |
| `TooManyRequestsException` | 429 Too Many Requests | レート制限超過 |
| `InternalServerErrorException` | 500 Internal Server Error | サーバー内部エラー |
| `NotImplementedException` | 501 Not Implemented | 未実装のメソッド |
| `BadGatewayException` | 502 Bad Gateway | 上流サーバーから不正なレスポンス |
| `ServiceUnavailableException` | 503 Service Unavailable | サービス一時停止・メンテナンス中 |
| `GatewayTimeoutException` | 504 Gateway Timeout | 上流サーバーのタイムアウト |
| `HttpVersionNotSupportedException` | 505 HTTP Version Not Supported | HTTP バージョン未対応 |

もし例外クラスとステータスコードの対応を実装から確認したい場合は以下NestJSのGithubで確認できる。
また、公式ドキュメントにも例外クラスの一覧はある（ただし、対応したステータスコードは書いてない）

- [nestjs](https://github.com/nestjs/nest/tree/master/packages/common/exceptions)
- [NestJS Docs exception-filters](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)

## NestJS 組み込み HTTP 例外クラス

`@nestjs/common` からインポートして使用できる例外クラスの一覧。

すべて `HttpException` を継承しており、`throw new XxxException()` の形で使用する。

```ts
import { NotFoundException } from '@nestjs/common';

throw new NotFoundException('リソースが見つかりません');
```

## HttpException（基底クラス）

上記に該当しないステータスコードを使いたい場合は `HttpException` を直接使う。
HttpStatusは`@nestjs/common`に組み込まれているenumとのこと。

```ts
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException('カスタムメッセージ', HttpStatus.FORBIDDEN);
// または数値で指定
throw new HttpException('カスタムメッセージ', 403);
```

## レスポンスオブジェクトのカスタマイズ

第1引数にオブジェクトを渡すとレスポンスボディを自由に定義できる。

```ts
throw new BadRequestException({
  statusCode: 400,
  message: ['email は必須です', 'password は8文字以上です'],
  error: 'Bad Request',
});
```

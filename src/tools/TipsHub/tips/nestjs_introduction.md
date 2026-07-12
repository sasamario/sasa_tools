---
title: "NestJS 入門"
description: "NestJSの基本要素（Module・Controller・Service）と登録・処理の流れをまとめたTips"
tags: ["NestJS"]
---

# NestJS の基本要素
NestJSはNode.jsフレームワークで、コードを **Module / Controller / Service** の3つの役割に分けて構成する。

## Module

アプリケーションを機能単位に分割するための **まとまりの単位**。  
`@Module()` デコレータで定義し、その機能に属する Controller・Service・他 Module をここで宣言する。

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController], // このモジュールが持つ Controller
  providers: [UsersService],      // このモジュールが持つ Service（Provider）
  exports: [UsersService],        // 他モジュールに公開したい場合に指定
})
export class UsersModule {}
```

| プロパティ | 役割 |
|---|---|
| `controllers` | このモジュールのリクエスト受け口（Controller）を登録 |
| `providers` | DI コンテナに登録する Service 等を指定 |
| `imports` | 依存する他のモジュールを取り込む |
| `exports` | 他モジュールから使えるように Provider を公開する |

■参考
- [NestJS Modules](https://docs.nestjs.com/modules)

## Controller

HTTP リクエストを受け取り、レスポンスを返す層。  
ビジネスロジックは持たず、リクエストの受け渡しに専念する。

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // ベースパス: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
```
■よく使うデコレータ
| デコレータ | 意味 |
|---|---|
| `@Controller('path')` | ベースパスを定義 |
| `@Get()` / `@Post()` 等 | HTTP メソッドとパスを定義 |
| `@Param('key')` | パスパラメータを取得 |
| `@Body()` | リクエストボディを取得 |
| `@Query('key')` | クエリパラメータを取得 |

■参考
- [NestJS Controllers](https://docs.nestjs.com/controllers)

## Service

ビジネスロジックを持つ層。  
`@Injectable()` を付けることで DI（依存性の注入）の対象になり、Controller 等から注入して使える。

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [{ id: 1, name: 'Alice' }];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(u => u.id === id);
  }

  create(data: { name: string }) {
    const user = { id: Date.now(), ...data };
    this.users.push(user);
    return user;
  }
}
```

■参考
- [NestJS Providers](https://docs.nestjs.com/providers)

## ルートモジュールと機能モジュールの関係

NestJS アプリは必ず **ルートモジュール（AppModule）** を起点にツリー構造を構成する。  
機能ごとにモジュールを分割し、AppModule に `imports` で取り込む。

```
AppModule
├── UsersModule
│   ├── UsersController
│   └── UsersService
├── PostsModule
│   ├── PostsController
│   └── PostsService
└── ...
```

### AppModule での機能モジュール登録

```typescript
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
```

### エントリーポイント（main.ts）

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

---

## リクエストの処理の流れ

```
HTTP リクエスト
    ↓
[Middleware]         ← 共通処理（認証・ログ等）
    ↓
[Guard]              ← 認可チェック
    ↓
[Interceptor（前）]  ← レスポンス変換・タイミング計測等
    ↓
[Pipe]               ← バリデーション・型変換
    ↓
Controller           ← ルーティング・リクエスト受け取り
    ↓
Service              ← ビジネスロジック実行
    ↓
[Interceptor（後）]  ← レスポンス加工
    ↓
HTTP レスポンス
```

基本の流れとしては **Controller がリクエストを受け取り → Service に処理を委譲 → 結果をレスポンスとして返す** のシンプルな構成。

---

## モジュール間で Service を使い回す

別のモジュールの Service を利用したい場合は `exports` と `imports` を組み合わせる。

```typescript
// auth.module.ts
@Module({
  providers: [AuthService],
  exports: [AuthService], // 外部に公開
})
export class AuthModule {}

// users.module.ts
@Module({
  imports: [AuthModule],  // AuthModule を取り込むことで AuthService が使える
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly authService: AuthService) {} // DI で注入
}
```

`exports` に書かれた Provider だけが外部公開され、書かれていないものはそのモジュール内に閉じる。  
これにより **依存関係を明示的に管理** できる。

## 参考
- [NestJSにざっくり入門してみる](https://zenn.dev/higuchimakoto/articles/21c8420c4a612a)
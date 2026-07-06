---
title: "NestJS デコレータ一覧"
description: "NestJS でよく使うデコレータ一覧"
tags: ["NestJS"]
---

## ルーティング系

| デコレータ | 説明 |
|---|---|
| `@Controller('prefix')` | コントローラーのルートパスを定義する |
| `@Get('path')` | HTTP GET メソッドのルートを定義する |
| `@Post('path')` | HTTP POST メソッドのルートを定義する |
| `@Put('path')` | HTTP PUT メソッドのルートを定義する |
| `@Patch('path')` | HTTP PATCH メソッドのルートを定義する |
| `@Delete('path')` | HTTP DELETE メソッドのルートを定義する |
| `@All('path')` | すべての HTTP メソッドにマッチするルートを定義する |
| `@Redirect(url, status?)` | 指定した URL にリダイレクトする |
| `@HttpCode(statusCode)` | レスポンスのステータスコードを指定する（デフォルトは POST が 201、それ以外は 200） |
| `@Header(key, value)` | レスポンスヘッダーに固定値をセットする |

```ts
@Controller('users')
export class UsersController {
  @Get()
  @HttpCode(200)
  findAll() { ... }

  @Post()
  create() { ... }  // デフォルト 201
}
```


## パラメータ系

| デコレータ | 説明 |
|---|---|
| `@Param('key')` | URLパスパラメータを取得する（`:id` など） |
| `@Query('key')` | クエリストリングを取得する（`?page=1` など） |
| `@Body()` | リクエストボディ全体を取得する |
| `@Body('key')` | リクエストボディの特定フィールドを取得する |
| `@Headers('key')` | リクエストヘッダーを取得する |
| `@Ip()` | クライアントの IP アドレスを取得する |
| `@HostParam('key')` | ホストパラメータを取得する（サブドメインルーティング時） |
| `@Req()` | Express/Fastify のリクエストオブジェクトを直接取得する |
| `@Res()` | Express/Fastify のレスポンスオブジェクトを直接取得する（使用時は `passthrough: true` 推奨） |

```ts
@Get(':id')
findOne(
  @Param('id') id: string,
  @Query('fields') fields: string,
) { ... }

@Post()
create(@Body() createUserDto: CreateUserDto) { ... }
```


## ガード・ミドルウェア連携系

| デコレータ | 説明 |
|---|---|
| `@UseGuards(Guard)` | ガードを適用する（認証・認可チェック） |
| `@UseInterceptors(Interceptor)` | インターセプターを適用する（ログ・変換など） |
| `@UsePipes(Pipe)` | パイプを適用する（バリデーション・変換） |
| `@UseFilters(Filter)` | 例外フィルターを適用する |
| `@SetMetadata(key, value)` | カスタムメタデータをセットする（ガード内で `Reflector` を使って参照） |

```ts
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController { ... }
```


## Swagger（@nestjs/swagger）系

`@nestjs/swagger` をインストールすると使用可能。

| デコレータ | 説明 |
|---|---|
| `@ApiTags('name')` | Swagger UI でのグループ名を指定する |
| `@ApiOperation({ summary })` | エンドポイントの説明を記述する |
| `@ApiResponse({ status, description })` | レスポンスの定義を記述する |
| `@ApiOkResponse({ type })` | 200 レスポンスの型を指定する |
| `@ApiCreatedResponse({ type })` | 201 レスポンスの型を指定する |
| `@ApiNotFoundResponse()` | 404 レスポンスを定義する |
| `@ApiBearerAuth()` | Bearer トークン認証を Swagger に示す |
| `@ApiParam({ name, description })` | パスパラメータを Swagger に記述する |
| `@ApiQuery({ name, description })` | クエリパラメータを Swagger に記述する |
| `@ApiBody({ type })` | リクエストボディの型を Swagger に記述する |

```ts
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Get(':id')
  @ApiOperation({ summary: 'ユーザー取得' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'ユーザーが存在しない' })
  findOne(@Param('id') id: string) { ... }
}
```


## 依存注入系

### プロバイダー定義

| デコレータ | 説明 |
|---|---|
| `@Injectable()` | クラスを NestJS の DI コンテナで管理できるプロバイダーとして登録する。Service・Guard・Interceptor 等すべてに付ける |
| `@Module({ imports, controllers, providers, exports })` | モジュールを定義する。`providers` に登録したものが DI の対象になる |

```ts
@Injectable()
export class UsersService { ... }

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],  // 他モジュールから使えるようにする場合
})
export class UsersModule {}
```

### インジェクション

| デコレータ | 説明 |
|---|---|
| `@Inject(token)` | コンストラクタ引数に対して明示的にトークンを指定して注入する。クラス以外（文字列・シンボルトークン）のプロバイダーを注入する際に必要 |
| `@Optional()` | 注入対象が DI コンテナに存在しなくてもエラーにしない（`undefined` になる） |

```ts
// 通常はコンストラクタの型推論で自動注入されるため @Inject 不要
constructor(private readonly usersService: UsersService) {}

// カスタムトークンを使う場合は @Inject が必要
constructor(@Inject('CONFIG_OPTIONS') private config: ConfigOptions) {}

// 存在しなくてもよいプロバイダー
constructor(@Optional() private readonly logger?: LoggerService) {}
```

### スコープ

`@Injectable()` にはインスタンスのスコープを指定できる。

| スコープ | 説明 |
|---|---|
| `Scope.DEFAULT` | アプリ起動時に1つだけ生成されるシングルトン（デフォルト） |
| `Scope.REQUEST` | リクエストごとにインスタンスが生成される |
| `Scope.TRANSIENT` | 注入されるたびに新しいインスタンスが生成される |

```ts
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService { ... }
```

## 参考

- [NestJS Docs - Controllers](https://docs.nestjs.com/controllers)
- [NestJS Docs - Providers](https://docs.nestjs.com/providers)
- [NestJS Docs - Modules](https://docs.nestjs.com/modules)
- [NestJS Docs - OpenAPI (Swagger)](https://docs.nestjs.com/openapi/introduction)

---
title: "Docker環境構築（SSL対応）"
description: "Dockerローカル環境構築もりもり解説"
tags: ["Docker"]
---

# 概要
Dockerで以下の環境を構築する際の手順や解説をする。  
- Apache2.4.67(Debian)
- PHP8.3
- Laravel13
- PostgreSQL17

ディレクトリ構成は以下の通り。
```text
project/
├── compose.yml
├── docker/
│   └── web/
│       ├── Dockerfile
│       ├── custom_php.ini
│       ├── 000-default.conf
│       ├── default-ssl.conf
│       └── ssl/
│           ├── server.crt
│           └── server.key
├── src/
│   └── Laravel/
└── .gitignore
```

# Dockerfile
## 全体
```Dockerfile
FROM php:8.3-apache

# OSパッケージのインストール
RUN apt-get update && apt-get install -y \
  git \
  unzip \
  zip \
  libpq-dev \
  libxml2-dev \
  libonig-dev \
  && rm -rf /var/lib/apt/lists/*

# PHP拡張のインストール
RUN docker-php-ext-install \
  pdo \
  pdo_pgsql \
  mbstring \
  xml

# custom_php.iniをコピー
COPY docker/web/custom_php.ini /usr/local/etc/php/conf.d/custom_php.ini

# Apacheのrewrite,sslモジュール有効化
RUN a2enmod rewrite ssl

# Apacheのドキュメントルートを変更
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
  /etc/apache2/sites-available/*.conf \
  /etc/apache2/apache2.conf \
  /etc/apache2/conf-available/*.conf

# SSL対応
## SSL証明書と秘密鍵をコピー
COPY docker/web/ssl/server.crt /etc/apache2/ssl/server.crt
COPY docker/web/ssl/server.key /etc/apache2/ssl/server.key

## SSL設定をコピー
COPY docker/web/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf

## default-ssl.confを有効化
RUN a2ensite default-ssl

# Composerを公式イメージから取得
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリ変更
WORKDIR /var/www/html
```

## OSのパッケージインストール
```Dockerfile
# OSパッケージのインストール
RUN apt-get update && apt-get install -y \
  git \
  unzip \
  zip \
  libpq-dev \
  libxml2-dev \
  libonig-dev \
  && rm -rf /var/lib/apt/lists/*
```
今回使用しているLinuxディストリビューションはDebianのため、パッケージ管理コマンドとして`apt-get`を使用している。  
`apt-get update`でパッケージ一覧を最新化している。  
`apt-get update && apt-get instal`の`&&`は、`apt-get update`が成功したら`apt-get install`を実行するという意味。  

導入パッケージは以下の通り。
| パッケージ | 用途 |
|-----------|------|
| git / unzip / zip | Composer実行時のパッケージ取得・展開・圧縮処理に使用 |
| libpq-dev | PHPのPostgreSQL関連拡張（pdo_pgsql等）のビルドに必要 |
| libxml2-dev | PHPのXML関連拡張（xml等）のビルドに必要 |
| libonig-dev | PHPのマルチバイト文字列拡張（mbstring）のビルドに必要 |

`rm -rf /var/lib/apt/lists/*`は、`apt-get update`で取得したパッケージ一覧のキャッシュを削除している。これによりDockerイメージのサイズを小さくしている。

## PHP拡張のインストール
```Dockerfile
# PHP拡張のインストール
RUN docker-php-ext-install \
  pdo \
  pdo_pgsql \
  mbstring \
  xml
```
`docker-php-ext-install`はPHPのDockerイメージが提供しているPHP拡張モジュールをインストール・有効化するためのコマンド。  
ひとまず最低限入れているだけなので他に必要なものがあれば入れる必要がある。  
| PHP拡張モジュール | 用途 |
|------------------|------|
| pdo | データベースへ接続するための共通インターフェース |
| pdo_pgsql | PostgreSQLへ接続するためのPDOドライバ |
| mbstring | 日本語などのマルチバイト文字列を正しく処理するための拡張 |
| xml | XMLデータの解析や操作を行うための拡張 |

## php.iniのコピー
```Dockerfile
# custom_php.iniをコピー
COPY docker/web/custom_php.ini /usr/local/etc/php/conf.d/custom_php.ini
```
PHP公式のDockerイメージで、追加設定ファイルの配置場所が決まっていてそれが`/usr/local/etc/php/conf.d/`である。  
> The default config can be customized by copying configuration files into the $PHP_INI_DIR/conf.d/ directory.  
> 引用元: https://hub.docker.com/_/php

公式イメージのテンプレートで`ENV PHP_INI_DIR /usr/local/etc/php`のように環境設定値が定義されている。  
そのため、`${PHP_INI_DIR}/conf.d/custom_php.ini`と指定することもできる。  
ただ、環境設定値がなんなのかわからないのでここでは直接パスを指定している。  
[Dockerfile-linux.template](https://github.com/docker-library/php/blob/master/Dockerfile-linux.template#L90)

COPY元はこちらで用意しているcustom_php.iniを指定。compose.ymlで指定したcontextからのパスを指定すること。

## Apache設定（モジュール有効化、ドキュメントルート設定）
### モジュール有効化
```Dockerfile
RUN a2enmod rewrite ssl
```
`a2enmod`はApacheのモジュールを有効化するコマンド。  
| モジュール | 用途 |
|-----------|------|
| rewrite | URL書き換え（URL Rewriting）を行うため |
| ssl | HTTPS通信を行うため |

rewriteは、Laravelなどフレームワークでのルーティングで必要（/index.php/users → /users）。  
sslは後述するSSL対応で必要。  

### ドキュメントルートの設定
```Dockerfile
# Apacheのドキュメントルートを変更
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -i 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
  /etc/apache2/sites-available/*.conf \
  /etc/apache2/apache2.conf \
  /etc/apache2/conf-available/*.conf
```
`sed`コマンドを使って、Apacheでパスが書かれている設定ファイルに対して置換処理している。`-i`オプションでファイル編集を指定している。  
| 置換対象ファイル | 役割 |
|----------|------|
| sites-available/*.conf | VirtualHost（サイト設定）を定義するファイル |
| apache2.conf | Apache全体の基本設定ファイル |
| conf-available/*.conf | Apacheの追加設定ファイル |

DocumentRoot以外にも、`<Directory>`のような権限設定などでパスを指定しているところがあるのでそれらも対象としている。  

## Apache設定（SSL対応）
SSL対応に必要な証明書と鍵の作成は以下の手順で行う。
```bash
# sslフォルダを作成
cd /path/docker/web
mkdir ssl
cd ssl
```

### 秘密鍵作成
```bash
# 秘密鍵（server.key）作成
openssl genpkey -algorithm RSA \
  -out server.key \
  -pkeyopt rsa_keygen_bits:2048
```
| オプション | 説明 |
|-----------|------|
| genpkey | 秘密鍵を生成するコマンド |
| -algorithm RSA | RSA方式で鍵を生成する |
| -out server.key | 生成した秘密鍵を `server.key` として出力する |
| -pkeyopt rsa_keygen_bits:2048 | 鍵長を2048bitに指定する |

※以前は`genrsa`が利用されていたが、現在は`genpkey`の利用が推奨されている。  

### 自己証明書作成
```bash
# 証明書（server.crt）の作成
openssl req \
  -new \
  -x509 \
  -key server.key \
  -out server.crt \
  -days 365
```
| オプション | 説明 |
|-----------|------|
| req | CSR（証明書署名要求）や証明書を作成するコマンド |
| -new | 新規に証明書要求を作成する |
| -x509 | CSRではなく自己署名証明書を作成する |
| -key server.key | 証明書作成時に使用する秘密鍵を指定する |
| -out server.crt | 作成した証明書を `server.crt` として出力する |
| -days 365 | 証明書の有効期限を365日に設定する |

※本来はCSRファイルを作成後CAに提出し、CAが署名した証明書（CRTファイル）を使う流れだが、今回は自己証明書のため、`-x509`で自分で署名している。

### Dockerfile側の設定
```Dockerfile
# SSL対応
## SSL証明書と秘密鍵をコピー
COPY docker/web/ssl/server.crt /etc/apache2/ssl/server.crt
COPY docker/web/ssl/server.key /etc/apache2/ssl/server.key

## SSL設定をコピー
COPY docker/web/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf

## default-ssl.confを有効化
RUN a2ensite default-ssl
```
事前に作成した証明書と秘密鍵をコピーしておく（コピー先は特に指定の場所があるわけではないが、default-ssl.confで指定するパスと合わせること）。  
ApacheのHTTPS用の設定ファイル（default-ssl.conf）をコピーして、有効化する。  
`RUN a2ensite default-ssl`は、`default-ssl.conf`をApacheの有効なサイト設定として登録するコマンド。  
設置するだけでは読み込まれず、このコマンドで有効化することで以下のようなイメージで`sites-available/default-ssl.conf`へのシンボリックリンクが作成されるらしい。
```text
sites-available/
└─ default-ssl.conf

sites-enabled/
└─ default-ssl.conf -> ../sites-available/default-ssl.conf
```

# default-ssl.conf
```default-ssl.conf
<VirtualHost *:443>
  ServerName sample-docker

  DocumentRoot /var/www/html/public

  SSLEngine on

  SSLCertificateFile /etc/apache2/ssl/server.crt
  SSLCertificateKeyFile /etc/apache2/ssl/server.key

  <Directory /var/www/html/public>
    AllowOverride All
    Require all granted
  </Directory>
</VirtualHost>
```
`default-ssl.conf`（ApacheのHTTPS用のVirtualHost設定ファイル）。  
Apacheにはサイトごとの設定を行う、VirtualHostという仕組みがある。  

| 設定内容 | 説明 |
|----------|------|
| VirtualHost *:443 | HTTPS(443番ポート)で待ち受ける |
| SSLEngine on | SSL/TLS機能を有効化する |
| SSLCertificateFile | SSL証明書(.crt)のパスを指定する |
| SSLCertificateKeyFile | 秘密鍵(.key)のパスを指定する |
| DocumentRoot | 公開ディレクトリを指定する |
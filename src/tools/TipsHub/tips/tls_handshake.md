---
title: "TLSハンドシェイクをopensslコマンドで確認"
description: "TLSハンドシェイクをopensslコマンドで確認する際のTips"
tags: ["TLS"]
---

# opensslコマンドによるTLSハンドシェイクの確認
## OpenSSLとopensslコマンドについて
OpenSSLは、SSL/TLSや暗号化機能を提供するオープンソースのソフトウェア。
ライブラリだけでなく、SSL/TLSの確認や証明書の操作などを行うための**opensslコマンド**も提供している。

```bash
# opensslが使えるか確認（Macの場合はデフォルトで入っているらしい）
openssl version
```

## openssl s_clientについて
`openssl s_client`は、TLSクライアントとしてサーバへ接続するためのOpenSSLのサブコマンド。
HTTPS通信でブラウザが行うようなTLS接続を実行し、接続先サーバのTLSに関する情報を確認できる。

公式ドキュメント: [OpenSSL Documentation openssl-s_client](https://docs.openssl.org/3.0/man1/openssl-s_client/)

### 用途
- TLS接続の動作確認
- サーバ証明書の確認
- 証明書チェーンの確認
- TLSバージョンの確認
- 暗号スイート（Cipher Suite）の確認
- TLSハンドシェイクの解析・学習
- TLS関連のトラブルシューティング

### 使い方
```bash
# 基本構文
openssl s_client -connect <ホスト名>:<ポート番号> [オプション]

# 使用例
openssl s_client -connect google.com:443 -msg
```
| オプション | 説明 |
|-----------|------|
| `-connect <host>:<port>` | 接続先のホスト名とポート番号を指定 |
| `-msg` | TLSハンドシェイクで送受信されるTLSメッセージを表示 |
| `-state` | OpenSSL内部のTLS接続状態（状態遷移）を表示 |
| `-showcerts` | サーバから送信された証明書チェーンをすべて表示 |
| `-servername <hostname>` | SNI（Server Name Indication）を指定して接続 |
| `-tls1_2` | TLS 1.2を使用して接続 |
| `-tls1_3` | TLS 1.3を使用して接続 |
| `-brief` | 接続結果を簡潔に表示 |

### 実際に確認してみる
```bash
# 実行コマンド
openssl s_client -connect google.com:443 -msg

# 実行結果（抜粋）※TLS v1.3（Record Headerに記載のv1.0やv1.2というのは互換性のための表示らしい。実際のやり取りのバージョンはHandshakeのところを見ればわかる）
## google.comをDNSで名前解決した結果のIPアドレス。CONNECTEDはTCP接続が正常に確立したということ
Connecting to 142.251.23.139
CONNECTED(00000006)

## ① Client Hello（Client >>> Server）
>>> TLS 1.0, RecordHeader [length 0005]
>>> TLS 1.3, Handshake [length 0600], ClientHello

## ② Server Hello（Client <<< Server）
<<< TLS 1.2, RecordHeader [length 0005]
<<< TLS 1.3, Handshake [length 04ba], ServerHello

## ※TLS1.2以前で使用されていたメッセージ（以降で暗号化通信に切り替えることを明示するもの）
## TLS1.3では不要だが互換性のために送受信している
<<< TLS 1.2, RecordHeader [length 0005]
<<< TLS 1.3, ChangeCipherSpec [length 0001]

## --- この時点でクライアント、サーバ側でそれぞれ共有鍵の計算ができているので以降のやり取りは暗号化されている ---

## ③ サーバ証明書、④ Certificate Verify、⑤ Finished（Client <<< Server）
### InnerContentは、この暗号化されたデータの中身はHandshakeメッセージということを示すものらしい
<<< TLS 1.2, RecordHeader [length 0005]
<<< TLS 1.3, InnerContent [length 0001]
### EncryptedExtensionsは、TLS接続に関する追加情報をクライアントに通知するメッセージ
<<< TLS 1.3, Handshake [length 0006], EncryptedExtensions
### ③ サーバ証明書を送信
<<< TLS 1.3, Handshake [length 1305], Certificate
### ④ Certificate Verify（サーバ証明書の所有者であることを証明するための、秘密鍵で署名したデータ）
<<< TLS 1.3, Handshake [length 004e], CertificateVerify
### ⑤ Finished（ここまでのハンドシェイク内容が改ざんされていないことを確認するための検証データ）
<<< TLS 1.3, Handshake [length 0034], Finished

## ⑥ Finished（Client >>> Server）
>>> TLS 1.2, RecordHeader [length 0005]
>>> TLS 1.3, ChangeCipherSpec [length 0001]
>>> TLS 1.2, RecordHeader [length 0005]
>>> TLS 1.2, InnerContent [length 0001]
### ⑥ Finished（サーバと同様にここまでのハンドシェイク内容が改竄されていないことを確認するための検証データ）
>>> TLS 1.3, Handshake [length 0034], Finished

## --- TLSハンドシェイク完了 ---
```

#### ■TLS Record
TLSでは、Client HelloやServer HelloなどのハンドシェイクメッセージはTLSレコードという単位で送受信されている。
TLS Recordは、**Record Header（5バイト）**と**Record Payload**で構成されている。
Record Headerには、データの種類やバージョン、データ長さなどの情報が格納されている。

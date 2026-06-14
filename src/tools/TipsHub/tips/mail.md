---
title: "送信ドメイン認証（SPF/DKIM/DMARC）について"
description: "送信ドメイン認証（SPF/DKIM/DMARC）の仕組み"
tags: ["SPF / DKIM / DMARC"]
---

# 送信ドメイン認証
SMTPでは、差出人のメールアドレス（Fromアドレス）を自由に設定することができる。
なりすましメールの対策には、SPF、DKIM、DMARCといった送信ドメイン認証が有効である。

# SPFについて
### ■概要  
SPF（Sender Policy Framework）は、 電子メールの**送信元ドメインが詐称されていないかを検査する**ための仕組み。  
SPFではDNSを利用する。  

### ■目的 
メール送信元メールサーバのIPが正当なものか確認

### ■送信側と受信側の対応  
送信側：DNSにSPFレコードという情報を追加。ドメイン名を送信元としてメールを送ってもよいサーバのIPアドレスを登録  

受信側：メール受信時に送信元のドメインのSPFレコードをDNSに問い合わせ、送信元サーバのIPが許可されているか確認

```text
1. 送信側 メールサーバがメールを送信
From: user@example.com  
送信元サーバIP: xxx.x.xxx.xx  

2. 受信側がDNSを確認
受信サーバはexample.comのSPFレコードをDNSから取得  
example.com TXT "v=spf1 ip4:xxx.x.xxx.xx -all"

・v=spf1　SPFのバージョン  
・ip4: xxx.x.xxx.xx　許可IP  
・-all　それ以外は拒否  

3. IPを照合
受信サーバは送信IPとSPF許可IPを比較し、一致すれば`SPF PASS`  
SPFがチェックするのはEnvelopeFromのアドレス。
```


# DKIM
### ■概要
DKIM（Domain Keys Identified Mail）は、 電子メールにおける送信ドメイン認証技術の一つ。
メールを送信する際に送信元が電子署名を行い、 受信者がそれを検証することで、 **送信者のなりすましやメールの改ざんを検知できる**ようにするもの。

### ■目的
メールの改ざん検知

### ■送信側と受信側の対応
送信側：メール送信時に秘密鍵で署名を付与、DNSに対応する公開鍵を登録  
受信側：DNSの公開鍵を使って、メール本文やヘッダの署名を検証し改ざんされていないか確認

# DMARC
### ■概要
DMARC (Domain-based Message Authentication, Reporting, and Conformance)とは、 電子メールにおける送信ドメイン認証技術の一つ。
DMARCは、**SPFとDKIMを利用したメールのドメイン認証を補強する技術**。

SPFやDKIMを用いて送信元ドメインを認証する際、認証に失敗したメールの取り扱いは受信者側の判断に委ねられる。  
また認証に失敗したか、どのように処理されたかは送信者が把握できない。  
この課題を解消するのがDMARCで、認証失敗時にどのようにメールを処理するかなどをポリシーと呼ばれるレコードをDNSに公開して表明する仕組み。

### ■目的
SPFやDKIMを統合的に制御し、なりすまし対策を強化

### ■送信側と受信側の対応
送信側：DNSにSPFやDKIMの結果に基づくポリシーを記載  
受信側：SPFやDKIMの検証結果を確認し、DMARCポリシーに従って対応

# 参考
- [インターネット用語1分解説～SPFとは～ - JPNIC](https://www.nic.ad.jp/ja/basics/terms/spf.html)
- [インターネット用語1分解説～DKIMとは～ - JPNIC](https://www.nic.ad.jp/ja/basics/terms/dkim.html)
- [インターネット用語1分解説～DMARCとは](https://www.nic.ad.jp/ja/basics/terms/dmarc.html)

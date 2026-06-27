---
title: "メールエージェント（MUA/MTA/MDA）について"
description: "メールエージェント（MUA/MTA/MDA）の役割に関するTips"
tags: ["メール"]
---

# MUA,MTA,MDA
### 全体の流れ
```
送信者
 ↓
MUA(メールクライアント:Gmail,Outlook)
 ↓ SMTP
MTA(メール転送エージェント:Postfix,Sendmail)
 ↓ SMTP
相手MTA
 ↓
MDA(メール配送エージェント)
 ↓（保存）
メールボックス
 ↑（取得）
MUA(メールクライアント)
 ↓
受信者
```

### MUA(Mail User Agent)
ユーザが使うメールクライアントのこと。GamilやOutlockなど。

■役割
- メールを書く
- メールを読む
- メール送信を依頼する

### MTA(Mesage Transfer Agent)
メールを他のメールサーバに転送、配送する。PostfixやSendmailなど。

■役割
- SMTPでメールを受け取る
- 宛先メールサーバを探す
- メールを宛先のメールサーバに配送する
- 再送管理

### MDA(Message Delivery Agent)
メールをユーザーのメールボックスに保存する。

■役割
- 受信したメールを保存
- ユーザーのメールボックスに配達
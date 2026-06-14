---
title: "OCIについて"
description: "OCIと提供サービスについて"
tags: ["OCI"]
---

# OCIとは
OCI（Oracle Cloud Infrastructure）は、Oracleが提供するクラウドサービス。 
OCIではインフラ基盤からアプリケーション実行環境まで幅広いクラウドサービスを提供している。

# OCIで利用できる主なサービス（IaaSサービス）
## VCN（Virtual Cloud Network）
VCNは、特定リージョンにあるOCI上に作成する仮想ネットワーク。  
VCNでネットワーク空間を用意し、サブネットで分割してその中に各サーバを配置する。


### サブネット（Subnet）
VCNを論理的に分割したネットワーク区画（Subdivision）。  
VCNのIPアドレス範囲を分割し、用途ごとにサーバを配置するために利用する。
```text
VCN (10.0.0.0/16)
├─ Public Subnet  (10.0.1.0/24)
├─ Private Subnet (10.0.2.0/24)
└─ Private Subnet (10.0.3.0/24)
```

### セキュリティリスト（Security lists）
セキュリティリストは、サブネットに適用する仮想ファイアウォール。  

```text
VCN
├─ Public Subnet
│   ├─ Security ListA
│   └─ Webサーバ
│
└─ Private Subnet
      ├─ Security ListB
      └─ DBサーバ
```

### ネットワークセキュリティグループ（Network Security Group）
NSGは、コンピュートインスタンスやその他リソースに対する仮想ファイアウォール。  
セキュリティリストがサブネット単位で通信を制御するのに対し、NSGはインスタンス単位で通信を制御できる。  
```text
VCN
└─ Public Subnet
   ├─ Web1 (NSG-Web)
   ├─ Web2 (NSG-Web)
   └─ Bastion (NSG-Bastion)　※踏み台サーバ
```
上記例の場合、Web1とWeb2には同じNSGが適用されていて、Bastionには異なるNSGが適用されている。


### 参考  
- [Virtual Cloud Network（VCN）](https://www.oracle.com/jp/cloud/networking/virtual-cloud-network/)
- [Overview of VCNs and Subnets](https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/Overview_of_VCNs_and_Subnets.htm)
- [Security Rules](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/securityrules.htm) 
- [Network Security Groups](http://docs.oracle.com/en-us/iaas/Content/Network/Concepts/networksecuritygroups.htm)


### Compute
OCIで仮想サーバを提供するサービス。  
Computeサービスを利用して、コンピュートインスタンスを作成する。  
CPUやメモリ構成を自由に選択できる「シェイプ」により、開発環境から大規模処理まで要件に応じた柔軟な構成が可能。  


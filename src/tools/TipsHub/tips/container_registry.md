---
title: "Quay.ioというコンテナレジストリについて"
description: "DockerHubからイメージが削除されていた場合の対処法に関するTips"
tags: ["Docker"]
---

# 概要
Dockerコンテナ内で使用していたMinioのイメージをpullする際に以下のエラーが発生していた。
`pull access denied for minio/minio, repository does not exist or may require 'docker login'`

どうやら、MinioのイメージがDockerHubから削除されていたことが原因だった。
その際、別のコンテナレジストリであるQuayからMinioのイメージをpullすることでことなきを得た。

まさに以下の記事の事象に遭遇。
[MinIO のイメージが Docker Hub から消えました](https://stablebuild.jp/blog/minio-images-disappeared-from-docker-hub/)

Quay.ioについてとイメージの探し方について記載する。

## Quayとは
Quayとは、RedHat社が提供するコンテナレジストリ（コンテナイメージの保管、管理サービス）であり、DockerHubの代替・競合サービス。
※元々は別の会社が開発していたものをRedHatが買収したらしい。

## Quay.ioでのイメージ検索
以下公式サイトで元々使っていたイメージ名で検索してみる。
[Quay.io Explore](https://quay.io/search)

例えば以下、quay.ioにあるminioのイメージページ。ここにあるDockerコマンドをDockerfileなどで指定すれば良い。
https://quay.io/repository/minio/minio

公式のイメージかどうかの判断基準として以下の観点で確認すると良い。
1. 組織(Organization)名を確認する　→　イメージのパスが、`quay.io/組織名/イメージ名`となっているか
2. プロジェクトの公式ドキュメント・GitHubから直接リンクをたどる

ただ、DockerHubとは別のコンテナレジストリなので全く同じイメージではないと思われるので、その点り介した上で使う必要あり。
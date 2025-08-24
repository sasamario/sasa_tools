export const commands = {
  // 雛形 { command: "", description: "" },
  Git: [
    { command: `git commit --no-veryfy -m "[コミットメッセージ]"`, description: "コミット時フック無効化、メッセージ指定" },
    { command: "git checkout -b [ブランチ名]", description: "ブランチを作成し切り替える" },
    { command: "git diff origin/[ブランチ1]..origin/[ブランチ2]", description: "リモートブランチ1とリモートブランチ2間の比較" },
    { command: "git cherry-pick [コミットハッシュA] [コミットハッシュB] [コミットハッシュC]", description: "AとBとCのコミットを取り込む" },
    { command: "git cherry-pick [コミットハッシュA]^..[コミットハッシュC]", description: "Aを含むA〜Cのコミットを取り込む" },
    { command: `git stash push -m "[メッセージ] [ファイルパス]" `, description: "指定ファイルをメッセージ付きでスタッシュに保存" },
  ],
  Docker: [
    { command: "docker compose ps", description: "コンテナ一覧、状態の表示" },
    { command: "docker container exec -it [コンテナ名] bash", description: "コンテナに入る" },
    { command: "docker compose up -d", description: "コンテナをまとめてバックグラウンドで起動" },
  ],
  Mysql: [
    { command: "mysql -u [ユーザ名] -p", description: "localhostのMySQLサーバに接続" },
    { command: "show databases;", description: "DB一覧表示" },
    { command: "use [DB名];", description: "DB選択" },
    { command: "show tables;", description: "テーブル一覧の表示" },
  ],
};

export const commands = {
  // 雛形 { command: "", description: "" },
  Git: [
    { command: `git commit --no-veryfy -m "[コミットメッセージ]"`, description: "コミット時フック無効化、メッセージ指定" },
    { command: "git checkout -b [ブランチ名]", description: "ブランチを作成し切り替える" },
    { command: "git diff origin/[ブランチ1]..origin/[ブランチ2]", description: "リモートブランチ1とリモートブランチ2間の比較" },
    { command: "git cherry-pick [コミットハッシュA] [コミットハッシュB] [コミットハッシュC]", description: "AとBとCのコミットを取り込む" },
    { command: "git cherry-pick [コミットハッシュA]^..[コミットハッシュC]", description: "Aを含むA〜Cのコミットを取り込む" },
    { command: `git stash push -m "[メッセージ]" [ファイルパス]`, description: "指定ファイルをメッセージ付きでスタッシュに保存" },
    { command: "git branch -d [ブランチ名]", description: "ローカルブランチを削除" },
    { command: "git push origin --delete [ブランチ名]", description: "リモートブランチを削除" },
  ],
  Docker: [
    { command: "docker compose ps", description: "コンテナ一覧、状態の表示" },
    { command: "docker container exec -it [コンテナ名] bash", description: "コンテナに入る" },
    { command: "docker compose up -d", description: "コンテナをまとめてバックグラウンドで起動" },
    { command: "docker volume ls", description: "Dockerボリュームの一覧を表示" },
    { command: "docker volume rm [ボリューム名]", description: "Dockerボリュームの削除" },
  ],
  SQL: [
    { command: "INSERT INTO [テーブル名] VALUES ([値1], [値2], ...);", description: "テーブルにデータを挿入" },
    { command: "INSERT INTO [テーブル名] (カラム1, ...) SELECT 値1, ... FROM [別のテーブル名];", description: "別のテーブルからデータを挿入" },
    { command: "UPDATE [テーブル名] SET [カラム1] = [値1], [カラム2] = [値2] WHERE [条件];", description: "テーブルのデータを更新" },
    { command: "DELETE FROM [テーブル名] WHERE [条件];", description: "テーブルのデータを削除" },
  ],
  PostgreSQL: [
    { command: "SELECT * FROM information_schema.tables WHERE table_name = '[テーブル名]';", description: "テーブルの存在確認" },
    { command: "gen_random_uuid()", description: "UUIDを生成" },
    { command: "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'", description: "UTCの現在時刻を取得" },
  ],
  MySQL: [
    { command: "mysql -u [ユーザ名] -p", description: "localhostのMySQLサーバに接続" },
    { command: "show databases;", description: "DB一覧表示" },
    { command: "use [DB名];", description: "DB選択" },
    { command: "show tables;", description: "テーブル一覧の表示" },
  ],
};

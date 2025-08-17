export const commands = {
  git: [
    { command: `git commit --no-veryfy -m "[コミットメッセージ]"`, description: "コミット時フック無効化、メッセージ指定" },
    { command: "git diff origin/[ブランチ1]..origin/[ブランチ2]", description: "リモートブランチ1とリモートブランチ2間の比較" },
    { command: "git cherry-pick [コミットハッシュA] [コミットハッシュB] [コミットハッシュC]", description: "AとBとCのコミットを取り込む" },
    { command: "git cherry-pick [コミットハッシュA]^..[コミットハッシュC]", description: "Aを含むA〜Cのコミットを取り込む" },
  ],
  docker: [
    { command: "docker compose ps", description: "コンテナ一覧、状態の表示" },
    { command: "docker container exec -it [コンテナ名] bash", description: "コンテナに入る" },
    { command: "docker compose up -d", description: "コンテナをまとめてバックグラウンドで起動" },
  ],
};

import styles from "./TipsHub.module.css";
import { useMemo, useState } from "react";
import { Frame, Fieldset, Input, Button, Checkbox } from "@react95/core";
import fm from "front-matter";
import TipDetail, { type TipItem } from "./TipDetail";

type FrontMatterAttributes = {
  title?: string;
  description?: string;
  tags?: string[] | string;
};

// load markdown files from ./tips/*.md at build time (Vite)
const tipModules = import.meta.glob<string>("./tips/*.md", {
  query: "?raw", // ファイルの内容を文字列としてインポート
  import: "default",
  eager: true, //遅延読み込みせずビルド時に読み込みする
});

/**
 * Tips一覧取得
 */
const tipList: TipItem[] = Object.entries(tipModules).map(([path, raw]) => {
  const id = path.split("/").pop()?.replace(/\.md$/, "") ?? path;
  const { attributes, body } = fm<FrontMatterAttributes>(raw);
  const tags: string[] = Array.isArray(attributes?.tags)
    ? attributes.tags.map((t: any) => String(t))
    : [];
  return {
    id,
    title: String(attributes?.title ?? id),
    description: attributes?.description ? String(attributes.description) : "",
    tags,
    content: String(body),
  };
});

const allTags = Array.from(new Set(tipList.flatMap((tip) => tip.tags))).sort();

export default function TipsHub() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 選択されたTipの情報を取得（useMemoは、selectedIdが変更されたときに再計算）
  const selectedTip = useMemo(
    () => tipList.find((tip) => tip.id === selectedId) ?? null,
    [selectedId]
  );

  /**
   * Tipsのフィルタリング
   */
  const filteredTips = tipList.filter((tip) => {
    // タイトル、説明、タグを結合して小文字に変換（検索用）
    const normalized = [tip.title, tip.description, tip.tags.join(" ")].join(" ").toLowerCase();
    // 検索キーワードが空、または正規化されたテキストにキーワードが含まれているかをチェック
    const matchesKeyword =
      searchKeyword.trim() === "" || normalized.includes(searchKeyword.trim().toLowerCase());
    // 選択されたタグがすべてtipのタグに含まれているかをチェック（タグのAND検索）
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => tip.tags.includes(tag));

    // キーワードとタグ検索の両方を満たすTipsのみ表示
    return matchesKeyword && matchesTags;
  });

  /**
   * タグの選択状態を切り替える
   * @param tag
   */
  const toggleTag = (tag: string) => {
    // prevはチェック処理前のselectedTagsの状態
    setSelectedTags((prev) =>
      // チェック処理前にすでにタグが選択済みであれば、タグを除外した新しい配列を返す。選択済みでなければ、タグを追加した新しい配列を返す。
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  /**
   * 検索キーワードとタグの選択をリセット
   */
  const clearFilters = () => {
    setSelectedTags([]);
    setSearchKeyword("");
  };

  if (selectedTip) {
    // Tips選択時は、Tips詳細画面を表示
    return (
      <div className={styles.container}>
        <TipDetail tip={selectedTip} onBack={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Frame className={styles.panel}>
          <Fieldset legend="キーワード検索">
            <Input
              style={{ width: "100%" }}
              placeholder="キーワード検索"
              value={searchKeyword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearchKeyword(event.target.value)
              }
            />
          </Fieldset>
          <Fieldset legend="タグ検索">
            <div className={styles.tagList}>
              {allTags.map((tag) => (
                <label key={tag} className={styles.tagItem}>
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </Fieldset>
          <div className={styles.tagAction}>
            <Button onClick={clearFilters}>クリア</Button>
          </div>
        </Frame>

        <div className={styles.listHeader}>
          <div className={styles.listTitle}>Tips 一覧</div>
          <div className={styles.listCount}>{filteredTips.length} 件</div>
        </div>

        <div className={styles.listItems}>
          {filteredTips.map((tip) => (
            <button
              key={tip.id}
              type="button"
              className={`${styles.listItem} ${tip.id === selectedId ? styles.activeItem : ""}`}
              onClick={() => setSelectedId(tip.id)}
            >
              <div className={styles.tipTitle}>{tip.title}</div>
              <div className={styles.tipDescription}>{tip.description}</div>
              <div className={styles.tagBadges}>
                {tip.tags.map((tag) => (
                  <span key={tag} className={styles.tagBadge}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
          {filteredTips.length === 0 && (
            <div className={styles.empty}>該当するTipがありません。</div>
          )}
        </div>
      </div>
    </div>
  );
}

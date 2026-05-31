import { Button, Frame } from "@react95/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./TipsHub.module.css";
import { use, useEffect } from "react";

export type TipItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
};

type TipDetailProps = {
  tip: TipItem;
  onBack: () => void;
};

/**
 * コードブロックコンポーネント
 * - remarkGfmのコードブロックを、react-syntax-highlighterで装飾するためのコンポーネント
 * - classNameに言語情報が含まれている場合は、SyntaxHighlighterでコードを装飾。そうでない場合は通常のcodeタグで表示。
 */
const CodeBlock = ({ inline, className, children, ...props }: any) => {
  // classNameに「language-js」のように言語情報が含まれているかを正規表現でチェックして言語名を抽出
  const match = /language-(\w+)/.exec(className || "");
  
  // コードブロックにはinline codeとblock codeの2種類があり、inline=falseの場合block codeでかつ言語情報がある場合にシンタックスハイライトを適用
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus} // シンタックスハイライトのテーマ（vscDarkPlusはVisual Studio Codeのダークテーマに似た配色）
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={styles.inlineCode} {...props}>
      {children}
    </code>
  );
};

export default function TipDetail({ tip, onBack }: TipDetailProps) {
  useEffect(() => {
    // ブラウザの戻るボタンが押されたときにonBackを呼び出してTips一覧に戻る
    const handlePopState = () => {
      onBack();
    };

    // ブラウザのpopstateイベントにリスナーを追加
    window.addEventListener("popstate", handlePopState);

    return () => {
      // クリーンアップ: コンポーネントがアンマウントされるときにイベントリスナーを削除
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack]);

  return (
    <div className={styles.detailWrapper}>
      <div className={styles.detailHeader}>
        <Button onClick={onBack}>一覧に戻る</Button>
      </div>

      <Frame className={styles.detailContent}>
        <div className={styles.detailMeta}>
          <p className={styles.detailTitle}>{tip.title}</p>
          <p className={styles.detailDescription}>{tip.description}</p>
          <div className={styles.tagBadges}>
            {tip.tags.map((tag) => (
              <span key={tag} className={styles.tagBadge}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* componentsでコードブロックを描画する際は、code: CodeBlockを指定 */}
        <div className={styles.detailBody}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
            {tip.content}
          </ReactMarkdown>
        </div>
      </Frame>
    </div>
  );
}

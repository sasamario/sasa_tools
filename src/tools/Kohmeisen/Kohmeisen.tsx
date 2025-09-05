import { useState } from "react";
import styles from "./Kohmeisen.module.css";

export default function Kohmeisen() {
  const [today, setToday] = useState(new Date());
  const bathType = getBathType(today);
  const bathTypeText = bathType === 'men' ? '男湯' : '女湯';

  const formateDate = (date: Date) => {
    const mm = String(date.getMonth() + 1);
    const dd = String(date.getDate());
    return `${mm}/${dd}`;
  }

  // React.MouseEventは、Reactでマウス操作（今回はクリック）をしたときに発生するイベントの型
  // HTMLAnchorElementは、aタグの要素の型
  const handleUpdate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setToday(new Date());
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>本日({formateDate(today)})の光明泉</h2>
      <section>
        <h3 className={styles.subTitle}>本日の露天風呂</h3>
        <p>本日の露天風呂は<span className={`${styles.bathType} ${styles[bathType]}`}>{bathTypeText}</span>です</p>
        <p>日付の更新は<a href="#" onClick={handleUpdate}>こちら</a>から</p>
      </section>
      <section>
        <h3 className={styles.subTitle}>営業時間</h3>
        <p>15:00〜25:00(最終受付は24:30)</p>
        <p className={styles.infoSmall}>※正確な情報は光明泉HPをご覧ください。</p>
      </section>
    </div>
  );
}

function getBathType(today: Date): 'men' | 'women' {
  const msInWeek = 7 * 24 * 60 * 60 * 1000; // 1週間のミリ秒数
  const baseFriday = new Date('2025-08-29'); // 基準日（金曜、男湯の週）
  baseFriday.setHours(0, 0, 0, 0); // 時間を00:00:00に設定

  // todayをそのまま使うと元のオブジェクトを書き換えてしまうためコピーして使用
  const current = new Date(today);
  current.setHours(0, 0, 0, 0); // 時間を00:00:00に設定

  const diffWeeks = Math.floor((current.getTime() - baseFriday.getTime()) / msInWeek); // 基準日からの経過週数
  return diffWeeks % 2 === 0 ? 'men' : 'women';
}

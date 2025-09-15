
import styles from './CharacterCount.module.css';
import { TextArea } from "@react95/core";
import { useState } from "react";


export default function CharacterCount() {
  const [text, setText] = useState('');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Character Count</h2>
      <section className={styles.main}>
        <TextArea rows={8} cols={70} value={text} onChange={e => setText(e.target.value)} wrap="off"/>
        <div>
          <p>文字数： {text.length}文字</p>
          <p>改行を除いた文字数： {text.replace(/\n/g, '').length}文字</p>
          <p>改行、空白を除いた文字数： {text.replace(/\s/g, '').length}文字</p>
          <p>行数： {text.length > 0 ? text.split('\n').length : 0}行</p>
        </div>
      </section>
    </div>
  );
}

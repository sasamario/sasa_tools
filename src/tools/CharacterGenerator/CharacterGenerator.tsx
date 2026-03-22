
import styles from './CharacterGenerator.module.css';
import { TextArea, Button, Checkbox, Fieldset, Frame } from "@react95/core";
import { useState } from "react";

export default function CharacterGenerator() {
  const [length, setLength] = useState(10);
  const [generatedText, setGeneratedText] = useState('');
  const [useAlphabets, setUseAlphabets] = useState(true);
  const [useNumbers, setUseNumbers] = useState(false);
  const [useJapanese, setUseJapanese] = useState(false);

  const generateRandomString = () => {
    let charset = '';

    if (useAlphabets) {
      charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (useNumbers) {
      charset += '0123456789';
    }
    if (useJapanese) {
      charset += 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
    }

    if (charset === '') {
      alert('少なくとも1つのオプションを選択してください');
      return;
    }

    if (length <= 0) {
      alert('文字数は1以上で指定してください');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedText(result);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Character Generator</h2>
      <section className={styles.main}>
        <div className={styles.section}>
          <TextArea
            value={generatedText}
            readOnly
            className={styles.resultText}
            rows={5}
          />
          <div className={styles.buttonGroup}>
            <Button onClick={generateRandomString} className={styles.button}>
              生成
            </Button>
            <Button onClick={() => navigator.clipboard.writeText(generatedText)} className={styles.button}>
              コピー
            </Button>
          </div>
        </div>
        <div className={styles.section}>
          <label className={styles.label}>
            文字数：
            <input
              type="number"
              className={styles.numberInput}
              value={length}
              onChange={(e) => setLength(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
          </label>
        </div>

        <div className={styles.section}>
          <Fieldset legend="文字の種類" className={styles.fieldset}>
            <Frame>
              <Checkbox
                checked={useAlphabets}
                onChange={() => setUseAlphabets(!useAlphabets)}
              >
                半角英字（a-z, A-Z）
              </Checkbox>
              <Checkbox
                checked={useNumbers}
                onChange={() => setUseNumbers(!useNumbers)}
              >
                半角数値（0-9）
              </Checkbox>
              <Checkbox
                checked={useJapanese}
                onChange={() => setUseJapanese(!useJapanese)}
              >
                ひらがな（あ-ん）
              </Checkbox>
            </Frame>
          </Fieldset>
        </div>
      </section>
    </div>
  );
}

import { Input } from "@react95/core";
import styles from "./Conversion.module.css";
import { useState } from "react";

export default function Base64Conversion() {
  const [base64, setBase64] = useState("");
  const [text, setText] = useState("");

  const handleBase64Decode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBase64(value);

    try {
      // atob()でデコード
      const binary = atob(value);

      // マルチバイト文字を含む場合のデコード処理
      // 1.split()でデコードした文字列を1文字ずつ配列に分割
      // 2.map()で各文字に対して以下の処理を行う
      //  2-1.charCodeAt(0)で文字コードに変換
      //  2-2.toString(16)で16進数に変換（パーセントエンコーディングは1バイトごとに「%」+「2桁の16進数」で表現するため）
      //  2-3.padStart(2, "0")で2桁に0埋め
      //  2-4.先頭に"%"を付与
      // 3.join("")で連結して1つの文字列にする
      // 4.decodeURIComponent()でパーセントエンコーディングをデコード（%xx形式の文字列をUTF-8として解釈）
      const decode = decodeURIComponent(
        binary
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );
      setText(decode);
    } catch (error) {
      setText("");
    }
  };

  const handleBase64Encode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setText(value);

    try {
      // 1.encodeURIComponent()でパーセントエンコード（%xx形式に変換）
      // 2.replace()で%xx形式を1バイトごとの文字列に変換
      //  2-1.正規表現/%([0-9A-F]{2})/gで%に続く2桁の16進数をキャプチャ
      //  2-2.キャプチャグループの値p1に対して、parseIntで10進数に変換
      //  2-3.String.fromCharCode()で対応する文字に変換
      // 3.btoa()でBase64エンコード
      const utf8Bytes = encodeURIComponent(value).replace(
        /%([0-9A-F]{2})/g,
        (_, p1) => String.fromCharCode(parseInt(p1, 16))
      );
      const encode = btoa(utf8Bytes);
      setBase64(encode);
    } catch (error) {
      setBase64("");
    }
  };

  return (
    <section>
      <h3 className={styles.subTitle}>Base64 ↔︎ Text</h3>
      <Input className={styles.base64Input} placeholder="Base64" value={base64} onChange={handleBase64Decode} />
      <span> ↔︎ </span>
      <Input className={styles.base64Input} placeholder="Text" value={text} onChange={handleBase64Encode} />
    </section>
  );
}
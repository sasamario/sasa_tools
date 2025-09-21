import { Input } from "@react95/core";
import styles from "./Conversion.module.css";
import { useState } from "react";

// 2桁に0埋め
const pad = (n: number) => n.toString().padStart(2, "0");

// 日本標準時(JST)に変換した"YYYY-MM-DDTHH:MM"形式の文字列を返す
const getJtcDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const formattedDatetime = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

  return formattedDatetime
}

export default function TimestampConversion() {
  const [timestamp, setTimestamp] = useState("");
  const [datetime, setDatetime] = useState(getJtcDate(new Date())); // "YYYY-MM-DDTHH:MM"
  const [seconds, setSeconds] = useState(0);

  const handleTimestampChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTimestamp(value);

    const num = Number(value);
    if (isNaN(num)) {
      return;
    }

    // ミリ秒か秒かを判定（値が10^12未満なら、秒単位判定）して、ミリ秒に変換
    const timestamp = num < 1e12 ? num * 1000 : num;
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return;
    } else {
      setDatetime(getJtcDate(date));

      // 秒は別途セット
      const sec = date.getSeconds();
      setSeconds(sec);
    }
  };

  const handleDatetimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDatetime(value);

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return;
    } else {
      const ms = seconds * 1000;
      // 秒数の入力値をmsに変換
      // getTime()はミリ秒を返すので秒数の入力値（ms変換後）を足した後、秒に変換してから文字列化。その際Math.floorで小数点以下を切り捨てる
      setTimestamp(Math.floor((date.getTime() + ms) / 1000).toString());
    }
  };

  const handleSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const num = Number(value);
    setSeconds(num);

    if (isNaN(num)) {
      return;
    }

    const date = new Date(datetime);
    if (isNaN(date.getTime())) {
      return;
    } else {
      const ms = Number(value) * 1000;
      // 秒数の入力値をmsに変換
      // getTime()はミリ秒を返すので秒数の入力値（ms変換後）を足した後、秒に変換してから文字列化。その際Math.floorで小数点以下を切り捨てる
      setTimestamp(Math.floor((date.getTime() + ms) / 1000).toString());
    }
  };

  return (
    <section>
      <h3 className={styles.subTitle}>Timestamp ↔︎ DateTime(JST)</h3>
      <Input placeholder="Timestamp" value={timestamp} onChange={handleTimestampChange} />
      <span> ↔︎ </span>
      <Input type="datetime-local" value={datetime} onChange={handleDatetimeChange} />
      <span> : </span>
      <Input type="number" min="0" max="59" value={seconds} onChange={handleSecondsChange} />
    </section>
  );
}
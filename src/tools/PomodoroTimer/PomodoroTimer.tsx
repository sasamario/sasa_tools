import { useState, useEffect } from "react";
import styles from "./PomodoroTimer.module.css";
import { Button } from "@react95/core";

export const WORK = "work";
export const BREAK = "break";
export type PomodoroMode = typeof WORK | typeof BREAK;

export default function PomodoroTimer() {
  // --- 状態管理 ---
  const WORK_TIME = 25 * 60; // 作業時間（秒）
  const BREAK_TIME = 5 * 60; // 休憩時間（秒）

  const [timeLeft, setTimeLeft] = useState(WORK_TIME); // 残り時間（秒）
  const [isRunning, setIsRunning] = useState(false); // タイマー動作中か
  const [mode, setMode] = useState<PomodoroMode>(WORK); // 作業/休憩モード

  const changeMode = (currentMode: PomodoroMode) => {
    const nextMode = currentMode === WORK ? BREAK : WORK;
    const nextTime = nextMode === WORK ? WORK_TIME : BREAK_TIME;
    setMode(nextMode);
    setTimeLeft(nextTime);
  };

  // --- タイマーの処理 ---
  // 第二引数の依存配列に指定している、isRunnningやmodeの値が変わるタイミングで第一引数のコールバック関数が実行される
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev > 0 ? prev -1 : 0);
    }, 1000);

    // クリーンアップ（停止処理）
    // 不要な処理が動き続けるのを防ぐため、前のuseEffectで動かしていたsetIntervalを取り消している。
    return () => clearInterval(timer);
  }, [isRunning]);

  // タイマー停止処理
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      setIsRunning(false);
    }
  }, [timeLeft, isRunning]);

  // タイマー終了処理（タイマー停止後に実行）
  useEffect(() => {
    if (timeLeft !== 0 || isRunning) return;

    const confirm = window.confirm("タイマーが終了しました。次のモードを開始しますか？");
    changeMode(mode);
    if (confirm) {
      setIsRunning(true)
    }
  }, [timeLeft, isRunning, mode]);

  // --- 時間表示を mm:ss に変換 ---
  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- 円形プログレスバー用計算 ---
  const radius = 54; // 半径
  const circumference = 2 * Math.PI * radius; // 円周
  const totalTime = mode === WORK ? WORK_TIME : BREAK_TIME;
  const progress = timeLeft === 0 ? 0 : timeLeft / totalTime; // 進捗
  const dashoffset = circumference * (1 - progress); // 残り

  return (
    <div className={styles.container}>
      <h1>Pomodoro Timer</h1>

      {/* 円形プログレスバー */}
      <div className={styles.circleWrapper}>
        <svg width="120" height="120">
          {/*
            circle:SVGの要素の一つで、円を書くためのタグ
            cx:円の中心(x座標)
            cy:円の中心(y座標)
            r:半径
            stroke:枠線色
            strokeWidth:枠線の太さ
            fill:中心の塗りつぶし色
            stroke-dasharray:線のダッシュと隙間のパターン
            strokeDashoffset:ダッシュ（線分）の開始位置をずらす量
            strokeLinecap:線の終端の形状を指定（round:半円状）
          */}
          <circle
            className={styles.circleBackground}
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="12"
            fill="none"
          />
          {/* 進捗円 */}
          <circle
            className={styles.circleProgress}
            cx="60"
            cy="60"
            r={radius}
            stroke={mode === WORK ? "tomato" : "mediumseagreen"}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)" // SVGの円はデフォルト位置が3時の方向のため、-90°回転させて12時方向にしている
          />
        </svg>
        <div className={styles.timeDisplay}>{formatTime(timeLeft)}</div>
      </div>

      <p>Mode: {mode === WORK ? "Work" : "Break"}</p>

      <div className={styles.buttons}>
        {!isRunning ? (
          <Button onClick={() => setIsRunning(true)}>Start</Button>
        ) : (
          <Button onClick={() => setIsRunning(false)}>Pause</Button>
        )}
        <Button
          onClick={() => {
            setIsRunning(false);
            setMode(WORK);
            setTimeLeft(WORK_TIME);
          }}
          className={styles.resetButton}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

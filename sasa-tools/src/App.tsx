import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // --- 状態管理 ---
  const WORK_TIME = 25 * 60; // 作業時間（秒）
  const BREAK_TIME = 5 * 60; // 休憩時間（秒）

  const [timeLeft, setTimeLeft] = useState(WORK_TIME); // 残り時間（秒）
  const [isRunning, setIsRunning] = useState(false); // タイマー動作中か
  const [mode, setMode] = useState<"work" | "break">("work"); // 作業/休憩モード

  // --- タイマーの処理 ---
  // 第二引数の依存配列に指定している、isRunnningやmodeの値が変わるタイミングで第一引数のコールバック関数が実行される
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          // 時間終了 → モード切替
          if (mode === "work") {
            setMode("break");
            return BREAK_TIME;
          } else {
            setMode("work");
            return WORK_TIME;
          }
        }
      });
    }, 1000);

    // クリーンアップ（停止処理）
    // 不要な処理が動き続けるのを防ぐため、前のuseEffectで動かしていたsetIntervalを取り消している。
    return () => clearInterval(timer);
  }, [isRunning, mode]);

  // --- 時間表示を mm:ss に変換 ---
  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Pomodoro Timer</h1>
      <h2>{formatTime(timeLeft)}</h2>
      <p>Mode: {mode === "work" ? "Work" : "Break"}</p>

      <div style={{ marginTop: "1rem" }}>
        {!isRunning ? (
          <button onClick={() => setIsRunning(true)}>Start</button>
        ) : (
          <button onClick={() => setIsRunning(false)}>Pause</button>
        )}
        <button
          onClick={() => {
            setIsRunning(false);
            setMode("work");
            setTimeLeft(WORK_TIME);
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;

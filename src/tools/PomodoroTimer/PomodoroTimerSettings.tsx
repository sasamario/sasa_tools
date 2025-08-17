// おいおい改修する予定
import { useState, useEffect } from "react";

export default function PomodoroTimerSettings() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inputWorkTime, setInputWorkTime] = useState(25);
  const [inputBreakTime, setInputBreakTime] = useState(5);

  // モーダルが表示されるタイミングで実行
  useEffect(() => {
    if (!isSettingsOpen) return;

    // ローカルストレージの値を入力欄の状態管理にセット
    const savedSettings = JSON.parse(localStorage.getItem("pomodoro") || "{}");
    if (savedSettings.workTime) setInputWorkTime(savedSettings.workTime);
    if (savedSettings.breakTime) setInputBreakTime(savedSettings.breakTime);
  }, [isSettingsOpen]);

  const save = () => {
    const newSettings = {
      workTime: inputWorkTime,
      breakTime: inputBreakTime,
    };
    localStorage.setItem("pomodoro", JSON.stringify(newSettings));
    setIsSettingsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsSettingsOpen(true)}>設定</button>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <h2>ポモドーロ設定</h2>
        <label>
          作業時間（分）:
          <input
            type="number"
            value={inputWorkTime}
            onChange={(e) => setInputWorkTime(Number(e.target.value))}
          />
        </label>
        <label>
          休憩時間（分）:
          <input
            type="number"
            value={inputBreakTime}
            onChange={(e) => setInputBreakTime(Number(e.target.value))}
          />
        </label>
        <button onClick={save}>保存</button>
      </Modal>
    </div>
  );
}

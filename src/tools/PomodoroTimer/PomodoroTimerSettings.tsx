import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button, Frame, Modal, TitleBar } from "@react95/core";
import styles from "./PomodoroTimerSettings.module.css";

interface PomodoroTimerSettingsProps {
  workTime: number; // 分単位
  breakTime: number; // 分単位
  onSettingsChange: (workTime: number, breakTime: number) => void;
  onClose: () => void;
}

const STORAGE_KEY = "pomodoro-timer-settings";

export default function PomodoroTimerSettings({
  workTime,
  breakTime,
  onSettingsChange,
  onClose,
}: PomodoroTimerSettingsProps) {
  const [tempWorkTime, setTempWorkTime] = useState(workTime);
  const [tempBreakTime, setTempBreakTime] = useState(breakTime);

  // localStorageから設定を読み込む
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const { workTime: savedWorkTime, breakTime: savedBreakTime } = JSON.parse(savedSettings);
        setTempWorkTime(savedWorkTime);
        setTempBreakTime(savedBreakTime);
      } catch (error) {
        console.error("設定の読み込みに失敗しました:", error);
      }
    }
  }, []);

  // 設定を保存
  const saveSettings = () => {
    const settings = {
      workTime: tempWorkTime,
      breakTime: tempBreakTime,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    onSettingsChange(tempWorkTime, tempBreakTime);
    onClose();
  };

  // デフォルト設定に戻す
  const resetToDefault = () => {
    const defaultWorkTime = 25;
    const defaultBreakTime = 5;
    setTempWorkTime(defaultWorkTime);
    setTempBreakTime(defaultBreakTime);
  };

  // そのままだと親コンポーネントのDOM要素内にレンダリングされ、モーダルの動きが連動してしまうため、createPortalを使用してモーダルをbody直下にレンダリング
  return createPortal(
    <div>
      <Frame>
        {/* @ts-ignore */}
        <Modal title="Pomodoro Timer Settings" titleBarOptions={[<TitleBar.Close key="close" onClick={onClose} />]} width={400} height={300}>
          <Modal.Content>
            <div className={styles.content}>
              <div className={styles.settingItem}>
                <label htmlFor="workTime">Work Time(min)</label>
                <input
                  id="workTime"
                  type="number"
                  min="1"
                  max="60"
                  value={tempWorkTime}
                  onChange={(e) => setTempWorkTime(Number(e.target.value))}
                  className={styles.input}
                />
              </div>

              <div className={styles.settingItem}>
                <label htmlFor="breakTime">Break Time(min)</label>
                <input
                  id="breakTime"
                  type="number"
                  min="1"
                  max="30"
                  value={tempBreakTime}
                  onChange={(e) => setTempBreakTime(Number(e.target.value))}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <Button onClick={resetToDefault} className={styles.resetButton}>
                reset
              </Button>
              <div className={styles.buttonGroup}>
                <Button onClick={saveSettings} className={styles.saveButton}>
                  save
                </Button>
              </div>
            </div>
          </Modal.Content>
        </Modal>
      </Frame>
    </div>,
    document.body
  );
}

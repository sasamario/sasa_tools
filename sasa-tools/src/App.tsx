import PomodoroTimer from "./components/PomodoroTimer/PomodoroTimer";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",  // 横中央
        alignItems: "center",      // 縦中央
        height: "100vh",           // 画面の高さいっぱい
        width: "100vw",            // 画面の幅いっぱい
        margin: 0,
        padding: 0,
      }}
    >
      <PomodoroTimer />
    </div>
  );
}

export default App;

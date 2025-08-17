import Desktop from './components/Desktop';
import { desktopIcons } from './config/desktopIcons';
import { TaskBar } from "@react95/core";

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#008080', overflow: 'hidden' }}>
      <Desktop icons={desktopIcons} />
      <TaskBar />
    </div>
  );
}

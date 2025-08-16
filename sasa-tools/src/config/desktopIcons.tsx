import { Time, Folder } from '@react95/icons';
import SampleTool from '../tools/SampleTool';
import PomodoroTimer from '../tools/PomodoroTimer/PomodoroTimer';

export const desktopIcons = [
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Timer',
    icon: <Time style={{width: 32, height: 32}} />,
    content: <PomodoroTimer />,
  },
  {
    id: 'folder',
    title: 'folder',
    icon: <Folder />,
    content: <SampleTool />,
  },
];

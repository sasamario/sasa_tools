import { Time, Bookmark } from '@react95/icons';
import PomodoroTimer from '../tools/PomodoroTimer/PomodoroTimer';
import CommandCollection from '../tools/CommandCollection/CommandCollection';

export const desktopIcons = [
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Timer',
    icon: <Time style={{width: 32, height: 32}} />,
    content: <PomodoroTimer />,
  },
  {
    id: 'commands',
    title: 'Commands',
    icon: <Bookmark />,
    content: <CommandCollection />,
  },
];

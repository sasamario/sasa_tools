import { HelpBook, Time, Bookmark, Drvspace7, Explore } from '@react95/icons';
import About from '../tools/About/About';
import PomodoroTimer from '../tools/PomodoroTimer/PomodoroTimer';
import CommandCollection from '../tools/CommandCollection/CommandCollection';
import Kohmeisen from '../tools/Kohmeisen/Kohmeisen';
import LinkStation from '../tools/LinkStation/LinkStation';

export const desktopIcons = [
  {
    id: 'About',
    title: 'About this tool',
    icon: <HelpBook style={{width: 32, height: 32}} />,
    content: <About />,
  },
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
  {
    id: 'kohmeisen',
    title: `Today's Kohmeisen`,
    icon: <Drvspace7 />,
    content: <Kohmeisen />,
  },
  {
    id: 'link-station',
    title: `LinkStation`,
    icon: <Explore />,
    content: <LinkStation />,
  },
];

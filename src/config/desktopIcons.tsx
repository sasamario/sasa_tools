import { Time, Bookmark, Drvspace7, Explore, Calculator, Packager1 } from '@react95/icons';
import PomodoroTimer from '../tools/PomodoroTimer/PomodoroTimer';
import CommandCollection from '../tools/CommandCollection/CommandCollection';
import Kohmeisen from '../tools/Kohmeisen/Kohmeisen';
import LinkStation from '../tools/LinkStation/LinkStation';
import CharacterCount from '../tools/CharacterCount/CharacterCount';
import Conversion from '../tools/Conversion/Conversion';

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
  {
    id: 'character-count',
    title: `Character Count`,
    icon: <Calculator />,
    content: <CharacterCount />,
  },
  {
    id: 'conversion',
    title: `Conversion Tools`,
    icon: <Packager1 />,
    content: <Conversion />,
  },
];

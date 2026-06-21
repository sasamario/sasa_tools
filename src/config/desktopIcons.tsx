import { Time, Bookmark, Drvspace7, Calculator, Packager1, Fm20enu5, Notepad2, User6, Websrch } from '@react95/icons';
import PomodoroTimer from '../tools/PomodoroTimer/PomodoroTimer';
import CommandCollection from '../tools/CommandCollection/CommandCollection';
import CommandBuilder from '../tools/CommandBuilder/CommandBuilder';
import Kohmeisen from '../tools/Kohmeisen/Kohmeisen';
// import LinkStation from '../tools/LinkStation/LinkStation';
import CharacterCount from '../tools/CharacterCount/CharacterCount';
import Conversion from '../tools/Conversion/Conversion';
import CharacterGenerator from '../tools/CharacterGenerator/CharacterGenerator';
import YarnAuditViewer from '../tools/YarnAuditViewer/YarnAuditViewer';
import NpmAuditViewer from '../tools/NpmAuditViewer/NpmAuditViewer';
import TipsHub from '../tools/TipsHub/TipsHub';

export const desktopIcons = [
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Timer',
    icon: <Time style={{width: 32, height: 32}} />,
    content: <PomodoroTimer />,
    defaultWidth: 300,
    defaultHeight: 280,
  },
  {
    id: 'commands',
    title: 'Commands',
    icon: <Bookmark />,
    content: <CommandCollection />,
    defaultWidth: 660,
    defaultHeight: 400,
  },
  {
    id: 'command-builder',
    title: 'Command Builder',
    icon: <Fm20enu5 />,
    content: <CommandBuilder />,
    defaultWidth: 620,
    defaultHeight: 400,
  },
  {
    id: 'kohmeisen',
    title: `Today's Kohmeisen`,
    icon: <Drvspace7 />,
    content: <Kohmeisen />,
    defaultWidth: 230,
    defaultHeight: 190,
  },
  // {
  //   id: 'link-station',
  //   title: `LinkStation`,
  //   icon: <Explore />,
  //   content: <LinkStation />,
  // },
  {
    id: 'character-generator',
    title: `Character Generator`,
    icon: <Notepad2 />,
    content: <CharacterGenerator />,
    defaultWidth: 430,
    defaultHeight: 340,
  },
  {
    id: 'character-count',
    title: `Character Count`,
    icon: <Calculator />,
    content: <CharacterCount />,
    defaultWidth: 510,
    defaultHeight: 310,
  },
  {
    id: 'conversion',
    title: `Conversion Tools`,
    icon: <Packager1 />,
    content: <Conversion />,
    defaultWidth: 562,
    defaultHeight: 230,
  },
  {
    id: 'yarn-audit',
    title: `Yarn Audit Viewer`,
    icon: <User6 />,
    content: <YarnAuditViewer />,
    defaultWidth: 1050,
    defaultHeight: 750,
  },
  {
    id: 'npm-audit',
    title: `Npm Audit Viewer`,
    icon: <User6 />,
    content: <NpmAuditViewer />,
    defaultWidth: 1050,
    defaultHeight: 750,
  },
  {
    id: 'tips-hub',
    title: `Tips Hub`,
    icon: <Websrch style={{width: 32, height: 32}} />,
    content: <TipsHub />,
    defaultWidth: 800,
    defaultHeight: 700,
  },
];

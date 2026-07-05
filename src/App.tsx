import Desktop from './components/Desktop';
import { desktopIcons } from './config/desktopIcons';
import DesktopBar from './components/DesktopBar';
import { StickyNoteProvider, useStickyNoteContext } from './contexts/StickyNoteContext';
import StickyNoteWindow from './tools/StickyNote/StickyNoteWindow';

function StickyNoteWindows() {
  // コンテキストから付箋データと付箋の表示状態を切り替える関数を取得
  const { notes, toggleVisibility } = useStickyNoteContext();
  // 表示中の付箋のみを取得
  const visibleNotes = notes.filter((n) => n.isVisible);
  return (
    <>
      {visibleNotes.map((note, index) => (
        <StickyNoteWindow
          key={note.id}
          note={note}
          index={index}
          // ウィンドウを閉じる際に付箋の表示状態を切り替える
          onClose={() => toggleVisibility(note.id)}
        />
      ))}
    </>
  );
}

export default function App() {
  return (
    // StickyNoteProviderでアプリ全体をラップすることで、付箋データをコンテキストとして提供
    <StickyNoteProvider>
      <div style={{ width: '100vw', height: '100vh', background: '#008080', overflow: 'hidden' }}>
        <Desktop icons={desktopIcons} />
        <DesktopBar />
        <StickyNoteWindows />
      </div>
    </StickyNoteProvider>
  );
}

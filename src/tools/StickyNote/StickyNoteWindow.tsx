import { Modal, TitleBar, useModal } from '@react95/core';
import { useEffect } from 'react';
import type { StickyNote } from '../../contexts/StickyNoteContext';
import styles from './StickyNoteWindow.module.css';

const COLOR_MAP: Record<StickyNote['color'], string> = {
  yellow: '#fffacd',
  blue: '#ddeeff',
  green: '#ddffdd',
  pink: '#ffdde8',
};

const MAX_BODY_HEIGHT = 340;

type Props = {
  note: StickyNote;
  index: number;
  onClose: () => void;
};

// 付箋ウィンドウコンポーネント
export default function StickyNoteWindow({ note, index, onClose }: Props) {
  const offset = index * 100;
  const modalId = `sticky-${note.id}`;
  const { restore } = useModal();
  const defaultX = window.innerWidth * 0.75;

  useEffect(() => {
    restore(modalId);
  }, [modalId, restore]);

  const bgColor = COLOR_MAP[note.color];

  return (
    // @ts-ignore
    <Modal
      title={note.title || '(無題)'}
      style={{ backgroundColor: bgColor }}
      titleBarOptions={[
        <Modal.Minimize key="minimize" />,
        <TitleBar.Close key="close" onClick={onClose} />,
      ]}
      dragOptions={{
        defaultPosition: { x: defaultX, y: 60 + offset },
      }}
    >
      <Modal.Content
        p="0"
        style={{
          minWidth: 240,
          backgroundColor: bgColor,
          marginBlockStart: 0,
          marginInlineEnd: 0,
        }}
      >
        <div
          className={styles.body}
          style={{ maxHeight: MAX_BODY_HEIGHT }}
        >
          {note.content || <span className={styles.empty}>（内容なし）</span>}
        </div>
      </Modal.Content>
    </Modal>
  );
}

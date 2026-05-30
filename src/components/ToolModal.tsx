import { Modal, Frame, TitleBar } from '@react95/core';

type ToolModalProps = {
  isOpen: boolean;
  id: string;
  content: React.ReactNode;
  title: string;
  onClose: () => void;
  onMaximize: () => void;
};

export default function ToolModal({ isOpen, id, content, title, onClose, onMaximize }: ToolModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <Frame display="flex" flexDirection="column" gap="16px" p="20px" style={{ padding: 0 }}>
        {/* @ts-ignore */}
        <Modal key={id} title={title} titleBarOptions={[<Modal.Minimize key="minimize" />, <TitleBar.Maximize key="maximize" onClick={onMaximize} />, <TitleBar.Close key="close" onClick={onClose} />]} dragOptions={{
          defaultPosition: {
            x: window.innerWidth / 3,
            y: window.innerHeight / 4
          }
        }}>
          <Modal.Content p="16px">
            <Frame as="div" display="flex" flexDirection="column">
              {content}
            </Frame>
          </Modal.Content>
        </Modal>
      </Frame>
    </>
  );
}
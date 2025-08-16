import { Modal, Frame, TitleBar } from '@react95/core';

type ToolModalProps = {
  isOpen: boolean;
  id: string;
  content: React.ReactNode;
  title: string;
  onClose: () => void;
};

export default function ToolModal({ isOpen, id, content, title, onClose }: ToolModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <Frame display="flex" flexDirection="column" gap="16px" p="20px" style={{ padding: 0 }}>
        {/* @ts-ignore */}
        <Modal key={id} title={title} titleBarOptions={[<Modal.Minimize key="minimize" />, <TitleBar.Close onClick={onClose} />]} dragOptions={{
          defaultPosition: {
            x: window.innerWidth / 3,
            y: window.innerHeight / 4
          }
        }}>
          <Modal.Content boxShadow="$in" bgColor="white" p="16px">
            <Frame as="div" display="flex" flexDirection="column" gap="8px">
              {content}
            </Frame>
          </Modal.Content>
        </Modal>
      </Frame>
    </>
  );
}
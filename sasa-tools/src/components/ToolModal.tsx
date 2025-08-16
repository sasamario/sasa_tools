// import { useState, useEffect } from 'react';
import { Modal, Frame, TitleBar } from '@react95/core';

type ToolModalProps = {
  isOpen: boolean;
  id: string;
  content: React.ReactNode;
  title: string;
  onClose: () => void;
};

export default function ToolModal({ isOpen, id, content, title, onClose }: ToolModalProps) {
  const modalWidth = 600;
  const modalHeight = 500;

  if (!isOpen) return null;

  return (
    <>
      <Frame display="flex" flexDirection="column" gap="16px" p="20px" style={{ padding: 0 }}>
        {/* @ts-ignore */}
        <Modal title={title} titleBarOptions={[<Modal.Minimize key="minimize" />, <TitleBar.Close onClick={onClose} />]} dragOptions={{
          defaultPosition: {
            x: (window.innerWidth - modalWidth) / 2,
            y: (window.innerHeight - modalHeight) / 2 - modalHeight / 3
          }
        }}>
          <Modal.Content width={`${modalWidth}px`} height={`${modalHeight}px`} boxShadow="$in" bgColor="white" p="16px">
            <Frame as="div" display="flex" flexDirection="column" gap="8px">
              {content}
            </Frame>
          </Modal.Content>
        </Modal>
      </Frame>
    </>
  );
}
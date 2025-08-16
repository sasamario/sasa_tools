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
      {/* モーダル要素はDOMの通常フローから独立させるためposition: fixedを適用した要素で囲っている */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Frame display="flex" flexDirection="column" gap="16px" p="20px">
          {/* @ts-ignore */}
          <Modal id={id} title={title} titleBarOptions={<TitleBar.Close onClick={onClose} />} dragOptions={{
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
      </div>
    </>
  );
}
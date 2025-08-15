// import { useState, useEffect } from 'react';
import { useModal, Modal, Frame, TaskBar, TitleBar } from '@react95/core';


export default function ToolModal() {
  const modalWidth = 600;
  const modalHeight = 500;

  // https://react95.github.io/React95/?path=/docs/hooks-usemodal--docs
  const { minimize, remove } = useModal();
  const closeModal = () => {
    minimize('basic-modal'); // モーダルを最小化する（コンテンツを非表示にし、タスクバーに表示する）
    remove('basic-modal'); // タスクバーからモーダルを削除する
  };

  // const [modalSize, setmodalSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  // useEffect(() => {
  //   const handleResize = () => {
  //     setmodalSize({ width: window.innerWidth, height: window.innerHeight });
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  return (
    <>
      <Frame display="flex" flexDirection="column" gap="16px" p="20px">
        <TaskBar />
        {/* @ts-ignore */}
        <Modal id="basic-modal" title="Basic Modal" titleBarOptions={<TitleBar.Close onClick={closeModal} />} dragOptions={{
          defaultPosition: {
            x: (window.innerWidth - modalWidth) / 2,
            y: (window.innerHeight - modalHeight) / 2 - modalHeight / 3
          }
        }}>
          <Modal.Content width={`${modalWidth}px`} height={`${modalHeight}px`} boxShadow="$in" bgColor="white" p="16px">
            <Frame as="div" display="flex" flexDirection="column" gap="8px">
              <h4>useModal Hook</h4>
              <p>
                This modal automatically registered with the TaskBar when it
                mounted.
              </p>
              <p>
                The Modal component handles its own rendering - the useModal
                hook provides programmatic control.
              </p>
            </Frame>
          </Modal.Content>
        </Modal>
      </Frame>
    </>
  );
}
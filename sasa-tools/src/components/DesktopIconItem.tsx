import { useState } from "react";
import ToolModal from "./ToolModal";
import { useModal } from "@react95/core";

type DesktopIconProps = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

export default function DesktopIconItem({ id, title, icon, content}: DesktopIconProps) {
  // https://react95.github.io/React95/?path=/docs/hooks-usemodal--docs
  const { restore, minimize } = useModal(); 
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    if (!isOpen) {
      restore(id);
      setIsOpen(true);
    }
  }

  const close = () => {
    minimize(id);
    setIsOpen(false);
  }

  return (
    <>
      <div
        id={id}
        style={{ width: 80, textAlign: 'center', cursor: 'pointer' }}
        onClick={open}
      >
        {icon}
        <div style={{ color: 'white', fontSize: 12 }}>{title}</div>
      </div>
      {isOpen && (
        <ToolModal isOpen={isOpen} id={id} title={title} content={content} onClose={close}></ToolModal>
      )}
    </>
  );
}

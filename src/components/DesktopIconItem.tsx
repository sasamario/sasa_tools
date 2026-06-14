import { useState } from "react";
import ToolModal from "./ToolModal";
import { useModal } from "@react95/core";

type DesktopIconProps = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  defaultWidth?: number | null;
  defaultHeight?: number | null;
};

export default function DesktopIconItem({ id, title, icon, content, defaultWidth, defaultHeight }: DesktopIconProps) {
  // https://react95.github.io/React95/?path=/docs/hooks-usemodal--docs
  const { restore, minimize } = useModal(); 
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

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

  const maximize = () => {
    setIsMaximized(!isMaximized);
    console.log('TODO... maximize');
  }

  return (
    <>
      <div
        id={id}
        style={{ width: 80, textAlign: 'center', cursor: 'pointer', marginBottom: 8 }}
        onClick={open}
      >
        {icon}
        <div style={{ color: 'white', fontSize: 12 }}>{title}</div>
      </div>
      {isOpen && (
        <ToolModal isOpen={isOpen} id={id} title={title} content={content} defaultWidth={defaultWidth} defaultHeight={defaultHeight} onClose={close} onMaximize={maximize} />
      )}
    </>
  );
}

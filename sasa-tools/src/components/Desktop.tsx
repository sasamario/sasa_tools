import DesktopIconItem from "./DesktopIconItem";

export type DesktopIcon = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

type DesktopProps = {
  icons: DesktopIcon[];
};

export default function Desktop({ icons }: DesktopProps) {
  return (
    <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap' }}>
      {icons.map((icon) => (
        <DesktopIconItem id={icon.id} title={icon.title} icon={icon.icon} content={icon.content}></DesktopIconItem>
      ))}
    </div>
  );
}

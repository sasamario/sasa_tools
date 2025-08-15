import { Folder } from '@react95/icons';

type DesktopIcon = {
  id: string;
  label: string;
  onClick: () => void;
};

export default function Desktop({ icons }: { icons: DesktopIcon[] }) {
  return (
    <div style={{ padding: 16 }}>
    {icons.map((icon) => (
        <div
          key={icon.id}
          style={{ width: 80, textAlign: 'center', marginBottom: 20, cursor: 'pointer' }}
          onClick={icon.onClick}
        >
          <Folder style={{ fontSize: '32px', color: 'white' }} />
          <div style={{ color: 'white', fontSize: 12 }}>{icon.label}</div>
        </div>
    ))}
    </div>
  );
}

import { useState } from 'react';
import Desktop from './components/Desktop';
import ToolModal from './components/ToolModal';
import SampleTool from './tools/SampleTool';

type OpenWindow = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function App() {
  const openTool = (id: string, title: string, content: React.ReactNode) => {
    
  };

  const closeTool = (id: string) => {
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#008080', overflow: 'hidden' }}>
      <Desktop
        icons={[
          {
            id: 'sample',
            label: 'sample-tool',
            onClick: () => openTool('sample', 'サンプルツール', <SampleTool />),
          },
        ]}
      />
      <ToolModal></ToolModal>
    </div>
  );
}

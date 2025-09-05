import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// @ts-ignore
import '@react95/core/GlobalStyle'; // 型定義ファイルが提供されていなかったのでチェックは無視して対応
import '@react95/core/themes/win95.css';

// icons のスタイルだけ読み込む（coreのスタイルは組み込み済み）
import '@react95/icons/icons.css';

import './reset.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

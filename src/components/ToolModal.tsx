import { Modal, Frame, TitleBar } from '@react95/core';
import { useState, useRef } from 'react';

type ToolModalProps = {
  isOpen: boolean;
  id: string;
  content: React.ReactNode;
  title: string;
  defaultWidth?: number | null;
  defaultHeight?: number | null;
  onClose: () => void;
  onMaximize: () => void;
};

export default function ToolModal({ isOpen, id, content, title, defaultWidth, defaultHeight, onClose, onMaximize }: ToolModalProps) {
  if (!isOpen) return null;

  const minWidth = defaultWidth || 228;
  const minHeight = defaultHeight || 190;

  const [size, setSize] = useState<{ width: number | null; height: number | null }>({ width: defaultWidth || null, height: defaultHeight || null });
  const resizingRef = useRef<{ dir: 'right' | 'bottom' | 'bottomRight' | null; startX: number; startY: number; startW: number; startH: number }>({ dir: null, startX: 0, startY: 0, startW: 0, startH: 0 });
  const contentRef = useRef<HTMLDivElement | null>(null);

  /**
   * ウィンドウのリサイズ処理
   */
  const startResize = (dir: 'right' | 'bottom' | 'bottomRight') => (e: React.MouseEvent) => {
    // イベントの伝播とデフォルトの動作を停止
    // これにより、リサイズ中のドラッグやテキスト選択などのReact95やブラウザのデフォルト動作が防止
    e.stopPropagation();
    e.preventDefault();

    // リサイズ開始時の情報（リサイズ方向、開始位置、開始サイズ）をresizingRefに保存
    // size が未定義の場合は現在のモーダル実サイズを測定して初期値とする(contentRefはModal.Contentのrefで、モーダルの実サイズを取得するために使用)
    const measuredW = contentRef.current?.offsetWidth ?? Math.round(window.innerWidth * 0.5);
    const measuredH = contentRef.current?.offsetHeight ?? Math.round(window.innerHeight * 0.5);

    const clampedW = Math.round(Math.max(minWidth, measuredW));
    const clampedH = Math.round(Math.max(minHeight, measuredH));

    if (size.width == null || size.height == null) {
      setSize({
        width: size.width ?? clampedW,
        height: size.height ?? clampedH,
      });
    }

    resizingRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width ?? clampedW,
      startH: size.height ?? clampedH,
    };

    /**
     * リサイズ中のマウス移動に応じてウィンドウサイズを計算、更新
     */
    const onMove = (ev: MouseEvent) => {
      // リサイズしていない場合は何もしない
      if (!resizingRef.current.dir) return;

      // リサイズ開始時の情報を取得
      const { dir, startX, startY, startW, startH } = resizingRef.current;

      // リサイズ時のマウス移動量（移動後のX,Y座標 - 移動前のX,Y座標）を計算
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      // 幅と高さの初期化
      let newW = startW;
      let newH = startH;

      // リサイズ方向に応じて新しい幅と高さを計算（現状はbottomRightのみ利用）
      if (dir === 'right' || dir === 'bottomRight') newW = Math.max(minWidth, startW + dx);
      if (dir === 'bottom' || dir === 'bottomRight') newH = Math.max(minHeight, startH + dy);

      // リサイズ後のサイズ更新
      setSize({ width: Math.round(newW), height: Math.round(newH) });
    };

    // マウスアップでリサイズ終了
    const onUp = () => {
      resizingRef.current.dir = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    // リサイズ中であれば、マウス移動とマウスアップのイベントリスナーを追加
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
      <>
        <Frame style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }}>
          {/* @ts-ignore */}
          <Modal
            key={id}
            title={title}
            titleBarOptions={[
              <Modal.Minimize key="minimize" />,
              <TitleBar.Maximize key="maximize" onClick={onMaximize} />,
              <TitleBar.Close key="close" onClick={onClose} />,
            ]}
            dragOptions={{
              defaultPosition: {
                x: 0,
                y: 0,
              },
            }}
          >
            {/* 初期ウィンドウサイズ取得ようにrefを設定 */}
            <Modal.Content ref={contentRef} p="0" style={{
              width: size.width,
              height: size.height,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'visible',
            }}>
              <Frame as="div" display="flex" flexDirection="column" style={{ height: '100%' }}>
                {content}
              </Frame>
            </Modal.Content>
            {/* resize handles */}
            <div
              // onMouseDownでリサイズ検知し、startResize()実行
              onMouseDown={startResize('bottomRight')}
              style={{ position: 'absolute', right: -3, bottom: -3, width: 16, height: 16, cursor: 'nwse-resize' }}
            />
          </Modal>
        </Frame>
      </>
  );
}
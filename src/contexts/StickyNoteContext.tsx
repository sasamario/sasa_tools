import { createContext, useContext, useEffect, useState } from 'react';

// 付箋の色の種類
export type StickyNoteColor = 'yellow' | 'blue' | 'green' | 'pink';

// 付箋のデータ構造
export type StickyNote = {
  id: string;
  title: string;
  content: string;
  color: StickyNoteColor;
  isVisible: boolean;
  createdAt: number;
};

// 付箋データを管理するコンテキストの型
type StickyNoteContextType = {
  notes: StickyNote[];
  addNote: (draft: { title: string; content: string; color: StickyNoteColor }) => void;
  updateNote: (id: string, updates: Partial<Pick<StickyNote, 'title' | 'content' | 'color'>>) => void;
  deleteNote: (id: string) => void;
  toggleVisibility: (id: string) => void;
};

// 付箋データを管理するコンテキスト
/// contextを使うことで、コンポーネント間で付箋データを共有できるようする
const StickyNoteContext = createContext<StickyNoteContextType | null>(null);

const STORAGE_KEY = 'sticky-notes';

// 付箋データを管理するコンテキストプロバイダー
export function StickyNoteProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<StickyNote[]>([]);

  useEffect(() => {
    try {
      // マウント時にローカルストレージから付箋データを読み込む
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // 付箋データを更新するたびにローカルストレージに保存する
  const persist = (next: StickyNote[]) => {
    setNotes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  // 付箋の追加
  const addNote = (draft: { title: string; content: string; color: StickyNoteColor }) => {
    const note: StickyNote = {
      id: crypto.randomUUID(),
      ...draft,
      isVisible: true,
      createdAt: Date.now(),
    };
    persist([...notes, note]);
  };

  // 付箋の更新
  const updateNote = (id: string, updates: Partial<Pick<StickyNote, 'title' | 'content' | 'color'>>) => {
    persist(notes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  // 付箋の削除
  const deleteNote = (id: string) => {
    persist(notes.filter((n) => n.id !== id));
  };

  // 付箋の表示・非表示を切り替え
  const toggleVisibility = (id: string) => {
    persist(notes.map((n) => (n.id === id ? { ...n, isVisible: !n.isVisible } : n)));
  };

  return (
    // StickyNoteContext.Providerで子コンポーネントに付箋データと付箋データの操作関数を提供
    <StickyNoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, toggleVisibility }}>
      {children}
    </StickyNoteContext.Provider>
  );
}

export function useStickyNoteContext() {
  const ctx = useContext(StickyNoteContext);
  if (!ctx) throw new Error('useStickyNoteContext must be used within StickyNoteProvider');
  return ctx;
}

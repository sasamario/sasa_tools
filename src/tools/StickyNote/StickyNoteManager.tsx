import { useState } from 'react';
import { Button, Frame } from '@react95/core';
import { useStickyNoteContext, type StickyNote, type StickyNoteColor } from '../../contexts/StickyNoteContext';
import styles from './StickyNoteManager.module.css';

const COLORS: { value: StickyNoteColor; label: string; hex: string }[] = [
  { value: 'yellow', label: '黄', hex: '#fffacd' },
  { value: 'blue',   label: '青', hex: '#ddeeff' },
  { value: 'green',  label: '緑', hex: '#ddffdd' },
  { value: 'pink',   label: '桃', hex: '#ffdde8' },
];

// 付箋の追加・編集フォームの状態
type FormState = {
  id: string | null;
  title: string;
  content: string;
  color: StickyNoteColor;
};

const EMPTY_FORM: FormState = { id: null, title: '', content: '', color: 'yellow' };

export default function StickyNoteManager() {
  // コンテキストから付箋データと付箋データの操作関数を取得
  const { notes, addNote, updateNote, deleteNote, toggleVisibility } = useStickyNoteContext();
  const [form, setForm] = useState<FormState | null>(null);

  // 新規追加時は空のフォームを開く
  const openAddForm = () => setForm(EMPTY_FORM);

  // 編集時は既存の付箋データをフォームにセット
  const openEditForm = (note: StickyNote) =>
    setForm({ id: note.id, title: note.title, content: note.content, color: note.color });

  const closeForm = () => setForm(null);

  const handleSave = () => {
    if (!form) return;
    const title = form.title.trim();
    if (!title) return;
    if (form.id) {
      updateNote(form.id, { title, content: form.content, color: form.color });
    } else {
      addNote({ title, content: form.content, color: form.color });
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('この付箋を削除しますか？')) return;
    deleteNote(id);
  };

  return (
    <div className={styles.container}>
      {/* タイトル + ツールバー */}
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Stiky Note Manager</h2>
        <Button onClick={openAddForm} disabled={form !== null}>
          追加
        </Button>
      </div>

      {/* フォーム（追加・編集） */}
      {form && (
        <Frame variant="field" className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>タイトル</label>
            <input
              className={styles.input}
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="タイトルを入力"
              autoFocus
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>内容</label>
            <textarea
              className={styles.textarea}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="内容を入力"
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>色</label>
            <div className={styles.colorPicker}>
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={`${styles.colorSwatch} ${form.color === c.value ? styles.colorSwatchSelected : ''}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
          <div className={styles.formActions}>
            <Button onClick={handleSave}>保存</Button>
            <Button onClick={closeForm}>キャンセル</Button>
          </div>
        </Frame>
      )}

      {/* 付箋一覧 */}
      {!form && (
        <div className={styles.list}>
          {notes.length === 0 && (
            <div className={styles.empty}>付箋がありません。</div>
          )}
          {notes.map((note) => (
            <div key={note.id} className={styles.noteRow}>
              <span
                className={styles.colorDot}
                style={{ backgroundColor: COLORS.find((c) => c.value === note.color)?.hex }}
              />
              <label className={styles.noteTitle}>
                <input
                  type="checkbox"
                  checked={note.isVisible}
                  onChange={() => toggleVisibility(note.id)}
                  className={styles.checkbox}
                />
                {note.title || '(無題)'}
              </label>
              <div className={styles.noteActions}>
                <Button onClick={() => openEditForm(note)}>
                  編集
                </Button>
                <Button onClick={() => handleDelete(note.id)}>削除</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// app/page.tsx

'use client';

import React, { useState } from 'react';
import MemoList from './components/MemoList';
import MemoDetail from './components/MemoDetail';

export default function MemoPage() {
  // number: メモID, 'new': 新規作成, null: 一覧表示
  const [selectedMemoId, setSelectedMemoId] = useState<number | 'new' | null>(null);

  // メモ選択
  const handleMemoSelect = (id: number) => {
    setSelectedMemoId(id);
  };

  // 新規作成
  const handleCreateNew = () => {
    setSelectedMemoId('new');
  };

  // 一覧に戻る
  const handleBackToList = () => {
    setSelectedMemoId(null);
  };

  // 表示切り替え
  if (selectedMemoId !== null) {
    return (
      <MemoDetail
        memoId={selectedMemoId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <MemoList
      onSelectMemo={handleMemoSelect}
      onCreateNew={handleCreateNew}
    />
  );
}

// components/MemoList.tsx

import React, { useEffect, useState } from 'react';
import './MemoList.css'; // スタイルシートを読み込む

// Memoの型定義（Prismaのモデルと合わせる）
interface Memo {
  id: string;
  title: string;
  items: string; // ここにitemsプロパティを追加。必要に応じてより具体的な型を定義する
  createdAt: string; // Dateオブジェクトとして受け取る場合はDate型にする
  updatedAt: string; // Dateオブジェクトとして受け取る場合はDate型にする
}

// 各メモアイテムのコンポーネントのProps
interface MemoItemProps {
  memo: Memo;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void; // 削除イベントハンドラを追加
}

function MemoItem({ memo, onSelect, onDelete }: MemoItemProps) {
  // 削除ボタンがクリックされたときに、親要素のonClickが発火しないようにする
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // イベントの伝播を停止
    onDelete(memo.id);
  };

  return (
    // memo-itemにflexboxを適用するため、スタイルを調整
    <div className="memo-item" onClick={() => onSelect(memo.id)}>
      <div className="memo-content"> {/* メモのタイトルと日付をまとめる */}
        <h3>{memo.title}</h3>
        <p className="memo-date">作成日: {new Date(memo.createdAt).toLocaleDateString()}</p>
      </div>
      {/* 削除ボタンを追加し、新しいクラス名 `delete-button` を適用 */}
      <button onClick={handleDeleteClick} className="delete-button">
        削除
      </button>
    </div>
  );
}

// MemoListコンポーネントのProps
interface MemoListProps {
  onSelectMemo: (id: string) => void; // メモが選択された時のコールバック
  onCreateNew: () => void; // 新規作成ボタンが押された時のコールバック
}

function MemoList({ onSelectMemo, onCreateNew }: MemoListProps) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // メモデータをAPIから取得する関数
  const fetchMemos = async () => {
    try {
      setIsLoading(true); // 読み込み開始
      const response = await fetch('/api/memos'); // 作成したAPIルートを叩く
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Memo[] = await response.json();
      setMemos(data);
    } catch (e: unknown) {
  console.error('メモデータの取得に失敗しました:', e);
  if (e instanceof Error) {
    setError(`メモの読み込みに失敗しました: ${e.message}`);
  } else {
    setError('メモの読み込みに失敗しました（詳細不明）');
  }
}finally {
      setIsLoading(false); // 読み込み終了
    }
  };

  // コンポーネントがマウントされた時にAPIからメモデータを取得
  useEffect(() => {
    fetchMemos();
  }, []); // 空の依存配列で初回マウント時のみ実行

  // メモを削除する関数
  const handleDeleteMemo = async (id: string) => {
    // window.confirmの代わりにカスタムモーダルUIを使うのが推奨
    // 例: SweetAlert2や独自のモーダルコンポーネントなど
    if (window.confirm('本当にこのメモを削除しますか？')) {
      try {
        const response = await fetch(`/api/memos?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // 削除成功したら、メモリストから該当のメモをフィルタリングして更新
          setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id));
          // alert('メモを削除しました！'); // alertの代わりにカスタムメッセージ表示を推奨
        } else {
          const errorData = await response.json();
          console.error('メモの削除に失敗しました:', errorData.error);
          // alert(`メモの削除に失敗しました: ${errorData.error}`);
        }
      } catch (error) {
        console.error('削除中にエラーが発生しました:', error);
        // alert('メモの削除中に予期せぬエラーが発生しました。');
      }
    }
  };

  if (isLoading) {
    return <div className="memo-list-container"><p>メモを読み込み中...</p></div>;
  }

  if (error) {
    return <div className="memo-list-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="memo-list-container">
      <h1>メモ</h1>

      <button className="create-new-button" onClick={onCreateNew}>
        新規作成
      </button>

      <div className="memo-items-wrapper">
        {memos.length === 0 ? (
          <p>メモがありません。新規作成しましょう！</p>
        ) : (
          memos.map((memo) => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onSelect={onSelectMemo}
              onDelete={handleDeleteMemo} // MemoItemに削除ハンドラを渡す
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MemoList;
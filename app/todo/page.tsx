'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';

import '@fullcalendar/common/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

type Todo = {
  id: number;
  title: string;
  date: string; // ISO文字列
  isDone: boolean;
};

export default function CalendarPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  // 初回ロード時にTodo一覧取得
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await fetch('/api/todo', { method: 'GET' });
      if (!res.ok) throw new Error('取得エラー');
      const data: Todo[] = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Todo取得エラー', error);
    }
  }

  // 日付クリック時にモーダルを開く
  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setNewTitle('');
    setShowModal(true);
  };

  // 新規Todo追加
  const handleAddTodo = async () => {
    try {
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          date: selectedDate,
        }),
      });
      if (!res.ok) throw new Error('追加エラー');
      await fetchTodos();
      setShowModal(false);
    } catch (error) {
      console.error('Todo追加エラー', error);
    }
  };

  // Todo削除
  const handleDeleteTodo = async (id: number) => {
    if (!confirm('このTodoを削除しますか？')) return;
    try {
      const res = await fetch(`/api/todo?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('削除エラー');
      await fetchTodos();
    } catch (error) {
      console.error('Todo削除エラー', error);
    }
  };

  // FullCalendar表示用に変換
  const events = todos.map(todo => ({
    id: String(todo.id),
    title: todo.title,
    start: todo.date,
    allDay: true,  // 追加！
    backgroundColor: todo.isDone ? '#6c757d' : '#0d6efd',
    textColor: 'white',
  }));

  // イベントクリックで削除（本当は編集モーダルを作ってもいい）
  const handleEventClick = (info: any) => {
    const id = Number(info.event.id);
    handleDeleteTodo(id);
  };

  return (
    <div className="container mt-3" style={{ maxWidth: '1000px', border: '1px solid #000' }}>
      <div className="calendar-body">
        <FullCalendar
          plugins={[dayGridPlugin, bootstrap5Plugin, interactionPlugin]}
          initialView="dayGridMonth"
          themeSystem="bootstrap5"
          locale="ja"
          headerToolbar={{
            start: 'prev,next',
            center: 'title',
            end: '',
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          height="auto"
        />
      </div>

      {/* モーダル */}
      {showModal && (
        <div
          className="modal show fade"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">TODO追加 ({selectedDate})</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="TODOの内容を入力"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>キャンセル</button>
                <button className="btn btn-primary" onClick={handleAddTodo}>追加</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

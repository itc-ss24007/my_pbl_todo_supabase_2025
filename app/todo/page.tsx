// app/calendar/page.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './calendar.css';
type Todo = {
  id: number;
  title: string;
  date: string;         // 'YYYY-MM-DD' or ISO
  time?: string | null; // 'HH:mm' or ISO (server converts to Date)
  isDone: boolean;
};
function ymd(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
export default function CalendarPage() {
  const calRef = useRef<FullCalendar | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  // 追加モーダル
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState<string>(''); // HH:mm
  // 編集モーダル
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');       // YYYY-MM-DD
  const [editTime, setEditTime] = useState<string>(''); // HH:mm
  const [editIsDone, setEditIsDone] = useState(false);
  useEffect(() => {
    fetchTodos();
  }, []);
  async function fetchTodos() {
    try {
      const res = await fetch('/api/todo');
      if (!res.ok) throw new Error('取得エラー');
      const data: Todo[] = await res.json();
      setTodos(data);
    } catch (e) {
      console.error(e);
    }
  }
  // 追加
  const onDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setNewTitle('');
    setNewTime('');
    setShowAdd(true);
  };
  const addTodo = async () => {
    if (!newTitle.trim()) return;
    try {
      const body: any = { title: newTitle, date: selectedDate };
      if (newTime) body.time = `${selectedDate}T${newTime}:00`; // server side -> Date
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('追加エラー');
      await fetchTodos();
      setShowAdd(false);
    } catch (e) {
      console.error(e);
    }
  };
  // 編集
  const openEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditDate(ymd(todo.date));
    if (todo.time) {
      const t = typeof todo.time === 'string' ? todo.time : '';
      const hhmm = t.length > 5 ? new Date(t).toTimeString().slice(0, 5) : t;
      setEditTime(hhmm);
    } else {
      setEditTime('');
    }
    setEditIsDone(todo.isDone);
    setShowEdit(true);
  };
  const updateTodo = async () => {
    if (editId == null) return;
    try {
      const body: any = {
        id: editId,
        title: editTitle,
        date: editDate,
        isDone: editIsDone,
      };
      body.time = editTime ? `${editDate}T${editTime}:00` : null;
      const res = await fetch('/api/todo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('更新エラー');
      await fetchTodos();
      setShowEdit(false);
    } catch (e) {
      console.error(e);
    }
  };
  const deleteTodo = async (id: number) => {
    if (!confirm('このTodoを削除しますか？')) return;
    try {
      const res = await fetch(`/api/todo?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('削除エラー');
      await fetchTodos();
      setShowEdit(false);
    } catch (e) {
      console.error(e);
    }
  };
  // FullCalendar に渡すイベント
  const events = todos.map((t) => {
    const hasTime = !!t.time;
    const start = hasTime
      ? `${ymd(t.date)}T${
          typeof t.time === 'string' && t.time.length <= 5
            ? t.time
            : new Date(String(t.time)).toTimeString().slice(0, 5)
        }:00`
      : t.date;
    return {
      id: String(t.id),
      title: t.title,
      start,
      allDay: !hasTime,
      backgroundColor: t.isDone ? '#6C757D' : '#0D6EFD',
      textColor: 'white',
    };
  });
  const onEventClick = (info: any) => {
    const t = todos.find((x) => x.id === Number(info.event.id));
    if (t) openEdit(t);
  };
  const onEventDrop = async (info: any) => {
    const id = Number(info.event.id);
    const isAllDay = info.event.allDay;
    const start = info.event.start as Date;
    const newDate = ymd(start);
    const body: any = { id, date: newDate };
    if (!isAllDay) {
      const hhmm = start.toTimeString().slice(0, 5);
      body.time = `${newDate}T${hhmm}:00`;
    } else {
      body.time = null;
    }
    try {
      const res = await fetch('/api/todo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('日付更新エラー');
      await fetchTodos();
    } catch (e) {
      console.error(e);
      info.revert();
    }
  };
  // カスタムボタン（prev / home / next）
  const customButtons = {
    prevCustom: {
      text: '‹',
      click: () => calRef.current?.getApi().prev(),
    },
    homeCustom: {
      click: () => calRef.current?.getApi().today(),
      render: () => {
        // 画像のみの透明ボタン
        const btn = document.createElement('button');
        btn.className = 'fc-home-btn';           // ← 自前クラス（青塗りを避ける）
        btn.setAttribute('title', '今日へ');
        const img = document.createElement('img');
        img.src = '/images/homeIcon.png'; // 画像パスは適宜変更
        img.alt = 'Home';
        img.style.width = '200px';
        img.style.height = '200px';
        btn.appendChild(img);
        return btn;
      },
    },
    nextCustom: {
      text: '›',
      click: () => calRef.current?.getApi().next(),
    },
  };
  return (
    <div className="cal-wrapper container my-4">
      <div className="cal-card shadow-sm">
        <FullCalendar
          ref={calRef as any}
          plugins={[dayGridPlugin, bootstrap5Plugin, interactionPlugin]}
          themeSystem="bootstrap5"
          locale="ja"
          initialView="dayGridMonth"
          height="auto"
          customButtons={customButtons}
          headerToolbar={{
            start: 'prevCustom',
            center: 'title',
            end: 'homeCustom nextCustom',
          }}
          fixedWeekCount={false}
          dayMaxEvents={3}
          editable={true}
          eventDurationEditable={false}
          dateClick={onDateClick}
          eventClick={onEventClick}
          eventDrop={onEventDrop}
          events={events}
          displayEventTime={true}
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        />
      </div>
      {/* 追加モーダル */}
      {showAdd && (
        <div
          className="modal show fade"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">TODO追加（{selectedDate}）</h5>
                <button type="button" className="btn-close" onClick={() => setShowAdd(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">タイトル</label>
                  <input
                    className="form-control"
                    placeholder="TODOの内容を入力"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">時間（任意）</label>
                  <input
                    type="time"
                    className="form-control"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                  <small className="text-muted">未入力なら終日予定になります。</small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                  キャンセル
                </button>
                <button className="btn btn-primary" onClick={addTodo}>
                  追加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 編集モーダル */}
      {showEdit && (
        <div
          className="modal show fade"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">TODO編集</h5>
                <button type="button" className="btn-close" onClick={() => setShowEdit(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">タイトル</label>
                  <input
                    className="form-control"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="row g-2">
                  <div className="col-7">
                    <label className="form-label">日付</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  </div>
                  <div className="col-5">
                    <label className="form-label">時間（任意）</label>
                    <input
                      type="time"
                      className="form-control"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-check mt-2">
                  <input
                    id="doneCheck"
                    className="form-check-input"
                    type="checkbox"
                    checked={editIsDone}
                    onChange={(e) => setEditIsDone(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="doneCheck">
                    完了済みにする
                  </label>
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => editId != null && deleteTodo(editId!)}
                >
                  削除
                </button>
                <div>
                  <button className="btn btn-secondary me-2" onClick={() => setShowEdit(false)}>
                    キャンセル
                  </button>
                  <button className="btn btn-primary" onClick={updateTodo}>
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
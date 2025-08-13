import { NextResponse } from 'next/server';
import { todoRepository } from '@/app/_repositories/Todo';
import { createSupabaseServerClient } from '@/lib/supabase';
import { findBySupabaseId } from '@/app/_repositories/User';

// 共通処理：取得当前登录用户（数据库用户）
async function getCurrentDbUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }
  return await findBySupabaseId(user.id);
}

// 【GET】取得当前用户所有待办
export async function GET() {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const todos = await todoRepository.findManyByUserId(dbUser.id);
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('Todo取得エラー:', error);
    return NextResponse.json({ message: 'Todoの取得に失敗しました' }, { status: 500 });
  }
}

// 【POST】新增待办
export async function POST(request: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const body = await request.json();

    // 简单校验必填字段
    if (!body.title || !body.date) {
      return NextResponse.json({ error: 'タイトルまたは日付がありません' }, { status: 400 });
    }

    const newTodo = await todoRepository.create({
      userId: dbUser.id,
      title: body.title,
      description: body.description ?? '',
      date: new Date(body.date),
      time: body.time ? new Date(body.time) : null,
      datetime: body.datetime ? new Date(body.datetime) : null,
      isDone: body.isDone ?? false,
      isRemind: body.isRemind ?? false,
      remindTime: body.remindTime ? new Date(body.remindTime) : null,
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Todo作成エラー:', error);
    return NextResponse.json({ message: 'Todoの作成に失敗しました' }, { status: 500 });
  }
}

// 【DELETE】删除待办，传参数 ?id=123
export async function DELETE(request: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Todo IDが指定されていません' }, { status: 400 });
    }

    const todo = await todoRepository.findById(Number(id));
    if (!todo) {
      return NextResponse.json({ error: 'Todoが存在しません' }, { status: 404 });
    }
    if (todo.userId !== dbUser.id) {
      return NextResponse.json({ error: 'このTodoの削除権限がありません' }, { status: 403 });
    }

    await todoRepository.deleteById(todo.id);
    return NextResponse.json({ message: 'Todoを削除しました' }, { status: 200 });
  } catch (error) {
    console.error('Todo削除エラー:', error);
    return NextResponse.json({ message: 'Todoの削除に失敗しました' }, { status: 500 });
  }
}

// 【PUT】更新Todo
export async function PUT(request: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Todo IDが必要です' }, { status: 400 });
    }

    const todo = await todoRepository.findById(body.id);
    if (!todo) {
      return NextResponse.json({ error: 'Todoが存在しません' }, { status: 404 });
    }
    if (todo.userId !== dbUser.id) {
      return NextResponse.json({ error: 'このTodoの更新権限がありません' }, { status: 403 });
    }

    const updatedData = {
      ...body,
      date: body.date ? new Date(body.date) : undefined,
      time: body.time ? new Date(body.time) : undefined,
      datetime: body.datetime ? new Date(body.datetime) : undefined,
      remindTime: body.remindTime ? new Date(body.remindTime) : undefined,
    };

    const updatedTodo = await todoRepository.update(body.id, updatedData);
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error('Todo更新エラー:', error);
    return NextResponse.json({ message: 'Todoの更新に失敗しました' }, { status: 500 });
  }
}

// app/api/memos/route.ts
import { NextResponse } from 'next/server';
import { MemoRepository } from '@/app/_repositories/Memo';
import { createSupabaseServerClient } from '@/lib/supabase';
import { findBySupabaseId } from '@/app/_repositories/User';

// メモ作成時のリクエストボディ型
interface MemoCreateRequestBody {
  title: string;
  items?: string | null;
  textContent?: string | null;
  images?: string | null;
  urls?: string | null;
  type: 'checklist' | 'text';
}

// 共通処理：現在のログインユーザーを取得
async function getCurrentDbUser() {
  const supabase =  await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // ログインしていない場合は null を返す
    return null;
  }
  // supabaseId からデータベース上のユーザーを取得
  return await findBySupabaseId(user.id);
}

// 【GET】現在ログイン中のユーザーのメモ一覧を取得
export async function GET() {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    // ユーザーIDでフィルターをかけてメモを取得
    const memos = await MemoRepository.findManyByUserId(dbUser.id);
    return NextResponse.json(memos, { status: 200 });
  } catch (error) {
    console.error('メモ取得エラー:', error);
    return NextResponse.json({ message: 'メモの取得に失敗しました' }, { status: 500 });
  }
}

// 【POST】新しいメモを作成（現在ログイン中のユーザーに紐づけ）
export async function POST(request: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const body: MemoCreateRequestBody = await request.json();

    // バリデーション：タイトル必須
    if (!body.title || !['checklist', 'text'].includes(body.type)) {
      return NextResponse.json({ error: 'タイトルが空か、タイプが不正です' }, { status: 400 });
    }

    // メモを作成
    const newMemo = await MemoRepository.create({
      title: body.title,
      items: body.type === 'checklist' ? body.items ?? '' : '',
      textContent: body.type === 'text' ? body.textContent ?? '' : '',
      images: body.images ?? '',
      urls: body.urls ?? '',
      type: body.type,
      userId: dbUser.id,
    });

    return NextResponse.json(newMemo, { status: 201 });
  } catch (error) {
    console.error('メモ作成エラー:', error);
    return NextResponse.json({ message: 'メモの作成に失敗しました' }, { status: 500 });
  }
}

// 【DELETE】メモIDで削除。所有者のみ削除可能
export async function DELETE(request: Request) {
  try {
    const dbUser = await getCurrentDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'メモIDが指定されていません' }, { status: 400 });
    }

    // メモの存在と所有者チェック
    const memo = await MemoRepository.findById(Number(id));
    if (!memo) {
      return NextResponse.json({ error: 'メモが存在しません' }, { status: 404 });
    }
    if (memo.userId !== dbUser.id) {
      return NextResponse.json({ error: 'このメモの削除権限がありません' }, { status: 403 });
    }

    // 削除実行
    await MemoRepository.deleteById(memo.id);
    return NextResponse.json({ message: 'メモを削除しました' }, { status: 200 });
  } catch (error) {
    console.error('メモ削除エラー:', error);
    return NextResponse.json({ message: 'メモの削除に失敗しました' }, { status: 500 });
  }
}

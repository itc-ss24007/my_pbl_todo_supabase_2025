// app/api/memos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables are required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// メモ更新リクエストボディの型定義
interface MemoUpdateRequestBody {
  title?: string;
  items?: string | null;
  textContent?: string | null;
  images?: string | null;
  urls?: string | null;
  type?: "checklist" | "text";
}

// GET - 単一メモの取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Memo ID is required' }, { status: 400 });
    }

    // Supabaseを使ってメモを取得
    const { data: memo, error } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Memo not found' }, { status: 404 });
      }
      console.error('Failed to fetch memo:', error);
      return NextResponse.json({ error: 'Failed to fetch memo' }, { status: 500 });
    }

    return NextResponse.json(memo, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch memo:', error);
    return NextResponse.json({ error: 'Failed to fetch memo' }, { status: 500 });
  }
}

// PUT - メモの更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: MemoUpdateRequestBody = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Memo ID is required' }, { status: 400 });
    }

    // リクエストボディが空の場合はエラーを返す
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
    }

    // 更新データを作成
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.items !== undefined) updateData.items = body.items;
    if (body.textContent !== undefined) updateData.text_content = body.textContent;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.urls !== undefined) updateData.urls = body.urls;

    // Supabaseを使ってメモを更新
    const { data: updatedMemo, error } = await supabase
      .from('memos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update memo:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Memo not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update memo' }, { status: 500 });
    }

    return NextResponse.json(updatedMemo, { status: 200 });
  } catch (error) {
    console.error('Failed to update memo:', error);
    return NextResponse.json({ error: 'Failed to update memo' }, { status: 500 });
  }
}

// DELETE - メモの削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Memo ID is required' }, { status: 400 });
    }

    // Supabaseを使ってメモを削除
    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete memo:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Memo not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Memo deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete memo:', error);
    return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 });
  }
}
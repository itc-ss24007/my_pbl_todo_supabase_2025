import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabase'; // パスを適宜修正してください
// メモ作成リクエストボディの型定義
interface MemoCreateRequestBody {
  title: string;
  items?: string | null;
  textContent?: string | null;
  images?: string | null;
  urls?: string | null;
  type: "checklist" | "text";
}
// GET - 全メモの取得
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const { data: memos, error } = await supabase
      .from('memos')
      .select('*')
      .order('createdAt', { ascending: false });
      
    if (error) {
      console.error('メモの取得に失敗しました:', error);
      return NextResponse.json(
        { message: 'メモの取得に失敗しました', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(memos, { status: 200 });
  } catch (error) {
    console.error('メモの取得に失敗しました:', error);
    
    // Check if it's an environment variable error
    if (error instanceof Error && error.message.includes('environment variable')) {
      return NextResponse.json(
        { 
          message: 'サーバー設定エラー', 
          error: error.message,
          hint: 'Supabaseの環境変数が正しく設定されていません。.env.localファイルを確認してください。'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'メモの取得に失敗しました', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
// POST - 新規メモの作成
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  try {
    const body: MemoCreateRequestBody = await request.json();
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
    }
    if (!body.type || (body.type !== 'checklist' && body.type !== 'text')) {
      return NextResponse.json({ error: '有効なタイプが必要です (checklist または text)' }, { status: 400 });
    }
    const { data: newMemo, error } = await supabase
      .from('memos')
      .insert([
        {
          title: body.title.trim(),
          items: body.type === 'checklist' ? body.items : null,
          text_content: body.type === 'text' ? body.textContent : null,
          images: body.images,
          urls: body.urls,
          type: body.type,
        }
      ])
      .select()
      .single();
    if (error) {
      console.error('メモの作成に失敗しました:', error);
      return NextResponse.json(
        { message: 'メモの作成に失敗しました', error: error.message },
        { status: 500 }
      );
    }
    console.log('新しいメモが作成されました:', newMemo);
    return NextResponse.json(newMemo, { status: 201 });
  } catch (error) {
    console.error('メモの作成に失敗しました:', error);
    return NextResponse.json(
      {
        message: 'メモの作成に失敗しました',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
// DELETE - メモの削除（クエリパラメータでIDを指定）
export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'メモIDが必要です' }, { status: 400 });
    }
    const { data: deletedMemo, error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('メモの削除に失敗しました:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'メモが見つかりません' }, { status: 404 });
      }
      return NextResponse.json(
        { error: 'メモの削除に失敗しました', message: error.message },
        { status: 500 }
      );
    }
    console.log('メモが削除されました:', deletedMemo);
    return NextResponse.json(
      { message: 'メモが正常に削除されました', deletedMemo },
      { status: 200 }
    );
  } catch (error) {
    console.error('メモの削除に失敗しました:', error);
    return NextResponse.json(
      {
        error: 'メモの削除に失敗しました',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
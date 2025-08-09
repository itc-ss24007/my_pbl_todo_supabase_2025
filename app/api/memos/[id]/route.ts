// app/api/memos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 環境変数の読み込み
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabaseの環境変数が設定されていません");
}

// Supabaseクライアント作成（Service Role Key使用）
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 更新時のリクエストボディ型
interface MemoUpdateRequestBody {
  title?: string;
  items?: string | null;
  textContent?: string | null;
  images?: string | null;
  urls?: string | null;
  type?: "checklist" | "text";
}

// Promise<{ id: string }> から数値IDを取得する関数
async function getIdFromParams(paramsPromise: Promise<{ id: string }>): Promise<number> {
  const { id } = await paramsPromise;
  const numId = Number(id);
  if (!numId) {
    throw new Error("不正なMemo ID");
  }
  return numId;
}

// GETメソッド: メモを取得
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(context.params);

    const { data: memo, error } = await supabase
      .from("Memo") // テーブル名を「Memo」に変更
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("メモ取得失敗:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "メモが見つかりません" }, { status: 404 });
      }
      return NextResponse.json({ error: "メモ取得に失敗しました" }, { status: 500 });
    }

    return NextResponse.json(memo, { status: 200 });
  } catch (err) {
    console.error("メモ取得時のエラー:", err);
    return NextResponse.json({ error: "メモ取得に失敗しました" }, { status: 500 });
  }
}

// PUTメソッド: メモを更新
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(context.params);
    const body: MemoUpdateRequestBody = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "リクエストボディが空です" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.items !== undefined) updateData.items = body.items;
    if (body.textContent !== undefined) updateData.textContent = body.textContent;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.urls !== undefined) updateData.urls = body.urls;

    const { data: updatedMemo, error } = await supabase
      .from("Memo") // テーブル名を「Memo」に変更
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("メモ更新失敗:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "メモが見つかりません" }, { status: 404 });
      }
      return NextResponse.json({ error: "メモ更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json(updatedMemo, { status: 200 });
  } catch (err) {
    console.error("メモ更新時のエラー:", err);
    return NextResponse.json({ error: "メモ更新に失敗しました" }, { status: 500 });
  }
}

// DELETEメソッド: メモを削除
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(context.params);

    const { error } = await supabase
      .from("Memo") // テーブル名を「Memo」に変更
      .delete()
      .eq("id", id);

    if (error) {
      console.error("メモ削除失敗:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "メモが見つかりません" }, { status: 404 });
      }
      return NextResponse.json({ error: "メモ削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ message: "メモ削除成功" }, { status: 200 });
  } catch (err) {
    console.error("メモ削除時のエラー:", err);
    return NextResponse.json({ error: "メモ削除に失敗しました" }, { status: 500 });
  }
}

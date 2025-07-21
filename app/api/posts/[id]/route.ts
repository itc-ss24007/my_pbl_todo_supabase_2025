export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PostRepository } from "@/app/_repositories/Post";
import { createClient } from "@/utils/supabase/server";
// import { getPostById, updatePostById, deletePostById } from "../../../_repositories/Post";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const postId = Number(id);

  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const post = await PostRepository.findById(postId);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 Promise に変更
) {
  const { id } = await context.params; // 👈 await 追加
  const postId = Number(id);

  const { title, content } = await req.json();

  const updated = await PostRepository.update(postId, {
    title,
    content,
  });

  if (!updated) {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// 👇認可前
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const postId = Number(id);

  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const deleted = await PostRepository.deletePostById(postId);

  if (!deleted) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Post deleted successfully" },
    { status: 200 }
  );
}

// 👇認可処理後
// export async function DELETE(
//   _req: Request,
//   { params }: { params: { postId: string } }
// ) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return NextResponse.json({ error: "未認証" }, { status: 401 });
//   }

//   const id = Number(params.postId);

//   // PostRepository を使って投稿を取得
//   const post = await PostRepository.findById(id);

//   // 投稿が存在しない、または自分の投稿でない場合は拒否
//   if (!post || String(post.userId) !== user.id) {
//     return NextResponse.json(
//       { error: "削除権限がありません" },
//       { status: 403 }
//     );
//   }

//   // 削除実行
//   const deleted = await PostRepository.deletePostById(id);
//   return NextResponse.json(deleted);
// }

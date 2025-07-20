export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PostRepository } from "@/app/_repositories/Post";

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

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const id = Number(params.id);
//   const { title, content } = await req.json();

//   if (!title || !content) {
//     return NextResponse.json(
//       { error: "タイトルと本文は必須です" },
//       { status: 400 }
//     );
//   }

//   try {
//     const updated = await PostRepository.update(id, { title, content });
//     return NextResponse.json(updated, { status: 200 });
//   } catch (e) {
//     console.error("更新エラー:", e);
//     return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
//   }
// }

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

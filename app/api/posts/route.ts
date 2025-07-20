// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PostRepository } from "@/app/_repositories/Post";

export async function GET() {
  const posts = await PostRepository.findMany();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { title, content, userId } = await req.json();

  if (!title || !content || !userId) {
    return NextResponse.json(
      { error: "全ての項目が必須です" },
      { status: 400 }
    );
  }

  try {
    const newPost = await PostRepository.create({ title, content, userId });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("投稿作成エラー:", error);
    return NextResponse.json(
      { error: "投稿作成に失敗しました" },
      { status: 500 }
    );
  }
}

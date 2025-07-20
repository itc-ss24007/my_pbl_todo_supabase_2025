export const dynamic = "force-dynamic";
import { PostRepository } from "@/app/_repositories/Post";
import PostEditForm from "@/app/dashboard/_components/PostEditForm";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const postId = Number(resolvedParams.id);

  const post = await PostRepository.findById(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white border rounded">
      <h1 className="text-2xl font-bold mb-4">投稿の編集</h1>
      <PostEditForm post={post} />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  user?: {
    name: string | null;
  };
};

type Props = {
  posts: Post[];
};

export default function PostScreen({ posts }: Props) {
  const router = useRouter();

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">📚 投稿一覧</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">タイトル</th>
            <th className="px-4 py-2 border-b">内容</th>
            <th className="px-4 py-2 border-b">作成日</th>
            <th className="px-4 py-2 border-b">投稿者</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-4 py-2 border-b">{post.title}</td>
              <td className="px-4 py-2 border-b">{post.content}</td>
              <td className="px-4 py-2 border-b">
                {new Date(post.createdAt).toLocaleString("ja-JP")}
              </td>
              <td className="px-4 py-2 border-b">
                {post.user?.name ?? "不明"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

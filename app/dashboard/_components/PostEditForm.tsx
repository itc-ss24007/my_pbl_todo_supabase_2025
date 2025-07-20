// app/dashboard/_components/PostEditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  post: {
    id: number;
    title: string;
    content: string;
  };
};

export default function PostEditForm({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setMessage("❌ 更新に失敗しました");
    }
  };

  return (
    <>
      <input
        type="text"
        className="border p-2 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-500 hover:underline"
        >
          ← 戻る
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          更新する
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </>
  );
}

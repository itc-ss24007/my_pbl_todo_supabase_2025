"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: number;
  onSuccess?: () => void;
};

export default function PostForm({ userId, onSuccess }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, userId }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setMessage("✅ 投稿が完了しました");

      // 投稿後にダッシュボードへ遷移
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } else {
      setMessage("❌ 投稿に失敗しました");
    }
  };

  return (
    <div className="bg-white p-4 border rounded mb-6">
      <input
        type="text"
        placeholder="タイトル"
        className="border p-2 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="本文"
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
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          投稿する
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}

// "use client";

// import { useState } from "react";

// type Props = {
//   userId: number;
// };

// export default function PostForm({ userId }: Props) {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async () => {
//     const res = await fetch("/api/posts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, content, userId }),
//     });

//     if (res.ok) {
//       setTitle("");
//       setContent("");
//       setMessage("✅ 投稿が完了しました");
//     } else {
//       setMessage("❌ 投稿に失敗しました");
//     }
//   };

//   return (
//     <div className="bg-white p-4 border rounded mb-6">
//       <h2 className="text-lg font-bold mb-2">新規投稿</h2>
//       <input
//         type="text"
//         className="border p-2 w-full mb-2"
//         placeholder="タイトル"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <textarea
//         className="border p-2 w-full mb-2"
//         placeholder="本文"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//         onClick={handleSubmit}
//       >
//         投稿
//       </button>
//       {message && <p className="mt-2 text-sm">{message}</p>}
//     </div>
//   );
// }

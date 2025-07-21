import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// import { Button } from "@/components/ui/button";
import HomeScreen from "./_components/HomeScreen";
import PostScreen from "./_components/PostScreen";
import { UserRepository } from "../_repositories/User";
import { PostRepository } from "../_repositories/Post";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogoutButton from "@/components/logout-button";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) {
    redirect("/login");
  }

  let currentUser = await UserRepository.findBySupabaseId(supabaseUser.id);

  if (!currentUser) {
    currentUser = await UserRepository.createUser({
      name: supabaseUser.email?.split("@")[0] || "NoName",
      email: supabaseUser.email || "",
      supabaseId: supabaseUser.id,
    });
  }

  // 🔽 共通でユーザー一覧を取得（ifの外）
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/users`, {
    cache: "no-store",
  });
  const users = await res.json();

  const userWithPosts = await UserRepository.findManyWithPosts();

  const posts = await PostRepository.findMany();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <LogoutButton />
        </div>

        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ ログインに成功しました！
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ようこそ！</CardTitle>
              <CardDescription></CardDescription>
              <h1>こんにちは {currentUser.name ?? "ユーザー"} さん！</h1>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                <p>メール:</p>
                <p>{supabaseUser.email}</p>

                {/* <p>ユーザーID:</p>
    <p>{supabaseUser.id}</p> */}

                <p>最終ログイン:</p>
                <p>
                  {supabaseUser.last_sign_in_at
                    ? new Date(supabaseUser.last_sign_in_at).toLocaleString(
                        "ja-JP"
                      )
                    : "不明"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ✅ ユーザー一覧表示 */}
          {/* <HomeScreen users={users} /> */}
          <HomeScreen users={[currentUser]} />
          {/* <PostScreen users={userWithPosts} /> */}
          {/* <PostScreen users={userWithPosts} /> */}
          {/* <PostForm userId={currentUser.id} /> */}
          <PostScreen
            posts={posts.map((post) => ({
              ...post,
              createdAt:
                post.createdAt instanceof Date
                  ? post.createdAt.toISOString()
                  : post.createdAt,
            }))}
          />
          {/* ここで１ユーザーのみを表示 */}
        </div>
      </div>
    </div>
  );
}

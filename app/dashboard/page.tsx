import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import HomeScreen from "./_components/HomeScreen";
import { UserRepository, User } from "../_repositories/User";

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
  const users: User[] = await UserRepository.findMany();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>ようこそ！</CardTitle>
              <CardDescription>認証が正常に完了しました</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">メール: {user.email}</p>
              <p className="text-sm text-gray-600">ユーザーID: {user.id}</p>
              <p className="text-sm text-gray-600">
                最終ログイン:{" "}
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString("ja-JP")
                  : "不明"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>プロフィール</CardTitle>
              <CardDescription>アカウント設定を管理</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                プロフィール編集
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>設定</CardTitle>
              <CardDescription>環境設定を変更</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                設定を開く
              </Button>
            </CardContent>
          </Card>
          <HomeScreen users={users} />
        </div>
      </div>
    </div>
  );
}

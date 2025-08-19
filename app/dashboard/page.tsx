import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// import { Button } from "@/components/ui/button";
import { UserRepository } from "../_repositories/User";
import MemoPage from '../memo/page';
import CalendarPage from "../todo/page";

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


	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* <div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
					<LogoutButton />
				</div> */}

				

				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
      <div>
        <CardTitle>ようこそ！</CardTitle>
        <CardDescription></CardDescription>
        <h1>こんにちは {currentUser.name ?? "ユーザー"} さん！</h1>
      </div>
      <LogoutButton />
    </div>
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
<section>
<CalendarPage />	
</section>
		<section>
        <MemoPage />
        </section>
				</div>
			</div>
		</div>
	);
}

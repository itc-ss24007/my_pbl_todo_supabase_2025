"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateScreen.module.css";
// import { supabase } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/client";

export default function CreateScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient(); // ここでクライアントを作成

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setSupabaseId(user?.id ?? null);
    };

    getUserId();
  }, []);

  const handleCreateUser = async () => {
    if (!supabaseId) {
      alert("ログイン情報が見つかりません");
      return;
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, supabaseId }),
    });

    if (res.ok) {
      router.push("/home");
    } else {
      alert("ユーザー作成に失敗しました");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ユーザー作成</h2>
      <input
        className={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前"
      />
      <input
        className={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
      />
      <button className={styles.button} onClick={handleCreateUser}>
        作成する
      </button>
    </div>
  );
}

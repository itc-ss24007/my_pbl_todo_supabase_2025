"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateScreen.module.css";

export default function CreateScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleCreateUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      router.push("/home");
    } else {
      alert("ユーザー作成に失敗しました");
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        戻る
      </button>

      <form
        className={styles.formWrapper}
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser();
        }}
      >
        <h1 className={styles.title}>ユーザー作成</h1>
        <label className={styles.label} htmlFor="name-input">
          名前
        </label>

        <input
          id="name-input"
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <label className={styles.label} htmlFor="email-input">
          メールアドレス
        </label>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.createButton}>
          作成
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setStatus(result.message ?? "登录失败");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus("登录失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="admin-login" onSubmit={handleSubmit}>
      <div className="admin-login__panel">
        <p className="section-heading__eyebrow">Admin Login</p>
        <h1>后台管理登录</h1>
        <p>输入管理员密码后进入内容维护界面。</p>

        <label className="admin-field">
          <span>管理员密码</span>
          <input
            autoComplete="current-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="请输入管理员密码"
            required
            type="password"
            value={password}
          />
        </label>

        {status ? <p className="admin-status admin-status--error">{status}</p> : null}

        <button className="button-link button-link--primary admin-button" disabled={submitting} type="submit">
          {submitting ? "登录中..." : "进入后台"}
        </button>
      </div>
    </form>
  );
}

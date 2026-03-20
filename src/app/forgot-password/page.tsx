"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-bold">查看你的邮箱 Check Your Email</h1>
          <p className="text-sm text-gray-500">
            如果该邮箱已注册，你将收到一封重置密码的邮件。
          </p>
          <p className="text-xs text-gray-400">
            If this email is registered, you&apos;ll receive a password reset link.
          </p>
          <Link href="/login" className="inline-block text-sm text-orange-500 hover:underline">
            返回登录 Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">忘记密码 Forgot Password</h1>
          <p className="mt-1 text-sm text-gray-500">
            输入你的邮箱，我们将发送重置链接
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              邮箱 Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "发送中... Sending..." : "发送重置链接 Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm">
          <Link href="/login" className="text-orange-500 hover:underline">
            返回登录 Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

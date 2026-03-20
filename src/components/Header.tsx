"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href={user ? "/timeline" : "/"} className="text-lg font-bold text-orange-500">
          Ember
        </Link>

        {user ? (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/timeline" className="text-gray-600 hover:text-gray-900">
              时间线
            </Link>
            <Link href="/compose" className="text-gray-600 hover:text-gray-900">
              写信
            </Link>
            <Link href="/pair" className="text-gray-600 hover:text-gray-900">
              配对
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600"
            >
              退出
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              登录 Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-orange-500 px-3 py-1 text-white hover:bg-orange-600"
            >
              注册 Sign Up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const { user, loading } = useAuth();
  const { t, locale, setLocale } = useT();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-orange-500">Ember</span>
        </div>
      </header>
    );
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
              {t("header.timeline")}
            </Link>
            <Link href="/compose" className="text-gray-600 hover:text-gray-900">
              {t("header.compose")}
            </Link>
            <Link href="/pair" className="text-gray-600 hover:text-gray-900">
              {t("header.pair")}
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-gray-900">
              {t("header.settings")}
            </Link>
            <button
              onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              {locale === "zh" ? "EN" : "中"}
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600"
            >
              {t("header.logout")}
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <button
              onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              {locale === "zh" ? "EN" : "中"}
            </button>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              {t("header.signIn")}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-orange-500 px-3 py-1 text-white hover:bg-orange-600"
            >
              {t("header.signUp")}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

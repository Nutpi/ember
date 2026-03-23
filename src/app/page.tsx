"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useT();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="text-orange-500">Ember</span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-500">
        {t("home.tagline")}
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          {t("home.getStarted")}
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          {t("home.signIn")}
        </Link>
      </div>
    </div>
  );
}

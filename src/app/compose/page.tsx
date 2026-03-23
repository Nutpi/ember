"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function ComposePage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { user, profile } = useAuth();
  const { t } = useT();

  const partnerId = profile?.partner_id ?? null;
  const partnerNickname = profile?.partner_nickname ?? "";

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!partnerId || !user) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.from("letters").insert({
      author_id: user.id,
      recipient_id: partnerId,
      content: content.trim(),
    });

    if (error) {
      setError(t("compose.failed"));
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  if (!partnerId) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-500">{t("compose.noPair")}</p>
          <a
            href="/pair"
            className="inline-block rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            {t("compose.goPair")}
          </a>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t("compose.sent")}</h1>
          <p className="text-gray-500">{t("compose.sentTo")} {partnerNickname}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSent(false); setContent(""); }}
              className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              {t("compose.writeAnother")}
            </button>
            <a
              href="/timeline"
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50"
            >
              {t("compose.timeline")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold mb-1">{t("compose.title")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("compose.to")} {partnerNickname}</p>

      <form onSubmit={handleSend} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          placeholder={t("compose.placeholder")}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm leading-relaxed focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{content.length} {t("compose.chars")}</span>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || content.trim().length === 0}
          className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? t("compose.loading") : t("compose.submit")}
        </button>
      </form>
    </div>
  );
}

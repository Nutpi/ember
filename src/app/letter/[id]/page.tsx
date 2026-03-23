"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface LetterDetail {
  id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  author_id: string;
  author: { nickname: string } | null;
  recipient: { nickname: string } | null;
}

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const [letter, setLetter] = useState<LetterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { t, locale } = useT();

  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      const { id } = await params;
      const supabase = createClient();

      const { data } = await supabase
        .from("letters")
        .select(`
          id, content, created_at, read_at, author_id, recipient_id,
          author:profiles!letters_author_id_fkey(nickname),
          recipient:profiles!letters_recipient_id_fkey(nickname)
        `)
        .eq("id", id)
        .single();

      if (data) {
        setLetter(data as unknown as LetterDetail);

        if (data.recipient_id === user!.id && !data.read_at) {
          // fire-and-forget
          supabase
            .from("letters")
            .update({ read_at: new Date().toISOString() })
            .eq("id", id)
            .then(() => {});
        }
      }
      setLoading(false);
    }
    load();
  }, [authLoading, user, params]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-400">{t("common.loading")}</p>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-500">{t("letter.notFound")}</p>
      </div>
    );
  }

  const isMine = letter.author_id === user?.id;
  const authorName = letter.author?.nickname ?? t("letter.unknown");
  const recipientName = letter.recipient?.nickname ?? t("letter.unknown");
  const date = new Date(letter.created_at).toLocaleString(
    locale === "zh" ? "zh-CN" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <a href="/timeline" className="text-sm text-orange-500 hover:underline">
        &larr; {t("letter.backToTimeline")}
      </a>

      <div className="mt-6 rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {isMine
              ? `${t("common.you")} → ${recipientName}`
              : `${authorName} → ${t("common.you")}`}
          </p>
          <time className="text-xs text-gray-400">{date}</time>
        </div>

        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {letter.content}
        </div>
      </div>
    </div>
  );
}

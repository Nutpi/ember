"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

interface LetterCardProps {
  letter: {
    id: string;
    content: string;
    created_at: string;
    read_at: string | null;
    author: { nickname: string } | null;
    recipient: { nickname: string } | null;
  };
  isMine: boolean;
  hasImages?: boolean;
}

export default function LetterCard({ letter, isMine, hasImages }: LetterCardProps) {
  const { t, locale } = useT();

  const preview =
    letter.content.length > 80
      ? letter.content.slice(0, 80) + "..."
      : letter.content;

  const date = new Date(letter.created_at).toLocaleDateString(
    locale === "zh" ? "zh-CN" : "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const authorName = letter.author?.nickname ?? "?";
  const recipientName = letter.recipient?.nickname ?? "?";

  return (
    <Link href={`/letter/${letter.id}`} className="block">
      <div
        className={`rounded-lg border p-4 transition hover:shadow-sm ${
          isMine
            ? "border-orange-200 bg-orange-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">
            {isMine
              ? `${t("common.you")} → ${recipientName}`
              : `${authorName} → ${t("common.you")}`}
          </p>
          <div className="flex items-center gap-2">
            {hasImages && (
              <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
            )}
            {!isMine && !letter.read_at && (
              <span className="h-2 w-2 rounded-full bg-orange-500" />
            )}
            <time className="text-xs text-gray-400">{date}</time>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{preview}</p>
      </div>
    </Link>
  );
}

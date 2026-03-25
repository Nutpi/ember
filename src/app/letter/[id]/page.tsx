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

interface LetterImage {
  id: string;
  storage_path: string;
  display_order: number;
}

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const [letter, setLetter] = useState<LetterDetail | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
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
          supabase
            .from("letters")
            .update({ read_at: new Date().toISOString() })
            .eq("id", id)
            .then(() => {});
        }

        // Load images
        const { data: images } = await supabase
          .from("letter_images")
          .select("id, storage_path, display_order")
          .eq("letter_id", id)
          .order("display_order");

        if (images && images.length > 0) {
          const urls: string[] = [];
          for (const img of images as LetterImage[]) {
            const { data: signedData } = await supabase.storage
              .from("letter-images")
              .createSignedUrl(img.storage_path, 3600);
            if (signedData?.signedUrl) {
              urls.push(signedData.signedUrl);
            }
          }
          setImageUrls(urls);
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

        {imageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => setViewingImage(url)}
                className="overflow-hidden rounded-lg"
              >
                <img
                  src={url}
                  alt=""
                  className="h-40 w-full object-cover transition hover:opacity-90"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen image overlay */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute right-4 top-4 text-2xl text-white hover:text-gray-300"
          >
            &times;
          </button>
          <img
            src={viewingImage}
            alt=""
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import LetterCard from "@/components/LetterCard";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface Letter {
  id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  author_id: string;
  recipient_id: string;
  author: { nickname: string } | null;
  recipient: { nickname: string } | null;
  letter_images: { count: number }[];
}

export default function TimelinePage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, loading: authLoading } = useAuth();
  const { t, locale } = useT();

  const hasPartner = !!profile?.partner_id;

  function groupLettersByMonth(letters: Letter[]) {
    const groups: { key: string; label: string; letters: Letter[] }[] = [];
    const map = new Map<string, Letter[]>();

    for (const letter of letters) {
      const d = new Date(letter.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(letter);
    }

    for (const [key, items] of map) {
      const [year, month] = key.split("-").map(Number);
      const label = new Date(year, month - 1).toLocaleDateString(
        locale === "zh" ? "zh-CN" : "en-US",
        { year: "numeric", month: "long" }
      );
      groups.push({ key, label, letters: items });
    }

    return groups;
  }

  useEffect(() => {
    if (authLoading || !user) return;
    if (!hasPartner) {
      setLoading(false);
      return;
    }

    async function loadLetters() {
      const supabase = createClient();

      // Try with letter_images count; fall back without if table doesn't exist yet
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any[] | null = null;

      const withImages = await supabase
        .from("letters")
        .select(`
          id, content, created_at, read_at, author_id, recipient_id,
          author:profiles!letters_author_id_fkey(nickname),
          recipient:profiles!letters_recipient_id_fkey(nickname),
          letter_images(count)
        `)
        .or(`author_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
        .eq("is_draft", false)
        .order("created_at", { ascending: false });

      if (withImages.error) {
        // letter_images table may not exist yet, retry without it
        const withoutImages = await supabase
          .from("letters")
          .select(`
            id, content, created_at, read_at, author_id, recipient_id,
            author:profiles!letters_author_id_fkey(nickname),
            recipient:profiles!letters_recipient_id_fkey(nickname)
          `)
          .or(`author_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
          .eq("is_draft", false)
          .order("created_at", { ascending: false });
        data = withoutImages.data;
      } else {
        data = withImages.data;
      }

      if (data) {
        setLetters(data as unknown as Letter[]);

        const unreadIds = data
          .filter((l) => l.recipient_id === user!.id && !l.read_at)
          .map((l) => l.id);

        if (unreadIds.length > 0) {
          // fire-and-forget
          supabase
            .from("letters")
            .update({ read_at: new Date().toISOString() })
            .in("id", unreadIds)
            .then(() => {});
        }
      }
      setLoading(false);
    }
    loadLetters();
  }, [authLoading, user, hasPartner]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-400">{t("common.loading")}</p>
      </div>
    );
  }

  if (!hasPartner) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-500">{t("timeline.noPair")}</p>
          <a
            href="/pair"
            className="inline-block rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            {t("timeline.goPair")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold">{t("timeline.title")}</h1>
      </div>

      {letters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">{t("timeline.noLetters")}</p>
          <a
            href="/compose"
            className="text-sm text-orange-500 hover:underline"
          >
            {t("timeline.writeFirst")}
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          {groupLettersByMonth(letters).map((group) => (
            <div key={group.key}>
              <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm -mx-4 px-4 py-2">
                <h2 className="text-sm font-semibold text-gray-500">{group.label}</h2>
              </div>
              <div className="space-y-4 mt-2">
                {group.letters.map((letter) => (
                  <LetterCard
                    key={letter.id}
                    letter={letter}
                    isMine={letter.author_id === user!.id}
                    hasImages={letter.letter_images?.[0]?.count > 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

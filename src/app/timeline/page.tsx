"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import LetterCard from "@/components/LetterCard";

interface Letter {
  id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  author_id: string;
  recipient_id: string;
  author: { nickname: string } | null;
  recipient: { nickname: string } | null;
}

export default function TimelinePage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPartner, setHasPartner] = useState(true);

  useEffect(() => {
    async function loadLetters() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("partner_id")
        .eq("id", user.id)
        .single();

      if (!profile?.partner_id) {
        setHasPartner(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("letters")
        .select(`
          id, content, created_at, read_at, author_id, recipient_id,
          author:profiles!letters_author_id_fkey(nickname),
          recipient:profiles!letters_recipient_id_fkey(nickname)
        `)
        .or(`author_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .eq("is_draft", false)
        .order("created_at", { ascending: false });

      if (data) {
        setLetters(data as unknown as Letter[]);

        const unreadIds = data
          .filter((l) => l.recipient_id === user.id && !l.read_at)
          .map((l) => l.id);

        if (unreadIds.length > 0) {
          await supabase
            .from("letters")
            .update({ read_at: new Date().toISOString() })
            .in("id", unreadIds);
        }
      }
      setLoading(false);
    }
    loadLetters();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-400">加载中... Loading...</p>
      </div>
    );
  }

  if (!hasPartner) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-500">你还没有配对，先找到你的另一半吧</p>
          <p className="text-xs text-gray-400">You haven&apos;t paired yet. Find your partner first!</p>
          <a
            href="/pair"
            className="inline-block rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            去配对 Go Pair
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">时间线 Timeline</h1>
        <a
          href="/compose"
          className="rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          写信 Compose
        </a>
      </div>

      {letters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-1">还没有信件，写一封吧！</p>
          <p className="text-xs text-gray-300 mb-4">No letters yet. Write the first one!</p>
          <a
            href="/compose"
            className="text-sm text-orange-500 hover:underline"
          >
            写第一封信 Write First Letter
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {letters.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              isMine={letter.author_id === userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

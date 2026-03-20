"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ComposePage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partnerNickname, setPartnerNickname] = useState("");

  useEffect(() => {
    async function loadPartner() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("partner_id")
        .eq("id", user.id)
        .single();

      if (profile?.partner_id) {
        setPartnerId(profile.partner_id);
        const { data: partner } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", profile.partner_id)
          .single();
        if (partner) setPartnerNickname(partner.nickname);
      }
    }
    loadPartner();
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!partnerId) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("letters").insert({
      author_id: user.id,
      recipient_id: partnerId,
      content: content.trim(),
    });

    if (error) {
      setError("发送失败，请重试 / Failed to send, please try again");
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
          <p className="text-gray-500">你还没有配对，请先完成配对</p>
          <p className="text-xs text-gray-400">You haven&apos;t paired yet</p>
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

  if (sent) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">信已送出！Letter Sent!</h1>
          <p className="text-gray-500">你的信已发送给 {partnerNickname}</p>
          <p className="text-xs text-gray-400">Your letter has been sent to {partnerNickname}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSent(false); setContent(""); }}
              className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              再写一封 Write Another
            </button>
            <a
              href="/timeline"
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50"
            >
              时间线 Timeline
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold mb-1">写信 Compose</h1>
      <p className="text-sm text-gray-500 mb-6">写给 To {partnerNickname}</p>

      <form onSubmit={handleSend} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          placeholder="想对 TA 说些什么... What would you like to say..."
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm leading-relaxed focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{content.length} 字 chars</span>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || content.trim().length === 0}
          className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "发送中... Sending..." : "发送 Send"}
        </button>
      </form>
    </div>
  );
}

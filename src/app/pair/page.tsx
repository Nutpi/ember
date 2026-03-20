"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PairPage() {
  const [myCode, setMyCode] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [partnerNickname, setPartnerNickname] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paired, setPaired] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("invite_code, partner_id")
        .eq("id", user.id)
        .single();

      if (profile) {
        setMyCode(profile.invite_code);
        if (profile.partner_id) {
          setPaired(true);
          const { data: partner } = await supabase
            .from("profiles")
            .select("nickname")
            .eq("id", profile.partner_id)
            .single();
          if (partner) setPartnerNickname(partner.nickname);
        }
      }
    }
    loadProfile();
  }, []);

  async function handlePair(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: rpcError } = await supabase.rpc("pair_with_code", {
      partner_code: partnerCode.trim(),
    });

    if (rpcError) {
      setError("配对失败，请重试 / Pairing failed, please try again");
      setLoading(false);
      return;
    }

    if (data?.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setPaired(true);
    setPartnerNickname(data.partner_nickname);
    setLoading(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(myCode);
  }

  if (paired) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-bold">配对成功！Paired!</h1>
          <p className="text-gray-500">
            你已经和 <strong>{partnerNickname}</strong> 配对
          </p>
          <p className="text-xs text-gray-400">You are now paired with {partnerNickname}</p>
          <a
            href="/compose"
            className="inline-block rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            写一封信 Write a Letter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">配对 Pair</h1>
          <p className="mt-1 text-sm text-gray-500">
            分享你的邀请码给对方，或输入对方的邀请码
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            Share your invite code, or enter your partner&apos;s code
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">你的邀请码 Your Invite Code</p>
          <p className="text-2xl font-mono font-bold tracking-widest">{myCode}</p>
          <button
            onClick={copyCode}
            className="mt-2 text-xs text-orange-500 hover:underline"
          >
            复制 Copy
          </button>
        </div>

        <form onSubmit={handlePair} className="space-y-4">
          <div>
            <label htmlFor="partnerCode" className="block text-sm font-medium">
              输入对方的邀请码 Partner&apos;s Code
            </label>
            <input
              id="partnerCode"
              type="text"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value)}
              required
              placeholder="8-digit code"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-center font-mono text-lg tracking-widest focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "配对中... Pairing..." : "配对 Pair"}
          </button>
        </form>
      </div>
    </div>
  );
}

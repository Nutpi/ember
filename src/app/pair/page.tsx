"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function PairPage() {
  const [partnerCode, setPartnerCode] = useState("");
  const [localPartnerNickname, setLocalPartnerNickname] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [justPaired, setJustPaired] = useState(false);
  const { profile, refreshProfile } = useAuth();
  const { t } = useT();

  const myCode = profile?.invite_code ?? "";
  const paired = justPaired || !!profile?.partner_id;
  const partnerNickname = localPartnerNickname ?? profile?.partner_nickname ?? null;

  async function handlePair(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: rpcError } = await supabase.rpc("pair_with_code", {
      partner_code: partnerCode.trim(),
    });

    if (rpcError) {
      setError(t("pair.failed"));
      setLoading(false);
      return;
    }

    if (data?.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setJustPaired(true);
    setLocalPartnerNickname(data.partner_nickname);
    setLoading(false);
    refreshProfile();
  }

  function copyCode() {
    navigator.clipboard.writeText(myCode);
  }

  if (paired) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-bold">{t("pair.success")}</h1>
          <p className="text-gray-500">
            {t("pair.pairedWith")} <strong>{partnerNickname}</strong>
          </p>
          <a
            href="/compose"
            className="inline-block rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            {t("pair.writeLetter")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("pair.title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("pair.subtitle")}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">{t("pair.yourCode")}</p>
          <p className="text-2xl font-mono font-bold tracking-widest">{myCode}</p>
          <button
            onClick={copyCode}
            className="mt-2 text-xs text-orange-500 hover:underline"
          >
            {t("pair.copy")}
          </button>
        </div>

        <form onSubmit={handlePair} className="space-y-4">
          <div>
            <label htmlFor="partnerCode" className="block text-sm font-medium">
              {t("pair.partnerCode")}
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
            {loading ? t("pair.loading") : t("pair.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

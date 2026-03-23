"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const [nickname, setNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nicknameMsg, setNicknameMsg] = useState("");
  const [nicknameFailed, setNicknameFailed] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordFailed, setPasswordFailed] = useState(false);
  const [unpairMsg, setUnpairMsg] = useState("");
  const [unpairFailed, setUnpairFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [unpairing, setUnpairing] = useState(false);
  const [showUnpairConfirm, setShowUnpairConfirm] = useState(false);

  const { user, profile, refreshProfile } = useAuth();
  const { t, locale, setLocale } = useT();

  const paired = !!profile?.partner_id;
  const partnerNickname = profile?.partner_nickname ?? null;

  useEffect(() => {
    if (profile?.nickname) {
      setNickname(profile.nickname);
    }
  }, [profile?.nickname]);

  async function handleNickname(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setNicknameMsg("");

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ nickname: nickname.trim() })
      .eq("id", user.id);

    if (error) {
      setNicknameMsg("settings.saveFailed");
      setNicknameFailed(true);
    } else {
      setNicknameMsg("settings.saved");
      setNicknameFailed(false);
      refreshProfile();
    }
    setSaving(false);
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg("");

    if (newPassword !== confirmPassword) {
      setPasswordMsg("settings.passwordMismatch");
      setPasswordFailed(true);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("settings.passwordTooShort");
      setPasswordFailed(true);
      return;
    }

    setChangingPw(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMsg("settings.passwordFailed");
      setPasswordFailed(true);
    } else {
      setPasswordMsg("settings.passwordUpdated");
      setPasswordFailed(false);
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPw(false);
  }

  async function handleUnpair() {
    setUnpairing(true);
    setUnpairMsg("");

    const supabase = createClient();
    const { error } = await supabase.rpc("unpair");

    if (error) {
      setUnpairMsg("settings.unpairFailed");
      setUnpairFailed(true);
    } else {
      setShowUnpairConfirm(false);
      setUnpairMsg("settings.unpaired");
      setUnpairFailed(false);
      refreshProfile();
    }
    setUnpairing(false);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">{t("settings.title")}</h1>

      {/* 语言 Language */}
      <section className="rounded-lg border border-gray-200 p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.language")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLocale("zh")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              locale === "zh"
                ? "bg-orange-500 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            中文
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              locale === "en"
                ? "bg-orange-500 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            English
          </button>
        </div>
      </section>

      {/* 修改昵称 */}
      <section className="rounded-lg border border-gray-200 p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.changeNickname")}</h2>
        <form onSubmit={handleNickname} className="space-y-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            placeholder={t("settings.nicknamePlaceholder")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          {nicknameMsg && (
            <p className={`text-sm ${nicknameFailed ? "text-red-600" : "text-green-600"}`}>
              {t(nicknameMsg)}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? t("settings.saving") : t("settings.save")}
          </button>
        </form>
      </section>

      {/* 修改密码 */}
      <section className="rounded-lg border border-gray-200 p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.changePassword")}</h2>
        <form onSubmit={handlePassword} className="space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder={t("settings.newPassword")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder={t("settings.confirmPassword")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          {passwordMsg && (
            <p className={`text-sm ${passwordFailed ? "text-red-600" : "text-green-600"}`}>
              {t(passwordMsg)}
            </p>
          )}
          <button
            type="submit"
            disabled={changingPw}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {changingPw ? t("settings.updating") : t("settings.updatePassword")}
          </button>
        </form>
      </section>

      {/* 解除配对 */}
      <section className="rounded-lg border border-gray-200 p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.pairing")}</h2>
        {paired ? (
          <>
            <p className="text-sm text-gray-600">
              {t("settings.pairedWith")}<strong>{partnerNickname}</strong>
            </p>
            {!showUnpairConfirm ? (
              <button
                onClick={() => setShowUnpairConfirm(true)}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                {t("settings.unpair")}
              </button>
            ) : (
              <div className="space-y-2 rounded-lg bg-red-50 p-3">
                <p className="text-sm text-red-700">
                  {t("settings.unpairConfirm")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleUnpair}
                    disabled={unpairing}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {unpairing ? t("settings.unpairing") : t("settings.confirmUnpair")}
                  </button>
                  <button
                    onClick={() => setShowUnpairConfirm(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    {t("settings.cancel")}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">{t("settings.notPaired")}</p>
        )}
        {unpairMsg && (
          <p className={`text-sm ${unpairFailed ? "text-red-600" : "text-green-600"}`}>
            {t(unpairMsg)}
          </p>
        )}
      </section>
    </div>
  );
}

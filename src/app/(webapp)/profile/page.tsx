"use client";
import { useState } from "react";
import { ChevronRight, Bell, Eye, Users } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppStore } from "@/lib/store";
import { useTelegram } from "@/hooks/useTelegram";
import type { Lang } from "@/lib/translations";

const LANG_LABELS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fa", label: "فارسی" },
];

export default function ProfilePage() {
  const { t, lang, setLang } = useLanguage();
  const { user, twa } = useTelegram();
  const hideBalance = useAppStore((s) => s.hideBalance);
  const setHideBalance = useAppStore((s) => s.setHideBalance);
  const pushNotify = useAppStore((s) => s.pushNotify);
  const setPushNotify = useAppStore((s) => s.setPushNotify);
  const [inviteCode] = useState("109711635");
  const [referralCount] = useState(0);
  const REFERRAL_GOAL = 150;
  const [inviteInput, setInviteInput] = useState("");
  const [copied, setCopied] = useState(false);

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "PremioShopBot";
  const shareUrl = `https://t.me/${botUsername}?start=${inviteCode}`;

  function handleShare() {
    if (twa) {
      twa.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Join PremioShop!")}`);
    } else {
      navigator.share?.({ url: shareUrl, title: "PremioShop" });
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayName = user
    ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
    : "PremioSuport";
  const username = user?.username ?? "premiosuport";

  return (
    <div className="p-4 pb-6 space-y-4">
      {/* User card */}
      <div className="bg-bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
        <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-bg-primary text-xl font-bold">
          {displayName[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-text-primary">{displayName}</p>
          <p className="text-text-secondary text-sm">@{username}</p>
        </div>
      </div>

      {/* Referral card */}
      <div className="bg-bg-card border border-border rounded-2xl p-4">
        <h3 className="font-bold text-text-primary mb-1">{t("inviteFriends")}</h3>
        <p className="text-sm text-text-secondary mb-3">
          {t("inviteDesc").replace("{goal}", String(REFERRAL_GOAL))}
        </p>

        <p className="text-sm text-text-secondary mb-1">{referralCount} / {REFERRAL_GOAL} counted</p>
        <div className="w-full bg-bg-elevated rounded-full h-1.5 mb-4">
          <div
            className="bg-accent h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min((referralCount / REFERRAL_GOAL) * 100, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleShare}
            className="bg-accent text-bg-primary font-bold py-3 rounded-xl text-sm"
          >
            {t("share")}
          </button>
          <button
            onClick={handleCopyLink}
            className="bg-bg-elevated border border-border text-text-primary font-bold py-3 rounded-xl text-sm"
          >
            {copied ? "Copied!" : t("copyLink")}
          </button>
        </div>

        <div className="border border-dashed border-border rounded-xl p-3">
          <p className="text-[10px] text-text-muted font-mono tracking-widest mb-1">{t("yourInviteCode")}</p>
          <p className="text-2xl font-mono font-bold text-text-primary tracking-wider">{inviteCode}</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-bg-card border border-border rounded-2xl p-4">
        <h3 className="font-bold mb-3">{t("howItWorks")}</h3>
        <div className="space-y-3">
          {[
            "Share your code or link with friends.",
            "Your friend opens the app, enters your code, and subscribes to the channel, bot and group — required.",
            "Once they're subscribed the invite counts. Reach 150 and the Cursor method unlocks free.",
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 bg-bg-elevated rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-text-secondary">{text}</p>
            </div>
          ))}
        </div>

        {/* Enter invite code */}
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-bold text-sm">{t("haveCode")}</p>
            <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">{t("required")}</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">Entering a friend's code is required to be counted as their referral.</p>
          <input
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
            placeholder={t("enterCode")}
            className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary outline-none font-mono mb-2"
          />
          <button className="w-full bg-accent text-bg-primary font-bold py-3 rounded-xl text-sm mb-2">
            {t("apply")}
          </button>
          <button className="w-full bg-bg-elevated border border-border text-text-primary font-bold py-3 rounded-xl text-sm">
            {t("iSubscribed")}
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <p className="text-xs text-text-muted font-bold tracking-widest mb-2 px-1">{t("preferences")}</p>
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-text-secondary" />
              <span className="text-sm font-medium">{t("pushNotifications")}</span>
            </div>
            <button
              onClick={() => setPushNotify(!pushNotify)}
              className={`w-12 h-6 rounded-full transition-colors ${pushNotify ? "bg-accent" : "bg-bg-elevated border border-border"}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${pushNotify ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Eye size={18} className="text-text-secondary" />
              <span className="text-sm font-medium">{t("hideBalance")}</span>
            </div>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className={`w-12 h-6 rounded-full transition-colors ${hideBalance ? "bg-accent" : "bg-bg-elevated border border-border"}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${hideBalance ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Language */}
      <div>
        <p className="text-xs text-text-muted font-bold tracking-widest mb-2 px-1">{t("language")}</p>
        <div className="grid grid-cols-3 gap-2">
          {LANG_LABELS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`py-3 rounded-2xl font-bold text-sm transition-colors ${
                lang === code ? "bg-bg-elevated border border-border text-text-primary" : "bg-bg-card border border-border/50 text-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
        {[
          { label: t("faqHelp"), icon: "ℹ️" },
          { label: t("terms"), icon: "🛡" },
          { label: t("support"), icon: "💬" },
        ].map(({ label, icon }) => (
          <button key={label} className="flex items-center justify-between w-full p-4">
            <div className="flex items-center gap-3">
              <span>{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="text-xs text-text-muted text-center">
        <span className="font-bold">verifier</span> · {t("fundsHeld")}
      </p>
    </div>
  );
}

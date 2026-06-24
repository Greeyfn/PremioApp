"use client";
import { useEffect } from "react";
import BottomNav from "@/components/layout/BottomNav";
import AppHeader from "@/components/layout/AppHeader";
import { useTelegram } from "@/hooks/useTelegram";
import { useAppStore } from "@/lib/store";

export default function WebAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initData } = useTelegram();
  const setUserId = useAppStore((s) => s.setUserId);
  const setBalance = useAppStore((s) => s.setBalance);
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const isRtl = lang === "fa";

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const payload = user
      ? JSON.stringify({ initData })
      : isDev
      ? JSON.stringify({ devMode: true, telegramId: 109711635 })
      : null;

    if (!payload) return;

    fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user.id);
          setBalance(data.user.balance);
        }
      })
      .catch(() => {});
  }, [user, initData, setUserId, setBalance]);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex flex-col min-h-screen max-w-md mx-auto ${theme === "light" ? "light-mode" : ""}`}
    >
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

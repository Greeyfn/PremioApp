"use client";
import { useEffect, useState } from "react";
import type { TelegramWebApp } from "@/types";

export function useTelegram() {
  const [twa, setTwa] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const webapp = window.Telegram?.WebApp;
    if (webapp) {
      webapp.ready();
      webapp.expand();
      setTwa(webapp);
    }
    setIsReady(true);
  }, []);

  const haptic = {
    light: () => twa?.HapticFeedback.impactOccurred("light"),
    medium: () => twa?.HapticFeedback.impactOccurred("medium"),
    success: () => twa?.HapticFeedback.notificationOccurred("success"),
    error: () => twa?.HapticFeedback.notificationOccurred("error"),
  };

  return {
    twa,
    isReady,
    isInsideTelegram: !!twa,
    user: twa?.initDataUnsafe?.user ?? null,
    initData: twa?.initData ?? "",
    haptic,
  };
}

"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/lib/translations";

interface AppState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  balance: number;
  setBalance: (balance: number) => void;
  hideBalance: boolean;
  setHideBalance: (hide: boolean) => void;
  pushNotify: boolean;
  setPushNotify: (enable: boolean) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: "fa",
      setLang: (lang) => set({ lang }),
      balance: 0,
      setBalance: (balance) => set({ balance }),
      hideBalance: false,
      setHideBalance: (hideBalance) => set({ hideBalance }),
      pushNotify: true,
      setPushNotify: (pushNotify) => set({ pushNotify }),
      userId: null,
      setUserId: (userId) => set({ userId }),
    }),
    {
      name: "premio-shop-storage",
      partialize: (state) => ({
        lang: state.lang,
        hideBalance: state.hideBalance,
        pushNotify: state.pushNotify,
      }),
    }
  )
);

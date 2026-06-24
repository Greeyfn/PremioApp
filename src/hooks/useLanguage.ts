"use client";
import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { translations, type Lang } from "@/lib/translations";

export function useLanguage() {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);

  const t = useCallback(
    (key: keyof typeof translations.en): string => {
      return (translations[lang as Lang] as Record<string, string>)[key] ?? key;
    },
    [lang]
  );

  return { lang, setLang, t };
}

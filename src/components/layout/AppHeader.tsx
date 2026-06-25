"use client";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon, ChevronDown, Globe } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import { useTelegram } from "@/hooks/useTelegram";
import type { Lang } from "@/lib/translations";

const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "fa", label: "FA", native: "فارسی" },
  { code: "en", label: "EN", native: "English" },
];

export default function AppHeader() {
  const { lang, setLang } = useLanguage();
  const { user: tgUser } = useTelegram();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const { usdToTomanFormatted } = useCurrency();
  const balance = useAppStore((s) => s.balance);
  const hideBalance = useAppStore((s) => s.hideBalance);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const isFa = lang === "fa";
  const balanceToman = usdToTomanFormatted(balance);
  const balanceDisplay = isFa && balanceToman ? `${balanceToman} ت` : `$${balance.toFixed(0)}`;

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [langOpen]);

  return (
    <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-border px-3 py-2 flex items-center gap-2">
      {/* Logo + title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={() => {
            const tg = window.Telegram?.WebApp;
            if (tg) tg.openTelegramLink("https://t.me/premioshop");
            else window.open("https://t.me/premioshop", "_blank");
          }}
          className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-black flex items-center justify-center p-1.5 animate-logo"
        >
          <svg viewBox="0 0 472 844" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g clipPath="url(#clip0_110_176)">
              <path d="M193.609 0C191.107 0 188.615 0.039957 186.133 0.109882C186.074 4.56509 182.455 8.16123 178 8.16123V137.942C183.123 137.362 188.336 137.053 193.609 137.053C269.671 137.053 331.329 198.846 331.329 275.074C331.329 351.302 269.671 413.096 193.609 413.096C188.326 413.096 183.123 412.786 178 412.207V549.699C182.495 549.699 186.143 553.355 186.143 557.86C186.143 557.86 186.143 557.87 186.143 557.88C188.625 557.95 191.117 557.99 193.609 557.99C347.357 557.99 472 433.074 472 278.99C472 124.906 347.357 0 193.609 0Z" fill="white"/>
            </g>
            <path d="M128.654 707.774C128.654 703.265 132.332 699.606 136.864 699.606C137.005 699.606 137.146 699.616 137.286 699.626L138 9.16772C133.468 9.16772 129.8 5.50863 129.8 0.999751C129.8 0.659836 129.83 0.329918 129.87 0H8.14011C8.18031 0.329918 8.21046 0.659836 8.21046 0.999751C8.21046 5.50863 4.53233 9.16772 0 9.16772V844L131.096 713.582C129.589 712.103 128.654 710.053 128.654 707.774Z" fill="white"/>
            <defs>
              <clipPath id="clip0_110_176">
                <rect width="294" height="558" fill="white" transform="translate(178)"/>
              </clipPath>
            </defs>
          </svg>
        </button>
        <div className="flex flex-col justify-center min-w-0">
          <p className="font-bold text-text-primary text-xs leading-none mb-0.5 truncate">
            {tgUser ? tgUser.first_name : "پریمیوشاپ"}
          </p>
          {tgUser && (
            <p className="text-text-muted text-[10px] leading-none truncate" dir="ltr">
              {tgUser.username ? `@${tgUser.username}` : `ID: ${tgUser.id}`}
            </p>
          )}
        </div>
      </div>

      {/* Balance — hidden on very small screens */}
      <button className="hide-on-small flex items-center gap-1 bg-bg-elevated rounded-full px-2.5 py-1 border border-border shrink-0">
        <span className="text-[11px] font-medium text-text-primary whitespace-nowrap">
          {hideBalance ? "***" : balanceDisplay}
        </span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center bg-bg-elevated border border-border text-text-secondary"
      >
        {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
      </button>

      {/* Language dropdown */}
      <div ref={langRef} className="relative shrink-0">
        <button
          onClick={() => setLangOpen((o) => !o)}
          className="flex items-center gap-0.5 bg-bg-elevated border border-border rounded-full px-2 py-1 text-[11px] font-medium text-text-primary"
        >
          <Globe size={11} className="text-text-muted shrink-0" />
          <span className="mx-0.5">{lang.toUpperCase()}</span>
          <ChevronDown
            size={10}
            className={`text-text-muted transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
          />
        </button>

        {langOpen && (
          <div
            className="absolute top-full mt-1.5 bg-bg-elevated border border-border rounded-xl shadow-xl overflow-hidden z-50"
            style={{ insetInlineEnd: 0, minWidth: "108px" }}
          >
            {LANGS.map(({ code, label, native }) => (
              <button
                key={code}
                onClick={() => { setLang(code); setLangOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                  lang === code
                    ? "bg-accent/15 text-accent font-bold"
                    : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                }`}
              >
                <span className="font-mono font-bold text-[11px]">{label}</span>
                <span className="text-text-muted text-[11px]">{native}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

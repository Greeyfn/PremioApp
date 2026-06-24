"use client";
import { Sun, Moon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import { useTelegram } from "@/hooks/useTelegram";
import type { Lang } from "@/lib/translations";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fa", label: "FA" },
  { code: "en", label: "EN" },
];

export default function AppHeader() {
  const { lang, setLang } = useLanguage();
  const { user: tgUser } = useTelegram();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const { usdToTomanFormatted } = useCurrency();
  const balance = useAppStore((s) => s.balance);
  const hideBalance = useAppStore((s) => s.hideBalance);

  const isFa = lang === "fa";

  const balanceToman = usdToTomanFormatted(balance);
  const balanceDisplay = isFa && balanceToman
    ? `${balanceToman} تومان`
    : `$${balance.toFixed(2)}`;

  return (
    <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
      {/* Logo & title */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => {
            const tg = window.Telegram?.WebApp;
            if (tg) {
              tg.openTelegramLink("https://t.me/premioshop");
            } else {
              window.open("https://t.me/premioshop", "_blank");
            }
          }}
          className="w-10 h-10 rounded-full overflow-hidden bg-black flex items-center justify-center p-2 animate-logo"
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
        <div className="flex flex-col justify-center">
          <p className="font-bold text-text-primary text-sm leading-none mb-0.5">
            {tgUser ? tgUser.first_name : "پریمیوشاپ"}
          </p>
          {tgUser && (
            <p className="text-text-muted text-xs leading-none" dir="ltr">
              {tgUser.username ? `@${tgUser.username}` : `ID: ${tgUser.id}`}
            </p>
          )}
        </div>
      </div>

      {/* Balance */}
      <button className="hide-on-small flex items-center gap-1.5 bg-bg-elevated rounded-full px-3 py-1.5 border border-border shrink-0">
        <span className="text-xs">💰</span>
        <span className="text-xs font-medium text-text-primary whitespace-nowrap">
          {hideBalance ? "***" : balanceDisplay}
        </span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-bg-elevated border border-border text-text-secondary hover:text-text-primary transition-colors"
      >
        {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Language switcher */}
      <div className="flex items-center bg-bg-elevated rounded-full border border-border overflow-hidden">
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`px-2.5 py-1 text-xs font-medium transition-colors ${
              lang === code
                ? "bg-accent text-bg-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}

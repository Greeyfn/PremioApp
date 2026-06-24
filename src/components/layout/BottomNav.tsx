"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Wallet, User } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const NAV_ITEMS = [
  { href: "/", icon: Home, labelKey: "store" as const },
  { href: "/orders", icon: ShoppingBag, labelKey: "orders" as const },
  { href: "/balance", icon: Wallet, labelKey: "balance" as const },
  { href: "/profile", icon: User, labelKey: "profile" as const },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-bg-primary border-t border-border safe-bottom z-50">
      <div className="flex items-end justify-around px-2 pt-2 pb-3">
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 min-w-[56px] transition-colors ${
                isActive ? "text-text-primary" : "text-text-muted"
              }`}
            >
              <div
                className={`flex items-center justify-center px-5 py-1.5 rounded-full transition-colors ${
                  isActive ? "bg-accent text-bg-primary" : ""
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              <span className="text-[11px] font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

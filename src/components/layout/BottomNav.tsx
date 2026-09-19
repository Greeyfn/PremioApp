"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const pillReady = useRef(false);

  useLayoutEffect(() => {
    const iconEl = iconRefs.current.get(pathname);
    const pill = pillRef.current;
    const container = containerRef.current;
    if (!iconEl || !pill || !container) return;

    const cr = container.getBoundingClientRect();
    const ir = iconEl.getBoundingClientRect();
    const left = ir.left - cr.left;
    const top = ir.top - cr.top;

    if (!pillReady.current) {
      pill.style.transition = "none";
      pill.style.opacity = "1";
      pill.style.top = `${top}px`;
      pill.style.height = `${ir.height}px`;
      pill.style.left = `${left}px`;
      pill.style.width = `${ir.width}px`;
      pillReady.current = true;
      requestAnimationFrame(() => { pill.style.transition = ""; });
    } else {
      pill.style.top = `${top}px`;
      pill.style.height = `${ir.height}px`;
      pill.style.left = `${left}px`;
      pill.style.width = `${ir.width}px`;
    }
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-bg-primary/90 backdrop-blur-md border-t border-border safe-bottom z-50">
      <div ref={containerRef} className="relative flex items-center justify-around px-3 pt-2 pb-4">
        {/* Sliding pill */}
        <div ref={pillRef} className="nav-slider-pill" />

        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative z-10 flex flex-col items-center gap-1"
            >
              <div
                ref={(el) => {
                  if (el) iconRefs.current.set(href, el);
                  else iconRefs.current.delete(href);
                }}
                className={`flex items-center justify-center px-6 py-2 rounded-2xl transition-colors duration-300 ${
                  isActive ? "text-bg-primary" : "text-text-muted"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className={`text-[11px] font-semibold transition-colors duration-300 ${
                isActive ? "text-text-primary" : "text-text-muted"
              }`}>
                {t(labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

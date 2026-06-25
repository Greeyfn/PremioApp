"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const ROUTE_ORDER = ["/", "/orders", "/balance", "/profile"];

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const prevIdxRef = useRef(ROUTE_ORDER.indexOf(pathname));
  const [animClass, setAnimClass] = useState("");

  useEffect(() => {
    const prev = prevIdxRef.current;
    const curr = ROUTE_ORDER.indexOf(pathname);
    if (prev === curr) return;

    const isRtl = lang === "fa";
    // In RTL, physical "forward" (higher index) comes from the left
    const forward = curr > prev;
    const fromRight = isRtl ? !forward : forward;

    setAnimClass(fromRight ? "page-slide-right" : "page-slide-left");
    prevIdxRef.current = curr;

    const t = setTimeout(() => setAnimClass(""), 320);
    return () => clearTimeout(t);
  }, [pathname, lang]);

  return (
    <div className={`page-transition-wrap ${animClass}`}>
      {children}
    </div>
  );
}

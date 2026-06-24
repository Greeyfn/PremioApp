"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Zap, Shield, Truck, Star } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import type { ProductWithStock } from "@/types";

interface Props {
  products: ProductWithStock[];
  onBuy: (product: ProductWithStock) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  API: <Zap size={14} />,
  ACCOUNT: <Shield size={14} />,
  LICENSE: <Star size={14} />,
  EDUCATION: <Star size={14} />,
  OTHER: <Star size={14} />,
};

const AUTOPLAY_INTERVAL = 8000;

export default function ProductSlider({ products, onBuy }: Props) {
  const { t, lang } = useLanguage();
  const { usdToTomanFormatted } = useCurrency();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const isFa = lang === "fa";
  const total = products.length;

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrent((prev) => (prev + 1) % total);
    }, AUTOPLAY_INTERVAL);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    resetAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [total, resetAutoplay]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, current]);

  function goTo(index: number) {
    setIsTransitioning(true);
    setCurrent(index);
    resetAutoplay();
  }

  function goNext() {
    goTo((current + 1) % total);
  }

  function goPrev() {
    goTo((current - 1 + total) % total);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }

  if (total === 0) return null;

  const product = products[current];
  const hasImage = !!product.imageUrl;
  const icon = CATEGORY_ICONS[product.category] ?? CATEGORY_ICONS.OTHER;
  const tomanPrice = usdToTomanFormatted(product.price);
  const priceText = isFa && tomanPrice ? `${tomanPrice} تومان` : `$${product.price}`;
  const features = product.features ?? [];

  return (
    <div className="mb-5">
      <div
        className="relative overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide Content */}
        <div
          className={`relative border border-border rounded-2xl min-h-[220px] flex flex-col justify-between transition-all duration-500 overflow-hidden ${
            isTransitioning ? "opacity-0 scale-[0.97]" : "opacity-100 scale-100"
          } ${hasImage ? "" : "bg-bg-card"}`}
        >
          {/* Animated Glow Line (Premium Shimmer) */}
          <div className="absolute top-0 left-0 w-full h-[2px] z-20 overflow-hidden pointer-events-none opacity-80">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer-line blur-[0.5px]" />
          </div>

          {/* Full-cover background image */}
          {hasImage && (
            <>
              <img
                src={product.imageUrl!}
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {/* Dark overlay so text stays readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40 z-[1]" />
            </>
          )}

          {/* Content layer */}
          <div className="relative z-10 p-5 pb-4 flex flex-col justify-between flex-1">
            {/* Top row: badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                {icon}
                {product.category}
              </span>
              {product.tag && (
                <span className="text-[10px] font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white leading-tight mb-1.5 line-clamp-2 drop-shadow-lg">
                {product.title}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed line-clamp-2 mb-3 drop-shadow">
                {product.description}
              </p>

              {/* Mini features row */}
              {features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {features.slice(0, 3).map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] text-white/80 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full"
                    >
                      <Truck size={9} className="text-accent" />
                      <span className="line-clamp-1 max-w-[120px]">{f}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom: Price + CTA + Dots (all in one row) */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => onBuy(product)}
                className="bg-accent text-bg-primary text-xs font-bold px-5 py-2.5 rounded-xl active:scale-95 transition-transform shadow-lg shadow-accent/20"
              >
                {t("buyNow")} · {product.priceSuffix ? `${isFa ? "از" : "from"} ` : ""}{priceText}
              </button>

              {/* Dots integrated into the slide */}
              {total > 1 && (
                <div className="flex items-center gap-1.5">
                  {products.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-5 h-1.5 bg-accent"
                          : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const isFa = lang === "fa";
  const total = products.length;

  // Infinite loop: [last, ...products, first]
  const slides = total > 1 ? [products[total - 1], ...products, products[0]] : products;
  const [index, setIndex] = useState(total > 1 ? 1 : 0);
  const [animated, setAnimated] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const mouseStartX = useRef(0);
  const isMouseDown = useRef(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // current real index for dots
  const current = total > 1 ? (index - 1 + total) % total : index;
  const isJumping = useRef(false);

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isJumping.current) setIndex((prev) => prev + 1);
    }, AUTOPLAY_INTERVAL);
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    resetAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [total, resetAutoplay]);

  // When we land on a clone, instantly jump to the real slide
  useEffect(() => {
    if (total <= 1) return;
    const lastIdx = slides.length - 1;

    if (index === 0 || index === lastIdx) {
      isJumping.current = true;
      const t = setTimeout(() => {
        setAnimated(false);
        setIndex(index === 0 ? total : 1);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setAnimated(true);
            isJumping.current = false;
          })
        );
      }, 520);
      return () => clearTimeout(t);
    }
  }, [index, slides.length, total]);

  function goTo(realIndex: number) {
    setIndex(realIndex + 1);
    resetAutoplay();
  }

  function goNext() { setIndex((prev) => prev + 1); resetAutoplay(); }
  function goPrev() { setIndex((prev) => prev - 1); resetAutoplay(); }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }

  function handleTouchMove(e: React.TouchEvent) {
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  }

  function handleTouchEnd() {
    setIsDragging(false);
    if (dragOffset < -60) goNext();
    else if (dragOffset > 60) goPrev();
    setDragOffset(0);
    resetAutoplay();
  }

  function handleMouseDown(e: React.MouseEvent) {
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
    setIsDragging(true);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isMouseDown.current) return;
    setDragOffset(e.clientX - mouseStartX.current);
  }

  function handleMouseUp() {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    setIsDragging(false);
    if (dragOffset < -60) goNext();
    else if (dragOffset > 60) goPrev();
    setDragOffset(0);
    resetAutoplay();
  }

  if (total === 0) return null;

  return (
    <div className="mb-5">
      {/* Glow border wrapper */}
      <div
        className="relative rounded-2xl p-[2px] overflow-hidden"
        style={{ boxShadow: "0 0 0 1px rgba(232,213,176,0.5), 0 0 20px 4px rgba(232,213,176,0.25)" }}
      >
        {/* Rotating sweep */}
        <div
          className="animate-spin-border z-0"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, transparent 20%, rgba(232,213,176,0.6) 25%, #e8d5b0 40%, #fff8ee 60%, #e8d5b0 80%, rgba(232,213,176,0.4) 95%, transparent 100%)",
          }}
        />
        {/* Slider track */}
        <div
          dir="ltr"
          className="relative z-10 overflow-hidden rounded-[14px] bg-bg-primary select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className={`flex ${isDragging || !animated ? "" : "transition-transform duration-500 ease-in-out"}`}
            style={{ transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))` }}
          >
            {slides.map((product, slideIdx) => {
              const hasImage = !!product.imageUrl;
              const icon = CATEGORY_ICONS[product.category] ?? CATEGORY_ICONS.OTHER;
              const tomanPrice = usdToTomanFormatted(product.price);
              const priceText = isFa && tomanPrice ? `${tomanPrice} تومان` : `$${product.price}`;
              const features = product.features ?? [];

              return (
                <div
                  key={`${product.id}-${slideIdx}`}
                  className={`relative min-w-full min-h-55 flex flex-col justify-between overflow-hidden ${hasImage ? "" : "bg-bg-card"}`}
                >
                  {hasImage && (
                    <>
                      <img
                        src={product.imageUrl!}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/70 to-black/40 z-1" />
                    </>
                  )}

                  <div className="relative z-10 p-5 pb-4 flex flex-col justify-between flex-1" dir={isFa ? "rtl" : "ltr"}>
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

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white leading-tight mb-1.5 line-clamp-2 drop-shadow-lg">
                        {product.title}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed line-clamp-2 mb-3 drop-shadow">
                        {product.description}
                      </p>
                      {features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {features.slice(0, 3).map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-[10px] text-white/80 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                              <Truck size={9} className="text-accent" />
                              <span className="line-clamp-1 max-w-30">{f}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between" dir="ltr">
                      <button
                        onClick={() => onBuy(product)}
                        className="bg-accent text-bg-primary text-xs font-bold px-5 py-2.5 rounded-xl active:scale-95 transition-transform shadow-lg shadow-accent/20"
                        dir={isFa ? "rtl" : "ltr"}
                      >
                        {t("buyNow")} · {product.priceSuffix ? `${isFa ? "از" : "from"} ` : ""}{priceText}
                      </button>

                      {total > 1 && (
                        <div className="flex items-center gap-1.5">
                          {products.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => goTo(i)}
                              className={`rounded-full transition-all duration-300 ${
                                i === current
                                  ? "w-5 h-1.5 bg-accent"
                                  : "w-1.5 h-1.5 bg-white/30"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

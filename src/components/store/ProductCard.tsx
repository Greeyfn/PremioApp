"use client";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import type { ProductWithStock } from "@/types";

interface Props {
  product: ProductWithStock;
  onBuy: () => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  API: "API",
  ACCOUNT: "ACCOUNT",
  LICENSE: "LICENSE",
  EDUCATION: "EDUCATION",
  OTHER: "OTHER",
};

export default function ProductCard({ product, onBuy }: Props) {
  const { lang } = useLanguage();
  const { usdToTomanFormatted } = useCurrency();
  const isFa = lang === "fa";
  const tomanPrice = usdToTomanFormatted(product.price);

  const cat = CATEGORY_LABEL[product.category] ?? product.category;
  const tag = product.tag ?? (isFa ? "اشتراک" : "Subscription");

  return (
    <button
      onClick={onBuy}
      disabled={product.stock === 0}
      className="relative rounded-2xl overflow-hidden flex flex-col text-left w-full active:scale-95 transition-transform disabled:opacity-50 border border-white/10"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      {/* Blurred background image */}
      {product.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={product.imageUrl}
            alt=""
            className="w-full h-full object-cover scale-150 blur-2xl opacity-20"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col w-full">
        {/* Image */}
        <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-contain p-6 drop-shadow-2xl"
            />
          ) : (
            <div className="text-5xl">📦</div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-bold">ناموجود</span>
            </div>
          )}
        </div>

        {/* Glass info panel */}
        <div
          className="p-3 flex flex-col gap-1.5 border-t border-white/10"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/50">
            {cat} · {tag}
          </p>
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
            {product.title}
          </h3>
          <p className="text-accent font-bold text-sm mt-0.5" dir="ltr">
            {isFa && tomanPrice
              ? `${tomanPrice} تومان`
              : `از $${product.price.toLocaleString()}`}
          </p>
        </div>
      </div>
    </button>
  );
}

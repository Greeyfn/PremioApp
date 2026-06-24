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
      className="bg-bg-card border border-border rounded-2xl overflow-hidden flex flex-col text-left w-full active:scale-95 transition-transform disabled:opacity-50"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-bg-elevated flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-5"
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

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-[10px] font-bold text-white/50 flex items-center gap-1">
          🚀 <span>{isFa ? "تحویل فوری" : "Instant Delivery"}</span>
        </p>
        <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-2">
          {product.title}
        </h3>

        {product.packages && product.packages.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {product.packages.map((pkg) => (
              <span
                key={pkg.id}
                className="text-[10px] px-2 py-0.5 rounded-full border border-accent/30 text-accent/80 bg-accent/10"
              >
                {isFa ? pkg.nameFa : pkg.nameEn}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-accent font-bold text-sm mt-0.5" dir="ltr">
            {isFa && tomanPrice
              ? `${tomanPrice} تومان`
              : `از $${product.price.toLocaleString()}`}
          </p>
        )}
      </div>
    </button>
  );
}

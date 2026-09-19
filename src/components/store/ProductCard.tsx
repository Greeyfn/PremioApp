"use client";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import type { ProductWithStock } from "@/types";

interface Props {
  product: ProductWithStock;
  onBuy: () => void;
}

const TYPE_COLOR: Record<string, string> = {
  "آماده":    "text-emerald-400",
  "شخصی":    "text-sky-400",
  "اشتراکی": "text-purple-400",
};

const TYPE_DOT: Record<string, string> = {
  "آماده":    "bg-emerald-400",
  "شخصی":    "bg-sky-400",
  "اشتراکی": "bg-purple-400",
};

const TYPE_LABEL: Record<string, string> = {
  "آماده":    "اکانت آماده",
  "شخصی":    "ایمیل شخصی",
  "اشتراکی": "اشتراکی",
};

export default function ProductCard({ product, onBuy }: Props) {
  const { lang } = useLanguage();
  const { usdToTomanFormatted } = useCurrency();
  const isFa = lang === "fa";
  const tomanPrice = usdToTomanFormatted(product.price);

  const pkgs = product.packages;
  const minPrice = pkgs && pkgs.length > 0 ? Math.min(...pkgs.map((p) => p.price)) : product.price;
  const maxPrice = pkgs && pkgs.length > 0 ? Math.max(...pkgs.map((p) => p.price)) : product.price;
  const hasRange = pkgs && pkgs.length > 1 && minPrice !== maxPrice;

  const minToman = usdToTomanFormatted(minPrice);
  const maxToman = usdToTomanFormatted(maxPrice);

  const priceDisplay = hasRange
    ? isFa && minToman && maxToman
      ? `${minToman} تا ${maxToman} تومان`
      : `$${minPrice} — $${maxPrice}`
    : isFa && tomanPrice
      ? `${tomanPrice} تومان`
      : `$${product.price}`;

  return (
    <button
      onClick={onBuy}
      disabled={product.stock === 0}
      className="bg-bg-card border border-border rounded-2xl overflow-hidden flex flex-col text-start w-full active:scale-95 transition-transform disabled:opacity-50"
    >
      {/* Image — white background */}
      <div className="relative w-full aspect-video bg-white flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-4"
          />
        ) : (
          <div className="text-5xl">📦</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {isFa ? "ناموجود" : "Out of stock"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        {/* Account types */}
        {product.accountTypes && product.accountTypes.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {product.accountTypes.map((type, i) => (
              <span key={type} className={`flex items-center gap-1 text-[10px] font-semibold ${TYPE_COLOR[type] ?? "text-text-muted"}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TYPE_DOT[type] ?? "bg-text-muted"}`} />
                {TYPE_LABEL[type] ?? type}
                {i < product.accountTypes!.length - 1 && (
                  <span className="text-border ms-0.5">·</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-1">
          {product.title}
        </h3>
        {isFa && product.titleFa && (
          <p className="text-[11px] font-medium text-text-secondary leading-snug">
            {product.titleFa}
          </p>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <p className="text-accent font-bold text-xs mt-0.5" dir="ltr">
          {priceDisplay}
        </p>
      </div>
    </button>
  );
}

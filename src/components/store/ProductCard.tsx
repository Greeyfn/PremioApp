"use client";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import type { ProductWithStock } from "@/types";

interface Props {
  product: ProductWithStock;
  onBuy: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  API: "text-orange-400",
  ACCOUNT: "text-blue-400",
  LICENSE: "text-purple-400",
  EDUCATION: "text-green-400",
  OTHER: "text-text-secondary",
};

export default function ProductCard({ product, onBuy }: Props) {
  const { t, lang } = useLanguage();
  const { usdToTomanFormatted } = useCurrency();
  const catColor = CATEGORY_COLORS[product.category] ?? "text-text-secondary";

  const features = product.features ?? [];
  const tomanPrice = usdToTomanFormatted(product.price);
  const isFa = lang === "fa";

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative bg-white h-36 flex items-center justify-center">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-3"
          />
        ) : (
          <div className="text-5xl">📦</div>
        )}
        {product.tag && (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className={`text-[10px] font-bold tracking-wide uppercase ${catColor}`}>
          {product.category}
        </p>
        <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-2">
          {product.title}
        </h3>

        {features.length > 0 ? (
          <ul className="mt-1 space-y-0.5 flex-1">
            {features.slice(0, 3).map((f: string, i: number) => (
              <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1">
                <span className="text-accent mt-0.5">💠</span>
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-text-secondary line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {/* Price + Stock */}
        <div className="flex items-center justify-between mt-2">
          <div>
            {product.priceSuffix && (
              <span className="text-text-muted text-[10px] block">{product.priceSuffix}</span>
            )}
            <span className="text-accent font-bold text-base">
              {isFa && tomanPrice
                ? `${tomanPrice} تومان`
                : `$${product.price.toLocaleString()}`
              }
            </span>
          </div>
          <span className="text-text-muted text-xs">
            {product.stock} {t("left")}
          </span>
        </div>

        <button
          onClick={onBuy}
          disabled={product.stock === 0}
          className="mt-2 w-full bg-accent text-bg-primary text-xs font-bold py-2.5 rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
        >
          {product.stock === 0 ? t("outOfStock") : t("buyNow")}
        </button>
      </div>
    </div>
  );
}

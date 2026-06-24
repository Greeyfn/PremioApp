"use client";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import type { ProductWithStock } from "@/types";

interface Props {
  product: ProductWithStock;
  onBuy: () => void;
}

export default function ProductCard({ product, onBuy }: Props) {
  const { lang } = useLanguage();
  const { usdToTomanFormatted } = useCurrency();
  const isFa = lang === "fa";
  const tomanPrice = usdToTomanFormatted(product.price);

  const priceDisplay = isFa && tomanPrice
    ? `${tomanPrice} تومان`
    : `$${product.price}`;

  return (
    <button
      onClick={onBuy}
      disabled={product.stock === 0}
      className="bg-bg-card border border-border rounded-2xl overflow-hidden flex flex-col text-start w-full active:scale-95 transition-transform disabled:opacity-50"
    >
      {/* Image — white background like reference */}
      <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden">
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
        {/* Category · Tag */}
        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-text-muted">
          {product.category}
          {product.tag ? ` · ${product.tag}` : ""}
        </p>

        {/* Title */}
        <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <p className="text-accent font-black text-base mt-0.5" dir="ltr">
          {product.packages && product.packages.length > 0
            ? `${isFa ? "از " : "from "}${priceDisplay}`
            : priceDisplay}
        </p>
      </div>
    </button>
  );
}

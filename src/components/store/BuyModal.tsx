"use client";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import { useAppStore } from "@/lib/store";
import { useTelegram } from "@/hooks/useTelegram";
import type { ProductWithStock, ProductPackage } from "@/types";

interface Props {
  product: ProductWithStock;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BuyModal({ product, onClose, onSuccess }: Props) {
  const { t, lang } = useLanguage();
  const { haptic } = useTelegram();
  const { usdToTomanFormatted } = useCurrency();
  const balance = useAppStore((s) => s.balance);
  const setBalance = useAppStore((s) => s.setBalance);
  const userId = useAppStore((s) => s.userId);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const [selectedPkg, setSelectedPkg] = useState<ProductPackage | null>(
    product.packages && product.packages.length > 0 ? product.packages[0] : null
  );

  const finalPrice = selectedPkg ? selectedPkg.price : product.price;
  const hasEnough = balance >= finalPrice;
  const isFa = lang === "fa";

  const productToman = usdToTomanFormatted(finalPrice);
  const balanceToman = usdToTomanFormatted(balance);
  const deficitToman = !hasEnough ? usdToTomanFormatted(finalPrice - balance) : null;

  // Format price based on language
  const priceDisplay = isFa && productToman ? `${productToman} تومان` : `$${finalPrice}`;
  const balanceDisplay = isFa && balanceToman ? `${balanceToman} تومان` : `$${balance.toFixed(2)}`;
  const deficitDisplay = !hasEnough
    ? isFa && deficitToman
      ? `${deficitToman} تومان`
      : `$${(finalPrice - balance).toFixed(2)}`
    : "";

  async function handleBuy() {
    if (!userId) { setError("Please open from Telegram"); return; }
    if (!hasEnough) { setError(isFa ? "موجودی کافی نیست. لطفاً حساب خود را شارژ کنید." : "Insufficient balance. Please add funds."); return; }

    setLoading(true);
    setError("");
    try {
      const body: any = { userId, productId: product.id };
      if (selectedPkg) {
        body.packageId = selectedPkg.id;
        body.packageName = isFa ? selectedPkg.nameFa : selectedPkg.nameEn;
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setBalance(balance - finalPrice);
      setSuccess(true);
      haptic.success();
      setTimeout(onSuccess, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      haptic.error();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center backdrop-blur-sm transition-colors duration-300"
      style={{ backgroundColor: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-bg-secondary rounded-t-3xl p-5 pb-8 border-t border-border transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
              <Check size={32} className="text-success" />
            </div>
            <p className="text-lg font-bold text-text-primary">{t("orderConfirmed")}</p>
            <p className="text-sm text-text-secondary text-center">{t("fundsHeld")}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{t("confirmPurchase")}</h2>
              <button onClick={handleClose} className="w-8 h-8 bg-bg-elevated rounded-full flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="bg-bg-card rounded-2xl p-4 mb-4 flex gap-3 items-center border border-border">
              <div className="text-3xl">📦</div>
              <div className="flex-1">
                <p className="font-bold text-sm">{product.title}</p>
                <p className="text-text-secondary text-xs mt-0.5">{product.description}</p>
              </div>
              <p className="text-accent font-bold">{priceDisplay}</p>
            </div>

            {/* Packages Selector */}
            {product.packages && product.packages.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-bold text-text-primary mb-2">
                  {isFa ? "انتخاب پلن:" : "Select Plan:"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {product.packages.map((pkg) => {
                    const isSelected = selectedPkg?.id === pkg.id;
                    const pkgToman = usdToTomanFormatted(pkg.price);
                    const pkgPriceDisplay = isFa && pkgToman ? `${pkgToman} تومان` : `$${pkg.price}`;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm transition-colors ${
                          isSelected
                            ? "border-accent bg-accent/10 text-accent font-bold shadow-sm"
                            : "border-border bg-bg-elevated text-text-secondary hover:border-text-muted"
                        }`}
                      >
                        <span>{isFa ? pkg.nameFa : pkg.nameEn}</span>
                        <span className="text-xs opacity-80 mt-1">{pkgPriceDisplay}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center bg-bg-card rounded-xl p-3 mb-4 border border-border">
              <span className="text-sm text-text-secondary">{t("yourBalance")}</span>
              <span className={`font-bold ${hasEnough ? "text-success" : "text-error"}`}>
                {balanceDisplay}
              </span>
            </div>

            {error && (
              <p className="text-error text-sm text-center mb-3">{error}</p>
            )}

            {!hasEnough && (
              <p className="text-warning text-xs text-center mb-3">
                {isFa
                  ? `${deficitDisplay} دیگه نیاز دارید — اول حساب خود را شارژ کنید.`
                  : `Need ${deficitDisplay} more — add funds first.`
                }
              </p>
            )}

            <button
              onClick={handleBuy}
              disabled={loading || !hasEnough}
              className="w-full bg-accent text-bg-primary font-bold py-3.5 rounded-2xl disabled:opacity-40 transition-opacity active:scale-[0.98]"
            >
              {loading
                ? (isFa ? "در حال پردازش..." : "Processing...")
                : `${t("buyNow")} · ${priceDisplay}`
              }
            </button>
          </>
        )}
      </div>
    </div>
  );
}

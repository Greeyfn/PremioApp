"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import { useAppStore } from "@/lib/store";
import AddFundsModal from "@/components/balance/AddFundsModal";
import type { TransactionWithDetails } from "@/types";

export default function BalancePage() {
  const { t, lang } = useLanguage();
  const { usdToTomanFormatted } = useCurrency();
  const balance = useAppStore((s) => s.balance);
  const hideBalance = useAppStore((s) => s.hideBalance);
  const userId = useAppStore((s) => s.userId);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/transactions?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions ?? []));
  }, [userId]);

  const isFa = lang === "fa";
  const balanceToman = usdToTomanFormatted(balance);
  const [integer, decimal] = (balance.toFixed(2)).split(".");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t("balance")}</h1>

      {/* Balance Card */}
      <div className="bg-bg-card border border-border rounded-3xl p-5 mb-6">
        <p className="text-text-secondary text-sm mb-2">{t("yourBalance")}</p>
        <div className="flex items-baseline gap-0.5 mb-5">
          {hideBalance ? (
            <span className="text-4xl font-bold">***</span>
          ) : isFa && balanceToman ? (
            <>
              <span className="text-4xl font-bold">{balanceToman}</span>
              <span className="text-xl font-bold text-text-secondary mr-1"> تومان</span>
            </>
          ) : (
            <>
              <span className="text-5xl font-bold">${integer}</span>
              <span className="text-2xl font-bold text-text-secondary">.{decimal}</span>
            </>
          )}
        </div>
        <button
          onClick={() => setShowAddFunds(true)}
          className="w-full bg-accent text-bg-primary font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
        >
          {t("addFunds")}
        </button>
      </div>

      {/* Activity */}
      <h2 className="text-lg font-bold mb-3">{t("recentActivity")}</h2>
      {transactions.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-10">{t("noActivity")}</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const txToman = usdToTomanFormatted(Math.abs(tx.amount));
            const isPositive = tx.type === "DEPOSIT" || tx.type === "BONUS";
            const sign = isPositive ? "+" : "-";
            const amountDisplay = isFa && txToman
              ? `${sign}${txToman} تومان`
              : `${sign}$${Math.abs(tx.amount).toFixed(2)}`;

            return (
              <div key={tx.id} className="flex items-center justify-between bg-bg-card border border-border rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium capitalize">{tx.type.toLowerCase()}</p>
                  <p className="text-xs text-text-muted">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold ${isPositive ? "text-success" : "text-error"}`}>
                  {amountDisplay}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showAddFunds && (
        <AddFundsModal
          onClose={() => setShowAddFunds(false)}
          onSuccess={(amount) => {
            setShowAddFunds(false);
          }}
        />
      )}
    </div>
  );
}

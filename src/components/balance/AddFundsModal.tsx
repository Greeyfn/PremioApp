"use client";
import { useState, useRef } from "react";
import { X, Copy, Check, Upload } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppStore } from "@/lib/store";

interface Props {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const PRESET_AMOUNTS = [10, 20, 50, 100];
type Method = "card" | "usdt" | "ton";

export default function AddFundsModal({ onClose, onSuccess }: Props) {
  const { t } = useLanguage();
  const userId = useAppStore((s) => s.userId);
  const [amount, setAmount] = useState(20);
  const [method, setMethod] = useState<Method>("card");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const CARD_NUMBER = process.env.NEXT_PUBLIC_CARD_NUMBER ?? "6037-XXXX-XXXX-XXXX";
  const USDT_WALLET = process.env.NEXT_PUBLIC_USDT_WALLET ?? "TYour...Wallet";
  const TON_WALLET = process.env.NEXT_PUBLIC_TON_WALLET ?? "UQYour...Wallet";

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit() {
    if (!userId) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("amount", amount.toString());
      formData.append("method", method === "card" ? "CARD" : method === "usdt" ? "CRYPTO_USDT" : "CRYPTO_TON");
      if (screenshot) formData.append("screenshot", screenshot);
      if (txHash) formData.append("txHash", txHash);

      const res = await fetch("/api/payments/request", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-bg-secondary rounded-t-3xl border-t border-border max-h-[85vh] overflow-y-auto scrollbar-hide">
        <div className="p-5 pb-8">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <Check size={32} className="text-success" />
              </div>
              <p className="text-lg font-bold">{t("adminConfirm")}</p>
              <button onClick={onClose} className="bg-accent text-bg-primary font-bold px-8 py-3 rounded-2xl">
                OK
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">{t("addFundsTitle")}</h2>
                <button onClick={onClose} className="w-8 h-8 bg-bg-elevated rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>

              {/* Amount selector */}
              <p className="text-sm text-text-secondary mb-2">{t("selectAmount")}</p>
              <div className="grid grid-cols-4 gap-2 mb-5">
                {PRESET_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-colors ${
                      amount === a ? "bg-accent text-bg-primary" : "bg-bg-card border border-border text-text-primary"
                    }`}
                  >
                    ${a}
                  </button>
                ))}
              </div>
              <div className="flex items-center bg-bg-card border border-border rounded-xl px-4 mb-5">
                <span className="text-text-secondary">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 bg-transparent py-3 px-2 text-text-primary outline-none"
                  min={1}
                />
              </div>

              {/* Method selector */}
              <p className="text-sm text-text-secondary mb-2">{t("selectMethod")}</p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {(["card", "usdt", "ton"] as Method[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      method === m ? "bg-accent text-bg-primary" : "bg-bg-card border border-border text-text-primary"
                    }`}
                  >
                    {m === "card" ? "💳 Card" : m === "usdt" ? "🔵 USDT" : "💎 TON"}
                  </button>
                ))}
              </div>

              {/* Card method */}
              {method === "card" && (
                <div className="bg-bg-card border border-border rounded-2xl p-4 mb-4">
                  <p className="text-xs text-text-secondary mb-1">{t("cardNumber")}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-text-primary">{CARD_NUMBER}</p>
                    <button onClick={() => copyText(CARD_NUMBER)} className="text-accent">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Crypto method */}
              {(method === "usdt" || method === "ton") && (
                <div className="bg-bg-card border border-border rounded-2xl p-4 mb-4">
                  <p className="text-xs text-text-secondary mb-1">{t("network")}: {method === "usdt" ? "TRC20 (Tron)" : "TON"}</p>
                  <p className="text-xs text-text-secondary mb-1">{t("walletAddress")}</p>
                  <div className="flex items-start gap-2">
                    <p className="font-mono text-xs text-text-primary break-all flex-1">
                      {method === "usdt" ? USDT_WALLET : TON_WALLET}
                    </p>
                    <button onClick={() => copyText(method === "usdt" ? USDT_WALLET : TON_WALLET)} className="text-accent shrink-0">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Screenshot / tx hash */}
              {method === "card" && (
                <>
                  <p className="text-xs text-text-secondary mb-2">{t("afterTransfer")}</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-2xl py-6 flex flex-col items-center gap-2 mb-4 text-text-muted"
                  >
                    {screenshot ? (
                      <><Check size={20} className="text-success" /><span className="text-xs text-success">{screenshot.name}</span></>
                    ) : (
                      <><Upload size={20} /><span className="text-xs">{t("uploadScreenshot")}</span></>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} />
                </>
              )}

              {(method === "usdt" || method === "ton") && (
                <>
                  <p className="text-xs text-text-secondary mb-2">Transaction Hash (optional)</p>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-primary outline-none mb-4 font-mono"
                  />
                  <p className="text-xs text-text-secondary mb-2">{t("afterTransfer")}</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-2xl py-6 flex flex-col items-center gap-2 mb-4 text-text-muted"
                  >
                    {screenshot ? (
                      <><Check size={20} className="text-success" /><span className="text-xs text-success">{screenshot.name}</span></>
                    ) : (
                      <><Upload size={20} /><span className="text-xs">{t("uploadScreenshot")}</span></>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} />
                </>
              )}

              <p className="text-xs text-text-muted text-center mb-4">{t("adminConfirm")}</p>

              <button
                onClick={handleSubmit}
                disabled={loading || (!screenshot && !txHash)}
                className="w-full bg-accent text-bg-primary font-bold py-3.5 rounded-2xl disabled:opacity-40 transition-opacity"
              >
                {loading ? "Submitting..." : `${t("submit")} · $${amount}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

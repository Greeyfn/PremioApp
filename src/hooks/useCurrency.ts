"use client";
import { useEffect, useState } from "react";

interface CurrencyRate {
  toman: number;  // e.g. 161600
  rate: number;   // e.g. 1616000 (Rial)
  updatedAt: string;
}

/**
 * Hook to fetch and cache the USD→Toman exchange rate on the client side.
 * Fetches from /api/currency which itself caches from alanchand.com.
 * Re-fetches every 5 minutes.
 */
export function useCurrency() {
  const [currencyRate, setCurrencyRate] = useState<CurrencyRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchRate() {
      try {
        const res = await fetch("/api/currency");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (mounted) {
          setCurrencyRate(data);
        }
      } catch (err) {
        console.warn("Failed to fetch currency rate:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRate();

    // Refresh rate every 5 minutes
    const interval = setInterval(fetchRate, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  /**
   * Convert USD to Toman
   */
  function toToman(usdAmount: number): number | null {
    if (!currencyRate) return null;
    return Math.round(usdAmount * currencyRate.toman);
  }

  /**
   * Format a Toman value with commas (Persian digits)
   */
  function formatToman(toman: number): string {
    return toman.toLocaleString("fa-IR");
  }

  /**
   * Format a Toman value with commas (Latin digits)
   */
  function formatTomanLatin(toman: number): string {
    return toman.toLocaleString("en-US");
  }

  /**
   * Get formatted Toman string from USD amount
   * Returns null if rate isn't loaded yet
   */
  function usdToTomanFormatted(usdAmount: number, usePersianDigits = false): string | null {
    const toman = toToman(usdAmount);
    if (toman === null) return null;
    return usePersianDigits ? formatToman(toman) : formatTomanLatin(toman);
  }

  return {
    currencyRate,
    loading,
    toToman,
    formatToman,
    formatTomanLatin,
    usdToTomanFormatted,
  };
}

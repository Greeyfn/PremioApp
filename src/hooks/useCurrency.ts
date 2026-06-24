"use client";
import { useEffect, useState } from "react";

interface CurrencyRate {
  toman: number;
  rate: number;
  updatedAt: string;
}

// Singleton: shared across all hook instances
let cachedRate: CurrencyRate | null = null;
let fetchPromise: Promise<void> | null = null;
let lastFetchTime = 0;
const CACHE_MS = 5 * 60 * 1000;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

async function fetchRate() {
  const now = Date.now();
  if (cachedRate && now - lastFetchTime < CACHE_MS) return;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/currency")
    .then((r) => r.json())
    .then((data) => {
      cachedRate = data;
      lastFetchTime = Date.now();
      notify();
    })
    .catch(() => {})
    .finally(() => { fetchPromise = null; });

  return fetchPromise;
}

export function useCurrency() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    fetchRate();

    const interval = setInterval(fetchRate, CACHE_MS);
    return () => {
      listeners.delete(listener);
      clearInterval(interval);
    };
  }, []);

  function toToman(usdAmount: number): number | null {
    if (!cachedRate) return null;
    return Math.round(usdAmount * cachedRate.toman);
  }

  function usdToTomanFormatted(usdAmount: number, usePersianDigits = false): string | null {
    const toman = toToman(usdAmount);
    if (toman === null) return null;
    return usePersianDigits
      ? toman.toLocaleString("fa-IR")
      : toman.toLocaleString("en-US");
  }

  return {
    currencyRate: cachedRate,
    loading: !cachedRate,
    toToman,
    usdToTomanFormatted,
  };
}

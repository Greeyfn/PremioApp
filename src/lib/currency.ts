// Currency conversion utility — fetches live USD→IRR rate from alanchand.com API
// Caches the rate for 5 minutes to avoid excessive API calls

const ALANCHAND_TOKEN = "45lxYk0L98YRsz1Q5weB";
const ALANCHAND_URL = `https://api.alanchand.com/?type=currencies&token=${ALANCHAND_TOKEN}`;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface CurrencyCache {
  rate: number; // USD sell price in Rials (e.g. 1616000)
  toman: number; // USD sell price in Toman (e.g. 161600)
  updatedAt: string;
  fetchedAt: number;
}

let cache: CurrencyCache | null = null;

export async function getUsdRate(): Promise<CurrencyCache> {
  // Return cached rate if still fresh
  if (cache && Date.now() - cache.fetchedAt < CACHE_DURATION_MS) {
    return cache;
  }

  try {
    const res = await fetch(ALANCHAND_URL, { next: { revalidate: 300 } });
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    const usd = data.usd;

    if (!usd || !usd.sell) {
      throw new Error("Invalid API response: missing usd.sell");
    }

    // alanchand returns price in Toman (e.g. 161600)
    // Rial = Toman * 10
    cache = {
      toman: usd.sell,
      rate: usd.sell * 10,
      updatedAt: usd.updated_at,
      fetchedAt: Date.now(),
    };

    return cache;
  } catch (error) {
    // If we have a stale cache, use it as fallback
    if (cache) {
      console.warn("Failed to fetch fresh rate, using stale cache:", error);
      return cache;
    }

    // Hardcoded fallback if no cache and API fails
    console.error("Currency API failed with no cache:", error);
    return {
      toman: 160000,
      rate: 1600000,
      updatedAt: new Date().toISOString(),
      fetchedAt: Date.now(),
    };
  }
}

/**
 * Convert USD amount to Toman
 */
export function usdToToman(usdAmount: number, tomanRate: number): number {
  return Math.round(usdAmount * tomanRate);
}

/**
 * Format a Toman amount with Persian-style separators
 * e.g. 1616000 → "1,616,000"
 */
export function formatToman(toman: number): string {
  return toman.toLocaleString("fa-IR");
}

/**
 * Format a Toman amount with Latin digits and separators
 * e.g. 1616000 → "1,616,000"
 */
export function formatTomanLatin(toman: number): string {
  return toman.toLocaleString("en-US");
}

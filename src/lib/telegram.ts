import crypto from "crypto";

export function validateTelegramWebAppData(initData: string): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  if (!hash) return false;

  urlParams.delete("hash");

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(token)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return calculatedHash === hash;
}

export function parseTelegramInitData(initData: string) {
  const urlParams = new URLSearchParams(initData);
  const userStr = urlParams.get("user");
  if (!userStr) return null;

  try {
    return JSON.parse(decodeURIComponent(userStr));
  } catch {
    return null;
  }
}

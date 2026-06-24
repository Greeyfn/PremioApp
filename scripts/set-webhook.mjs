import { config } from "dotenv";
config({ path: ".env.local" });

const token = process.env.TELEGRAM_BOT_TOKEN;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!token || !appUrl) {
  console.error("Missing TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_APP_URL");
  process.exit(1);
}

const webhookUrl = `${appUrl}/api/bot`;
const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: webhookUrl, allowed_updates: ["message", "callback_query"] }),
});
const data = await res.json();
console.log("Webhook set:", data);

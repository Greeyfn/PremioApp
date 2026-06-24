import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import { prisma } from "./prisma";

const token = process.env.TELEGRAM_BOT_TOKEN ?? "";
const botUsername = process.env.TELEGRAM_BOT_USERNAME ?? "PremioShopBot";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const bot = new Bot(token);

bot.command("start", async (ctx) => {
  const startParam = ctx.match;
  const user = ctx.from;
  if (!user) return;

  // Handle referral
  if (startParam) {
    await handleReferral(user.id, startParam);
  }

  const keyboard = new InlineKeyboard().webApp(
    "🛒 Open PremioShop",
    appUrl
  );

  await ctx.reply(
    `👋 Welcome to *PremioShop*!\n\nYour marketplace for digital products — accounts, API keys, licenses and more.\n\n✅ Funds held until you confirm delivery\n💳 Multiple payment methods\n🔒 Secure & instant`,
    {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    }
  );
});

bot.command("balance", async (ctx) => {
  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(ctx.from!.id) },
  });
  if (!user) return ctx.reply("Please open the shop first: /start");
  await ctx.reply(`💰 Your balance: *$${user.balance.toFixed(2)}*`, { parse_mode: "Markdown" });
});

bot.command("orders", async (ctx) => {
  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(ctx.from!.id) },
  });
  if (!user) return ctx.reply("Please open the shop first: /start");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (!orders.length) return ctx.reply("You have no orders yet.");

  const lines = orders.map((o) =>
    `• ${o.product.title} — $${o.price} [${o.status}]`
  ).join("\n");

  await ctx.reply(`📦 Your last ${orders.length} orders:\n\n${lines}`);
});

// Handle admin callback queries (approve/reject payments)
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",");

  if (!adminIds.includes(String(ctx.from.id))) {
    return ctx.answerCallbackQuery("Unauthorized");
  }

  if (data.startsWith("approve_payment_") || data.startsWith("reject_payment_")) {
    const action = data.startsWith("approve_") ? "approve" : "reject";
    const paymentId = data.replace(`${action}_payment_`, "");

    try {
      const res = await fetch(`${appUrl}/api/payments/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": String(ctx.from.id),
        },
        body: JSON.stringify({ paymentId, action }),
      });

      if (res.ok) {
        await ctx.answerCallbackQuery(action === "approve" ? "✅ Approved!" : "❌ Rejected");
        await ctx.editMessageText(
          ctx.callbackQuery.message?.text + `\n\n${action === "approve" ? "✅ APPROVED" : "❌ REJECTED"} by admin`
        );
      } else {
        await ctx.answerCallbackQuery("Error processing");
      }
    } catch {
      await ctx.answerCallbackQuery("Error");
    }
  }

  if (data.startsWith("deliver_order_")) {
    const orderId = data.replace("deliver_order_", "");
    await ctx.reply(`Send delivery content for order ${orderId}:`);
    // TODO: implement conversation flow for manual delivery
  }
});

async function handleReferral(newUserId: number, referralCode: string) {
  const referrer = await prisma.user.findUnique({ where: { referralCode } });
  if (!referrer) return;

  const existing = await prisma.user.findUnique({ where: { telegramId: BigInt(newUserId) } });
  if (existing?.referredBy) return; // Already has referral

  if (existing) {
    await prisma.user.update({
      where: { telegramId: BigInt(newUserId) },
      data: { referredBy: referrer.id },
    });
  }
}

export const handleWebhook = webhookCallback(bot, "std/http");

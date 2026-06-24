import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
    const txHash = (formData.get("txHash") as string) || null;
    const screenshot = formData.get("screenshot") as File | null;

    if (!userId || !amount || !method) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let screenshotUrl: string | null = null;

    if (screenshot) {
      const filename = `screenshots/${Date.now()}-${screenshot.name.replace(/[^a-z0-9.]/gi, "_")}`;
      const blob = await put(filename, screenshot, { access: "public" });
      screenshotUrl = blob.url;
    }

    const paymentReq = await prisma.paymentRequest.create({
      data: {
        userId,
        method: method as "CARD" | "CRYPTO_USDT" | "CRYPTO_TON" | "BALANCE",
        amount,
        screenshotUrl,
        txHash,
        status: "PENDING",
      },
    });

    // Notify admin
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const adminIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",").filter(Boolean);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

    if (token && adminIds.length) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const msg = `💰 Payment Request #${paymentReq.id.slice(-6)}\nUser: ${user?.firstName} (@${user?.username})\nAmount: $${amount}\nMethod: ${method}\n${txHash ? `TX: ${txHash}\n` : ""}${screenshotUrl ? `Screenshot: ${screenshotUrl}` : ""}`;

      await Promise.all(
        adminIds.map((id) =>
          fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: id,
              text: msg,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: "✅ Approve", callback_data: `approve_payment_${paymentReq.id}` },
                    { text: "❌ Reject", callback_data: `reject_payment_${paymentReq.id}` },
                  ],
                ],
              },
            }),
          })
        )
      );
    }

    return NextResponse.json({ success: true, id: paymentReq.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

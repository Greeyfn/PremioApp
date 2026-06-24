import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",");
  const authHeader = req.headers.get("x-admin-id");
  if (!authHeader || !adminIds.includes(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paymentId, action, note } = await req.json();
  if (!paymentId || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const payment = await prisma.paymentRequest.findUnique({ where: { id: paymentId } });
  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (payment.status !== "PENDING") {
    return NextResponse.json({ error: "Already processed" }, { status: 400 });
  }

  if (action === "approve") {
    await prisma.$transaction(async (tx) => {
      await tx.paymentRequest.update({
        where: { id: paymentId },
        data: { status: "APPROVED", reviewedAt: new Date(), reviewedBy: authHeader, adminNote: note },
      });
      await tx.user.update({
        where: { id: payment.userId },
        data: { balance: { increment: payment.amount } },
      });
      await tx.transaction.create({
        data: {
          userId: payment.userId,
          type: "DEPOSIT",
          status: "COMPLETED",
          amount: payment.amount,
          note: `Payment via ${payment.method}`,
        },
      });
    });

    // Notify user via bot
    const user = await prisma.user.findUnique({ where: { id: payment.userId } });
    if (user) {
      notifyUser(user.telegramId, `✅ Your deposit of $${payment.amount} has been approved! Your balance has been updated.`).catch(() => {});
    }
  } else {
    await prisma.paymentRequest.update({
      where: { id: paymentId },
      data: { status: "REJECTED", reviewedAt: new Date(), reviewedBy: authHeader, adminNote: note },
    });
    const user = await prisma.user.findUnique({ where: { id: payment.userId } });
    if (user) {
      notifyUser(user.telegramId, `❌ Your deposit request of $${payment.amount} was rejected.${note ? ` Reason: ${note}` : ""}`).catch(() => {});
    }
  }

  return NextResponse.json({ success: true });
}

async function notifyUser(telegramId: bigint, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: telegramId.toString(), text }),
  });
}

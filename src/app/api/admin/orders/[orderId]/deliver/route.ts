import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",");
  const authHeader = req.headers.get("x-admin-id");
  if (!authHeader || !adminIds.includes(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, product: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED", deliveryContent: content },
  });

  // Notify user
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (token && order.user.telegramId) {
    const msg = `✅ Your order for *${order.product.title}* has been delivered!\n\n\`\`\`\n${content}\n\`\`\`\n\nOpen the shop to view your order.`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: order.user.telegramId.toString(),
        text: msg,
        parse_mode: "Markdown",
      }),
    });
  }

  return NextResponse.json({ success: true });
}

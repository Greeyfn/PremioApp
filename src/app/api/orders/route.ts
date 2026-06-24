import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { product: { select: { title: true, imageUrl: true, category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      productId: o.productId,
      product: o.product,
      quantity: o.quantity,
      price: o.price,
      status: o.status,
      deliveryContent: o.deliveryContent,
      createdAt: o.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) {
      return NextResponse.json({ error: "userId and productId required" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { items: { where: { isUsed: false }, take: 1 } },
      });
      if (!product || !product.isActive) throw new Error("Product not available");
      if (user.balance < product.price) throw new Error("Insufficient balance");
      if (product.stock < 1) throw new Error("Out of stock");

      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          productId,
          price: product.price,
          status: "PENDING",
        },
      });

      // Deduct balance
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: product.price } },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          orderId: order.id,
          type: "PURCHASE",
          status: "COMPLETED",
          amount: product.price,
          note: product.title,
        },
      });

      // Auto-deliver if item available
      if (product.items.length > 0) {
        const item = product.items[0];
        await tx.productItem.update({
          where: { id: item.id },
          data: { isUsed: true, usedAt: new Date(), orderId: order.id },
        });
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: 1 } },
        });
        await tx.order.update({
          where: { id: order.id },
          data: { status: "COMPLETED", deliveryContent: item.content },
        });

        // Notify admin via bot
        notifyAdmin(`🛒 New order #${order.id.slice(-6)}\nUser: ${user.firstName}\nProduct: ${product.title}\nDelivered: ✅`).catch(() => {});

        return { ...order, status: "COMPLETED", deliveryContent: item.content };
      }

      // Manual delivery needed
      notifyAdmin(`🛒 New order #${order.id.slice(-6)}\nUser: ${user.firstName}\nProduct: ${product.title}\n⚠️ Manual delivery needed`).catch(() => {});

      return order;
    });

    return NextResponse.json({ order: result }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

async function notifyAdmin(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",").filter(Boolean);
  if (!token || !adminIds.length) return;

  await Promise.all(
    adminIds.map((id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: id, text }),
      })
    )
  );
}

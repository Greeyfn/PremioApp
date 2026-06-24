import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    transactions: transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      status: tx.status,
      amount: tx.amount,
      note: tx.note,
      createdAt: tx.createdAt.toISOString(),
    })),
  });
}

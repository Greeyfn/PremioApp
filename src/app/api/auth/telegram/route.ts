import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTelegramWebAppData, parseTelegramInitData } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    if (!initData) return NextResponse.json({ error: "No initData" }, { status: 400 });

    // In dev allow bypass
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev && !validateTelegramWebAppData(initData)) {
      return NextResponse.json({ error: "Invalid initData" }, { status: 401 });
    }

    const tgUser = parseTelegramInitData(initData);
    if (!tgUser) return NextResponse.json({ error: "No user in initData" }, { status: 400 });

    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(tgUser.id) },
      update: {
        firstName: tgUser.first_name,
        lastName: tgUser.last_name ?? null,
        username: tgUser.username ?? null,
        photoUrl: tgUser.photo_url ?? null,
      },
      create: {
        telegramId: BigInt(tgUser.id),
        firstName: tgUser.first_name,
        lastName: tgUser.last_name ?? null,
        username: tgUser.username ?? null,
        photoUrl: tgUser.photo_url ?? null,
        language: tgUser.language_code?.slice(0, 2) ?? "en",
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        balance: user.balance,
        language: user.language,
        hideBalance: user.hideBalance,
        pushNotify: user.pushNotify,
        referralCode: user.referralCode,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

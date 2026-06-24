import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { packages: true },
  });

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      tag: p.tag,
      price: p.price,
      priceSuffix: p.priceSuffix,
      features: p.features,
      stock: p.stock,
      imageUrl: p.imageUrl,
      isActive: p.isActive,
      packages: p.packages.map((pkg) => ({
        id: pkg.id,
        nameEn: pkg.nameEn,
        nameFa: pkg.nameFa,
        price: pkg.price,
      })),
    })),
  });
}

export async function POST(req: NextRequest) {
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",");
  const authHeader = req.headers.get("x-admin-id");
  if (!authHeader || !adminIds.includes(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, category, tag, price, priceSuffix, features, imageUrl, sortOrder } = body;

  const product = await prisma.product.create({
    data: {
      title,
      description,
      category,
      tag,
      price,
      priceSuffix: priceSuffix ?? null,
      features: features ?? [],
      imageUrl,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Sample product: ChatGPT Plus
  await prisma.product.upsert({
    where: { id: "seed-chatgpt-plus" },
    update: {},
    create: {
      id: "seed-chatgpt-plus",
      title: "❤️ ChatGPT Plus روی ایمیل شخصی خودتون",
      description: "فعال‌سازی روی اکانت و ایمیل شخصی شما — کاملاً اختصاصی",
      category: "ACCOUNT",
      tag: "ماهانه",
      price: 1880,
      priceSuffix: "ماهانه",
      features: [
        "دسترسی کامل به تمامی مدل‌های GPT",
        "حفظ کامل چت‌ها و اطلاعات حساب",
        "قابل تمدید",
        "سازگار با هر VPN",
        "پشتیبانی کامل",
      ],
      stock: 10,
      imageUrl: null,
      isActive: true,
      sortOrder: 1,
    },
  });

  // Sample product 2: Claude API Key
  await prisma.product.upsert({
    where: { id: "seed-claude-api" },
    update: {},
    create: {
      id: "seed-claude-api",
      title: "Claude API Key — Anthropic",
      description: "Claude API key packages with automatic key rotation",
      category: "API",
      tag: "API",
      price: 10,
      priceSuffix: "from",
      features: [
        "Access to Claude Sonnet & Opus",
        "Auto key rotation",
        "High rate limits",
        "Instant delivery",
      ],
      stock: 10,
      imageUrl: null,
      isActive: true,
      sortOrder: 2,
    },
  });

  // Sample product 3: EDU Email
  await prisma.product.upsert({
    where: { id: "seed-edu-email" },
    update: {},
    create: {
      id: "seed-edu-email",
      title: "EDU Email Account",
      description: "@live.hccc.edu mailbox with full student profile data.",
      category: "EDUCATION",
      tag: "EMAIL",
      price: 10,
      priceSuffix: null,
      features: [
        "Valid .edu email address",
        "Full student profile",
        "GitHub Student pack eligible",
        "Instant delivery",
      ],
      stock: 9,
      imageUrl: null,
      isActive: true,
      sortOrder: 3,
    },
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

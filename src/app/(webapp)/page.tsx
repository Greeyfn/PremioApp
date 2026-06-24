"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import ProductSlider from "@/components/store/ProductSlider";
import BuyModal from "@/components/store/BuyModal";
import { useLanguage } from "@/hooks/useLanguage";
import type { ProductWithStock } from "@/types";

const DEMO_PRODUCTS: ProductWithStock[] = [
  {
    id: "demo-chatgpt",
    title: "❤️ ChatGPT Plus — ایمیل آماده",
    description: "فعال‌سازی فوری روی اکانت اختصاصی و از پیش ساخته شده — دسترسی کامل به قابلیت‌های پلاس",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 20,
    priceSuffix: "ماهانه",
    features: [
      "دسترسی به GPT-4o و پلاگین‌ها",
      "اکانت اختصاصی آماده",
      "تحویل فوری پس از پرداخت",
    ],
    stock: 10,
    imageUrl: "/icons/chatgpt-logo.png",
    isActive: true,
    packages: [
      { id: "gpt-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 20 },
      { id: "gpt-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 200 },
    ],
  },
  {
    id: "demo-spotify",
    title: "Spotify Premium — روی ایمیل شخصی",
    description: "پرمیوم‌سازی کاملاً قانونی و بدون قطعی اکانت اسپاتیفای روی ایمیل اختصاصی خود شما",
    category: "ACCOUNT",
    tag: "۳ ماهه",
    price: 15,
    priceSuffix: "۳ ماهه",
    features: [
      "بدون قطعی (کاملاً قانونی)",
      "روی ایمیل شخصی شما",
      "حفظ پلی‌لیست‌ها و آهنگ‌ها",
    ],
    stock: 20,
    imageUrl: "/icons/spotify-logo.svg",
    isActive: true,
    packages: [
      { id: "spot-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 6 },
      { id: "spot-3m", nameEn: "3 Months", nameFa: "۳ ماهه", price: 15 },
      { id: "spot-6m", nameEn: "6 Months", nameFa: "۶ ماهه", price: 28 },
      { id: "spot-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 50 },
    ],
  },
  {
    id: "demo-claude",
    title: "Claude Pro — روی ایمیل شخصی",
    description: "فعال‌سازی اشتراک پرو روی اکانت اصلی شما برای استفاده از قدرتمندترین مدل Anthropic",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 22,
    priceSuffix: "ماهانه",
    features: [
      "دسترسی به Claude 3.5 Sonnet",
      "فعال‌سازی امن روی ایمیل شما",
      "بدون ریسک بن شدن",
    ],
    stock: 5,
    imageUrl: "/icons/claude-logo.svg",
    isActive: true,
    packages: [
      { id: "claude-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 22 },
      { id: "claude-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 240 },
    ],
  },
  {
    id: "demo-capcut",
    title: "CapCut Pro — اکانت آماده",
    description: "دسترسی به تمامی افکت‌ها، فیلترها و قابلیت‌های پرمیوم کپ‌کات برای ادیت حرفه‌ای",
    category: "ACCOUNT",
    tag: "سالانه",
    price: 12,
    priceSuffix: "سالانه",
    features: [
      "باز شدن تمامی افکت‌های پولی",
      "خروجی باکیفیت و بدون واترمارک",
      "قابل استفاده روی موبایل و PC",
    ],
    stock: 8,
    imageUrl: "/icons/capcut-logo.svg",
    isActive: true,
    packages: [
      { id: "capcut-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 2 },
      { id: "capcut-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 12 },
    ],
  },
  {
    id: "demo-gemini",
    title: "Google Gemini Advanced",
    description: "دسترسی به هوش مصنوعی قدرتمند گوگل (مدل Advanced) با پشتیبانی عالی از زبان فارسی",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 18,
    priceSuffix: "ماهانه",
    features: [
      "مدل Gemini 1.5 Pro",
      "ادغام با Google Docs و Gmail",
      "پاسخ‌دهی سریع و دقیق به فارسی",
    ],
    stock: 15,
    imageUrl: "/icons/gemini-logo.svg",
    isActive: true,
    packages: [
      { id: "gemini-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 18 },
      { id: "gemini-6m", nameEn: "6 Months", nameFa: "۶ ماهه", price: 90 },
      { id: "gemini-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 170 },
    ],
  },
];

export default function StorePage() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const list = data.products ?? [];
        setProducts(list.length > 0 ? list : DEMO_PRODUCTS);
      })
      .catch(() => setProducts(DEMO_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-3">
      {/* Hero Slider */}
      {!loading && products.length > 0 && (
        <ProductSlider
          products={products}
          onBuy={(product) => setSelectedProduct(product)}
        />
      )}

      {/* Section Title */}
      <h2 className="text-xl font-bold text-center mb-4 text-text-primary italic">
        {t("allProducts")}
      </h2>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-text-muted" />
        </div>
        <input
          type="text"
          placeholder={lang === "fa" ? "جستجوی محصولات..." : "Search products..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl leading-5 bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm transition-all shadow-sm"
        />
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bg-card rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={() => setSelectedProduct(product)}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-text-muted text-sm">
              {lang === "fa" ? "محصولی پیدا نشد." : "No products found."}
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <BuyModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

"use client";
import { useEffect, useState, useRef } from "react";
import { Search, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import ProductSlider from "@/components/store/ProductSlider";
import BuyModal from "@/components/store/BuyModal";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
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
    features: ["مدل Gemini 1.5 Pro", "ادغام با Google Docs و Gmail", "پاسخ‌دهی سریع به فارسی"],
    stock: 15,
    imageUrl: "/icons/gemini-logo.svg",
    isActive: true,
    packages: [
      { id: "gemini-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 18 },
      { id: "gemini-6m", nameEn: "6 Months", nameFa: "۶ ماهه", price: 90 },
      { id: "gemini-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 170 },
    ],
  },
  {
    id: "demo-disney",
    title: "Disney Plus — اکانت آماده",
    description: "دسترسی به تمامی محتوای Disney+، Marvel، Star Wars، Pixar و National Geographic",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 8,
    priceSuffix: "ماهانه",
    features: ["کیفیت 4K + HDR", "محتوای انحصاری Marvel و Star Wars", "تحویل فوری"],
    stock: 12,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    isActive: true,
    packages: [
      { id: "disney-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 8 },
      { id: "disney-3m", nameEn: "3 Months", nameFa: "۳ ماهه", price: 22 },
      { id: "disney-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 80 },
    ],
  },
  {
    id: "demo-psplus",
    title: "PlayStation Plus — اشتراک",
    description: "اشتراک PS Plus برای بازی آنلاین، بازی‌های رایگان ماهانه و تخفیف‌های انحصاری PS Store",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 10,
    priceSuffix: "ماهانه",
    features: ["بازی آنلاین PS5 و PS4", "بازی‌های رایگان هر ماه", "تخفیف PS Store"],
    stock: 8,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",
    isActive: true,
    packages: [
      { id: "ps-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 10 },
      { id: "ps-3m", nameEn: "3 Months", nameFa: "۳ ماهه", price: 25 },
      { id: "ps-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 80 },
    ],
  },
  {
    id: "demo-gamepass",
    title: "Xbox Game Pass Ultimate",
    description: "دسترسی به بیش از ۱۰۰ بازی AAA روی Xbox و PC + اشتراک Xbox Live Gold",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 15,
    priceSuffix: "ماهانه",
    features: ["+۱۰۰ بازی AAA روی Xbox و PC", "شامل Xbox Live Gold", "بازی‌های Day One"],
    stock: 6,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg",
    isActive: true,
    packages: [
      { id: "gp-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 15 },
      { id: "gp-3m", nameEn: "3 Months", nameFa: "۳ ماهه", price: 40 },
      { id: "gp-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 140 },
    ],
  },
  {
    id: "demo-midjourney",
    title: "Midjourney — اشتراک Basic",
    description: "تولید تصویر با هوش مصنوعی Midjourney — خلاقانه‌ترین ابزار تصویرسازی AI در جهان",
    category: "API",
    tag: "ماهانه",
    price: 10,
    priceSuffix: "ماهانه",
    features: ["۲۰۰ تصویر در ماه", "کیفیت Ultra HD", "دسترسی به مدل V6"],
    stock: 20,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
    isActive: true,
    packages: [
      { id: "mj-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 10 },
      { id: "mj-3m", nameEn: "3 Months", nameFa: "۳ ماهه", price: 27 },
      { id: "mj-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 96 },
    ],
  },
  {
    id: "demo-canva",
    title: "Canva Pro — اکانت آماده",
    description: "دسترسی کامل به تمپلیت‌های پرمیوم، حذف پس‌زمینه نامحدود و ابزارهای طراحی حرفه‌ای",
    category: "ACCOUNT",
    tag: "سالانه",
    price: 13,
    priceSuffix: "سالانه",
    features: ["تمپلیت‌های پرمیوم نامحدود", "حذف پس‌زمینه AI", "۱TB فضای ذخیره‌سازی"],
    stock: 15,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    isActive: true,
    packages: [
      { id: "canva-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 2 },
      { id: "canva-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 13 },
    ],
  },
  {
    id: "demo-netflix",
    title: "Netflix Premium — اشتراک",
    description: "اشتراک Netflix پلن پرمیوم با کیفیت 4K و امکان استفاده همزمان روی ۴ دستگاه",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 16,
    priceSuffix: "ماهانه",
    features: ["کیفیت 4K Ultra HD", "۴ دستگاه همزمان", "دانلود آفلاین"],
    stock: 18,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    isActive: true,
    packages: [
      { id: "nf-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 16 },
      { id: "nf-3m", nameEn: "3 Months", nameFa: "۳ ماهه", price: 44 },
      { id: "nf-6m", nameEn: "6 Months", nameFa: "۶ ماهه", price: 80 },
      { id: "nf-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 150 },
    ],
  },
  {
    id: "demo-perplexity",
    title: "Perplexity Pro — اشتراک",
    description: "موتور جستجوی هوش مصنوعی Perplexity با دسترسی به مدل‌های GPT-4 و Claude",
    category: "API",
    tag: "ماهانه",
    price: 20,
    priceSuffix: "ماهانه",
    features: ["جستجوی AI نامحدود", "دسترسی به GPT-4 و Claude", "منابع معتبر و آپدیت"],
    stock: 10,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg",
    isActive: true,
    packages: [
      { id: "ppx-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 20 },
      { id: "ppx-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 200 },
    ],
  },
  {
    id: "demo-adobe",
    title: "Adobe Creative Cloud",
    description: "دسترسی به تمامی اپ‌های Adobe: Photoshop، Illustrator، Premiere Pro و بیشتر",
    category: "LICENSE",
    tag: "ماهانه",
    price: 55,
    priceSuffix: "ماهانه",
    features: ["تمام اپ‌های Adobe", "۱۰۰GB فضای ابری", "فونت‌های Adobe Fonts"],
    stock: 5,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
    isActive: true,
    packages: [
      { id: "adobe-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 55 },
      { id: "adobe-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 600 },
    ],
  },
  {
    id: "demo-notion",
    title: "Notion AI Plus — اکانت",
    description: "نوشن پلاس با هوش مصنوعی برای مدیریت پروژه، یادداشت‌برداری و تیم‌ورک حرفه‌ای",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 16,
    priceSuffix: "ماهانه",
    features: ["AI نویسنده و خلاصه‌ساز", "صفحات نامحدود", "همکاری تیمی"],
    stock: 14,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    isActive: true,
    packages: [
      { id: "notion-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 16 },
      { id: "notion-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 160 },
    ],
  },
];

const CATEGORIES = [
  { id: "all",       fa: "همه",         en: "All"        },
  { id: "ai",        fa: "هوش مصنوعی",  en: "AI"         },
  { id: "music",     fa: "موسیقی",      en: "Music"      },
  { id: "gaming",    fa: "گیمینگ",      en: "Gaming"     },
  { id: "streaming", fa: "استریمینگ",   en: "Streaming"  },
  { id: "design",    fa: "طراحی",       en: "Design"     },
  { id: "software",  fa: "نرم‌افزار",   en: "Software"   },
];

const CATEGORY_PRODUCT_MAP: Record<string, string[]> = {
  ai:        ["demo-chatgpt", "demo-claude", "demo-gemini", "demo-midjourney", "demo-perplexity", "demo-notion"],
  music:     ["demo-spotify"],
  gaming:    ["demo-psplus", "demo-gamepass"],
  streaming: ["demo-netflix", "demo-disney"],
  design:    ["demo-canva", "demo-capcut", "demo-adobe"],
  software:  ["demo-adobe", "demo-notion", "demo-canva"],
};

export default function StorePage() {
  const { t, lang } = useLanguage();
  const { usdToTomanFormatted } = useCurrency();
  const isFa = lang === "fa";
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollThumb, setScrollThumb] = useState({ left: 0, width: 100 });

  const isFaRef = useRef(false);
  useEffect(() => { isFaRef.current = lang === "fa"; }, [lang]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const { scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) { setScrollThumb({ left: 0, width: 100 }); return; }
      const ratio = clientWidth / scrollWidth;
      const thumbW = Math.max(ratio * 100, 15);
      let progress: number;
      if (isFaRef.current) {
        if (el.scrollLeft <= 0) {
          // Chrome RTL: 0 at start, negative at end
          progress = Math.abs(el.scrollLeft) / maxScroll;
        } else {
          // iOS/Firefox RTL: maxScroll at start, 0 at end
          progress = 1 - (el.scrollLeft / maxScroll);
        }
        setScrollThumb({ left: (100 - thumbW) * (1 - progress), width: thumbW });
      } else {
        progress = el.scrollLeft / maxScroll;
        setScrollThumb({ left: progress * (100 - thumbW), width: thumbW });
      }
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

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
    const matchesSearch = p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "all" || (CATEGORY_PRODUCT_MAP[activeCategory]?.includes(p.id) ?? false);
    return matchesSearch && matchesCategory;
  });

  function handleCategoryChange(id: string) {
    setProgressKey((k) => k + 1);
    setCategoryLoading(true);
    setTimeout(() => {
      setActiveCategory(id);
      setCategoryLoading(false);
    }, 400);
  }

  return (
    <div className="p-3">
      {/* Hero Slider */}
      {!loading && products.length > 0 && (
        <ProductSlider
          products={products}
          onBuy={(product) => setSelectedProduct(product)}
        />
      )}



      {/* Search Bar */}
      <div className="relative mb-3">
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

      {/* Category Filter */}
      <div className="relative mb-4">
        {/* Progress bar */}
        {categoryLoading && (
          <div className="absolute -top-1 left-0 h-0.5 bg-accent rounded-full animate-progress-bar z-10" key={progressKey} />
        )}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-2 cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitOverflowScrolling: "touch", paddingInlineEnd: "32px" }}
          onMouseDown={(e) => {
            const el = e.currentTarget;
            const startX = e.pageX - el.offsetLeft;
            const scrollLeft = el.scrollLeft;
            const onMove = (ev: MouseEvent) => {
              el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX);
            };
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? "bg-accent text-bg-primary border-accent shadow-md"
                    : "bg-bg-card border-border text-text-secondary"
                }`}
              >
                {lang === "fa" ? cat.fa : cat.en}
              </button>
            );
          })}
        </div>
        {/* Fade indicating more items */}
        <div className="absolute top-0 end-0 h-full w-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--color-bg-primary) 30%, transparent)" }} />
        {/* Scroll indicator */}
        {scrollThumb.width < 99 && (
          <div className="relative h-0.5 bg-border rounded-full mt-2 mx-1">
            <div
              className="absolute top-0 h-full bg-accent rounded-full transition-all duration-150"
              style={{ left: `${scrollThumb.left}%`, width: `${scrollThumb.width}%` }}
            />
          </div>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bg-card rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : activeCategory === "all" ? (
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
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="flex items-center gap-2.5 bg-bg-card border border-border rounded-2xl p-2.5 active:scale-[0.98] transition-transform w-full text-start"
              >
                {/* Image */}
                <div className="w-14 h-14 shrink-0 rounded-xl bg-bg-elevated flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-xl">📦</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <p className="text-[8px] font-semibold tracking-[0.1em] uppercase text-text-muted">
                    {product.category}{product.tag ? ` · ${product.tag}` : ""}
                  </p>
                  <h3 className="text-xs font-bold text-text-primary leading-snug line-clamp-2">
                    {product.title}
                  </h3>
                  {product.description && (
                    <p className="text-[9px] text-text-muted leading-snug line-clamp-1">
                      {product.description}
                    </p>
                  )}
                  {/* Price + Buy */}
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    {isFa ? (
                      <div dir="ltr" className="flex items-baseline gap-0.5 min-w-0">
                        <span className="text-xs font-bold text-accent truncate">
                          {usdToTomanFormatted(product.price)}
                        </span>
                        <span className="text-[9px] text-text-muted shrink-0">ت</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-accent" dir="ltr">
                        ${product.price}
                      </span>
                    )}
                    <div className="shrink-0 flex items-center gap-1 bg-accent text-bg-primary text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      <ShoppingBag size={10} strokeWidth={2.5} />
                      <span>{isFa ? "خرید" : "Buy"}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-10 text-text-muted text-sm">
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

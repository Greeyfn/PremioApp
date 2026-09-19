"use client";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
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
    title: "ChatGPT Plus",
    titleFa: "چت‌جی‌پی‌تی پلاس",
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
    accountTypes: ["آماده"],
    packages: [
      { id: "gpt-1m", nameEn: "1M", nameFa: "۱ ماهه", price: 20 },
      { id: "gpt-2m", nameEn: "2M", nameFa: "۲ ماهه", price: 38 },
      { id: "gpt-3m", nameEn: "3M", nameFa: "۳ ماهه", price: 55 },
      { id: "gpt-6m", nameEn: "6M", nameFa: "۶ ماهه", price: 100 },
      { id: "gpt-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 180 },
    ],
  },
  {
    id: "demo-spotify",
    title: "Spotify Premium",
    titleFa: "اسپاتیفای پرمیوم",
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
    accountTypes: ["شخصی"],
    packages: [
      { id: "spot-1m", nameEn: "1M", nameFa: "۱ ماهه", price: 6 },
      { id: "spot-3m", nameEn: "3M", nameFa: "۳ ماهه", price: 15 },
      { id: "spot-6m", nameEn: "6M", nameFa: "۶ ماهه", price: 28 },
      { id: "spot-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 50 },
    ],
  },
  {
    id: "demo-claude",
    title: "Claude Pro",
    titleFa: "کلود پرو",
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
    accountTypes: ["شخصی"],
    packages: [
      { id: "claude-1m", nameEn: "1M", nameFa: "۱ ماهه", price: 22 },
      { id: "claude-3m", nameEn: "3M", nameFa: "۳ ماهه", price: 60 },
      { id: "claude-6m", nameEn: "6M", nameFa: "۶ ماهه", price: 110 },
      { id: "claude-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 200 },
    ],
  },
  {
    id: "demo-capcut",
    title: "CapCut Pro",
    titleFa: "کپ‌کات پرو",
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
    accountTypes: ["آماده"],
    packages: [
      { id: "capcut-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 12 },
    ],
  },
  {
    id: "demo-gemini",
    title: "Gemini Advanced",
    titleFa: "جمینای ادونسد",
    description: "دسترسی به هوش مصنوعی قدرتمند گوگل (مدل Advanced) با پشتیبانی عالی از زبان فارسی",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 18,
    priceSuffix: "ماهانه",
    features: ["مدل Gemini 1.5 Pro", "ادغام با Google Docs و Gmail", "پاسخ‌دهی سریع به فارسی"],
    stock: 15,
    imageUrl: "/icons/gemini-logo.svg",
    isActive: true,
    accountTypes: ["آماده", "شخصی"],
    packages: [
      { id: "gemini-1m", nameEn: "1M", nameFa: "۱ ماهه", price: 18 },
      { id: "gemini-6m", nameEn: "6M", nameFa: "۶ ماهه", price: 90 },
      { id: "gemini-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 170 },
    ],
  },
  {
    id: "demo-disney",
    title: "Disney+",
    titleFa: "دیزنی پلاس",
    description: "دسترسی به تمامی محتوای Disney+، Marvel، Star Wars، Pixar و National Geographic",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 8,
    priceSuffix: "ماهانه",
    features: ["کیفیت 4K + HDR", "محتوای انحصاری Marvel و Star Wars", "تحویل فوری"],
    stock: 12,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    isActive: true,
    accountTypes: ["آماده", "اشتراکی"],
    packages: [
      { id: "disney-1m", nameEn: "1M", nameFa: "۱ ماهه", price: 8 },
      { id: "disney-3m", nameEn: "3M", nameFa: "۳ ماهه", price: 22 },
      { id: "disney-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 80 },
    ],
  },
  {
    id: "demo-psplus",
    title: "PlayStation Plus",
    titleFa: "پلی‌استیشن پلاس",
    description: "اشتراک PS Plus برای بازی آنلاین، بازی‌های رایگان ماهانه و تخفیف‌های انحصاری PS Store",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 10,
    priceSuffix: "ماهانه",
    features: ["بازی آنلاین PS5 و PS4", "بازی‌های رایگان هر ماه", "تخفیف PS Store"],
    stock: 8,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",
    isActive: true,
    accountTypes: ["اشتراکی"],
    packages: [
      { id: "ps-1m", nameEn: "1M", nameFa: "۱ ماهه", price: 10 },
      { id: "ps-3m", nameEn: "3M", nameFa: "۳ ماهه", price: 25 },
      { id: "ps-6m", nameEn: "6M", nameFa: "۶ ماهه", price: 45 },
      { id: "ps-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 80 },
    ],
  },
  {
    id: "demo-gamepass",
    title: "Xbox Game Pass",
    titleFa: "گیم پس اولتیمیت",
    description: "دسترسی به بیش از ۱۰۰ بازی AAA روی Xbox و PC + اشتراک Xbox Live Gold",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 15,
    priceSuffix: "ماهانه",
    features: ["+۱۰۰ بازی AAA روی Xbox و PC", "شامل Xbox Live Gold", "بازی‌های Day One"],
    stock: 6,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg",
    isActive: true,
    accountTypes: ["اشتراکی"],
    packages: [
      { id: "gp-1m", nameEn: "1M", nameFa: "۱ ماهه", price: 15 },
      { id: "gp-3m", nameEn: "3M", nameFa: "۳ ماهه", price: 40 },
      { id: "gp-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 140 },
    ],
  },
  {
    id: "demo-midjourney",
    title: "Midjourney",
    titleFa: "میدجرنی",
    description: "تولید تصویر با هوش مصنوعی Midjourney — خلاقانه‌ترین ابزار تصویرسازی AI در جهان",
    category: "API",
    tag: "ماهانه",
    price: 10,
    priceSuffix: "ماهانه",
    features: ["۲۰۰ تصویر در ماه", "کیفیت Ultra HD", "دسترسی به مدل V6"],
    stock: 20,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
    isActive: true,
    accountTypes: ["اشتراکی"],
    packages: [
      { id: "mj-1m", nameEn: "1M", nameFa: "۱ ماهه", price: 10 },
      { id: "mj-3m", nameEn: "3M", nameFa: "۳ ماهه", price: 27 },
      { id: "mj-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 96 },
    ],
  },
  {
    id: "demo-canva",
    title: "Canva Pro",
    titleFa: "کنوا پرو",
    description: "دسترسی کامل به تمپلیت‌های پرمیوم، حذف پس‌زمینه نامحدود و ابزارهای طراحی حرفه‌ای",
    category: "ACCOUNT",
    tag: "سالانه",
    price: 13,
    priceSuffix: "سالانه",
    features: ["تمپلیت‌های پرمیوم نامحدود", "حذف پس‌زمینه AI", "۱TB فضای ذخیره‌سازی"],
    stock: 15,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    isActive: true,
    accountTypes: ["آماده"],
    packages: [
      { id: "canva-12m", nameEn: "1Y", nameFa: "۱ ساله", price: 13 },
    ],
  },
  {
    id: "demo-netflix",
    title: "Netflix Premium",
    titleFa: "نتفلیکس پرمیوم",
    description: "اشتراک Netflix پلن پرمیوم با کیفیت 4K و امکان استفاده همزمان روی ۴ دستگاه",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 16,
    priceSuffix: "ماهانه",
    features: ["کیفیت 4K Ultra HD", "۴ دستگاه همزمان", "دانلود آفلاین"],
    stock: 18,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    isActive: true,
    accountTypes: ["آماده", "شخصی", "اشتراکی"],
    packages: [
      { id: "nf-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 16 },
      { id: "nf-3m", nameEn: "3 Months", nameFa: "۳ ماهه", price: 44 },
      { id: "nf-6m", nameEn: "6 Months", nameFa: "۶ ماهه", price: 80 },
      { id: "nf-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 150 },
    ],
  },
  {
    id: "demo-perplexity",
    title: "Perplexity Pro",
    titleFa: "پرپلکسیتی پرو",
    description: "موتور جستجوی هوش مصنوعی Perplexity با دسترسی به مدل‌های GPT-4 و Claude",
    category: "API",
    tag: "ماهانه",
    price: 20,
    priceSuffix: "ماهانه",
    features: ["جستجوی AI نامحدود", "دسترسی به GPT-4 و Claude", "منابع معتبر و آپدیت"],
    stock: 10,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg",
    isActive: true,
    accountTypes: ["شخصی", "اشتراکی"],
    packages: [
      { id: "ppx-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 20 },
      { id: "ppx-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 200 },
    ],
  },
  {
    id: "demo-adobe",
    title: "Adobe Creative Cloud",
    titleFa: "ادوبی کریتیو کلاد",
    description: "دسترسی به تمامی اپ‌های Adobe: Photoshop، Illustrator، Premiere Pro و بیشتر",
    category: "LICENSE",
    tag: "ماهانه",
    price: 55,
    priceSuffix: "ماهانه",
    features: ["تمام اپ‌های Adobe", "۱۰۰GB فضای ابری", "فونت‌های Adobe Fonts"],
    stock: 5,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
    isActive: true,
    accountTypes: ["شخصی", "اشتراکی"],
    packages: [
      { id: "adobe-1m", nameEn: "1 Month", nameFa: "۱ ماهه", price: 55 },
      { id: "adobe-12m", nameEn: "12 Months", nameFa: "۱۲ ماهه", price: 600 },
    ],
  },
  {
    id: "demo-notion",
    title: "Notion AI",
    titleFa: "نوشن هوشمند",
    description: "نوشن پلاس با هوش مصنوعی برای مدیریت پروژه، یادداشت‌برداری و تیم‌ورک حرفه‌ای",
    category: "ACCOUNT",
    tag: "ماهانه",
    price: 16,
    priceSuffix: "ماهانه",
    features: ["AI نویسنده و خلاصه‌ساز", "صفحات نامحدود", "همکاری تیمی"],
    stock: 14,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    isActive: true,
    accountTypes: ["شخصی"],
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

const ACCT_COLOR: Record<string, string> = {
  "آماده":    "text-emerald-400",
  "شخصی":    "text-sky-400",
  "اشتراکی": "text-purple-400",
};
const ACCT_DOT: Record<string, string> = {
  "آماده":    "bg-emerald-400",
  "شخصی":    "bg-sky-400",
  "اشتراکی": "bg-purple-400",
};
const ACCT_LABEL: Record<string, string> = {
  "آماده":    "اکانت آماده",
  "شخصی":    "ایمیل شخصی",
  "اشتراکی": "اشتراکی",
};

function AccountTypeBadges({ product }: { product: ProductWithStock }) {
  const types = product.accountTypes;
  if (!types || types.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
      {types.map((type, i) => (
        <span key={type} className={`flex items-center gap-1 text-[10px] font-semibold ${ACCT_COLOR[type] ?? "text-text-muted"}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ACCT_DOT[type] ?? "bg-text-muted"}`} />
          {ACCT_LABEL[type] ?? type}
          {i < types.length - 1 && <span className="text-border ms-0.5">·</span>}
        </span>
      ))}
    </div>
  );
}

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [visualCategory, setVisualCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const catBtnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const sliderReady = useRef(false);
  const [scrollThumb, setScrollThumb] = useState({ left: 0, width: 100 });

  const isFaRef = useRef(isFa);
  useEffect(() => { isFaRef.current = isFa; }, [isFa]);

  // Chrome/modern Safari RTL: scrollLeft is 0→negative. Old Safari: maxScroll→0 (positive).
  // Detect by trying scrollLeft=-1: Chrome accepts (goes negative), old Safari clamps to 0.
  const rtlChromeRef = useRef(false);
  useEffect(() => {
    if (!isFa) return;
    const el = scrollRef.current;
    if (!el) return;
    const s = el.scrollLeft;
    el.scrollLeft = -1;
    rtlChromeRef.current = el.scrollLeft < 0;
    el.scrollLeft = s;
  }, [isFa]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) { setScrollThumb({ left: 0, width: 100 }); return; }
      const thumbW = Math.max((el.clientWidth / el.scrollWidth) * 100, 15);
      // Normalize scroll to 0=visual-start, max=visual-end regardless of browser/direction
      let normalized: number;
      if (isFaRef.current) {
        normalized = rtlChromeRef.current ? -el.scrollLeft : max - el.scrollLeft;
      } else {
        normalized = el.scrollLeft;
      }
      // RTL: thumb at right(start) → moves left as user scrolls
      // LTR: thumb at left(start) → moves right as user scrolls
      const thumbLeft = isFaRef.current
        ? (1 - normalized / max) * (100 - thumbW)
        : (normalized / max) * (100 - thumbW);
      setScrollThumb({ left: thumbLeft, width: thumbW });
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

  useEffect(() => {
    setActiveCategory("all");
    setVisualCategory("all");
  }, [lang]);

  useEffect(() => {
    if (!showSuggestions) return;
    const close = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [showSuggestions]);

  const suggestions = searchQuery.trim().length > 0
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }).slice(0, 5)
    : [];

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "all" || (CATEGORY_PRODUCT_MAP[activeCategory]?.includes(p.id) ?? false);
    return matchesSearch && matchesCategory;
  });

  useLayoutEffect(() => {
    const btn = catBtnRefs.current.get(visualCategory);
    const slider = sliderRef.current;
    if (!btn || !slider) return;
    if (!sliderReady.current) {
      slider.style.transition = "none";
      slider.style.opacity = "1";
      sliderReady.current = true;
      slider.style.left = `${btn.offsetLeft}px`;
      slider.style.width = `${btn.offsetWidth}px`;
      slider.style.height = `${btn.offsetHeight}px`;
      requestAnimationFrame(() => { slider.style.transition = ""; });
    } else {
      slider.style.left = `${btn.offsetLeft}px`;
      slider.style.width = `${btn.offsetWidth}px`;
    }
  }, [visualCategory]);

  function handleCategoryChange(id: string) {
    setVisualCategory(id);
    setProgressKey((k) => k + 1);
    setCategoryLoading(true);
    setTimeout(() => {
      setActiveCategory(id);
      setCategoryLoading(false);
    }, 300);
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



      {/* Search Bar + Suggestions */}
      <div ref={searchRef} className="relative mb-3 z-20">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <Search size={14} className="text-text-muted" />
        </div>
        <input
          type="text"
          placeholder={lang === "fa" ? "جستجوی محصولات..." : "Search products..."}
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          className="block w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-bg-elevated border border-border rounded-xl shadow-xl overflow-hidden">
            {suggestions.map((product) => {
              const toman = usdToTomanFormatted(product.price);
              const price = isFa && toman ? `${toman} تومان` : `$${product.price}`;
              return (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowSuggestions(false);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-bg-card active:bg-bg-card transition-colors border-b border-border last:border-0 text-start"
                >
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt="" className="w-full h-full object-contain p-0.5" />
                      : <span className="text-base">📦</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">{product.title}</p>
                    {product.description && (
                      <p className="text-[9px] text-text-muted truncate mt-0.5">{product.description}</p>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-row items-center gap-1.5 self-center">
                    <p className="text-[10px] text-accent font-bold" dir="ltr">{price}</p>
                    <ShoppingBag size={13} className="text-text-muted" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="relative mb-4">
        <div
          ref={scrollRef}
          className="relative flex overflow-x-auto scrollbar-hide gap-2 cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitOverflowScrolling: "touch", paddingInlineEnd: "32px" }}
          onMouseDown={(e) => {
            const el = e.currentTarget;
            const startX = e.pageX;
            const startScrollLeft = el.scrollLeft;
            let lastX = e.pageX;
            let velocity = 0;
            let rafId: number;
            let moved = false;

            const onMove = (ev: MouseEvent) => {
              const delta = ev.pageX - startX;
              if (Math.abs(delta) > 3) moved = true;
              velocity = ev.pageX - lastX;
              lastX = ev.pageX;
              // RTL (both Chrome-negative and Safari-positive): drag right = toward start → +delta
              // LTR: drag right = toward start → -delta
              el.scrollLeft = startScrollLeft + (isFaRef.current ? delta : -delta);
            };

            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
              // Prevent category click if user was dragging
              if (moved) {
                window.addEventListener("click", (ev) => {
                  if (scrollRef.current?.contains(ev.target as Node)) ev.stopPropagation();
                }, { once: true, capture: true });
              }
              let v = isFaRef.current ? velocity : -velocity;
              const glide = () => {
                if (Math.abs(v) < 0.5) return;
                el.scrollLeft += v;
                v *= 0.88;
                rafId = requestAnimationFrame(glide);
              };
              rafId = requestAnimationFrame(glide);
            };

            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
            return () => cancelAnimationFrame(rafId);
          }}
        >
          {/* Sliding pill — all positioning done via DOM in useLayoutEffect, no JSX style prop */}
          <div ref={sliderRef} className="cat-slider-pill" />
          {CATEGORIES.map((cat) => {
            const isActive = visualCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  if (el) catBtnRefs.current.set(cat.id, el);
                  else catBtnRefs.current.delete(cat.id);
                }}
                onClick={(e) => {
                  handleCategoryChange(cat.id);
                  e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                }}
                className={`relative z-10 whitespace-nowrap px-4 py-2 rounded-xl text-xs shrink-0 border border-transparent bg-transparent transition-colors duration-300 ${
                  isActive ? "font-bold text-bg-primary" : "font-semibold text-text-secondary"
                }`}
              >
                {lang === "fa" ? cat.fa : cat.en}
              </button>
            );
          })}
        </div>
        {/* Fade at inline-end: right in LTR, left in RTL */}
        <div
          className="absolute top-0 h-full w-10 pointer-events-none"
          style={{
            insetInlineEnd: 0,
            background: isFa
              ? "linear-gradient(to right, var(--color-bg-primary) 30%, transparent)"
              : "linear-gradient(to left, var(--color-bg-primary) 30%, transparent)",
          }}
        />
        {/* Scroll indicator */}
        {scrollThumb.width < 99 && (
          <div className="relative h-0.5 bg-border rounded-full mt-2 mx-1">
            <div
              className="absolute top-0 h-full bg-accent rounded-full transition-all duration-200 ease-out"
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
      ) : (
      <div
        style={{
          opacity: categoryLoading ? 0 : 1,
          transform: categoryLoading ? "translateY(6px)" : "translateY(0)",
          transition: "opacity 0.15s ease, transform 0.15s ease",
          pointerEvents: categoryLoading ? "none" : "auto",
        }}
      >
      {activeCategory === "all" ? (
        <div key={activeCategory} className="animate-grid-enter grid grid-cols-2 gap-3">
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
        <div key={activeCategory} className="animate-grid-enter flex flex-col gap-3">
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
                  <AccountTypeBadges product={product} />
                  <h3 className="text-xs font-bold text-text-primary leading-snug line-clamp-1">
                    {product.title}
                  </h3>
                  {isFa && product.titleFa && (
                    <p className="text-[10px] font-medium text-text-secondary leading-snug">
                      {product.titleFa}
                    </p>
                  )}
                  {product.description && (
                    <p className="text-[9px] text-text-muted leading-snug line-clamp-1">
                      {product.description}
                    </p>
                  )}
                  {/* Price + Buy */}
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    {(() => {
                      const pkgs = product.packages;
                      const minP = pkgs && pkgs.length > 0 ? Math.min(...pkgs.map((p) => p.price)) : product.price;
                      const maxP = pkgs && pkgs.length > 0 ? Math.max(...pkgs.map((p) => p.price)) : product.price;
                      const range = pkgs && pkgs.length > 1 && minP !== maxP;
                      const minT = usdToTomanFormatted(minP);
                      const maxT = usdToTomanFormatted(maxP);
                      const priceStr = range
                        ? isFa && minT && maxT ? `${minT} تا ${maxT} تومان` : `$${minP} — $${maxP}`
                        : isFa && minT ? `${minT} تومان` : `$${minP}`;
                      return (
                        <span className="text-xs font-bold text-accent" dir="ltr">{priceStr}</span>
                      );
                    })()}
                    <div className="shrink-0 flex items-center gap-1 bg-accent text-bg-primary text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      <ShoppingBag size={10} strokeWidth={2.5} />
                      <span>{isFa ? "اطلاعات بیشتر و خرید" : "Details & Buy"}</span>
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

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="bg-bg-secondary border-b border-border px-4 py-3 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <span className="font-bold text-accent mr-4 shrink-0">🛒 Admin</span>
        {ADMIN_NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === href
                ? "bg-accent text-bg-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <main className="p-4 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}

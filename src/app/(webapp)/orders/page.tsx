"use client";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppStore } from "@/lib/store";
import OrderCard from "@/components/orders/OrderCard";
import type { OrderWithDetails } from "@/types";

export default function OrdersPage() {
  const { t } = useLanguage();
  const userId = useAppStore((s) => s.userId);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetch(`/api/orders?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t("orders")}</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-bg-card rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center">
            <ShoppingBag size={36} className="text-text-muted" strokeWidth={1} />
          </div>
          <p className="font-bold text-text-primary">{t("noOrders")}</p>
          <p className="text-sm text-text-secondary text-center max-w-xs">
            {t("noOrdersDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

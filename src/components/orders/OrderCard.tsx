"use client";
import { useLanguage } from "@/hooks/useLanguage";
import type { OrderWithDetails } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-warning/20 text-warning",
  PAID: "bg-blue-500/20 text-blue-400",
  DELIVERING: "bg-purple-500/20 text-purple-400",
  COMPLETED: "bg-success/20 text-success",
  CANCELLED: "bg-error/20 text-error",
  REFUNDED: "bg-text-muted/20 text-text-muted",
};

export default function OrderCard({ order }: { order: OrderWithDetails }) {
  const { t } = useLanguage();
  const statusKey = order.status.toLowerCase() as Parameters<typeof t>[0];
  const date = new Date(order.createdAt).toLocaleDateString();

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-4 flex gap-3 items-center">
      <div className="text-3xl">📦</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-text-primary truncate">{order.product.title}</p>
        <p className="text-xs text-text-secondary mt-0.5">{date}</p>
        {order.deliveryContent && (
          <p className="text-xs text-success mt-1 font-mono truncate">{order.deliveryContent}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <p className="text-accent font-bold text-sm">${order.price}</p>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-bg-elevated text-text-muted"}`}>
          {t(statusKey as Parameters<typeof t>[0])}
        </span>
      </div>
    </div>
  );
}

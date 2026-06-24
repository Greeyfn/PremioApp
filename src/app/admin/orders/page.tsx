import { prisma } from "@/lib/prisma";
import DeliverOrderForm from "./DeliverOrderForm";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: any[] = [
    {
      id: "demo-1",
      product: { title: "Demo Product" },
      user: { firstName: "Demo", username: "demo_user" },
      createdAt: new Date().toISOString(),
      price: 15,
      status: "PENDING",
      deliveryContent: null
    }
  ];

  try {
    const res = await prisma.order.findMany({
      include: {
        user: { select: { firstName: true, username: true } },
        product: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    orders = res;
  } catch (e) {
    console.error("DB connection failed, using fallback data");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className={`bg-bg-card border rounded-2xl p-4 ${o.status === "PENDING" ? "border-warning" : "border-border"}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-sm">{o.product.title}</p>
                <p className="text-xs text-text-secondary">
                  {o.user.firstName} {o.user.username ? `(@${o.user.username})` : ""}
                </p>
                <p className="text-xs text-text-muted">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-accent font-bold">${o.price}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  o.status === "PENDING" ? "bg-warning/20 text-warning" :
                  o.status === "COMPLETED" ? "bg-success/20 text-success" :
                  "bg-bg-elevated text-text-muted"
                }`}>{o.status}</span>
              </div>
            </div>
            {o.deliveryContent && (
              <div className="bg-bg-elevated rounded-xl p-2 mt-2">
                <p className="text-xs font-mono text-success break-all">{o.deliveryContent}</p>
              </div>
            )}
            {o.status === "PENDING" && <DeliverOrderForm orderId={o.id} />}
          </div>
        ))}
        {!orders.length && <p className="text-text-muted text-center py-10">No orders yet</p>}
      </div>
    </div>
  );
}

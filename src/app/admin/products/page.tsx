import { prisma } from "@/lib/prisma";
import AddProductForm from "./AddProductForm";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: any[] = [
    { id: "1", title: "Dummy Product 1", category: "ACCOUNT", price: 10, stock: 5, isActive: true, _count: { items: 0 } },
    { id: "2", title: "Dummy Product 2", category: "API", price: 20, stock: 0, isActive: false, _count: { items: 0 } }
  ];

  try {
    const res = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { items: { where: { isUsed: false } } } } },
    });
    products = res;
  } catch (e) {
    console.error("DB connection failed, using fallback data");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="mb-6">
        <AddProductForm />
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className={`bg-bg-card border rounded-2xl p-4 flex items-center gap-3 ${!p.isActive ? "opacity-50" : "border-border"}`}>
            <div className="text-3xl">📦</div>
            <div className="flex-1">
              <p className="font-bold">{p.title}</p>
              <p className="text-xs text-text-secondary">{p.category} · ${p.price}</p>
              <p className="text-xs text-text-muted mt-0.5">Stock: {p.stock} | Items: {p._count.items}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
              {p.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

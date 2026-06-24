import { prisma } from "@/lib/prisma";
import Image from "next/image";
import PaymentActions from "./PaymentActions";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  let payments: any[] = [];
  try {
    const res = await prisma.paymentRequest.findMany({
      include: { user: { select: { firstName: true, username: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    payments = res;
  } catch (e) {
    console.error("DB connection failed, using fallback data");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment Requests</h1>
      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p.id} className={`bg-bg-card border rounded-2xl p-4 ${p.status === "PENDING" ? "border-warning" : "border-border"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold">
                  {p.user.firstName} {p.user.username ? `(@${p.user.username})` : ""}
                </p>
                <p className="text-sm text-text-secondary">{new Date(p.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-accent font-bold text-lg">${p.amount}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.status === "PENDING" ? "bg-warning/20 text-warning" :
                  p.status === "APPROVED" ? "bg-success/20 text-success" :
                  "bg-error/20 text-error"
                }`}>{p.status}</span>
              </div>
            </div>

            <p className="text-xs text-text-secondary mb-2">Method: {p.method}</p>
            {p.txHash && <p className="text-xs font-mono text-text-secondary mb-2 break-all">TX: {p.txHash}</p>}
            {p.adminNote && <p className="text-xs text-text-muted mb-2">Note: {p.adminNote}</p>}

            {p.screenshotUrl && (
              <div className="relative w-full h-48 mb-3 rounded-xl overflow-hidden bg-bg-elevated">
                <Image src={p.screenshotUrl} alt="screenshot" fill className="object-contain" />
              </div>
            )}

            {p.status === "PENDING" && <PaymentActions paymentId={p.id} />}
          </div>
        ))}
        {!payments.length && (
          <p className="text-text-muted text-center py-10">No payment requests yet</p>
        )}
      </div>
    </div>
  );
}

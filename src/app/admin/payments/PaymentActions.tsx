"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentActions({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function handle(action: "approve" | "reject") {
    const adminId = prompt("Enter your Telegram ID for auth:");
    if (!adminId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-id": adminId },
        body: JSON.stringify({ paymentId, action, note }),
      });
      if (res.ok) router.refresh();
      else alert("Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Admin note (optional)"
        className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary outline-none"
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handle("approve")}
          disabled={loading}
          className="bg-success/20 text-success font-bold py-2.5 rounded-xl text-sm disabled:opacity-40"
        >
          ✅ Approve
        </button>
        <button
          onClick={() => handle("reject")}
          disabled={loading}
          className="bg-error/20 text-error font-bold py-2.5 rounded-xl text-sm disabled:opacity-40"
        >
          ❌ Reject
        </button>
      </div>
    </div>
  );
}

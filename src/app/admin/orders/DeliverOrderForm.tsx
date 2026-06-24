"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeliverOrderForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDeliver() {
    const adminId = prompt("Enter your Telegram ID:");
    if (!adminId || !content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-id": adminId },
        body: JSON.stringify({ content }),
      });
      if (res.ok) router.refresh();
      else alert("Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Delivery content (account:password, API key, etc.)"
        rows={3}
        className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary outline-none font-mono resize-none"
      />
      <button
        onClick={handleDeliver}
        disabled={loading || !content.trim()}
        className="w-full bg-success/20 text-success font-bold py-2 rounded-xl text-sm disabled:opacity-40"
      >
        {loading ? "Delivering..." : "✅ Deliver & Complete"}
      </button>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["API", "ACCOUNT", "LICENSE", "EDUCATION", "OTHER"];

export default function AddProductForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "API",
    tag: "",
    price: "",
    imageUrl: "",
    sortOrder: "0",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const adminId = prompt("Enter your Telegram ID for auth:");
    if (!adminId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-id": adminId },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), sortOrder: parseInt(form.sortOrder) }),
      });
      if (res.ok) {
        setOpen(false);
        setForm({ title: "", description: "", category: "API", tag: "", price: "", imageUrl: "", sortOrder: "0" });
        router.refresh();
      } else alert("Error creating product");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="bg-accent text-bg-primary font-bold px-4 py-2 rounded-xl text-sm">
        + Add Product
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-2xl p-4 space-y-3">
      <h3 className="font-bold">New Product</h3>
      {[
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "text" },
        { key: "tag", label: "Tag (e.g. AI IDE)", type: "text" },
        { key: "price", label: "Price ($)", type: "number" },
        { key: "imageUrl", label: "Image URL", type: "url" },
        { key: "sortOrder", label: "Sort Order", type: "number" },
      ].map(({ key, label, type }) => (
        <div key={key}>
          <label className="text-xs text-text-secondary mb-1 block">{label}</label>
          <input
            type={type}
            value={form[key as keyof typeof form]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary outline-none"
            required={key !== "tag" && key !== "imageUrl"}
          />
        </div>
      ))}
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text-primary outline-none"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="flex-1 bg-accent text-bg-primary font-bold py-2 rounded-xl text-sm disabled:opacity-40">
          {loading ? "Creating..." : "Create Product"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 bg-bg-elevated border border-border rounded-xl text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

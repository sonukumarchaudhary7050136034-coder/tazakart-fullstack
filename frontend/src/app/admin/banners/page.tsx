"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Banner {
  id: number;
  title: string;
  active: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, title: "Monsoon Sale — Up to 40% off groceries", active: true },
    { id: 2, title: "Fresh Fruits & Veggies — Flat ₹30 off", active: true },
  ]);
  const [title, setTitle] = useState("");

  const addBanner = () => {
    if (!title.trim()) return;
    setBanners((prev) => [...prev, { id: Date.now(), title, active: true }]);
    setTitle("");
  };

  return (
    <AdminShell>
      <h1 className="text-xl font-bold mb-1">Banners</h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>Manage homepage promotional banners</p>

      <div className="bg-white rounded-xl border p-4 mb-6 flex gap-3" style={{ borderColor: "var(--color-line)" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Banner title / offer text"
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--color-line)" }}
        />
        <input type="file" accept="image/*" className="text-xs" />
        <button
          onClick={addBanner}
          className="px-4 py-2 rounded-lg text-white font-semibold text-sm"
          style={{ background: "var(--color-primary)" }}
        >
          + Add Banner
        </button>
      </div>

      <div className="space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: "var(--color-line)" }}>
            <div
              className="w-32 h-14 rounded-lg mr-4 flex items-center justify-center text-xs text-white font-semibold shrink-0"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              Banner
            </div>
            <p className="flex-1 text-sm">{b.title}</p>
            <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
              {b.active ? "Live" : "Hidden"}
            </span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

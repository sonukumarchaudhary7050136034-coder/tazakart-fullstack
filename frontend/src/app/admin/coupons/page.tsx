"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Coupon {
  code: string;
  discount: string;
  minOrder: number;
  active: boolean;
}

const initialCoupons: Coupon[] = [
  { code: "WELCOME50", discount: "50% off (max ₹50)", minOrder: 99, active: true },
  { code: "FRESH20", discount: "₹20 off", minOrder: 199, active: true },
  { code: "BIGORDER100", discount: "₹100 off", minOrder: 999, active: false },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState({ code: "", discount: "", minOrder: "" });

  const addCoupon = () => {
    if (!form.code || !form.discount) return;
    setCoupons((prev) => [{ code: form.code.toUpperCase(), discount: form.discount, minOrder: Number(form.minOrder || 0), active: true }, ...prev]);
    setForm({ code: "", discount: "", minOrder: "" });
  };

  const toggleActive = (code: string) => {
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
  };

  return (
    <AdminShell>
      <h1 className="text-xl font-bold mb-1">Coupons & Offers</h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>Create and manage discount coupons</p>

      <div className="bg-white rounded-xl border p-4 mb-6 grid grid-cols-3 gap-3" style={{ borderColor: "var(--color-line)" }}>
        <input
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          placeholder="Coupon code"
          className="border rounded-lg px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--color-line)" }}
        />
        <input
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
          placeholder="Discount (e.g. 20% off)"
          className="border rounded-lg px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--color-line)" }}
        />
        <input
          value={form.minOrder}
          onChange={(e) => setForm({ ...form, minOrder: e.target.value.replace(/\D/g, "") })}
          placeholder="Min order ₹"
          className="border rounded-lg px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--color-line)" }}
        />
        <button
          onClick={addCoupon}
          className="col-span-3 px-4 py-2 rounded-lg text-white font-semibold text-sm"
          style={{ background: "var(--color-primary)" }}
        >
          + Add Coupon
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.code} className="bg-white rounded-xl border p-4" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-sm">{c.code}</p>
              <button
                onClick={() => toggleActive(c.code)}
                className="text-xs font-semibold"
                style={{ color: c.active ? "var(--color-primary)" : "var(--color-muted)" }}
              >
                {c.active ? "Active" : "Inactive"}
              </button>
            </div>
            <p className="text-sm">{c.discount}</p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>Min order ₹{c.minOrder}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

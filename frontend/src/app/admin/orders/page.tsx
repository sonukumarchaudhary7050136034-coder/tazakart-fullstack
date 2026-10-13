"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { api, ApiOrder } from "@/lib/api";

const statuses = ["Pending", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { api.adminAllOrders().then(setOrders).finally(() => setLoading(false)); };
  useEffect(load, []);

  const updateStatus = async (id: number, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await api.adminUpdateOrderStatus(id, status);
  };

  return (
    <AdminShell>
      <h1 className="text-xl font-bold mb-1">Orders</h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>Manage and track customer orders</p>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-line)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ background: "var(--color-bg)", color: "var(--color-muted)" }}>
              <th className="p-3">Order ID</th>
              <th className="p-3">Items</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && orders.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center" style={{ color: "var(--color-muted)" }}>No orders yet.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t" style={{ borderColor: "var(--color-line)" }}>
                <td className="p-3 font-medium">#{o.id}</td>
                <td className="p-3">{o.items.length} items</td>
                <td className="p-3">₹{o.grand_total}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border rounded-lg px-2 py-1 text-xs outline-none"
                    style={{ borderColor: "var(--color-line)" }}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

"use client";

import AdminShell from "@/components/admin/AdminShell";

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <h1 className="text-xl font-bold mb-1">Settings</h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>Store configuration</p>

      <div className="bg-white rounded-xl border p-5 max-w-lg space-y-4" style={{ borderColor: "var(--color-line)" }}>
        <div>
          <label className="text-xs font-semibold block mb-1">Store Name</label>
          <input defaultValue="TazaKart" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Delivery Charge (₹)</label>
          <input defaultValue="25" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Handling Charge (₹)</label>
          <input defaultValue="4" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Free Delivery Above (₹)</label>
          <input defaultValue="199" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--color-line)" }} />
        </div>
        <button className="px-5 py-2.5 rounded-lg text-white font-bold text-sm" style={{ background: "var(--color-primary)" }}>
          Save Settings
        </button>
      </div>
    </AdminShell>
  );
}

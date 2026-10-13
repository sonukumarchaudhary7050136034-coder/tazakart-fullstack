"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { api, ApiAddress } from "@/lib/api";

export default function AddressPage() {
  const router = useRouter();
  const [savedAddresses, setSavedAddresses] = useState<ApiAddress[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Home", house: "", area: "", city: "", pincode: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("userToken")) {
      router.replace("/login");
      return;
    }
    api
      .getAddresses()
      .then((addrs) => {
        setSavedAddresses(addrs);
        if (addrs.length) setSelected(addrs[0].id);
        else setShowForm(true);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const proceed = () => {
    if (selected) localStorage.setItem("selectedAddressId", String(selected));
    router.push("/checkout");
  };

  const saveNewAddress = async () => {
    if (!form.house || !form.area || !form.city || !form.pincode) return;
    const addr = await api.addAddress(form);
    setSavedAddresses((prev) => [...prev, addr]);
    setSelected(addr.id);
    setShowForm(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 container-x py-10">
          <div className="h-40 rounded-xl animate-pulse" style={{ background: "var(--color-line)" }} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-x py-6 max-w-2xl">
          <h1 className="text-lg font-bold mb-4">Select delivery address</h1>

          <div
            className="rounded-xl border mb-5 h-48 flex items-center justify-center text-sm"
            style={{ borderColor: "var(--color-line)", background: "var(--color-bg)", color: "var(--color-muted)" }}
          >
            📍 Map preview — drag pin to set exact location
          </div>

          <div className="space-y-3 mb-5">
            {savedAddresses.map((addr) => (
              <label
                key={addr.id}
                className="flex items-start gap-3 border rounded-xl p-4 cursor-pointer"
                style={{ borderColor: selected === addr.id ? "var(--color-primary)" : "var(--color-line)" }}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selected === addr.id}
                  onChange={() => setSelected(addr.id)}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-sm">{addr.label}</p>
                  <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                    {addr.house}, {addr.area}, {addr.city} - {addr.pincode}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-bold mb-6"
              style={{ color: "var(--color-primary)" }}
            >
              + Add new address
            </button>
          ) : (
            <div className="border rounded-xl p-4 mb-6 space-y-3" style={{ borderColor: "var(--color-line)" }}>
              <div className="flex gap-2">
                {["Home", "Work", "Other"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setForm({ ...form, label: l })}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                    style={{
                      borderColor: form.label === l ? "var(--color-primary)" : "var(--color-line)",
                      background: form.label === l ? "var(--color-primary)" : "transparent",
                      color: form.label === l ? "white" : "var(--color-ink)",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <input
                placeholder="House / Flat / Floor no."
                value={form.house}
                onChange={(e) => setForm({ ...form, house: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--color-line)" }}
              />
              <input
                placeholder="Area / Street / Locality"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--color-line)" }}
              />
              <div className="flex gap-3">
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ borderColor: "var(--color-line)" }}
                />
                <input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  className="w-32 border rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ borderColor: "var(--color-line)" }}
                />
              </div>
              <button
                onClick={saveNewAddress}
                className="w-full py-2.5 rounded-lg text-white font-bold text-sm"
                style={{ background: "var(--color-primary)" }}
              >
                Save address
              </button>
            </div>
          )}

          <button
            onClick={proceed}
            disabled={!selected}
            className="w-full py-3 rounded-lg text-white font-bold disabled:opacity-60"
            style={{ background: "var(--color-primary)" }}
          >
            Deliver here
          </button>
        </div>
      </main>
    </>
  );
}

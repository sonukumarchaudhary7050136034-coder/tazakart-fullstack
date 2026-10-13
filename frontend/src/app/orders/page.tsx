"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api, ApiOrder } from "@/lib/api";

const statusColor: Record<string, string> = {
  Pending: "#B45309",
  Confirmed: "#1D5FB0",
  Packed: "#7A4B1B",
  "Out for Delivery": "#C9971F",
  Delivered: "#1B7A43",
  Cancelled: "#DC2626",
};

function OrdersContent() {
  const params = useSearchParams();
  const router = useRouter();
  const justPlaced = params.get("placed") === "1";
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("userToken")) {
      router.replace("/login");
      return;
    }
    api.myOrders().then(setOrders).finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="container-x py-6 max-w-2xl">
      <h1 className="text-lg font-bold mb-1">My Orders</h1>
      {justPlaced && (
        <p className="text-sm mb-4" style={{ color: "var(--color-primary)" }}>
          🎉 Order placed successfully!
        </p>
      )}
      {loading ? (
        <div className="space-y-3 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "var(--color-line)" }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm mt-6" style={{ color: "var(--color-muted)" }}>No orders yet.</p>
      ) : (
        <div className="space-y-3 mt-4">
          {orders.map((o) => (
            <div key={o.id} className="border rounded-xl p-4" style={{ borderColor: "var(--color-line)" }}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-sm font-bold">Order #{o.id}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {new Date(o.created_at).toLocaleDateString()} · {o.items.length} items · ₹{o.grand_total}
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full text-white"
                  style={{ background: statusColor[o.status] || "#666" }}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={null}>
          <OrdersContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

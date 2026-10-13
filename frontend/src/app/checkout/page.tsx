"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery" },
  { id: "upi", label: "UPI (Google Pay / PhonePe / Paytm)" },
  { id: "card", label: "Credit / Debit Card" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [payment, setPayment] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const deliveryCharge = totalItems > 0 && totalPrice < 199 ? 25 : 0;
  const handlingCharge = totalItems > 0 ? 4 : 0;
  const grandTotal = totalPrice + deliveryCharge + handlingCharge;

  const placeOrder = async () => {
    if (!localStorage.getItem("userToken")) {
      router.push("/login");
      return;
    }
    const addressId = localStorage.getItem("selectedAddressId");
    if (!addressId) {
      router.push("/checkout/address");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      // Sync local cart into backend cart, then place the order server-side.
      for (const item of items) {
        await api.addToCart(item.product.id, item.qty);
      }
      await api.placeOrder(Number(addressId), payment);
      clearCart();
      router.push("/orders?placed=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <p style={{ color: "var(--color-muted)" }}>Your cart is empty.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-x py-6 max-w-2xl">
          <h1 className="text-lg font-bold mb-4">Checkout</h1>

          <div className="border rounded-xl p-4 mb-4" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold">Delivery Address</h2>
              <button
                onClick={() => router.push("/checkout/address")}
                className="text-xs font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                Change
              </button>
            </div>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              Delivery address selected in the previous step
            </p>
          </div>

          <div className="border rounded-xl p-4 mb-4" style={{ borderColor: "var(--color-line)" }}>
            <h2 className="text-sm font-bold mb-3">Order Summary</h2>
            <div className="space-y-2">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span>{product.name} × {qty}</span>
                  <span>₹{product.price * qty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-xl p-4 mb-4" style={{ borderColor: "var(--color-line)" }}>
            <h2 className="text-sm font-bold mb-3">Payment Method</h2>
            <div className="space-y-2">
              {paymentMethods.map((m) => (
                <label key={m.id} className="flex items-center gap-3 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </div>

          <div className="border rounded-xl p-4 mb-6 space-y-2" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-muted)" }}>Items total</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-muted)" }}>Delivery charge</span>
              <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-muted)" }}>Handling charge</span>
              <span>₹{handlingCharge}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: "var(--color-line)" }}>
              <span>Grand total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full py-3 rounded-lg text-white font-bold disabled:opacity-60"
            style={{ background: "var(--color-primary)" }}
          >
            {placing ? "Placing order..." : `Place Order · ₹${grandTotal}`}
          </button>
        </div>
      </main>
    </>
  );
}

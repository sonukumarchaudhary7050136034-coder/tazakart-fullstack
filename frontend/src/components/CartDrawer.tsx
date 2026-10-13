"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, increment, decrement, totalPrice, totalItems } = useCart();

  if (!open) return null;

  const deliveryCharge = totalItems > 0 ? 25 : 0;
  const handlingCharge = totalItems > 0 ? 4 : 0;
  const grandTotal = totalPrice + deliveryCharge + handlingCharge;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--color-line)" }}>
          <h2 className="font-bold text-lg">My Cart</h2>
          <button onClick={onClose} className="text-xl leading-none">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16" style={{ color: "var(--color-muted)" }}>
              <p className="text-4xl mb-2">🛒</p>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 relative rounded-md overflow-hidden border shrink-0" style={{ borderColor: "var(--color-line)" }}>
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs" style={{ color: "var(--color-muted)" }}>{product.unit}</p>
                    <p className="text-sm font-semibold">₹{product.price * qty}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-md text-white text-sm font-bold" style={{ background: "var(--color-primary)" }}>
                    <button onClick={() => decrement(product.id)} className="w-7 h-7">-</button>
                    <span>{qty}</span>
                    <button onClick={() => increment(product.id)} className="w-7 h-7">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-2" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-muted)" }}>Items total</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-muted)" }}>Delivery charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-muted)" }}>Handling charge</span>
              <span>₹{handlingCharge}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: "var(--color-line)" }}>
              <span>Grand total</span>
              <span>₹{grandTotal}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block text-center mt-3 rounded-lg py-3 font-bold text-white"
              style={{ background: "var(--color-primary)" }}
            >
              Proceed to Checkout · ₹{grandTotal}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { totalItems, totalPrice } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x flex items-center gap-4 py-3">
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--color-primary)" }}
            >
              Taza
            </span>
            <span className="text-2xl font-black tracking-tight" style={{ color: "var(--color-accent)" }}>
              Kart
            </span>
          </Link>

          <div className="hidden md:flex flex-col leading-tight cursor-pointer shrink-0">
            <span className="text-sm font-bold">Delivery in 10 minutes</span>
            <span className="text-xs truncate max-w-[220px]" style={{ color: "var(--color-muted)" }}>
              Puraini, Bihar &mdash; change location
            </span>
          </div>

          <div className="flex-1 max-w-xl">
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 border"
              style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}
            >
              <span aria-hidden>🔍</span>
              <input
                type="text"
                placeholder='Search "milk"'
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {user ? (
            <div className="hidden sm:flex items-center gap-3 shrink-0 text-sm">
              <Link href="/orders" className="font-semibold">{user.name}</Link>
              <button onClick={logout} className="text-xs" style={{ color: "var(--color-muted)" }}>Logout</button>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-semibold hidden sm:block shrink-0">
              Login
            </Link>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white font-semibold text-sm shrink-0"
            style={{ background: "var(--color-primary)" }}
          >
            <span aria-hidden>🛒</span>
            <span>
              {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} · ₹${totalPrice}` : "My Cart"}
            </span>
          </button>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

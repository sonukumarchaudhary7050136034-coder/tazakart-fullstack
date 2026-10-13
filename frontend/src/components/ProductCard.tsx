"use client";

import Image from "next/image";
import Link from "next/link";
import { ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: ApiProduct }) {
  const { addItem, increment, decrement, getQty } = useCart();
  const qty = getQty(product.id);
  const outOfStock = product.stock === 0;

  return (
    <div
      className="flex flex-col rounded-xl border bg-white p-3"
      style={{ borderColor: "var(--color-line)" }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2" style={{ background: "var(--color-bg)" }}>
          <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
          {outOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-xs font-bold text-red-600">Out of Stock</span>
            </div>
          )}
        </div>
        <span
          className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded mb-1"
          style={{ background: "var(--color-bg)", color: "var(--color-primary-dark)" }}
        >
          {product.delivery_time}
        </span>
        <p className="text-sm font-medium leading-snug line-clamp-2">{product.name}</p>
        <p className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>{product.unit}</p>
      </Link>

      <div className="mt-auto flex items-center justify-between">
        <div>
          <span className="text-sm font-bold">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs line-through ml-1" style={{ color: "var(--color-muted)" }}>
              ₹{product.mrp}
            </span>
          )}
        </div>

        {outOfStock ? (
          <span className="text-xs font-semibold" style={{ color: "var(--color-muted)" }}>
            Notify me
          </span>
        ) : qty === 0 ? (
          <button
            onClick={() => addItem(product)}
            className="text-sm font-bold px-4 py-1.5 rounded-lg border"
            style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
          >
            ADD
          </button>
        ) : (
          <div
            className="flex items-center gap-2 rounded-lg text-white text-sm font-bold"
            style={{ background: "var(--color-primary)" }}
          >
            <button onClick={() => decrement(product.id)} className="w-7 h-7">-</button>
            <span>{qty}</span>
            <button onClick={() => increment(product.id)} className="w-7 h-7">+</button>
          </div>
        )}
      </div>
    </div>
  );
}

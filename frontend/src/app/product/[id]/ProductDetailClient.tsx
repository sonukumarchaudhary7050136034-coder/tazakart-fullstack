"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { api, ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ productId }: { productId: number }) {
  const { addItem, increment, decrement, getQty } = useCart();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [similar, setSimilar] = useState<ApiProduct[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .getProduct(productId)
      .then(async (p) => {
        setProduct(p);
        if (p.subcategory_id) {
          const all = await api.getProducts();
          setSimilar(all.filter((x) => x.subcategory_id === p.subcategory_id && x.id !== p.id));
        }
      })
      .catch(() => setNotFound(true));
  }, [productId]);

  if (notFound) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <p style={{ color: "var(--color-muted)" }}>Product not found.</p>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 container-x py-10">
          <div className="h-80 rounded-xl animate-pulse" style={{ background: "var(--color-line)" }} />
        </main>
      </>
    );
  }

  const qty = getQty(product.id);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-x py-6">
          <p className="text-xs mb-4" style={{ color: "var(--color-muted)" }}>
            <Link href="/">Home</Link> / {product.name}
          </p>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-80 aspect-square rounded-xl border relative" style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}>
              <Image src={product.image} alt={product.name} fill className="object-contain p-8" />
            </div>

            <div className="flex-1 max-w-md">
              <h1 className="text-xl font-bold mb-1">{product.name}</h1>
              <p className="text-sm mb-4" style={{ color: "var(--color-muted)" }}>{product.unit}</p>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-sm line-through" style={{ color: "var(--color-muted)" }}>
                    ₹{product.mrp}
                  </span>
                )}
              </div>
              <p className="text-xs mb-5" style={{ color: "var(--color-muted)" }}>(Inclusive of all taxes)</p>

              {product.stock === 0 ? (
                <span className="inline-block px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600">
                  Out of Stock
                </span>
              ) : qty === 0 ? (
                <button
                  onClick={() => addItem(product)}
                  className="px-6 py-3 rounded-lg text-white font-bold"
                  style={{ background: "var(--color-primary)" }}
                >
                  Add to cart
                </button>
              ) : (
                <div
                  className="inline-flex items-center gap-4 rounded-lg text-white font-bold px-2"
                  style={{ background: "var(--color-primary)" }}
                >
                  <button onClick={() => decrement(product.id)} className="w-9 h-10 text-lg">-</button>
                  <span>{qty}</span>
                  <button onClick={() => increment(product.id)} className="w-9 h-10 text-lg">+</button>
                </div>
              )}

              <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--color-line)" }}>
                <h3 className="text-sm font-bold mb-3">Why shop from TazaKart?</h3>
                <ul className="space-y-3 text-sm" style={{ color: "var(--color-muted)" }}>
                  <li>⚡ <b style={{ color: "var(--color-ink)" }}>Fast delivery</b> — from dark stores near you, whenever you need it.</li>
                  <li>💰 <b style={{ color: "var(--color-ink)" }}>Best prices & offers</b> — direct from manufacturers.</li>
                  <li>🛍️ <b style={{ color: "var(--color-ink)" }}>Wide assortment</b> — thousands of products across categories.</li>
                </ul>
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="mt-12">
              <h2 className="text-base font-bold mb-4">Similar products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {similar.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

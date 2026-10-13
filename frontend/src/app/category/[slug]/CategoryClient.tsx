"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { api, ApiCategory, ApiProduct } from "@/lib/api";

export default function CategoryClient({ slug }: { slug: string }) {
  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [activeSub, setActiveSub] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .getCategory(slug)
      .then(setCategory)
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts({ category_slug: slug, ...(activeSub ? { subcategory_slug: activeSub } : {}) })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [slug, activeSub]);

  if (notFound) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <p style={{ color: "var(--color-muted)" }}>Category not found.</p>
        </main>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Header />
        <main className="flex-1 py-10 container-x">
          <div className="h-6 w-40 rounded animate-pulse mb-6" style={{ background: "var(--color-line)" }} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-x py-6 flex gap-6">
          <aside className="w-40 sm:w-48 shrink-0">
            <div className="sticky top-20 space-y-1">
              <button
                onClick={() => setActiveSub(undefined)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg font-medium ${
                  activeSub === undefined ? "text-white" : ""
                }`}
                style={{
                  background: activeSub === undefined ? "var(--color-primary)" : "transparent",
                }}
              >
                All
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => setActiveSub(sub.slug)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg font-medium ${
                    activeSub === sub.slug ? "text-white" : ""
                  }`}
                  style={{
                    background: activeSub === sub.slug ? "var(--color-primary)" : "transparent",
                  }}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1">
            <h1 className="text-lg font-bold mb-4">
              {category.name}
              {activeSub && (
                <span style={{ color: "var(--color-muted)" }}>
                  {" "}
                  / {category.subcategories.find((s) => s.slug === activeSub)?.name}
                </span>
              )}
            </h1>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-56 rounded-xl animate-pulse" style={{ background: "var(--color-line)" }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                No products found in this section yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

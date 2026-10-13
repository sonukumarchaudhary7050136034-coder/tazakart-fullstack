"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, ApiCategory } from "@/lib/api";

export default function CategoryGrid() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(() => setError("Could not load categories. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: "var(--color-line)" }} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="flex flex-col items-center text-center gap-2 rounded-xl border p-4 bg-white hover:shadow-md transition-shadow"
          style={{ borderColor: "var(--color-line)" }}
        >
          <span className="text-4xl">{cat.icon}</span>
          <span className="text-sm font-semibold leading-tight">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}

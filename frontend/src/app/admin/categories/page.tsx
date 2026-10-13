"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { api, ApiCategory } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categoryList, setCategoryList] = useState<ApiCategory[]>([]);
  const [newCat, setNewCat] = useState("");
  const [subInputs, setSubInputs] = useState<Record<number, string>>({});

  const load = () => { api.getCategories().then(setCategoryList); };
  useEffect(load, []);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    await api.adminCreateCategory({
      slug: newCat.toLowerCase().replace(/\s+/g, "-"),
      name: newCat,
      icon: "🛍️",
    });
    setNewCat("");
    load();
  };

  const addSubCategory = async (catId: number) => {
    const value = subInputs[catId]?.trim();
    if (!value) return;
    await api.adminAddSubCategory(catId, {
      slug: value.toLowerCase().replace(/\s+/g, "-"),
      name: value,
    });
    setSubInputs({ ...subInputs, [catId]: "" });
    load();
  };

  return (
    <AdminShell>
      <h1 className="text-xl font-bold mb-1">Categories</h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>Manage categories and subcategories</p>

      <div className="bg-white rounded-xl border p-4 mb-6 flex gap-3" style={{ borderColor: "var(--color-line)" }}>
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name"
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--color-line)" }}
        />
        <button
          onClick={addCategory}
          className="px-4 py-2 rounded-lg text-white font-semibold text-sm"
          style={{ background: "var(--color-primary)" }}
        >
          + Add Category
        </button>
      </div>

      <div className="space-y-4">
        {categoryList.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border p-4" style={{ borderColor: "var(--color-line)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm">{cat.icon} {cat.name}</p>
              <span className="text-xs" style={{ color: "var(--color-muted)" }}>{cat.subcategories.length} subcategories</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {cat.subcategories.map((s) => (
                <span key={s.id} className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--color-bg)" }}>
                  {s.name}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={subInputs[cat.id] || ""}
                onChange={(e) => setSubInputs({ ...subInputs, [cat.id]: e.target.value })}
                placeholder="New subcategory"
                className="flex-1 border rounded-lg px-3 py-1.5 text-xs outline-none"
                style={{ borderColor: "var(--color-line)" }}
              />
              <button
                onClick={() => addSubCategory(cat.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

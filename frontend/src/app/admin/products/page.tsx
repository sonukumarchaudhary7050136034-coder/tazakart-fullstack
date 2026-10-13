"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { api, ApiCategory, ApiProduct } from "@/lib/api";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    category_id: 0,
    subcategory_id: 0,
    price: "",
    mrp: "",
    unit: "",
    stock: "",
  });

  const load = () => {
    api.getProducts().then(setProductList);
    api.getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length && !form.category_id) {
        setForm((f) => ({ ...f, category_id: cats[0].id, subcategory_id: cats[0].subcategories[0]?.id ?? 0 }));
      }
    });
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedCategory = categories.find((c) => c.id === form.category_id);

  const addProduct = async () => {
    if (!form.name || !form.price || !form.unit || !form.category_id) return;
    setSaving(true);
    setError("");
    try {
      await api.adminCreateProduct({
        name: form.name,
        unit: form.unit,
        price: Number(form.price),
        mrp: Number(form.mrp || form.price),
        image: "/products/milk-1.svg",
        stock: Number(form.stock || 0),
        category_id: form.category_id,
        subcategory_id: form.subcategory_id || null,
      });
      setShowForm(false);
      setForm({ name: "", category_id: categories[0]?.id ?? 0, subcategory_id: categories[0]?.subcategories[0]?.id ?? 0, price: "", mrp: "", unit: "", stock: "" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: number) => {
    await api.adminDeleteProduct(id);
    load();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>{productList.length} products in catalog</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 rounded-lg text-white font-semibold text-sm"
          style={{ background: "var(--color-primary)" }}
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-5 mb-6 grid grid-cols-2 gap-4" style={{ borderColor: "var(--color-line)" }}>
          <div>
            <label className="text-xs font-semibold block mb-1">Product Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--color-line)" }}
              placeholder="Fresh Toned Milk"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Unit / Quantity</label>
            <input
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--color-line)" }}
              placeholder="500 ml"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => {
                const catId = Number(e.target.value);
                const cat = categories.find((c) => c.id === catId);
                setForm({ ...form, category_id: catId, subcategory_id: cat?.subcategories[0]?.id ?? 0 });
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--color-line)" }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Sub Category</label>
            <select
              value={form.subcategory_id}
              onChange={(e) => setForm({ ...form, subcategory_id: Number(e.target.value) })}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--color-line)" }}
            >
              {selectedCategory?.subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Price (₹)</label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--color-line)" }}
              placeholder="30"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">MRP (₹)</label>
            <input
              value={form.mrp}
              onChange={(e) => setForm({ ...form, mrp: e.target.value.replace(/\D/g, "") })}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--color-line)" }}
              placeholder="32"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Stock</label>
            <input
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value.replace(/\D/g, "") })}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--color-line)" }}
              placeholder="100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Product Image</label>
            <input type="file" accept="image/*" className="w-full text-xs" />
          </div>
          {error && <p className="col-span-2 text-xs text-red-600">{error}</p>}
          <div className="col-span-2">
            <button
              onClick={addProduct}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-60"
              style={{ background: "var(--color-primary)" }}
            >
              {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-line)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ background: "var(--color-bg)", color: "var(--color-muted)" }}>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: "var(--color-line)" }}>
                <td className="p-3 font-medium">{p.name} <span style={{ color: "var(--color-muted)" }}>({p.unit})</span></td>
                <td className="p-3">{categories.find((c) => c.id === p.category_id)?.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  {p.stock === 0 ? (
                    <span className="text-red-600 font-semibold">Out of stock</span>
                  ) : (
                    p.stock
                  )}
                </td>
                <td className="p-3 space-x-3">
                  <button className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-xs font-semibold text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

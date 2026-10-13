"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/categories", label: "Categories", icon: "🗂️" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/coupons", label: "Coupons & Offers", icon: "🏷️" },
  { href: "/admin/banners", label: "Banners", icon: "🖼️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, ready, logoutAdmin } = useAuth();

  if (!ready) return null;

  if (!isAdmin) {
    router.replace("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-bg)" }}>
      <aside className="w-60 shrink-0 text-white flex flex-col" style={{ background: "#0F1C14" }}>
        <div className="px-5 py-5 border-b border-white/10">
          <span className="text-lg font-black" style={{ color: "var(--color-accent)" }}>TazaKart</span>
          <p className="text-[11px] text-white/50">Admin Panel</p>
        </div>
        <nav className="flex-1 py-3 space-y-1 px-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
                style={{ background: active ? "var(--color-primary)" : "transparent", opacity: active ? 1 : 0.8 }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => {
            logoutAdmin();
            router.push("/admin/login");
          }}
          className="m-3 px-3 py-2.5 rounded-lg text-sm text-left bg-white/10"
        >
          🚪 Logout
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-x-auto">{children}</main>
    </div>
  );
}

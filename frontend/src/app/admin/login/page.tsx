"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Enter email and password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.adminLogin(email, password);
      localStorage.setItem("adminToken", res.access_token);
      loginAdmin();
      router.push("/admin/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0F1C14" }}>
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        <div className="text-center mb-6">
          <span className="text-2xl font-black" style={{ color: "var(--color-primary)" }}>Taza</span>
          <span className="text-2xl font-black" style={{ color: "var(--color-accent)" }}>Kart</span>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>Admin Panel</p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: "var(--color-line)" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: "var(--color-line)" }}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-60"
            style={{ background: "var(--color-primary)" }}
          >
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </button>
          <p className="text-[11px] text-center" style={{ color: "var(--color-muted)" }}>
            Demo: admin@tazakart.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { api } from "@/lib/api";

interface UserRow {
  id: number;
  name: string;
  email: string | null;
  auth_provider: string | null;
  is_blocked: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const load = () => { api.adminListUsers().then((u) => setUsers(u as UserRow[])); };
  useEffect(load, []);

  const toggleBlock = async (id: number) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_blocked: !u.is_blocked } : u)));
    await api.adminToggleBlockUser(id);
  };

  return (
    <AdminShell>
      <h1 className="text-xl font-bold mb-1">Users</h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>View and manage customer accounts</p>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-line)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ background: "var(--color-bg)", color: "var(--color-muted)" }}>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Login via</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center" style={{ color: "var(--color-muted)" }}>No customers yet.</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-t" style={{ borderColor: "var(--color-line)" }}>
                <td className="p-3">{u.id}</td>
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.auth_provider}</td>
                <td className="p-3">
                  {u.is_blocked ? (
                    <span className="text-red-600 font-semibold text-xs">Blocked</span>
                  ) : (
                    <span className="font-semibold text-xs" style={{ color: "var(--color-primary)" }}>Active</span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleBlock(u.id)}
                    className="text-xs font-semibold"
                    style={{ color: u.is_blocked ? "var(--color-primary)" : "#DC2626" }}
                  >
                    {u.is_blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

import AdminShell from "@/components/admin/AdminShell";
import { products, categories } from "@/data/dummyData";

const stats = [
  { label: "Total Orders", value: "1,284", change: "+12% this week" },
  { label: "Revenue (30d)", value: "₹4,82,300", change: "+8% vs last month" },
  { label: "Products", value: String(products.length), change: `${categories.length} categories` },
  { label: "Active Users", value: "3,942", change: "+64 today" },
];

const recentOrders = [
  { id: "1001", customer: "Sonu Kumar", amount: 450, status: "Pending" },
  { id: "1002", customer: "Rahul Verma", amount: 320, status: "Confirmed" },
  { id: "1003", customer: "Amit Singh", amount: 780, status: "Delivered" },
];

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <h1 className="text-xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        Overview of your store performance
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4" style={{ borderColor: "var(--color-line)" }}>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-primary)" }}>{s.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "var(--color-line)" }}>
        <h2 className="text-sm font-bold mb-4">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ color: "var(--color-muted)" }}>
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-t" style={{ borderColor: "var(--color-line)" }}>
                <td className="py-2 font-medium">#{o.id}</td>
                <td className="py-2">{o.customer}</td>
                <td className="py-2">₹{o.amount}</td>
                <td className="py-2">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

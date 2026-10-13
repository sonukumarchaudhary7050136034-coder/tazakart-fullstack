const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(key: "userToken" | "adminToken") {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  tokenKey: "userToken" | "adminToken" | null = null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (tokenKey) {
    const token = getToken(tokenKey);
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---------- Types ----------
export interface ApiSubCategory {
  id: number;
  slug: string;
  name: string;
}
export interface ApiCategory {
  id: number;
  slug: string;
  name: string;
  icon: string;
  subcategories: ApiSubCategory[];
}
export interface ApiProduct {
  id: number;
  name: string;
  unit: string;
  price: number;
  mrp: number;
  image: string;
  stock: number;
  delivery_time: string;
  category_id: number;
  subcategory_id: number | null;
}
export interface ApiAddress {
  id: number;
  label: string;
  house: string;
  area: string;
  city: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
}
export interface ApiOrderItem {
  product_name: string;
  price: number;
  quantity: number;
}
export interface ApiOrder {
  id: number;
  items_total: number;
  delivery_charge: number;
  handling_charge: number;
  grand_total: number;
  payment_method: string;
  status: string;
  created_at: string;
  items: ApiOrderItem[];
}

// ---------- Public ----------
export const api = {
  getCategories: () => request<ApiCategory[]>("/api/categories"),
  getCategory: (slug: string) => request<ApiCategory>(`/api/categories/${slug}`),
  getProducts: (params?: { category_slug?: string; subcategory_slug?: string; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<ApiProduct[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (id: number) => request<ApiProduct>(`/api/products/${id}`),

  // ---------- User auth (Email OTP + Google) ----------
  getAuthConfig: () =>
    request<{ google_enabled: boolean; google_client_id: string | null }>("/api/auth/config"),
  sendEmailOtp: (email: string) =>
    request<{ message: string; dev_otp?: string }>("/api/auth/email/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  verifyEmailOtp: (email: string, otp: string, name?: string) =>
    request<{ access_token: string; role: string }>("/api/auth/email/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp, name }),
    }),
  googleLogin: (credential: string) =>
    request<{ access_token: string; role: string }>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    }),
  getMe: () => request("/api/auth/me", {}, "userToken"),

  // ---------- Addresses ----------
  getAddresses: () => request<ApiAddress[]>("/api/addresses", {}, "userToken"),
  addAddress: (payload: Omit<ApiAddress, "id">) =>
    request<ApiAddress>("/api/addresses", { method: "POST", body: JSON.stringify(payload) }, "userToken"),

  // ---------- Cart (server-side, synced at checkout) ----------
  addToCart: (product_id: number, quantity: number) =>
    request("/api/cart", { method: "POST", body: JSON.stringify({ product_id, quantity }) }, "userToken"),

  // ---------- Orders ----------
  placeOrder: (address_id: number, payment_method: string) =>
    request<ApiOrder>(
      "/api/orders",
      { method: "POST", body: JSON.stringify({ address_id, payment_method }) },
      "userToken"
    ),
  myOrders: () => request<ApiOrder[]>("/api/orders/my", {}, "userToken"),

  // ---------- Admin auth ----------
  adminLogin: (email: string, password: string) =>
    request<{ access_token: string; role: string }>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // ---------- Admin: products ----------
  adminCreateProduct: (payload: Partial<ApiProduct>) =>
    request<ApiProduct>("/api/products", { method: "POST", body: JSON.stringify(payload) }, "adminToken"),
  adminUpdateProduct: (id: number, payload: Partial<ApiProduct>) =>
    request<ApiProduct>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }, "adminToken"),
  adminDeleteProduct: (id: number) =>
    request(`/api/products/${id}`, { method: "DELETE" }, "adminToken"),

  // ---------- Admin: categories ----------
  adminCreateCategory: (payload: { slug: string; name: string; icon?: string }) =>
    request<ApiCategory>("/api/categories", { method: "POST", body: JSON.stringify(payload) }, "adminToken"),
  adminAddSubCategory: (categoryId: number, payload: { slug: string; name: string }) =>
    request<ApiSubCategory>(
      `/api/categories/${categoryId}/subcategories`,
      { method: "POST", body: JSON.stringify(payload) },
      "adminToken"
    ),

  // ---------- Admin: orders ----------
  adminAllOrders: () => request<ApiOrder[]>("/api/orders", {}, "adminToken"),
  adminUpdateOrderStatus: (orderId: number, status: string) =>
    request<ApiOrder>(
      `/api/orders/${orderId}/status`,
      { method: "PUT", body: JSON.stringify({ status }) },
      "adminToken"
    ),

  // ---------- Admin: users ----------
  adminListUsers: () => request("/api/users", {}, "adminToken"),
  adminToggleBlockUser: (userId: number) =>
    request(`/api/users/${userId}/block`, { method: "PUT" }, "adminToken"),
};

export function getApiBase() {
  return API_BASE;
}

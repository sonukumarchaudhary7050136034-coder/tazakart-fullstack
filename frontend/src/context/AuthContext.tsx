"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  ready: boolean;
  login: (user: User) => void;
  logout: () => void;
  loginAdmin: () => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    if (adminToken) setIsAdmin(true);
    if (userToken && userEmail) setUser({ name: userName || userEmail.split("@")[0], email: userEmail });
    setReady(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        ready,
        login: (u) => {
          setUser(u);
          localStorage.setItem("userEmail", u.email);
          localStorage.setItem("userName", u.name);
        },
        logout: () => {
          setUser(null);
          localStorage.removeItem("userToken");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userName");
        },
        loginAdmin: () => setIsAdmin(true),
        logoutAdmin: () => {
          setIsAdmin(false);
          localStorage.removeItem("adminToken");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

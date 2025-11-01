"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test credentials
const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "test123";
const TEST_USER: User = {
  email: TEST_EMAIL,
  name: "Test User"
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");
    if (authStatus === "true" && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if not authenticated and not on auth pages
      if (!pathname.startsWith("/auth")) {
        router.push("/auth/login");
      }
    }
  }, [pathname, router]);

  const login = (email: string, password: string): boolean => {
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      setIsAuthenticated(true);
      setUser(TEST_USER);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(TEST_USER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id?: string;
  email: string;
  name: string;
  role: "user" | "admin" | "coach" | "student";
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
  name: "Test User",
  role: "user"
};

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_USER: User = {
  email: ADMIN_EMAIL,
  name: "Admin",
  role: "admin"
};

const COACH_EMAIL = "coach@example.com";
const COACH_PASSWORD = "coach123";
const COACH_USER: User = {
  id: "COACH_001",
  email: COACH_EMAIL,
  name: "John Coach",
  role: "coach"
};

const STUDENT_EMAIL = "student@example.com";
const STUDENT_PASSWORD = "student123";
const STUDENT_USER: User = {
  id: "STU_001",
  email: STUDENT_EMAIL,
  name: "Aarav Patel",
  role: "student"
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
    let currentUser: User | null = null;
    
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      currentUser = TEST_USER;
    } else if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      currentUser = ADMIN_USER;
    } else if (email === COACH_EMAIL && password === COACH_PASSWORD) {
      currentUser = COACH_USER;
    } else if (email === STUDENT_EMAIL && password === STUDENT_PASSWORD) {
      currentUser = STUDENT_USER;
    }
    
    if (currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(currentUser));
      router.push("/role-selection");
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

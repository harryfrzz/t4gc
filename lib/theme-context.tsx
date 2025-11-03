"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("theme") as Theme | null;
  return stored || "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  // Initialize theme on mount
  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newTheme = e.matches ? "dark" : "light";
        setActualTheme(newTheme);
        updateDOM(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  function applyTheme(newTheme: Theme) {
    const resolvedTheme = newTheme === "system" ? getSystemTheme() : newTheme;
    setActualTheme(resolvedTheme);
    updateDOM(resolvedTheme);
  }

  function updateDOM(resolvedTheme: "light" | "dark") {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  }

  function toggleTheme() {
    const newTheme = actualTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

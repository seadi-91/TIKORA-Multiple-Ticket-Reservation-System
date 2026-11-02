"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  systemIsDark: boolean;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [systemIsDark, setSystemIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tikora_theme") as Theme | null;
    const initialTheme: Theme = saved || "system";
    setThemeState(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(mediaQuery.matches);

    const applyTheme = () => {
      const isDark =
        theme === "dark" || (theme === "system" && mediaQuery.matches);

      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
        setResolvedTheme("dark");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
        setResolvedTheme("light");
      }

      root.setAttribute("data-theme", isDark ? "dark" : "light");
      root.setAttribute("data-theme-setting", theme);
    };

    applyTheme();

    const listener = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("tikora_theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, systemIsDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeProvider;

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export default function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [initialized, setInitialized] = useState(false);

  // ==========================================
  // Read saved theme ONCE (falls back to system preference)
  // ==========================================

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("partiva-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme(initialTheme);
    }

    setInitialized(true);
  }, [initialTheme]);

  // ==========================================
  // Apply theme
  // ==========================================

  useEffect(() => {
    if (!initialized) return;

    document.documentElement.classList.toggle("dark", theme === "dark");

    window.localStorage.setItem("partiva-theme", theme);

    document.cookie = `partiva-theme=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [theme, initialized]);

  // ==========================================
  // Toggle theme
  // ==========================================

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type DarkModeContextValue = {
  isDark: boolean;
  toggleDark: () => void;
};

const DarkModeContext = createContext<DarkModeContextValue | null>(null);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("mood_dark_mode");
    if (stored !== null) {
      const dark = stored === "true";
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("mood_dark_mode", String(next));
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be inside <DarkModeProvider>");
  return ctx;
}

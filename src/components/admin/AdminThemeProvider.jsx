"use client";

import * as React from "react";
import { ADMIN_THEME_KEY } from "@/components/admin/theme-constants";

const ThemeContext = React.createContext({ theme: "dark", toggleTheme: () => {}, setTheme: () => {} });

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(ADMIN_THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : "dark";
  } catch {
    return "dark";
  }
}

/**
 * Keeps `data-theme` on <html> in sync with the admin's light/dark choice.
 * The public site is always dark, so the attribute is removed again when
 * the dashboard unmounts (e.g. after navigating to the website).
 */
export function AdminThemeProvider({ children }) {
  const [theme, setThemeState] = React.useState("dark");

  React.useEffect(() => {
    // Also covers client-side navigation into /admin, where the inline script doesn't run.
    const stored = readStoredTheme();
    setThemeState(stored);
    document.documentElement.dataset.theme = stored;
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  const setTheme = React.useCallback((value) => {
    setThemeState(value);
    document.documentElement.dataset.theme = value;
    try {
      window.localStorage.setItem(ADMIN_THEME_KEY, value);
    } catch {
      // storage unavailable — the theme still applies for this visit
    }
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAdminTheme() {
  return React.useContext(ThemeContext);
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AudienceMode } from "@/lib/content/portfolioContent";

interface AudienceContextValue {
  audienceMode: AudienceMode;
  setAudienceMode: (mode: AudienceMode) => void;
  theme: "cream" | "dark";
  setTheme: (theme: "cream" | "dark") => void;
  toggleTheme: () => void;
}

const AudienceContext = createContext<AudienceContextValue | undefined>(undefined);

function getInitialAudience(): AudienceMode {
  if (typeof window !== "undefined") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get("view")?.toLowerCase();
      if (viewParam === "simple" || viewParam === "recruiter" || viewParam === "engineer") {
        return viewParam;
      }
      const savedMode = localStorage.getItem("rishi_portfolio_audience") as AudienceMode | null;
      if (savedMode === "simple" || savedMode === "recruiter" || savedMode === "engineer") {
        return savedMode;
      }
    } catch {
      // storage blocked
    }
  }
  return "simple";
}

function getInitialTheme(): "cream" | "dark" {
  if (typeof window !== "undefined") {
    try {
      const savedTheme = localStorage.getItem("rishi_portfolio_theme");
      if (savedTheme === "cream" || savedTheme === "dark") {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "cream";
    } catch {
      return "cream";
    }
  }
  return "cream";
}

function applyThemeToDocument(t: "cream" | "dark") {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (t === "dark") {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    } else {
      root.removeAttribute("data-theme");
      root.classList.remove("dark");
    }
  }
}

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [audienceMode, setAudienceModeState] = useState<AudienceMode>(getInitialAudience);
  const [theme, setThemeState] = useState<"cream" | "dark">(getInitialTheme);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState("");

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setAudienceMode = useCallback((mode: AudienceMode) => {
    setAudienceModeState(mode);
    setScreenReaderAnnouncement(`Switched audience view to ${mode} mode`);

    try {
      localStorage.setItem("rishi_portfolio_audience", mode);
    } catch {
      // storage disabled
    }

    try {
      const url = new URL(window.location.href);
      url.searchParams.set("view", mode);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // history state fallback
    }
  }, []);

  const setTheme = useCallback((t: "cream" | "dark") => {
    setThemeState(t);
    applyThemeToDocument(t);
    try {
      localStorage.setItem("rishi_portfolio_theme", t);
    } catch {
      // storage disabled
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "cream" ? "dark" : "cream");
  }, [theme, setTheme]);

  return (
    <AudienceContext.Provider
      value={{
        audienceMode,
        setAudienceMode,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      <div aria-live="polite" className="sr-only">
        {screenReaderAnnouncement}
      </div>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const context = useContext(AudienceContext);
  if (!context) {
    throw new Error("useAudience must be used within an AudienceProvider");
  }
  return context;
}

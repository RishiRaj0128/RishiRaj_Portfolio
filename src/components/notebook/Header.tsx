"use client";

import React from "react";
import Link from "next/link";
import { useAudience } from "./AudienceContext";
import { AudienceMode } from "@/lib/content/portfolioContent";

export function Header() {
  const { audienceMode, setAudienceMode, theme, toggleTheme } = useAudience();

  const modes: { id: AudienceMode; label: string; description: string }[] = [
    { id: "simple", label: "Simple", description: "Plain English & everyday analogies" },
    { id: "recruiter", label: "Recruiter", description: "Impact, skills & verified results" },
    { id: "engineer", label: "Engineer", description: "Architecture, algorithms & exact specs" },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % modes.length;
      setAudienceMode(modes[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
      setAudienceMode(modes[prevIndex].id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-base)]/95 backdrop-blur-sm border-b border-[var(--color-border-default)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex flex-col group focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] rounded-[2px]"
          >
            <span className="font-serif font-bold text-lg text-[var(--color-text-primary)] tracking-tight leading-none">
              Rishi Raj
            </span>
            <span className="font-mono text-[11px] text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent)] transition-colors mt-0.5">
              Engineer&apos;s Notebook
            </span>
          </Link>
        </div>

        {/* Center: Three-way Audience Switch */}
        <div className="flex items-center">
          <nav
            role="tablist"
            aria-label="Audience view perspective"
            className="flex items-center p-1 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[3px]"
          >
            {modes.map((mode, index) => {
              const isActive = audienceMode === mode.id;
              return (
                <button
                  key={mode.id}
                  role="tab"
                  id={`audience-tab-${mode.id}`}
                  aria-selected={isActive}
                  aria-controls="main-content"
                  title={mode.description}
                  onClick={() => setAudienceMode(mode.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`px-2.5 sm:px-3.5 py-1 text-xs sm:text-sm font-sans transition-all duration-150 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
                    isActive
                      ? "bg-[var(--color-card)] text-[var(--color-text-primary)] font-semibold border border-[var(--color-border-active)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-transparent"
                  }`}
                >
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Theme Toggle & Explore 3D mode link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "cream" ? "Dark" : "Cream Notebook"} theme`}
            className="p-1.5 sm:px-2.5 sm:py-1 bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-border-active)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[2px] text-xs font-mono transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            {theme === "cream" ? (
              <>
                <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span className="hidden sm:inline">Cream</span>
              </>
            )}
          </button>

          {/* Explore Mode Link */}
          <Link
            href="/explore"
            className="px-2.5 sm:px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] text-[var(--color-accent)] rounded-[2px] text-xs font-mono transition-colors flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            title="Switch to interactive 3D topology simulator"
          >
            <span>Explore 3D</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

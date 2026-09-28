"use client";

import React, { useState, useRef, useEffect } from "react";
import { JARGON_DICTIONARY } from "@/lib/content/portfolioContent";

interface JargonTooltipProps {
  term: string;
  jargonKey?: string;
  children?: React.ReactNode;
}

export function JargonTooltip({ term, jargonKey, children }: JargonTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const lookupKey = (jargonKey || term).toLowerCase().trim();
  const definition = JARGON_DICTIONARY[lookupKey] || "Technical concept in distributed systems.";

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="inline cursor-help text-inherit underline decoration-dotted decoration-[var(--color-accent)] underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] rounded-[2px]"
        aria-expanded={isOpen}
      >
        {children || term}
      </button>

      {isOpen && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-2.5 text-xs bg-[var(--color-card)] text-[var(--color-text-primary)] border border-[var(--color-border-active)] rounded-[3px] pointer-events-none block animate-in fade-in zoom-in-95 duration-150"
        >
          <span className="block font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider mb-1 font-semibold">
            PLAIN DEFINITION // {term}
          </span>
          <span className="block font-sans text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {definition}
          </span>
          {/* Subtle notch */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[var(--color-border-active)]" />
        </span>
      )}
    </span>
  );
}

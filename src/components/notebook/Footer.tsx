"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  const commitHash = "58ad60e";
  const buildDate = "September 28, 2026";

  return (
    <footer className="py-12 bg-[var(--color-surface)] border-t border-[var(--color-border-default)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Identity & Legal note */}
          <div className="space-y-1">
            <div className="font-serif font-bold text-lg text-[var(--color-text-primary)]">
              Rishi Raj
            </div>
            <p className="font-sans text-xs text-[var(--color-text-secondary)]">
              Backend Distributed Systems & Fault Tolerance • B.Tech CSE, Lovely Professional University
            </p>
            <p className="font-mono text-[11px] text-[var(--color-text-tertiary)] pt-1">
              Build Rev: <span className="text-[var(--color-accent)]">{commitHash}</span> • {buildDate}
            </p>
          </div>

          {/* Navigation & Legal Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
            <Link
              href="/explore"
              className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              <span>Explore 3D Mode</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/terms"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              Privacy Policy
            </Link>
            <a
              href="https://github.com/RishiRaj0128"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rishiraj28/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              LinkedIn
            </a>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-4 border-t border-[var(--color-border-subtle)] text-center sm:text-left text-[11px] font-mono text-[var(--color-text-tertiary)] flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 Rishi Raj. All rights reserved. Zero trackers, zero cookies.</span>
          <span>Designed as an Engineer&apos;s Notebook</span>
        </div>
      </div>
    </footer>
  );
}

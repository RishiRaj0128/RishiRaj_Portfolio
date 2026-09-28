"use client";

import React from "react";
import { PORTFOLIO_CONTENT } from "@/lib/content/portfolioContent";

export function AboutPrinciples() {
  return (
    <section id="about" className="py-16 sm:py-24 border-b border-[var(--color-border-default)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* About Me Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-2">
                BACKGROUND // HUMAN CONTEXT
              </span>
              <h2 className="font-serif text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                {PORTFOLIO_CONTENT.about.heading}
              </h2>
            </div>

            {/* Human paragraph */}
            <div className="p-5 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-4">
              <p className="font-sans text-sm sm:text-base text-[var(--color-text-primary)] leading-relaxed">
                {PORTFOLIO_CONTENT.about.paragraph}
              </p>

              <div className="pt-3 border-t border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-tertiary)] flex items-center justify-between">
                <span>EDUCATION</span>
                <span className="text-[var(--color-text-primary)] font-semibold">B.Tech CSE • CGPA 7.98</span>
              </div>
            </div>
          </div>

          {/* How I Work Principles Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-2">
                OPERATING PRINCIPLES
              </span>
              <h2 className="font-serif text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                How I Work
              </h2>
            </div>

            <div className="space-y-4">
              {PORTFOLIO_CONTENT.principles.map((principle, pIdx) => (
                <div
                  key={pIdx}
                  className="p-5 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-2"
                >
                  <h3 className="font-serif text-lg font-bold text-[var(--color-text-primary)]">
                    {principle.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

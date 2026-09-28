"use client";

import React from "react";
import { PORTFOLIO_CONTENT } from "@/lib/content/portfolioContent";

export function TimelineSecurity() {
  return (
    <section id="timeline" className="py-16 sm:py-24 border-b border-[var(--color-border-default)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Timeline Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-2">
                ACADEMIC & PROFESSIONAL HISTORY
              </span>
              <h2 className="font-serif text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                Timeline & Benchmarks
              </h2>
            </div>

            <div className="space-y-4">
              {PORTFOLIO_CONTENT.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                    <span className="font-bold text-[var(--color-accent)]">
                      {item.role}
                    </span>
                    <span className="text-[var(--color-text-tertiary)]">
                      {item.period}
                    </span>
                  </div>

                  <div className="font-serif text-sm font-semibold text-[var(--color-text-primary)]">
                    {item.organization}
                  </div>

                  <ul className="space-y-1 text-xs font-sans text-[var(--color-text-secondary)] leading-relaxed">
                    {item.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-1.5">
                        <span className="text-[var(--color-text-tertiary)] font-mono">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Security Status Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-2">
                DEFENSIVE ARCHITECTURE
              </span>
              <h2 className="font-serif text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                Security Audit Status
              </h2>
            </div>

            <div className="p-5 sm:p-6 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-5">
              
              {/* Honest Status Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border-default)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-status-warn)] inline-block animate-pulse" />
                  <span className="font-mono text-xs font-bold text-[var(--color-status-warn)] uppercase">
                    {PORTFOLIO_CONTENT.securityStatus.statusBadge}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {PORTFOLIO_CONTENT.securityStatus.description}
              </p>

              {/* Planned Scope */}
              <div className="space-y-2.5">
                <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider block font-semibold">
                  AUDIT PIPELINE SCOPE
                </span>
                <div className="space-y-2">
                  {PORTFOLIO_CONTENT.securityStatus.plannedScope.map((scope, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-[2px] text-xs font-mono"
                    >
                      <div className="font-bold text-[var(--color-text-primary)] mb-0.5">
                        {sIdx + 1}. {scope.area}
                      </div>
                      <div className="font-sans text-[11px] text-[var(--color-text-tertiary)]">
                        {scope.details}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool reference */}
              <div className="pt-2 border-t border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-tertiary)] flex items-center justify-between">
                <span>Planned: automated security audit (Strix)</span>
                <a
                  href="https://github.com/usestrix/strix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
                >
                  <span>github.com/usestrix/strix</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

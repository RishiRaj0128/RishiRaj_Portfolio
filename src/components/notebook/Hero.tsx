"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAudience } from "./AudienceContext";
import { PORTFOLIO_CONTENT } from "@/lib/content/portfolioContent";
import { AmberUnderline } from "./illustrations/BlueprintDrawings";
import { runBreakItSimulation, BreakItResult } from "@/lib/simulations/breakItSimulation";

export function Hero({ hasPhoto = false }: { hasPhoto?: boolean }) {
  const { audienceMode } = useAudience();
  const [simState, setSimState] = useState<"idle" | "running" | "crashed">("idle");
  const [breakItData, setBreakItData] = useState<BreakItResult | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleCrashServer = async (timingMs = 750) => {
    setSimState("running");
    try {
      // Simulate real execution delay
      const delay = prefersReducedMotion ? 0 : 350;
      await new Promise((r) => setTimeout(r, delay));
      const result = await runBreakItSimulation(timingMs);
      setBreakItData(result);
      setSimState("crashed");
    } catch {
      setSimState("idle");
    }
  };

  const handleReset = () => {
    const randomized = 600 + Math.floor(Math.random() * 300);
    handleCrashServer(randomized);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-default)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Identity, Promise, Copy, Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Core Promise Banner */}
            <div className="inline-block p-2.5 sm:p-3 bg-[var(--color-card)] border border-[var(--color-border-active)] rounded-[3px]">
              <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-1">
                CORE PROMISE
              </span>
              <p className="font-serif text-base sm:text-lg text-[var(--color-text-primary)] italic leading-snug">
                &ldquo;{PORTFOLIO_CONTENT.hero.promise}&rdquo;
              </p>
            </div>

            {/* Name, Title, and Photo Dossier */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="inline-block relative">
                  <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] tracking-tight">
                    {PORTFOLIO_CONTENT.personal.name}
                  </h1>
                  <div className="mt-1">
                    <AmberUnderline className="w-40 sm:w-48 h-2 text-[var(--color-accent)]" />
                  </div>
                </div>
                <p className="font-mono text-xs sm:text-sm text-[var(--color-text-secondary)] mt-2">
                  {PORTFOLIO_CONTENT.personal.education}
                </p>
              </div>

              {/* Photo slot (cropped plain rectangle, 3px radius, 1px border; graceful fallback if absent at build time) */}
              {hasPhoto && (
                <div className="relative w-28 h-36 sm:w-32 sm:h-40 shrink-0 rounded-[3px] border border-[var(--color-border-default)] overflow-hidden bg-[var(--color-surface)]">
                  <Image
                    src="/rishi.jpg"
                    alt="Rishi Raj - Backend & Distributed Systems Engineer"
                    fill
                    priority
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Audience-Specific Headline and Subhead */}
            <div className="space-y-3 min-h-[140px] transition-opacity duration-200">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] leading-tight">
                {PORTFOLIO_CONTENT.hero.headline[audienceMode]}
              </h2>
              <p className="font-sans text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                {PORTFOLIO_CONTENT.hero.subhead[audienceMode]}
              </p>
            </div>

            {/* Three Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="px-4 py-2 bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-card)] font-sans font-semibold text-xs sm:text-sm rounded-[3px] transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                View projects
              </a>
              <a
                href="/Rishi_Raj_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-active)] font-sans text-xs sm:text-sm rounded-[3px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                Download resume
              </a>
              <a
                href="#contact"
                className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-active)] font-sans text-xs sm:text-sm rounded-[3px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                Contact
              </a>
            </div>

            {/* Target Roles Line */}
            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-status-ok)] inline-block" />
                <span className="font-mono text-xs font-semibold text-[var(--color-text-primary)]">
                  {PORTFOLIO_CONTENT.personal.statusMessage}
                </span>
              </div>
              <p className="font-mono text-[11px] text-[var(--color-text-tertiary)]">
                Target Roles:{" "}
                <span className="text-[var(--color-text-secondary)]">
                  {PORTFOLIO_CONTENT.personal.openToRoles.join(" • ")}
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive "Break It" Server Comparison */}
          <div className="lg:col-span-6">
            <div className="p-4 sm:p-5 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-4">
              
              {/* Header and Controls */}
              <div className="border-b border-[var(--color-border-default)] pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider block font-semibold">
                      {PORTFOLIO_CONTENT.breakItDemo.tagline}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[var(--color-text-primary)]">
                      {PORTFOLIO_CONTENT.breakItDemo.title}
                    </h3>
                  </div>

                  {/* Crash Action Buttons */}
                  <div className="flex items-center gap-2">
                    {simState !== "crashed" ? (
                      <button
                        type="button"
                        onClick={() => handleCrashServer(750)}
                        disabled={simState === "running"}
                        className="px-3 py-1.5 bg-[var(--color-status-err)] hover:opacity-90 disabled:opacity-50 text-white font-sans font-semibold text-xs rounded-[2px] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-status-err)]"
                      >
                        {simState === "running" ? "Crashing..." : PORTFOLIO_CONTENT.breakItDemo.buttonCrash}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-3 py-1.5 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-active)] font-mono text-xs rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                      >
                        Run again ⟳
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Two Comparative Panels Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* PANEL A: Without Reliable Systems (Fragile) */}
                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px] space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-[var(--color-status-err)] uppercase">
                      Without Reliable Systems
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[1px] bg-[var(--color-base)] text-[var(--color-text-tertiary)] border border-[var(--color-border-default)]">
                      {simState === "crashed" ? "CRASHED" : "NOMINAL"}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[var(--color-text-secondary)] leading-tight">
                    Direct HTTP writes with no consensus replication or idempotency safety.
                  </p>

                  {/* Computed Metrics */}
                  <div className="p-2 bg-[var(--color-base)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Orders lost:</span>
                      <span className={`font-bold ${simState === "crashed" ? "text-[var(--color-status-err)]" : "text-[var(--color-text-primary)]"}`}>
                        {simState === "crashed" ? `${breakItData?.fragile.ordersLost || 2} orders vanished` : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Duplicate charges:</span>
                      <span className={`font-bold ${simState === "crashed" ? "text-[var(--color-status-err)]" : "text-[var(--color-text-primary)]"}`}>
                        {simState === "crashed" ? `${breakItData?.fragile.duplicateCharges || 1} double-bill` : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Cluster recovery:</span>
                      <span className="text-[var(--color-status-err)] font-bold">
                        {simState === "crashed" ? "Failed / Offline" : "Standing by"}
                      </span>
                    </div>
                  </div>

                  {simState === "crashed" && (
                    <div className="text-[11px] font-sans text-[var(--color-status-err)] leading-snug bg-[var(--color-base)] p-1.5 border border-[var(--color-status-err)]/20 rounded-[2px]">
                      {breakItData?.fragile.description}
                    </div>
                  )}
                </div>

                {/* PANEL B: With Systems Like I Build (Reliable) */}
                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-accent)]/40 rounded-[2px] space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-[var(--color-accent)] uppercase">
                      With Systems Like I Build
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[1px] bg-[var(--color-base)] text-[var(--color-status-ok)] border border-[var(--color-status-ok)]/40">
                      {simState === "crashed" ? "RECOVERED" : "NOMINAL"}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[var(--color-text-secondary)] leading-tight">
                    Raft ISR consensus quorum + double-entry Saga compensation state machine.
                  </p>

                  {/* Computed Metrics */}
                  <div className="p-2 bg-[var(--color-base)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Orders lost:</span>
                      <span className="text-[var(--color-status-ok)] font-bold">
                        {simState === "crashed" ? `${breakItData?.reliable.ordersLost} (Zero loss)` : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Duplicate charges:</span>
                      <span className="text-[var(--color-status-ok)] font-bold">
                        {simState === "crashed" ? `${breakItData?.reliable.duplicateCharges} (Idempotent)` : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Cluster recovery:</span>
                      <span className="text-[var(--color-status-ok)] font-bold">
                        {simState === "crashed" ? `~${breakItData?.reliable.recoveryTimeMs}ms failover` : "Standing by"}
                      </span>
                    </div>
                  </div>

                  {simState === "crashed" && (
                    <div className="text-[11px] font-sans text-[var(--color-text-primary)] leading-snug bg-[var(--color-base)] p-1.5 border border-[var(--color-border-default)] rounded-[2px]">
                      {breakItData?.reliable.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Simulation Verification Notice */}
              <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-tertiary)]">
                <span>SIMULATION</span>
                <span>Numbers computed live via client-side simulation modules</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

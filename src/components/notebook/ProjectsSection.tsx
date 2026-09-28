"use client";

import React, { useState } from "react";
import { useAudience } from "./AudienceContext";
import { PORTFOLIO_CONTENT } from "@/lib/content/portfolioContent";
import { PaymentEngineDemo } from "./demos/PaymentEngineDemo";
import { MessageBrokerDemo } from "./demos/MessageBrokerDemo";
import { ShortenerDemo } from "./demos/ShortenerDemo";
import { BankBlueprint, QueueBlueprint, ReceiptBlueprint } from "./illustrations/BlueprintDrawings";

export function ProjectsSection() {
  const { audienceMode } = useAudience();
  const [detailsOpen, setDetailsOpen] = useState<Record<string, boolean>>({
    payment: false,
    broker: false,
    shortener: false,
  });

  const toggleDetails = (projectId: string) => {
    setDetailsOpen((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const paymentProject = PORTFOLIO_CONTENT.projects.find((p) => p.id === "payment")!;
  const brokerProject = PORTFOLIO_CONTENT.projects.find((p) => p.id === "broker")!;
  const shortenerProject = PORTFOLIO_CONTENT.projects.find((p) => p.id === "shortener")!;

  return (
    <section id="projects" className="py-16 sm:py-24 border-b border-[var(--color-border-default)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-2">
            ENGINEERED SYSTEMS // THREE-LAYER SPECIFICATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Flagship Engineering Projects
          </h2>
          <p className="font-sans text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 leading-relaxed">
            Presented in an editorial format: everyday analogies in plain English, exact architectural implementations, and verifiable empirical benchmarks.
          </p>
        </div>

        {/* EDITORIAL LAYOUT: 1 Large Featured Project + 2 Stacked Varied Entries */}
        <div className="space-y-12 sm:space-y-16">
          
          {/* ============================================================== */}
          {/* FEATURED PROJECT 1: Payment Engine & Movie Booking Platform   */}
          {/* ============================================================== */}
          <article
            id="project-payment"
            className="p-6 sm:p-8 md:p-10 bg-[var(--color-card)] border border-[var(--color-border-active)] rounded-[3px] space-y-8"
          >
            {/* Top Badge & Chapter */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[var(--color-accent)] text-[var(--color-card)] rounded-[2px]">
                  FEATURED SYSTEM // CHAPTER 1
                </span>
                <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                  JAVA • SPRING BOOT • MYSQL • REDIS
                </span>
              </div>

              {/* Repos & Live Links */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {paymentProject.liveUrl && (
                  <a
                    href={paymentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-[var(--color-accent)] border border-[var(--color-accent)] rounded-[2px] transition-colors inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  >
                    <span>Live app</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {paymentProject.repoUrl && (
                  <a
                    href={paymentProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-[2px] transition-colors inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  >
                    <span>GitHub repo</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {paymentProject.incidentLogUrl && (
                  <a
                    href={paymentProject.incidentLogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-[2px] transition-colors inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  >
                    <span>INCIDENTS.md</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                {paymentProject.title[audienceMode]}
              </h3>
              <p className="font-sans text-base text-[var(--color-text-secondary)]">
                {paymentProject.tagline[audienceMode]}
              </p>
            </div>

            {/* Visual Frame & Blueprint Graphic */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Illustration Frame */}
              <div className="lg:col-span-7 p-3 sm:p-4 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px] space-y-2">
                <BankBlueprint className="w-full h-52 sm:h-64 text-[var(--color-text-primary)]" />
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-tertiary)] pt-1 border-t border-[var(--color-border-subtle)]">
                  <span>ARCHITECTURE SKETCH // SAGA ORCHESTRATION</span>
                  <a
                    href={paymentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    Live app: coruscating-eclair-2724dd.netlify.app ↗
                  </a>
                </div>
              </div>

              {/* Plain English Layer A & Layer B */}
              <div className="lg:col-span-5 space-y-4">
                {/* Layer A: Plain English Analogy */}
                <div className="p-4 bg-[var(--color-surface)] border-l-2 border-[var(--color-accent)] rounded-r-[2px] space-y-1.5">
                  <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider block font-semibold">
                    IN PLAIN ENGLISH (ANALOGY)
                  </span>
                  <p className="font-serif text-sm sm:text-base text-[var(--color-text-primary)] italic leading-relaxed">
                    &ldquo;{paymentProject.analogy}&rdquo;
                  </p>
                </div>

                {/* Layer B: What I Built (2-3 Sentences) */}
                <div className="space-y-2">
                  <span className="font-mono text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider block font-semibold">
                    WHAT I BUILT
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm font-sans text-[var(--color-text-primary)] leading-relaxed">
                    {paymentProject.whatIBuilt[audienceMode].map((sentence, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="text-[var(--color-accent)] font-mono mt-0.5">•</span>
                        <span>{sentence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Embedded Live Demo */}
            <PaymentEngineDemo />

            {/* Layer C: Technical Details (Collapsed by Default) */}
            <div className="border border-[var(--color-border-default)] rounded-[2px] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleDetails("payment")}
                aria-expanded={detailsOpen.payment}
                className="w-full p-3.5 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[var(--color-text-primary)]">
                    LAYER C // TECHNICAL SPECIFICATION & VERIFIED RESULTS
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
                    (measured in my simulated tests)
                  </span>
                </div>
                <span className="font-mono text-xs text-[var(--color-accent)]">
                  {detailsOpen.payment ? "Hide Details ↑" : "Show Details ↓"}
                </span>
              </button>

              {detailsOpen.payment && (
                <div className="p-4 sm:p-6 bg-[var(--color-card)] border-t border-[var(--color-border-default)] space-y-6">
                  
                  {/* Verified Numbers Grid */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-tertiary)] mb-2">
                      <span>VERIFIED BENCHMARK RESULTS</span>
                      <span className="text-[var(--color-status-ok)]">STATUS: MEASURED IN MY SIMULATED TESTS</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                      {paymentProject.verifiedMetrics.map((m, mIdx) => (
                        <div key={mIdx} className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px]">
                          <span className="text-[var(--color-accent)] font-bold block">{m.stat}</span>
                          <span className="text-[11px] text-[var(--color-text-primary)] block font-sans">{m.label}</span>
                          <span className="text-[10px] text-[var(--color-text-tertiary)] block font-sans">{m.sublabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Honest LLM / Vector DB Note */}
                  {paymentProject.llmArchitectureNote && (
                    <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px] text-xs">
                      <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase block font-semibold mb-1">
                        ACCURATE ARCHITECTURE SCOPE (HONEST LLM / VECTOR DB USAGE)
                      </span>
                      <p className="font-sans text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {paymentProject.llmArchitectureNote}
                      </p>
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="font-mono text-xs text-[var(--color-text-tertiary)] mr-1">Stack:</span>
                    {paymentProject.technologies.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] text-xs font-mono rounded-[2px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                </div>
              )}
            </div>

          </article>


          {/* ============================================================== */}
          {/* STACKED PROJECT 2: Distributed Message Broker                  */}
          {/* ============================================================== */}
          <article
            id="project-broker"
            className="p-6 sm:p-8 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-6"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-border-default)] rounded-[2px]">
                  CHAPTER 2 // MESSAGE BROKER
                </span>
                <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                  JAVA • MULTITHREADING • SOCKETS • GRAFANA
                </span>
              </div>

              {/* Private repo note per prompt */}
              <span className="text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2.5 py-1 border border-[var(--color-border-default)] rounded-[2px]">
                Private repository, code walkthrough on request
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                {brokerProject.title[audienceMode]}
              </h3>
              <p className="font-sans text-sm sm:text-base text-[var(--color-text-secondary)]">
                {brokerProject.tagline[audienceMode]}
              </p>
            </div>

            {/* Visual Frame & Blueprint Graphic */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-7 p-3 sm:p-4 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px] space-y-2">
                <QueueBlueprint className="w-full h-48 sm:h-56 text-[var(--color-text-primary)]" />
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-tertiary)] pt-1 border-t border-[var(--color-border-subtle)]">
                  <span>ARCHITECTURE SKETCH // RAFT QUORUM CLUSTER</span>
                  <span>5-Node Topology [B1..B5]</span>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                {/* Layer A */}
                <div className="p-3.5 bg-[var(--color-surface)] border-l-2 border-[var(--color-accent)] rounded-r-[2px] space-y-1">
                  <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider block font-semibold">
                    IN PLAIN ENGLISH (ANALOGY)
                  </span>
                  <p className="font-serif text-sm text-[var(--color-text-primary)] italic leading-relaxed">
                    &ldquo;{brokerProject.analogy}&rdquo;
                  </p>
                </div>

                {/* Layer B */}
                <div className="space-y-1.5">
                  <span className="font-mono text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider block font-semibold">
                    WHAT I BUILT
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm font-sans text-[var(--color-text-primary)] leading-relaxed">
                    {brokerProject.whatIBuilt[audienceMode].map((sentence, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="text-[var(--color-accent)] font-mono mt-0.5">•</span>
                        <span>{sentence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Embedded Live Demo */}
            <MessageBrokerDemo />

            {/* Layer C: Technical Details */}
            <div className="border border-[var(--color-border-default)] rounded-[2px] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleDetails("broker")}
                aria-expanded={detailsOpen.broker}
                className="w-full p-3 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                <span className="font-mono text-xs font-semibold text-[var(--color-text-primary)]">
                  LAYER C // TECHNICAL SPECIFICATION & VERIFIED RESULTS (measured in my simulated tests)
                </span>
                <span className="font-mono text-xs text-[var(--color-accent)]">
                  {detailsOpen.broker ? "Hide Details ↑" : "Show Details ↓"}
                </span>
              </button>

              {detailsOpen.broker && (
                <div className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border-default)] space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    {brokerProject.verifiedMetrics.map((m, mIdx) => (
                      <div key={mIdx} className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px]">
                        <span className="text-[var(--color-accent)] font-bold block">{m.stat}</span>
                        <span className="text-[11px] text-[var(--color-text-primary)] block font-sans">{m.label}</span>
                        <span className="text-[10px] text-[var(--color-text-tertiary)] block font-sans">{m.sublabel}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-mono text-xs text-[var(--color-text-tertiary)] mr-1">Stack:</span>
                    {brokerProject.technologies.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] text-xs font-mono rounded-[2px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </article>


          {/* ============================================================== */}
          {/* STACKED PROJECT 3: URL Shortener & Real Click Analytics       */}
          {/* ============================================================== */}
          <article
            id="project-shortener"
            className="p-6 sm:p-8 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-6"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-border-default)] rounded-[2px]">
                  CHAPTER 3 // URL SHORTENER & TELEMETRY
                </span>
                <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                  JAVA • SPRING BOOT • REDIS • MYSQL • SNOWFLAKE
                </span>
              </div>

              {/* Private repo note */}
              <span className="text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2.5 py-1 border border-[var(--color-border-default)] rounded-[2px]">
                Private repository, code walkthrough on request
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                {shortenerProject.title[audienceMode]}
              </h3>
              <p className="font-sans text-sm sm:text-base text-[var(--color-text-secondary)]">
                {shortenerProject.tagline[audienceMode]}
              </p>
            </div>

            {/* Visual Frame & Blueprint Graphic */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-7 p-3 sm:p-4 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px] space-y-2">
                <ReceiptBlueprint className="w-full h-48 sm:h-56 text-[var(--color-text-primary)]" />
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-tertiary)] pt-1 border-t border-[var(--color-border-subtle)]">
                  <span>SCHEMATIC // 64-BIT SNOWFLAKE BIT-PACKER</span>
                  <span>Alphanumeric Base62 [0-9a-zA-Z]</span>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                {/* Layer A */}
                <div className="p-3.5 bg-[var(--color-surface)] border-l-2 border-[var(--color-accent)] rounded-r-[2px] space-y-1">
                  <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider block font-semibold">
                    IN PLAIN ENGLISH (ANALOGY)
                  </span>
                  <p className="font-serif text-sm text-[var(--color-text-primary)] italic leading-relaxed">
                    &ldquo;{shortenerProject.analogy}&rdquo;
                  </p>
                </div>

                {/* Layer B */}
                <div className="space-y-1.5">
                  <span className="font-mono text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider block font-semibold">
                    WHAT I BUILT
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm font-sans text-[var(--color-text-primary)] leading-relaxed">
                    {shortenerProject.whatIBuilt[audienceMode].map((sentence, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="text-[var(--color-accent)] font-mono mt-0.5">•</span>
                        <span>{sentence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Embedded Live Demo */}
            <ShortenerDemo />

            {/* Layer C: Technical Details */}
            <div className="border border-[var(--color-border-default)] rounded-[2px] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleDetails("shortener")}
                aria-expanded={detailsOpen.shortener}
                className="w-full p-3 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                <span className="font-mono text-xs font-semibold text-[var(--color-text-primary)]">
                  LAYER C // TECHNICAL SPECIFICATION & VERIFIED RESULTS (measured in my simulated tests)
                </span>
                <span className="font-mono text-xs text-[var(--color-accent)]">
                  {detailsOpen.shortener ? "Hide Details ↑" : "Show Details ↓"}
                </span>
              </button>

              {detailsOpen.shortener && (
                <div className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border-default)] space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    {shortenerProject.verifiedMetrics.map((m, mIdx) => (
                      <div key={mIdx} className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px]">
                        <span className="text-[var(--color-accent)] font-bold block">{m.stat}</span>
                        <span className="text-[11px] text-[var(--color-text-primary)] block font-sans">{m.label}</span>
                        <span className="text-[10px] text-[var(--color-text-tertiary)] block font-sans">{m.sublabel}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-mono text-xs text-[var(--color-text-tertiary)] mr-1">Stack:</span>
                    {shortenerProject.technologies.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] text-xs font-mono rounded-[2px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </article>

        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAudience } from "./AudienceContext";
import { PORTFOLIO_CONTENT, StoryStop } from "@/lib/content/portfolioContent";
import {
  AppBlueprint,
  QueueBlueprint,
  CheckBlueprint,
  BankBlueprint,
  LedgerBlueprint,
  ReceiptBlueprint,
  ProbeGuideIcon,
} from "./illustrations/BlueprintDrawings";

export function ScrollStory() {
  const { audienceMode } = useAudience();
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const storyContainerRef = useRef<HTMLDivElement>(null);
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

  // Update active step as user scrolls through the story
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!storyContainerRef.current) return;
      const stops = storyContainerRef.current.querySelectorAll<HTMLElement>("[data-story-stop]");
      const scrollPos = window.scrollY + window.innerHeight * 0.45;

      stops.forEach((el, index) => {
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          setActiveStopIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion]);

  const renderIllustration = (type: StoryStop["diagramType"]) => {
    switch (type) {
      case "app":
        return <AppBlueprint className="w-full h-44 sm:h-52 text-[var(--color-text-primary)]" />;
      case "queue":
        return <QueueBlueprint className="w-full h-44 sm:h-52 text-[var(--color-text-primary)]" />;
      case "check":
        return <CheckBlueprint className="w-full h-44 sm:h-52 text-[var(--color-text-primary)]" />;
      case "bank":
        return <BankBlueprint className="w-full h-44 sm:h-52 text-[var(--color-text-primary)]" />;
      case "ledger":
        return <LedgerBlueprint className="w-full h-44 sm:h-52 text-[var(--color-text-primary)]" />;
      case "receipt":
        return <ReceiptBlueprint className="w-full h-44 sm:h-52 text-[var(--color-text-primary)]" />;
    }
  };

  return (
    <section id="story" className="py-16 sm:py-24 border-b border-[var(--color-border-default)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-2">
            CHAPTER-BASED SCROLL STORY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">
            What Happens When You Press Pay
          </h2>
          <p className="font-sans text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 leading-relaxed">
            Follow a single payment through six crucial stops. See what could break at each step, and the exact distributed systems mechanisms built to guarantee safety.
          </p>
        </div>

        {/* Scroll Story Container */}
        <div ref={storyContainerRef} className="relative">
          
          {/* Vertical Progress Line with Traveling Probe Icon (Hidden in reduced motion) */}
          {!prefersReducedMotion && (
            <div className="hidden md:block absolute left-8 top-8 bottom-8 w-[2px] bg-[var(--color-border-default)]">
              {/* Traveling Guide Probe */}
              <div
                className="absolute -left-[7px] transition-all duration-300 ease-out"
                style={{
                  top: `${(activeStopIndex / (PORTFOLIO_CONTENT.storyStops.length - 1)) * 95}%`,
                }}
              >
                <div className="p-1 bg-[var(--color-card)] border border-[var(--color-accent)] rounded-full">
                  <ProbeGuideIcon className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                </div>
              </div>
            </div>
          )}

          {/* Stops List */}
          <div className="space-y-12 sm:space-y-16 md:pl-20">
            {PORTFOLIO_CONTENT.storyStops.map((stop, idx) => {
              const isCurrent = activeStopIndex === idx;

              return (
                <article
                  key={stop.id}
                  data-story-stop
                  className={`p-5 sm:p-6 md:p-8 bg-[var(--color-card)] border rounded-[3px] transition-all duration-200 ${
                    isCurrent
                      ? "border-[var(--color-border-active)]"
                      : "border-[var(--color-border-default)] opacity-95"
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    
                    {/* Left details */}
                    <div className="lg:col-span-6 space-y-4">
                      
                      {/* Step Tag & Component */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-border-default)] rounded-[2px]">
                          STOP {stop.stepNumber} OF 6
                        </span>
                        <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                          {`// ${stop.componentName}`}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                        {stop.title[audienceMode]}
                      </h3>

                      {/* What could go wrong */}
                      <div className="p-3 bg-[var(--color-surface)] border-l-2 border-[var(--color-status-err)] rounded-r-[2px] space-y-1">
                        <span className="font-mono text-[10px] text-[var(--color-status-err)] uppercase tracking-wider block font-semibold">
                          What could go wrong
                        </span>
                        <p className="font-sans text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed">
                          {stop.whatCouldGoWrong[audienceMode]}
                        </p>
                      </div>

                      {/* What was built to prevent it */}
                      <div className="p-3 bg-[var(--color-surface)] border-l-2 border-[var(--color-status-ok)] rounded-r-[2px] space-y-1">
                        <span className="font-mono text-[10px] text-[var(--color-status-ok)] uppercase tracking-wider block font-semibold">
                          What prevents it
                        </span>
                        <p className="font-sans text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed">
                          {stop.whatPreventsIt[audienceMode]}
                        </p>
                      </div>

                      {/* Link to project chapter */}
                      <div className="pt-2">
                        <a
                          href={`#project-${stop.projectLinkId}`}
                          className="font-mono text-xs text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                        >
                          <span>Explore corresponding project chapter</span>
                          <span aria-hidden="true">↓</span>
                        </a>
                      </div>
                    </div>

                    {/* Right Illustration & Margin Note */}
                    <div className="lg:col-span-6 space-y-2">
                      <div className="p-3 sm:p-4 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[2px]">
                        {renderIllustration(stop.diagramType)}
                      </div>

                      {/* Margin note annotation */}
                      {stop.marginNote && (
                        <div className="px-2 flex items-center gap-1.5 margin-note text-xs">
                          <span className="text-[var(--color-accent)]">✍</span>
                          <span>{stop.marginNote}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </article>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

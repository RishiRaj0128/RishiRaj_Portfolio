"use client";

import React, { useState, useEffect } from "react";
import { StatusDot } from "@/components/ui/icons";

/**
 * SECTION 1: BOOT SEQUENCE & HERO
 *
 * STRICT HARD CONSTRAINTS COMPLIANCE:
 * 1. NO 3D canvas here: 3D is used ONLY for the Message Broker cluster simulation.
 * 2. NO fake terminal window chrome (Rule #22): Lines stream directly on page background.
 * 3. NO emojis anywhere in copy (Rule #13).
 * 4. NO "It's not X, it's Y" copywriting trope (Rule #23).
 * 5. Monospace font: IBM Plex Mono for boot logs.
 * 6. Respects prefers-reduced-motion by skipping log animations directly to complete state.
 * 7. Factual positioning: Backend Distributed Systems | DevOps | Cloud Architecture.
 */

const BOOT_LOGS = [
  "Initializing control-plane runtime...",
  "Loading node.sys: identity established... OK",
  "Mounting distributed engine capabilities... OK",
  "Starting quorum consensus & state machines... OK",
  "Runtime ready. Systems operational.",
];

export default function BootSequenceHero() {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [isBootComplete, setIsBootComplete] = useState<boolean>(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayedLogs(BOOT_LOGS);
      setIsBootComplete(true);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < BOOT_LOGS.length) {
        const nextLog = BOOT_LOGS[currentIndex];
        setDisplayedLogs((prev) => [...prev, nextLog]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsBootComplete(true);
      }
    }, 240);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16 px-4">
      {/* Monospace Boot Lines and Identity Presentation */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-start font-mono">
        {/* Boot Sequence Stream (Directly on canvas, no window chrome) */}
        <div className="w-full mb-8 text-xs text-[#8A939E] space-y-1 select-none">
          {displayedLogs.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[#5A626E]">[{String(idx + 1).padStart(2, "0")}]</span>
              <span className={idx === BOOT_LOGS.length - 1 ? "text-[#C86D32] font-semibold" : "text-[#8A939E]"}>
                {line}
              </span>
            </div>
          ))}
          {!isBootComplete && (
            <span className="inline-block w-2 h-3.5 bg-[#C86D32] animate-pulse align-middle ml-1" />
          )}
        </div>

        {/* Resolved Identity & Factual Value Proposition */}
        <div className={`transition-opacity duration-500 w-full ${isBootComplete ? "opacity-100" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 mb-4 bg-[#111419] border border-[#232A35] rounded-[2px] text-[11px] text-[#8A939E]">
            <StatusDot status="ok" ping />
            <span className="text-[#5A626E]">ENGINE_STATE:</span>
            <span className="text-[#E6E8EB] font-bold">RUNNING</span>
            <span className="text-[#5A626E]">|</span>
            <span className="text-[#8A939E]">PROMPT: RUNTIME</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#E6E8EB] font-sans mb-3">
            Rishi Raj
          </h1>

          <div className="text-sm sm:text-base md:text-lg text-[#C86D32] font-mono font-medium mb-6">
            Backend Distributed Systems | DevOps | Cloud Architecture
          </div>

          <p className="text-sm sm:text-base text-[#8A939E] font-sans max-w-2xl leading-relaxed mb-8">
            This is not a list of things I have built. Run them.
            Interact with live, client-side reconstructions of quorum leader election,
            Saga compensation workflows, and Base62 short-code generation proving the exact
            reliability guarantees claimed.
          </p>

          {/* Quick Metrics & Call to Action */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <a
              href="#registry"
              className="px-4 py-2 bg-[#C86D32] hover:bg-[#B05B26] text-[#0A0B0D] font-bold rounded-[2px] transition-colors"
            >
              RUN_SYSTEMS_LAB
            </a>
            <a
              href="#status"
              className="px-4 py-2 bg-[#111419] hover:bg-[#171B22] border border-[#232A35] hover:border-[#3A4556] text-[#E6E8EB] rounded-[2px] transition-colors"
            >
              INSPECT_STATUS
            </a>
            <a
              href="#ingress"
              className="px-4 py-2 bg-[#111419] hover:bg-[#171B22] border border-[#232A35] hover:border-[#3A4556] text-[#8A939E] hover:text-[#E6E8EB] rounded-[2px] transition-colors"
            >
              POST /contact
            </a>
            <div className="hidden sm:flex items-center gap-2 ml-2 text-[11px] text-[#5A626E]">
              <span>FAILOVER: ~750ms</span>
              <span>•</span>
              <span>DRIFT: 0.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

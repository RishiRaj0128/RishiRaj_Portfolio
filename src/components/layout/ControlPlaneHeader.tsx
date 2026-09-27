"use client";

import React, { useState, useEffect } from "react";
import { StatusDot, SearchIcon } from "@/components/ui/icons";

interface ControlPlaneHeaderProps {
  onOpenCommandPalette: () => void;
}

export default function ControlPlaneHeader({ onOpenCommandPalette }: ControlPlaneHeaderProps) {
  const [utcTime, setUtcTime] = useState<string>("--:--:-- UTC");
  const [edgeNode, setEdgeNode] = useState<string>("PROBING_EDGE...");

  // Update clock every second
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const hours = String(d.getUTCHours()).padStart(2, "0");
      const mins = String(d.getUTCMinutes()).padStart(2, "0");
      const secs = String(d.getUTCSeconds()).padStart(2, "0");
      setUtcTime(`${hours}:${mins}:${secs} UTC`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch edge node telemetry
  useEffect(() => {
    fetch("/api/telemetry")
      .then((res) => res.json())
      .then((data) => {
        if (data.edgeNode) {
          setEdgeNode(data.edgeNode);
        }
      })
      .catch(() => {
        setEdgeNode("EDGE-NODE-01");
      });
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0B0D]/95 backdrop-blur-none border-b border-[#1F242C] font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: System Status & Identity */}
        <div className="flex items-center gap-3">
          <a href="#hero" className="flex items-center gap-2 text-[#E6E8EB] hover:text-[#C86D32] transition-colors">
            <span className="font-bold text-[13px] tracking-wide">RISHI_RAJ</span>
            <span className="text-[#5A626E]">/</span>
            <span className="text-[#8A939E] text-[11px] hidden sm:inline">RUNTIME_LAB</span>
          </a>

          <div className="h-3.5 w-px bg-[#1F242C] hidden md:block" />

          {/* Edge Node Status */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#8A939E]">
            <StatusDot status="ok" ping />
            <span className="text-[#5A626E]">NODE:</span>
            <span className="text-[#E6E8EB]">{edgeNode}</span>
          </div>
        </div>

        {/* Right: Telemetry & Nav */}
        <div className="flex items-center gap-3">
          {/* Clock */}
          <div className="text-[11px] text-[#8A939E] hidden lg:block">
            <span className="text-[#5A626E]">CLOCK: </span>
            <span className="text-[#E6E8EB]">{utcTime}</span>
          </div>

          <div className="h-3.5 w-px bg-[#1F242C] hidden lg:block" />

          {/* Quick Section Jump Links */}
          <nav className="hidden md:flex items-center gap-4 text-[11px] text-[#8A939E]">
            <a href="#status" className="hover:text-[#E6E8EB] transition-colors">STATUS</a>
            <a href="#registry" className="hover:text-[#E6E8EB] transition-colors">RUNTIME_LAB</a>
            <a href="#experience" className="hover:text-[#E6E8EB] transition-colors">EXPERIENCE</a>
            <a href="#postmortem" className="hover:text-[#E6E8EB] transition-colors">SECURITY</a>
            <a href="#telemetry" className="hover:text-[#E6E8EB] transition-colors">TELEMETRY</a>
            <a href="#ingress" className="hover:text-[#C86D32] transition-colors">INGRESS</a>
          </nav>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1 bg-[#111419] hover:bg-[#171B22] border border-[#232A35] hover:border-[#3A4556] rounded-[2px] text-[#8A939E] hover:text-[#E6E8EB] transition-colors text-[11px]"
            title="Open Control Plane Command Palette (Cmd+K / Ctrl+K)"
            aria-label="Command palette"
          >
            <SearchIcon size={12} />
            <span className="hidden sm:inline">PALETTE</span>
            <kbd className="px-1 py-0.2 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] text-[10px] text-[#5A626E]">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}

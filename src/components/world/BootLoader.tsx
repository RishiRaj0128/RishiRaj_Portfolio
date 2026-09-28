"use client";

import React, { useState, useEffect } from "react";

interface BootLoaderProps {
  progress: number; // 0 to 100
  statusText: string;
  onComplete: () => void;
}

export default function BootLoader({ progress, statusText, onComplete }: BootLoaderProps) {
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING UPLINK 3D RUNTIME ENVIRONMENT...",
    "DETECTING WEBGL2 CONTEXT & RENDER CAPABILITIES...",
  ]);
  const [prevStatus, setPrevStatus] = useState(statusText);

  if (statusText && statusText !== prevStatus) {
    setPrevStatus(statusText);
    setLogs((prev) => [...prev.slice(-6), statusText]);
  }

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0B0D] text-[#E6E8EB] flex flex-col justify-between p-6 sm:p-12 font-mono select-none">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#878F99] border-b border-[#1F242C] pb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-[1px] bg-[#C86D32] animate-pulse" />
          <span className="text-[#E6E8EB] font-bold">UPLINK // TOPOLOGY BOOT LOADER</span>
          <span className="text-[#5A626E]">v2.4.0-rev3</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>TARGET: RISHI RAJ PORTFOLIO</span>
          <span className="text-[#C86D32]">SUBSYSTEM: 3D GRAPHICS</span>
        </div>
      </div>

      {/* Center Console Readout (Plain monospace lines, NO fake terminal window chrome) */}
      <div className="max-w-2xl w-full my-auto space-y-4">
        <div className="text-xs text-[#878F99] space-y-1.5 min-h-[140px]">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[#5A626E] text-[10px]">[{idx.toString().padStart(2, "0")}]</span>
              <span className={idx === logs.length - 1 ? "text-[#E6E8EB] font-semibold" : "text-[#878F99]"}>
                {log}
              </span>
            </div>
          ))}
        </div>

        {/* Real Progress Bar */}
        <div className="space-y-2 pt-4 border-t border-[#1F242C]">
          <div className="flex justify-between text-xs">
            <span className="text-[#878F99]">PIPELINE STREAMING PROGRESS</span>
            <span className="text-[#C86D32] font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#171B22] rounded-[2px] overflow-hidden">
            <div
              className="h-full bg-[#C86D32] transition-all duration-150 ease-out rounded-[2px]"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-[11px] text-[#5A626E] flex justify-between border-t border-[#1F242C] pt-3">
        <span>STRICT CONSTRAINTS: NO BLANK FLASH • REAL STREAM PROGRESS</span>
        <span>INITIALIZING PROBE SPAWN AT INGRESS [0, 0, 0]</span>
      </div>
    </div>
  );
}

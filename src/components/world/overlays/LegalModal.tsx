"use client";

import React from "react";

interface LegalModalProps {
  type: "terms" | "privacy" | null;
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#0A0B0D]/85 flex items-center justify-center p-4 sm:p-6 font-mono"
    >
      <div className="bg-[#111317] border border-[#2D3440] rounded-[2px] max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden text-xs text-[#E6E8EB]">
        {/* Header */}
        <div className="p-3 bg-[#171B22] border-b border-[#1F242C] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-[1px] bg-[#C86D32]" />
            <span className="font-bold uppercase tracking-wider">
              {type === "terms" ? "TERMS OF SERVICE // RUNTIME" : "PRIVACY POLICY // TELEMETRY"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#878F99] hover:text-[#E6E8EB] px-2 py-0.5 border border-[#1F242C] rounded-[2px]"
          >
            CLOSE [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans leading-relaxed text-[#878F99]">
          {type === "terms" ? (
            <>
              <h3 className="font-bold text-[#E6E8EB] text-sm font-mono">1. Acceptance of Terms</h3>
              <p>
                By accessing this interactive portfolio (UPLINK // Rishi Raj), you agree to interact with the simulations in good faith. All client-side state machines (Raft leader election, Saga compensation, and Base62 shortener) are designed for demonstration of distributed systems principles.
              </p>
              <h3 className="font-bold text-[#E6E8EB] text-sm font-mono">2. Permitted Use</h3>
              <p>
                Visitors are encouraged to inspect simulation code, test edge cases, trigger fault injection scenarios, and verify idempotency guarantees. Automated scraping or denial-of-service traffic against the contact endpoint is strictly prohibited.
              </p>
              <h3 className="font-bold text-[#E6E8EB] text-sm font-mono">3. Intellectual Property</h3>
              <p>
                System architecture, design tokens, and simulation modules are authored by Rishi Raj, licensed under MIT.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-bold text-[#E6E8EB] text-sm font-mono">1. Zero Tracking Philosophy</h3>
              <p>
                This portfolio operates with strict telemetry minimization. We do not use third-party analytics trackers, advertising cookies, fingerprinting scripts, or cross-site telemetry beacons.
              </p>
              <h3 className="font-bold text-[#E6E8EB] text-sm font-mono">2. Contact Dispatch</h3>
              <p>
                Information submitted via the Egress Contact Gateway (name, email, message) is processed strictly to respond to your engineering inquiry. It is never sold, shared, or retained beyond operational correspondence.
              </p>
              <h3 className="font-bold text-[#E6E8EB] text-sm font-mono">3. Client-Side Simulations</h3>
              <p>
                All interactive simulation engines execute entirely in-memory within your browser session using standard TypeScript. No transaction state or generated short-codes are persisted to external ad networks.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0A0B0D] border-t border-[#1F242C] flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#171B22] border border-[#2D3440] hover:border-[#C86D32] text-[#E6E8EB] rounded-[2px]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}

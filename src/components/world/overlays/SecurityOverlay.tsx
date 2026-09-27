"use client";

import React from "react";
import { ExternalLinkIcon } from "@/components/ui/icons";

export default function SecurityOverlay() {
  return (
    <div className="space-y-6 text-[#E6E8EB] font-mono">
      {/* Header */}
      <div className="border-b border-[#1F242C] pb-4">
        <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
          SECURITY ARCHITECTURE // NODE: SECURITY [36, 0, -44]
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#E6E8EB] tracking-tight">
            Security Incident Postmortem & Audit
          </h2>
          <span className="text-xs text-[#C88D32] bg-[#251A12] px-2.5 py-1 border border-[#C88D32]/40 rounded-[2px] w-fit">
            [PLACEHOLDER: PENDING REAL STRIX AUDIT]
          </span>
        </div>
        <p className="text-xs text-[#878F99] font-sans mt-1">
          Defensive architecture postmortem layout. Guardrail compliance: zero fabricated security findings.
        </p>
      </div>

      {/* Mandatory Notice */}
      <div className="p-3 bg-[#111317] border border-[#2D3440] rounded-[2px] text-xs space-y-2">
        <div className="text-[10px] text-[#C88D32] uppercase font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-[1px] bg-[#C88D32]" />
          PRE-LAUNCH AUDIT CONSTRAINT (RULE #33)
        </div>
        <p className="text-[11px] font-sans text-[#878F99] leading-relaxed">
          In strict compliance with repository constraints, this node will remain marked as a placeholder until an actual automated penetration audit is executed against Rishi's production repository using the open-source Strix scanner (github.com/usestrix/strix). No simulated or fabricated vulnerabilities are published as real.
        </p>
        <div className="pt-1">
          <a
            href="https://github.com/usestrix/strix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C86D32] hover:text-[#E6E8EB] inline-flex items-center gap-1 text-[11px]"
          >
            <span>Inspect Strix Automated Pentest Tool</span>
            <ExternalLinkIcon size={10} />
          </a>
        </div>
      </div>

      {/* Audit Pipeline Specification */}
      <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] space-y-3 text-xs">
        <div className="text-[10px] text-[#5A626E] uppercase border-b border-[#1F242C] pb-1">
          PLANNED DEFENSIVE AUDIT SCOPE
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#E6E8EB] font-bold block">1. Input Sanitation</span>
            <span className="text-[#878F99] font-sans text-[10px]">Buffer overflows & socket deserialization checks</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#E6E8EB] font-bold block">2. Auth & Tokens</span>
            <span className="text-[#878F99] font-sans text-[10px]">OAuth token expiry & replay attack mitigation</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#E6E8EB] font-bold block">3. SSRF & Ingress</span>
            <span className="text-[#878F99] font-sans text-[10px]">URL shortener domain allowlist & redirect filtering</span>
          </div>
        </div>
      </div>
    </div>
  );
}

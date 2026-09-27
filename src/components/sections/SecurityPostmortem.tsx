import React from "react";
import { ShieldAuditIcon, ExternalLinkIcon, StatusDot } from "@/components/ui/icons";

/**
 * SECTION 6: SECURITY POSTMORTEM (Strix Audit Layout)
 *
 * SPECIFICATION COMPLIANCE (Rule #33 & Master Prompt):
 * - PRE-LAUNCH TASK REQUIRED: Run an actual Strix audit (https://github.com/usestrix/strix)
 *   against one real project before this section is populated with final data.
 * - Current layout uses explicit [PLACEHOLDER: real Strix findings pending pre-launch scan] content.
 * - Zero fabricated findings passed off as real.
 * - NO live public pentest endpoint on the site (eliminates SSRF and abuse risks).
 */

export default function SecurityPostmortem() {
  return (
    <section id="postmortem" className="py-16 px-4 max-w-7xl mx-auto font-mono">
      {/* Section Header */}
      <div className="mb-8 border-b border-[#1F242C] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
            INCIDENT MANAGEMENT / SECURITY POSTMORTEM
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E6E8EB] font-sans">
            Security Postmortem: Strix Automated Penetration Audit
          </h2>
        </div>
        <div className="text-xs text-[#8A939E] flex items-center gap-2">
          <StatusDot status="warn" />
          <span>PRE-LAUNCH AUDIT PENDING</span>
          <span className="text-[#5A626E]">|</span>
          <a
            href="https://github.com/usestrix/strix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C86D32] hover:text-[#E6E8EB] inline-flex items-center gap-1"
          >
            <span>Strix Scanner</span>
            <ExternalLinkIcon size={10} />
          </a>
        </div>
      </div>

      {/* Incident Postmortem Card */}
      <div className="bg-[#111419] border border-[#232A35] rounded-[2px] overflow-hidden text-xs">
        {/* Postmortem Meta Header */}
        <div className="p-4 bg-[#14181F] border-b border-[#1F242C] grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
          <div>
            <span className="text-[#5A626E] block">TARGET REPOSITORY</span>
            <span className="text-[#8A939E] font-semibold">[PLACEHOLDER: Target Project]</span>
          </div>
          <div>
            <span className="text-[#5A626E] block">AUDIT SCANNER</span>
            <span className="text-[#E6E8EB] font-semibold">Strix v0.4 (github.com/usestrix/strix)</span>
          </div>
          <div>
            <span className="text-[#5A626E] block">STATUS</span>
            <span className="text-[#C88D32] font-semibold">PENDING PRE-LAUNCH EXECUTION</span>
          </div>
          <div>
            <span className="text-[#5A626E] block">POSTMORTEM TRACKING</span>
            <span className="text-[#8A939E]">SEC-2026-STRIX-01</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. Pre-Launch Requirement Notice */}
          <div className="p-3 bg-[#1F1915] border border-[#C88D32]/40 rounded-[2px] text-xs space-y-1">
            <div className="text-[#C88D32] font-bold uppercase flex items-center gap-2">
              <ShieldAuditIcon size={14} />
              <span>Pre-Launch Requirement: Real Strix Audit Mandate</span>
            </div>
            <p className="text-[#8A939E] font-sans text-xs leading-relaxed">
              Per strict site integrity policies, no fabricated security findings are published.
              Before the public launch, an actual penetration scan using the open-source{" "}
              <a
                href="https://github.com/usestrix/strix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C86D32] underline hover:text-[#E6E8EB]"
              >
                Strix scanner
              </a>{" "}
              will be executed against the target distributed backend repository, and the factual findings,
              remediation diff, and regression results will populate this postmortem document.
            </p>
          </div>

          {/* 2. Structured Layout Demonstration */}
          <div>
            <h3 className="text-xs font-bold text-[#C86D32] uppercase tracking-wider mb-2">
              1. Audit Scope & Methodology (Layout Template)
            </h3>
            <p className="text-[#8A939E] font-sans text-xs leading-relaxed">
              [PLACEHOLDER: The Strix scanner will evaluate ingress socket endpoints, HTTP REST route bindings,
              CORS headers, authentication boundaries, and state-machine invalid transition injection to detect
              unauthenticated route exposure or buffer vulnerabilities.]
            </p>
          </div>

          {/* 3. Findings Timeline Layout */}
          <div>
            <h3 className="text-xs font-bold text-[#C86D32] uppercase tracking-wider mb-2">
              2. Vulnerability Timeline & Resolution (Layout Template)
            </h3>
            <div className="border-l border-[#1F242C] pl-4 space-y-3 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#5A626E]">T+00:00 — Strix Crawler Run</div>
                <div className="text-[#8A939E]">[PLACEHOLDER: Automated map of internal and public endpoints]</div>
              </div>
              <div>
                <div className="text-[10px] text-[#5A626E]">T+00:15 — Diagnostic Flag</div>
                <div className="text-[#8A939E]">[PLACEHOLDER: Real finding description, CVE/CWE reference if applicable]</div>
              </div>
              <div>
                <div className="text-[10px] text-[#5A626E]">T+00:45 — Remediation Commit</div>
                <div className="text-[#8A939E]">[PLACEHOLDER: Code patch restricting unauthorized interface exposure]</div>
              </div>
              <div>
                <div className="text-[10px] text-[#5A626E]">T+01:10 — Strix Verification</div>
                <div className="text-[#2FA866]">[PLACEHOLDER: Secondary Strix scan confirming 100% remediation]</div>
              </div>
            </div>
          </div>

          {/* 4. Patch Diff Template */}
          <div>
            <h3 className="text-xs font-bold text-[#C86D32] uppercase tracking-wider mb-2">
              3. Remediation Patch Diff (Layout Template)
            </h3>
            <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] font-mono text-xs space-y-2">
              <div className="text-[10px] text-[#5A626E] flex justify-between">
                <span>FILE: [PLACEHOLDER: deploy/security/ingress-policy.yaml]</span>
                <span>PATCH: STRIX_REMEDIATION_DIFF</span>
              </div>
              <pre className="text-[11px] leading-relaxed overflow-x-auto text-[#8A939E]">
                <span className="text-[#5A626E]"># [PLACEHOLDER: Real remediation git diff will be inserted here following audit]</span><br />
                <span className="text-[#C24545]">- route: /internal/debug/metrics</span><br />
                <span className="text-[#2FA866]">+ # Restricted strictly to loopback interface 127.0.0.1</span><br />
                <span className="text-[#2FA866]">+ route: /api/v1/healthz (public probe)</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

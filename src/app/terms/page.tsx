import React from "react";
import Link from "next/link";
import { StatusDot } from "@/components/ui/icons";

export const metadata = {
  title: "Terms of Service | Rishi Raj Control Plane",
  description: "Terms of Service governing the use of the Rishi Raj Control Plane engineering portfolio and telemetry services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0B0D] text-[#E6E8EB] font-mono p-6 sm:p-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#1F242C] pb-6 mb-8">
        <Link
          href="/"
          className="text-xs text-[#C86D32] hover:text-[#E6E8EB] inline-flex items-center gap-1 mb-4 transition-colors"
        >
          ← RETURN_TO_CONTROL_PLANE
        </Link>
        <div className="flex items-center gap-2 text-xs text-[#8A939E] mb-2">
          <StatusDot status="ok" />
          <span>SYS_DOC: TERMS_OF_SERVICE_V1.0</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#E6E8EB]">
          Terms of Service
        </h1>
        <div className="text-xs text-[#5A626E] mt-1">
          Effective Date: September 21, 2026 | Revision: 2026.09.21
        </div>
      </div>

      {/* Terms Body */}
      <div className="space-y-6 text-xs sm:text-sm text-[#8A939E] font-sans leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or interacting with the Rishi Raj Control Plane portfolio and its associated API endpoints (including <code className="text-[#C86D32] font-mono">/api/ping</code> and <code className="text-[#C86D32] font-mono">/api/contact</code>), you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please discontinue access immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            2. Permitted Use & Diagnostic Probes
          </h2>
          <p>
            This site is provided for informational and professional evaluation purposes. You may execute manual HTTP GET requests against public endpoints to evaluate latency and telemetry. Automated Denial of Service (DoS), Distributed Denial of Service (DDoS), server resource exhaustion, or fuzzing payloads exceeding 5 requests per minute are strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            3. Intellectual Property
          </h2>
          <p>
            Unless explicitly designated as open-source under an MIT or Apache 2.0 license within linked public repositories, all custom system diagrams, architectural specifications, and control plane software representations are the intellectual property of Rishi Raj.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            4. Disclaimer of Warranty
          </h2>
          <p>
            All telemetry metrics, 3D topologies, and status indications are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of any kind, whether express or implied. Real-time network measurements reflect sample conditions and do not constitute an enforceable enterprise Service Level Agreement (SLA).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            5. Modifications
          </h2>
          <p>
            We reserve the right to revise or replace these Terms at any time without notice. Continued use of the service constitutes acceptance of any modifications.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-[#1F242C] text-xs font-mono text-[#5A626E]">
        END OF DOCUMENT • HASH: sha256:7f3a9e...
      </div>
    </main>
  );
}

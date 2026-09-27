import React from "react";
import Link from "next/link";
import { StatusDot } from "@/components/ui/icons";

export const metadata = {
  title: "Privacy Policy | Rishi Raj Control Plane",
  description: "Privacy Policy detailing telemetry collection, ingress logging, and zero-tracking commitments on the Rishi Raj Control Plane.",
};

export default function PrivacyPage() {
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
          <span>SYS_DOC: PRIVACY_POLICY_V1.0</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#E6E8EB]">
          Privacy Policy
        </h1>
        <div className="text-xs text-[#5A626E] mt-1">
          Effective Date: September 21, 2026 | Revision: 2026.09.21
        </div>
      </div>

      {/* Privacy Body */}
      <div className="space-y-6 text-xs sm:text-sm text-[#8A939E] font-sans leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            1. Zero Advertising & Zero Tracking Commitment
          </h2>
          <p>
            The Rishi Raj Control Plane operates without third-party advertising networks, behavioral tracking pixels, or invasive surveillance analytics. We do not sell, rent, or monetize your network identifiers or communication payloads.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            2. Real-Time Telemetry & Diagnostic Data
          </h2>
          <p>
            When you invoke the <code className="text-[#C86D32] font-mono">/api/ping</code> or <code className="text-[#C86D32] font-mono">/api/telemetry</code> endpoints, the server temporarily inspects standard edge proxy headers (such as <code className="text-[#8A939E] font-mono">x-vercel-id</code> and client IP) strictly to compute transit latency and edge routing accuracy. Client IP addresses are masked (e.g. <code className="text-[#8A939E] font-mono">192.168.1.xxx</code>) before any logging occurs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            3. Contact Ingress Submissions
          </h2>
          <p>
            When you transmit a message via <code className="text-[#C86D32] font-mono">POST /api/contact</code>, the information you supply (name, email, subject, message body) is processed solely to facilitate direct professional communication with Rishi Raj. Submissions are protected against automated harvesting by an anti-bot honeypot and velocity checks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            4. Local Storage & Cookies
          </h2>
          <p>
            This website does not store non-essential marketing cookies. Local browser memory is utilized solely to maintain transient client state (such as 3D viewport pause preferences) across your active session.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-[#E6E8EB] uppercase">
            5. Inquiries & Data Erasure
          </h2>
          <p>
            To request the complete deletion of any communication transmitted to this control plane, submit an inquiry via the ingress endpoint or email <code className="text-[#C86D32] font-mono">[PLACEHOLDER: privacy@rishiraj.dev]</code>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-[#1F242C] text-xs font-mono text-[#5A626E]">
        END OF DOCUMENT • HASH: sha256:4a11b8...
      </div>
    </main>
  );
}

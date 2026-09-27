"use client";

import React, { useState, useEffect } from "react";
import { CopyIcon, CopiedSuccessIcon, StatusDot } from "@/components/ui/icons";

/**
 * SECTION 7: CONTACT / INGRESS GATEWAY
 *
 * FRAMED AS: API Endpoint Specification (POST /api/contact)
 *
 * DEFENSIVE MEASURES:
 * 1. Hidden honeypot field (_honeypot): Bots automatically populate it.
 * 2. Timing check (_renderedAt): Rejects submissions faster than 1800ms.
 * 3. Rate limiting: Client IP throttle on server route.
 * 4. cURL generator with one-click clipboard copy.
 */

export default function ContactIngress() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Distributed Systems Consultation",
    message: "",
    _honeypot: "", // Bot honeypot
  });
  const [renderedAt, setRenderedAt] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setRenderedAt(Date.now());
  }, []);

  const curlSnippet = `curl -X POST "${typeof window !== "undefined" ? window.location.origin : "https://controlplane.rishiraj.dev"}/api/contact" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "${formData.name || "Alex Chen"}",
    "email": "${formData.email || "alex@systems.corp"}",
    "subject": "${formData.subject || "Distributed Systems Role"}",
    "message": "${formData.message || "Discussing high-throughput consensus cluster."}"
  }'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseLog(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _renderedAt: renderedAt,
        }),
      });

      const data = await res.json();
      setResponseLog(JSON.stringify(data, null, 2));

      if (res.ok) {
        setFormData({
          name: "",
          email: "",
          subject: "Distributed Systems Consultation",
          message: "",
          _honeypot: "",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to establish network connection";
      setResponseLog(JSON.stringify({ error: "CLIENT_NETWORK_FAULT", message: msg }, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ingress" className="py-16 px-4 max-w-7xl mx-auto font-mono">
      {/* Section Header */}
      <div className="mb-8 border-b border-[#1F242C] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
            INGRESS / API ENDPOINT SPECIFICATION
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E6E8EB] font-sans">
            Contact Gateway: POST /api/contact
          </h2>
        </div>
        <div className="text-xs text-[#8A939E] flex items-center gap-2">
          <StatusDot status="ok" />
          <span>GATEWAY: ACCEPTING_INGRESS</span>
          <span className="text-[#5A626E]">|</span>
          <span>PROTOCOL: HTTP/2 JSON</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Submission Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#111419] border border-[#232A35] rounded-[2px] p-5">
          <div className="text-xs font-semibold text-[#E6E8EB] border-b border-[#1F242C] pb-2 mb-4 flex justify-between items-center">
            <span>DISPATCH INGRESS PAYLOAD</span>
            <span className="text-[10px] text-[#5A626E]">RATE_LIMIT: 5 req/min</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Honeypot field (hidden from legitimate humans, traps bots) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="_honeypot"
                value={formData._honeypot}
                onChange={(e) => setFormData({ ...formData, _honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[#8A939E] mb-1">
                  SENDER_NAME <span className="text-[#C86D32]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-[#0A0B0D] border border-[#232A35] focus:border-[#C86D32] rounded-[2px] p-2 text-[#E6E8EB] placeholder-[#5A626E] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#8A939E] mb-1">
                  REPLY_EMAIL <span className="text-[#C86D32]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. elena@infrastructure.io"
                  className="w-full bg-[#0A0B0D] border border-[#232A35] focus:border-[#C86D32] rounded-[2px] p-2 text-[#E6E8EB] placeholder-[#5A626E] text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#8A939E] mb-1">
                TOPIC_SUBJECT
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#0A0B0D] border border-[#232A35] focus:border-[#C86D32] rounded-[2px] p-2 text-[#E6E8EB] placeholder-[#5A626E] text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#8A939E] mb-1">
                PAYLOAD_MESSAGE (MIN 10 CHARS) <span className="text-[#C86D32]">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Inquire regarding distributed systems engineering, SRE, or agentic architecture..."
                className="w-full bg-[#0A0B0D] border border-[#232A35] focus:border-[#C86D32] rounded-[2px] p-2 text-[#E6E8EB] placeholder-[#5A626E] text-xs focus:outline-none resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#C86D32] hover:bg-[#B05B26] text-[#0A0B0D] font-bold rounded-[2px] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "DISPATCHING_PAYLOAD..." : "TRANSMIT_PAYLOAD (POST)"}
            </button>
          </form>

          {/* Response Payload Terminal Box */}
          {responseLog && (
            <div className="mt-4 p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] space-y-1">
              <div className="text-[10px] text-[#5A626E] flex justify-between">
                <span>GATEWAY_RESPONSE_BODY</span>
                <span>STATUS: 200 OK</span>
              </div>
              <pre className="text-[11px] text-[#2FA866] overflow-x-auto p-1 leading-relaxed">
                {responseLog}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: cURL Reference & Endpoint Documentation (5 cols) */}
        <div className="lg:col-span-5 bg-[#111419] border border-[#232A35] rounded-[2px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-[#E6E8EB] border-b border-[#1F242C] pb-2 mb-3 flex items-center justify-between">
              <span>CURL_INVOCATION_SNIPPET</span>
              <button
                onClick={copyCurl}
                className="text-[10px] text-[#8A939E] hover:text-[#E6E8EB] flex items-center gap-1.5 transition-colors"
                title="Copy cURL command to clipboard"
              >
                {isCopied ? <CopiedSuccessIcon size={12} className="text-[#2FA866]" /> : <CopyIcon size={12} />}
                <span>{isCopied ? "COPIED" : "COPY_CURL"}</span>
              </button>
            </div>

            <pre className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] text-[11px] text-[#8A939E] overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {curlSnippet}
            </pre>

            <div className="mt-4 space-y-2 text-xs">
              <div className="text-[10px] text-[#5A626E] uppercase">Endpoint Schema Headers</div>
              <div className="space-y-1 text-[11px] text-[#8A939E]">
                <div><code className="text-[#E6E8EB]">Content-Type:</code> application/json</div>
                <div><code className="text-[#E6E8EB]">Accept:</code> application/json</div>
                <div><code className="text-[#E6E8EB]">Authorization:</code> Not required for public ingress</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#1F242C] text-[11px] text-[#5A626E] space-y-1">
            <div>
              Direct email:{" "}
              <a
                href="mailto:rishiraj02989@gmail.com"
                className="text-[#C86D32] hover:underline font-mono"
              >
                rishiraj02989@gmail.com
              </a>
            </div>
            <div>
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/rishiraj28/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8A939E] hover:text-[#E6E8EB] underline"
              >
                linkedin.com/in/rishiraj28
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

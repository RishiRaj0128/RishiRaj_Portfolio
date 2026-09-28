"use client";

import React, { useState } from "react";
import { CopyIcon, CopiedSuccessIcon, ExternalLinkIcon } from "@/components/ui/icons";

export default function ContactOverlay() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Distributed Systems Discussion",
    message: "",
    _honeypot: "",
  });
  const [renderedAt] = useState<number>(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const curlSnippet = `curl -X POST "https://controlplane.rishiraj.dev/api/contact" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "${formData.name || "Engineering Lead"}",
    "email": "${formData.email || "lead@infra.corp"}",
    "subject": "${formData.subject}",
    "message": "${formData.message || "Discussing distributed systems & DevOps opportunities."}"
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
      if (res.ok) {
        setResponseLog(`[200 OK] Packet transmitted successfully. Dispatch ID: ${data.dispatchId ?? "tx_egress_ack"}`);
        setFormData({ name: "", email: "", subject: "Distributed Systems Discussion", message: "", _honeypot: "" });
      } else {
        setResponseLog(`[${res.status} ERROR] ${data.error ?? "Transmission failed"}`);
      }
    } catch {
      setResponseLog("[NETWORK_ERROR] Unable to route packet to /api/contact. Direct dispatch: rishiraj02989@gmail.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#E6E8EB] font-mono">
      {/* Header */}
      <div className="border-b border-[#1F242C] pb-4">
        <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
          EGRESS TRANSMITTER // NODE: CONTACT [0, 0, 64]
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#E6E8EB] tracking-tight">
          Outbound Packet Transmission
        </h2>
        <p className="text-xs text-[#878F99] font-sans mt-1">
          Transmit a message packet directly to Rishi Raj. Protected with defensive honeypot and client-side entropy validation.
        </p>
      </div>

      {/* Direct Communication Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
          <span className="text-[10px] text-[#5A626E] uppercase block">DIRECT EMAIL</span>
          <a
            href="mailto:rishiraj02989@gmail.com"
            className="text-[#C86D32] hover:text-[#E6E8EB] font-bold block mt-1 truncate"
          >
            rishiraj02989@gmail.com
          </a>
        </div>
        <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
          <span className="text-[10px] text-[#5A626E] uppercase block">LINKEDIN</span>
          <a
            href="https://www.linkedin.com/in/rishiraj28/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C86D32] hover:text-[#E6E8EB] font-bold inline-flex items-center gap-1 mt-1 truncate"
          >
            <span>in/rishiraj28</span>
            <ExternalLinkIcon size={10} />
          </a>
        </div>
        <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
          <span className="text-[10px] text-[#5A626E] uppercase block">GITHUB</span>
          <a
            href="https://github.com/RishiRaj0128"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C86D32] hover:text-[#E6E8EB] font-bold inline-flex items-center gap-1 mt-1 truncate"
          >
            <span>github.com/RishiRaj0128</span>
            <ExternalLinkIcon size={10} />
          </a>
        </div>
      </div>

      {/* Secure Transmission Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-[#111317] border border-[#232A35] rounded-[2px] space-y-3">
        {/* Hidden Honeypot Field */}
        <input
          type="text"
          name="_honeypot"
          value={formData._honeypot}
          onChange={(e) => setFormData({ ...formData, _honeypot: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#878F99] uppercase block mb-1">
              OPERATOR NAME
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sarah Connor"
              className="w-full bg-[#0A0B0D] border border-[#1F242C] text-[#E6E8EB] px-3 py-1.5 text-xs rounded-[2px] focus:outline-none focus:border-[#C86D32]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#878F99] uppercase block mb-1">
              RETURN ADDRESS (EMAIL)
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah@sky.net"
              className="w-full bg-[#0A0B0D] border border-[#1F242C] text-[#E6E8EB] px-3 py-1.5 text-xs rounded-[2px] focus:outline-none focus:border-[#C86D32]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-[#878F99] uppercase block mb-1">
            PACKET SUBJECT
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-[#0A0B0D] border border-[#1F242C] text-[#E6E8EB] px-3 py-1.5 text-xs rounded-[2px] focus:outline-none focus:border-[#C86D32]"
          />
        </div>

        <div>
          <label className="text-[10px] text-[#878F99] uppercase block mb-1">
            PAYLOAD MESSAGE
          </label>
          <textarea
            required
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Discussing distributed systems, backend engineering, or cloud infrastructure..."
            className="w-full bg-[#0A0B0D] border border-[#1F242C] text-[#E6E8EB] px-3 py-1.5 text-xs rounded-[2px] focus:outline-none focus:border-[#C86D32] resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-1">
          <button
            type="button"
            onClick={copyCurl}
            className="text-[11px] text-[#878F99] hover:text-[#E6E8EB] flex items-center gap-1.5"
          >
            {isCopied ? <CopiedSuccessIcon size={12} /> : <CopyIcon size={12} />}
            <span>{isCopied ? "cURL Copied" : "Copy cURL payload"}</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2 bg-[#C86D32] hover:bg-[#e07b39] text-[#0A0B0D] font-bold text-xs rounded-[2px] disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "TRANSMITTING..." : "DISPATCH PACKET"}
          </button>
        </div>

        {responseLog && (
          <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] text-xs text-[#C86D32]">
            &gt; {responseLog}
          </div>
        )}
      </form>
    </div>
  );
}

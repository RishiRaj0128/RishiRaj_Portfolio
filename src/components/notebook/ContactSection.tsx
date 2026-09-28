"use client";

import React, { useState } from "react";
import { PORTFOLIO_CONTENT } from "@/lib/content/portfolioContent";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [renderedAt] = useState<number>(() => Date.now());

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setFeedback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _honeypot: honeypot,
          _renderedAt: renderedAt,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFeedback(data.message || "Message successfully transmitted to Rishi's inbox.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
        setFeedback(data.message || "Failed to transmit message. Please email directly.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error while transmitting payload. Please reach out via email directly.");
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 border-b border-[var(--color-border-default)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-2">
                TRANSMISSION // DIRECT INGRESS
              </span>
              <h2 className="font-serif text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                Get in Touch
              </h2>
              <p className="font-sans text-sm sm:text-base text-[var(--color-text-secondary)] mt-3 leading-relaxed">
                Currently open to internships, distributed systems projects, and backend engineering inquiries.
              </p>
            </div>

            {/* Contact details */}
            <div className="p-5 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-4">
              <div>
                <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] uppercase block font-semibold">
                  PRIMARY EMAIL
                </span>
                <a
                  href={`mailto:${PORTFOLIO_CONTENT.personal.email}`}
                  className="font-mono text-sm text-[var(--color-accent)] hover:underline break-all"
                >
                  {PORTFOLIO_CONTENT.personal.email}
                </a>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] uppercase block font-semibold">
                  LINKEDIN
                </span>
                <a
                  href={PORTFOLIO_CONTENT.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[var(--color-text-primary)] hover:text-[var(--color-accent)] inline-flex items-center gap-1"
                >
                  <span>linkedin.com/in/rishiraj28</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] uppercase block font-semibold">
                  GITHUB
                </span>
                <a
                  href={PORTFOLIO_CONTENT.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[var(--color-text-primary)] hover:text-[var(--color-accent)] inline-flex items-center gap-1"
                >
                  <span>github.com/RishiRaj0128</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="pt-2 border-t border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-tertiary)]">
                Protected by anti-bot honeypot and request velocity verification.
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px]">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Anti-bot Honeypot field (hidden from screen, filled by bots) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="hp_field">Do not fill this</label>
                  <input
                    id="hp_field"
                    type="text"
                    name="_honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs text-[var(--color-text-secondary)] block mb-1">
                      Your Name <span className="text-[var(--color-accent)]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border-default)] focus:border-[var(--color-accent)] text-[var(--color-text-primary)] rounded-[2px] font-sans text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[var(--color-text-secondary)] block mb-1">
                      Your Email <span className="text-[var(--color-accent)]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border-default)] focus:border-[var(--color-accent)] text-[var(--color-text-primary)] rounded-[2px] font-sans text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-[var(--color-text-secondary)] block mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Distributed Systems Internship / Project Inquiry"
                    className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border-default)] focus:border-[var(--color-accent)] text-[var(--color-text-primary)] rounded-[2px] font-sans text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[var(--color-text-secondary)] block mb-1">
                    Message <span className="text-[var(--color-accent)]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project, team, or opportunity..."
                    className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border-default)] focus:border-[var(--color-accent)] text-[var(--color-text-primary)] rounded-[2px] font-sans text-sm focus:outline-none resize-y"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="px-5 py-2.5 bg-[var(--color-accent)] hover:opacity-90 disabled:opacity-50 text-[var(--color-card)] font-sans font-semibold text-xs sm:text-sm rounded-[3px] transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] w-fit"
                  >
                    {status === "submitting" ? "Transmitting..." : "Send Message"}
                  </button>

                  {status === "success" && (
                    <span className="font-mono text-xs text-[var(--color-status-ok)] flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 bg-[var(--color-status-ok)] shrink-0" />
                      {feedback}
                    </span>
                  )}
                  {status === "error" && (
                    <span className="font-mono text-xs text-[var(--color-status-err)]">
                      ✕ {feedback}
                    </span>
                  )}
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

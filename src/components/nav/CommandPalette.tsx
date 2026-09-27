"use client";

import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, CloseIcon, CopiedSuccessIcon } from "@/components/ui/icons";

interface ActionItem {
  id: string;
  category: "NAVIGATION" | "ACTIONS" | "EXTERNAL";
  label: string;
  detail?: string;
  perform: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: ActionItem[] = [
    // Navigation
    {
      id: "nav-hero",
      category: "NAVIGATION",
      label: "Jump to Boot Sequence & Hero",
      detail: "#hero",
      perform: () => {
        window.location.hash = "#hero";
        onClose();
      },
    },
    {
      id: "nav-status",
      category: "NAVIGATION",
      label: "Jump to Status Page (Skills as Services)",
      detail: "#status",
      perform: () => {
        window.location.hash = "#status";
        onClose();
      },
    },
    {
      id: "nav-lab",
      category: "NAVIGATION",
      label: "Jump to Runtime Lab (Interactive Simulations)",
      detail: "#registry",
      perform: () => {
        window.location.hash = "#registry";
        onClose();
      },
    },
    {
      id: "nav-exp",
      category: "NAVIGATION",
      label: "Jump to Internship & Training",
      detail: "#experience",
      perform: () => {
        window.location.hash = "#experience";
        onClose();
      },
    },
    {
      id: "nav-security",
      category: "NAVIGATION",
      label: "Jump to Security Postmortem (Strix Audit)",
      detail: "#postmortem",
      perform: () => {
        window.location.hash = "#postmortem";
        onClose();
      },
    },
    {
      id: "nav-telemetry",
      category: "NAVIGATION",
      label: "Jump to Live Telemetry & Latency Probe",
      detail: "#telemetry",
      perform: () => {
        window.location.hash = "#telemetry";
        onClose();
      },
    },
    {
      id: "nav-ingress",
      category: "NAVIGATION",
      label: "Jump to Contact / Ingress (POST /contact)",
      detail: "#ingress",
      perform: () => {
        window.location.hash = "#ingress";
        onClose();
      },
    },

    // Quick Actions
    {
      id: "act-copy-email",
      category: "ACTIONS",
      label: "Copy Email Address",
      detail: "rishiraj02989@gmail.com",
      perform: () => {
        navigator.clipboard.writeText("rishiraj02989@gmail.com");
        setFeedbackMsg("Copied rishiraj02989@gmail.com to clipboard");
        setTimeout(() => setFeedbackMsg(null), 2500);
      },
    },
    {
      id: "act-curl",
      category: "ACTIONS",
      label: "Copy cURL Ingress Snippet",
      detail: "curl -X POST /api/contact",
      perform: () => {
        const curlCmd = `curl -X POST "${window.location.origin}/api/contact" -H "Content-Type: application/json" -d '{"name":"Visitor","email":"visitor@domain.com","message":"Inquiring about distributed systems engineering."}'`;
        navigator.clipboard.writeText(curlCmd);
        setFeedbackMsg("cURL command copied to clipboard");
        setTimeout(() => setFeedbackMsg(null), 2500);
      },
    },
    {
      id: "act-resume",
      category: "ACTIONS",
      label: "Open Technical Resume",
      detail: "[PLACEHOLDER: Rishi_Raj_Resume.pdf]",
      perform: () => {
        setFeedbackMsg("Technical resume link: [PLACEHOLDER: Rishi_Raj_Resume.pdf]");
        setTimeout(() => setFeedbackMsg(null), 3000);
      },
    },

    // External Profiles
    {
      id: "ext-github",
      category: "EXTERNAL",
      label: "Open Rishi Raj GitHub Profile",
      detail: "github.com/RishiRaj0128",
      perform: () => {
        window.open("https://github.com/RishiRaj0128", "_blank");
        onClose();
      },
    },
    {
      id: "ext-linkedin",
      category: "EXTERNAL",
      label: "Open Rishi Raj LinkedIn Profile",
      detail: "linkedin.com/in/rishiraj28",
      perform: () => {
        window.open("https://www.linkedin.com/in/rishiraj28/", "_blank");
        onClose();
      },
    },
    {
      id: "ext-strix",
      category: "EXTERNAL",
      label: "Open Strix Security Scanner Repository",
      detail: "github.com/usestrix/strix",
      perform: () => {
        window.open("https://github.com/usestrix/strix", "_blank");
        onClose();
      },
    },
  ];

  const filtered = actions.filter((item) => {
    const term = query.toLowerCase().trim();
    if (!term) return true;
    return (
      item.label.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.detail?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].perform();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#111419] border border-[#232A35] rounded-[2px] overflow-hidden font-mono text-xs shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-3 border-b border-[#1F242C] flex items-center gap-2.5 bg-[#14181F]">
          <SearchIcon size={14} className="text-[#8A939E]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type command, action, or section..."
            className="w-full bg-transparent text-[#E6E8EB] placeholder-[#5A626E] text-xs focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-[#8A939E] hover:text-[#E6E8EB] p-1"
            aria-label="Close command palette"
          >
            <CloseIcon size={12} />
          </button>
        </div>

        {/* Temporary Feedback Banner */}
        {feedbackMsg && (
          <div className="px-3 py-1.5 bg-[#1B281F] text-[#2FA866] border-b border-[#232A35] flex items-center gap-2 text-[11px]">
            <CopiedSuccessIcon size={12} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-[#1A1F26] py-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-[#5A626E]">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.perform}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#1A202A] text-[#E6E8EB]"
                      : "text-[#8A939E] hover:bg-[#151920]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] px-1 py-0.5 border rounded-[2px] ${
                        item.category === "NAVIGATION"
                          ? "border-[#232A35] text-[#5A626E]"
                          : item.category === "ACTIONS"
                          ? "border-[#C86D32]/40 text-[#C86D32]"
                          : "border-[#3878A8]/40 text-[#3878A8]"
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="text-[#E6E8EB] font-medium">{item.label}</span>
                  </div>
                  {item.detail && (
                    <span className="text-[10px] text-[#5A626E]">{item.detail}</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer Hints */}
        <div className="px-3 py-2 bg-[#0E1116] border-t border-[#1F242C] text-[10px] text-[#5A626E] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>RUNTIME_CONTROL_PLANE</span>
        </div>
      </div>
    </div>
  );
}

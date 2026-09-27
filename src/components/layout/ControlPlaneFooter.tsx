import React from "react";
import Link from "next/link";
import { StatusDot } from "@/components/ui/icons";

export default function ControlPlaneFooter() {
  const buildDate = "2026-09-23T08:45:00Z";
  const gitCommit = "c3f8e19";

  return (
    <footer className="w-full bg-[#0E1116] border-t border-[#1F242C] font-mono text-xs text-[#8A939E] py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Top summary row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#1A1F26]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#E6E8EB] font-bold text-sm">
              <StatusDot status="ok" />
              <span>RISHI RAJ — RUNTIME CONTROL PLANE</span>
            </div>
            <div className="text-[11px] text-[#5A626E]">
              Backend Distributed Systems • DevOps • Cloud Architecture
            </div>
          </div>

          {/* Real External Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a
              href="https://github.com/RishiRaj0128"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A939E] hover:text-[#E6E8EB] transition-colors"
            >
              github.com/RishiRaj0128
            </a>
            <span className="text-[#232A35]">|</span>
            <a
              href="https://www.linkedin.com/in/rishiraj28/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A939E] hover:text-[#E6E8EB] transition-colors"
            >
              linkedin.com/in/rishiraj28
            </a>
            <span className="text-[#232A35]">|</span>
            <a
              href="mailto:rishiraj02989@gmail.com"
              className="text-[#8A939E] hover:text-[#C86D32] transition-colors"
            >
              rishiraj02989@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Metadata & Legal Links */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] text-[#5A626E]">
          <div className="flex flex-wrap items-center gap-3">
            <span>COMMIT: <code className="text-[#8A939E]">{gitCommit}</code></span>
            <span>BUILD_TIME: <code className="text-[#8A939E]">{buildDate}</code></span>
            <span>STACK: Next.js / React 19 / TypeScript / R3F</span>
          </div>

          {/* Mandatory Terms & Privacy Pages */}
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-[#8A939E] hover:text-[#C86D32] transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/privacy"
              className="text-[#8A939E] hover:text-[#C86D32] transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <span>MIT LICENSE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

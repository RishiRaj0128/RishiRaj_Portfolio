"use client";

import React from "react";
import { ExternalLinkIcon } from "@/components/ui/icons";

export default function IngressOverlay() {
  const bootLogs = [
    "[ OK ] systemd 252.12-1~deb12u1 booted system.",
    "[ OK ] Mounted /sys/fs/cgroup: control plane isolation enabled.",
    "[ OK ] Started Container Engine: containerd v1.7.13.",
    "[ OK ] Initialized Raft Consensus Layer: Quorum 3/5 achieved.",
    "[ OK ] Loaded Network Topology: 8 Service Nodes Mapped.",
    "[ OK ] Ingress Gateway Active: Rishi Raj [Backend & Distributed Systems].",
  ];

  return (
    <div className="space-y-6 text-[#E6E8EB]">
      {/* Profile & Bio Header */}
      <div className="border-b border-[#1F242C] pb-5">
        <div className="text-[11px] text-[#C86D32] uppercase font-mono tracking-wider mb-1">
          OPERATOR PROFILE // INGRESS [0, 0, 0]
        </div>
        <h2 className="text-2xl font-bold font-sans text-[#E6E8EB] tracking-tight">
          Rishi Raj
        </h2>
        <p className="text-sm text-[#878F99] font-sans mt-1">
          Backend Distributed Systems, DevOps, Cloud Architecture
        </p>

        {/* Links Strip */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-mono">
          <a
            href="https://github.com/RishiRaj0128"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C86D32] hover:text-[#E6E8EB] flex items-center gap-1"
          >
            <span>github.com/RishiRaj0128</span>
            <ExternalLinkIcon size={11} />
          </a>
          <span className="text-[#2D3440]">|</span>
          <a
            href="https://www.linkedin.com/in/rishiraj28/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C86D32] hover:text-[#E6E8EB] flex items-center gap-1"
          >
            <span>linkedin.com/in/rishiraj28</span>
            <ExternalLinkIcon size={11} />
          </a>
          <span className="text-[#2D3440]">|</span>
          <span className="text-[#878F99]">rishiraj02989@gmail.com</span>
        </div>
      </div>

      {/* Primary Engineering Focus */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-[#878F99] uppercase tracking-wider">
          CORE FOCUS & PHILOSOPHY
        </div>
        <p className="text-xs font-sans text-[#878F99] leading-relaxed">
          Specializing in fault-tolerant distributed consensus, high-throughput message brokers, transactional saga engines, and automated cloud infrastructure. Building resilient architectures with measurable linearizability and deterministic state recovery under failure injection.
        </p>
      </div>

      {/* Systemd Boot Log Telemetry */}
      <div className="bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] p-3 font-mono text-[11px]">
        <div className="text-[10px] text-[#5A626E] uppercase mb-2 border-b border-[#1F242C] pb-1 flex justify-between">
          <span>HOST BOOT SEQUENCE TELEMETRY</span>
          <span className="text-[#2FA866]">STATUS: RUNNING</span>
        </div>
        <div className="space-y-1 text-[#878F99]">
          {bootLogs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-[#2FA866]">[OK]</span>
              <span>{log.replace("[ OK ] ", "")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Academic & Internship Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
          <div className="text-[10px] text-[#5A626E] uppercase">EDUCATION</div>
          <div className="font-bold text-[#E6E8EB] mt-0.5">B.Tech in CSE (2024–Present)</div>
          <div className="text-[#878F99] text-[11px]">Lovely Professional University</div>
          <div className="text-[#C86D32] text-[11px] font-semibold mt-1">CGPA: 7.98</div>
        </div>
        <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
          <div className="text-[10px] text-[#5A626E] uppercase">INTERNSHIP</div>
          <div className="font-bold text-[#E6E8EB] mt-0.5">AI/ML Intern</div>
          <div className="text-[#878F99] text-[11px]">Edunet Foundation (AICTE-IBM)</div>
          <div className="text-[#878F99] text-[10px] mt-1">Jun–Jul 2025 • Python / Streamlit ML lifecycle</div>
        </div>
      </div>
    </div>
  );
}

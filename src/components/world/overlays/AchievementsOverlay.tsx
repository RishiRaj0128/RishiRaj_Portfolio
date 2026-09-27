"use client";

import React from "react";

export default function AchievementsOverlay() {
  const achievements = [
    {
      metric: "100+ PROBLEMS",
      label: "LeetCode Solved",
      category: "Algorithms & Data Structures",
      detail: "Focus on Graph theory, Dynamic Programming, Heap/Priority Queues, and Concurrency patterns.",
    },
    {
      metric: "TOP 25 / 200",
      label: "Cognitia Finalist",
      category: "Competitive Technical Event",
      detail: "Placed in top 12.5% of competing engineering teams at Lovely Professional University.",
    },
    {
      metric: "CERTIFIED",
      label: "DBMS Certification",
      category: "Infosys Springboard",
      detail: "Relational database schema normalization, transaction isolation levels, and SQL query optimization.",
    },
    {
      metric: "CGPA 7.98",
      label: "B.Tech Computer Science",
      category: "Lovely Professional University",
      detail: "2024–Present • Core coursework in Operating Systems, OOD, Complexity Analysis, and Distributed Systems Basics.",
    },
  ];

  return (
    <div className="space-y-6 text-[#E6E8EB] font-mono">
      {/* Header */}
      <div className="border-b border-[#1F242C] pb-4">
        <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
          WAYPOINT // NODE: ACHIEVEMENTS [-16, 0, -52]
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#E6E8EB] tracking-tight">
          Verified Academic & Algorithmic Credentials
        </h2>
        <p className="text-xs text-[#878F99] font-sans mt-1">
          Factual benchmarks and validated competitive results. No subjective claims or unearned badges.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {achievements.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] space-y-2 hover:border-[#2D3440] transition-colors"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-[#C86D32]">{item.metric}</span>
              <span className="text-[10px] text-[#2FA866] bg-[#0E1A14] px-2 py-0.5 border border-[#2FA866]/30 rounded-[1px]">
                VERIFIED
              </span>
            </div>
            <div>
              <div className="font-bold text-[#E6E8EB] text-xs">{item.label}</div>
              <div className="text-[10px] text-[#5A626E] uppercase">{item.category}</div>
            </div>
            <p className="text-[11px] font-sans text-[#878F99] leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

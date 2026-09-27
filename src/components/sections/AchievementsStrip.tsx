import React from "react";

/**
 * SECTION 5: ACHIEVEMENTS STRIP
 *
 * Small ticker/strip per prompt guidelines:
 * - 100+ DSA problems solved on LeetCode
 * - Top 25 of 200 teams, Cognitia (AI competitive event, Lovely Professional University)
 * - DBMS certification, Infosys Springboard
 * - Education: B.Tech CSE, Lovely Professional University (CGPA 7.98, 2024-Present)
 */

export default function AchievementsStrip() {
  const achievements = [
    {
      metric: "100+ PROBLEMS",
      label: "LeetCode Solved",
      detail: "Data Structures, Algorithms & Concurrency",
    },
    {
      metric: "TOP 25 / 200",
      label: "Cognitia Finalist",
      detail: "AI Competitive Event, Lovely Professional University",
    },
    {
      metric: "CERTIFIED",
      label: "DBMS Certification",
      detail: "Infosys Springboard Relational Schema & SQL",
    },
    {
      metric: "CGPA 7.98",
      label: "B.Tech CSE (2024–Present)",
      detail: "Lovely Professional University",
    },
  ];

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto font-mono">
      <div className="bg-[#111419] border border-[#232A35] rounded-[2px] p-3 sm:p-4">
        <div className="text-[10px] text-[#5A626E] uppercase mb-3 flex justify-between items-center border-b border-[#1F242C] pb-2">
          <span>BENCHMARKS & ACADEMIC CREDENTIALS</span>
          <span>STATUS: VERIFIED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] flex flex-col justify-between space-y-1"
            >
              <div className="text-sm font-bold text-[#C86D32]">
                {item.metric}
              </div>
              <div className="font-semibold text-[#E6E8EB] text-xs">
                {item.label}
              </div>
              <div className="text-[10px] text-[#8A939E] font-sans">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

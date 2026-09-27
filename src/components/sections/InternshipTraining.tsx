import React from "react";
import { StatusDot } from "@/components/ui/icons";

/**
 * SECTION 4: INTERNSHIP & TRAINING
 *
 * Factual entries presented concisely per specification:
 * - Edunet Foundation (AICTE-IBM SkillsBuild) AI/ML Internship (Jun-Jul 2025)
 * - Cipher Schools DSA Training
 */

export default function InternshipTraining() {
  return (
    <section id="experience" className="py-12 px-4 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="mb-6 border-b border-[#1F242C] pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
            CAREER & FORMATION / PRACTICAL EXPOSURE
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E6E8EB] font-sans">
            Internship & Technical Training
          </h2>
        </div>
        <div className="text-xs text-[#8A939E]">
          VERIFIED_ENTRIES: 2
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Entry 1: Edunet / AICTE-IBM */}
        <div className="p-4 bg-[#111419] border border-[#232A35] rounded-[2px] space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[#E6E8EB] font-bold text-sm">
                AI/ML Intern
              </div>
              <div className="text-[#C86D32] text-xs">
                Edunet Foundation (AICTE-IBM SkillsBuild)
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#14181F] border border-[#232A35] text-[#8A939E] text-[10px] rounded-[2px]">
              Jun–Jul 2025 (6 weeks)
            </span>
          </div>

          <p className="text-[#8A939E] font-sans text-xs leading-relaxed">
            Completed an end-to-end machine learning lifecycle project using Python and Streamlit.
            Handled data ingestion, exploratory data analysis (EDA), feature preprocessing with
            NumPy and Pandas, model training via Scikit-learn, and delivered an interactive web
            dashboard.
          </p>

          <div className="pt-2 border-t border-[#1F242C] flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">Python</span>
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">Streamlit</span>
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">Scikit-learn</span>
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">Pandas</span>
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">EDA</span>
          </div>
        </div>

        {/* Entry 2: Cipher Schools DSA Training */}
        <div className="p-4 bg-[#111419] border border-[#232A35] rounded-[2px] space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[#E6E8EB] font-bold text-sm">
                Data Structures & Algorithms Training
              </div>
              <div className="text-[#C86D32] text-xs">
                Cipher Schools
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#14181F] border border-[#232A35] text-[#8A939E] text-[10px] rounded-[2px]">
              Core Training
            </span>
          </div>

          <p className="text-[#8A939E] font-sans text-xs leading-relaxed">
            Intensive algorithmic program covering advanced linear and non-linear data structures,
            graph traversals, dynamic programming paradigms, recursion, and algorithmic complexity
            optimization in Java and C++.
          </p>

          <div className="pt-2 border-t border-[#1F242C] flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">DSA</span>
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">Time/Space Complexity</span>
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">Recursion</span>
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">Java</span>
            <span className="px-1.5 py-0.2 bg-[#0A0B0D] border border-[#1F242C] text-[#8A939E] rounded-[2px]">C++</span>
          </div>
        </div>
      </div>
    </section>
  );
}

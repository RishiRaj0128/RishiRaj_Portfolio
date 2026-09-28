"use client";

import React from "react";
import { PORTFOLIO_CONTENT } from "@/lib/content/portfolioContent";
import { JargonTooltip } from "./JargonTooltip";

export function SkillsSection() {
  return (
    <section id="skills" className="py-16 sm:py-24 border-b border-[var(--color-border-default)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block font-semibold mb-2">
            TECHNICAL REPERTOIRE // GROUPED BY MEANING
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Skills & Working Competencies
          </h2>
          <p className="font-sans text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 leading-relaxed">
            Grouped by what tools actually do, rather than an alphabet soup. No arbitrary percentage bars or subjective checkmarks. Hover or tap dotted terms for plain definitions.
          </p>
        </div>

        {/* 4 Plain Meaning Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PORTFOLIO_CONTENT.skills.map((group, gIdx) => (
            <div
              key={gIdx}
              className="p-5 sm:p-6 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[3px] space-y-4"
            >
              {/* Category Header */}
              <div className="border-b border-[var(--color-border-default)] pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                  {group.categoryName}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[var(--color-text-tertiary)] mt-0.5">
                  {group.description}
                </p>
              </div>

              {/* Skills List */}
              <div className="space-y-2.5">
                {group.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                  >
                    <div className="font-mono font-semibold text-[var(--color-text-primary)]">
                      {skill.jargonKey ? (
                        <JargonTooltip term={skill.name} jargonKey={skill.jargonKey} />
                      ) : (
                        <span>{skill.name}</span>
                      )}
                    </div>
                    {skill.levelOrNote && (
                      <span className="font-sans text-[11px] text-[var(--color-text-secondary)]">
                        {skill.levelOrNote}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

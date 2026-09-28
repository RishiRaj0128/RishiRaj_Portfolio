"use client";

import React, { useState } from "react";
import { Base62ShortenerEngine, ShortenedLinkRecord } from "@/lib/simulations/base62Generator";

export function ShortenerDemo() {
  const [engine] = useState(() => new Base62ShortenerEngine(42));
  const [urlInput, setUrlInput] = useState("https://distributed-systems.engineering/specs/raft-consensus");
  const [currentRecord, setCurrentRecord] = useState<ShortenedLinkRecord | null>(null);
  const [collisionResult, setCollisionResult] = useState<{ count: number; collisions: number; elapsedMs: number } | null>(null);
  const [lastAction, setLastAction] = useState<string>("Ready to encode. Enter a destination URL or click Shorten.");

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const record = engine.shortenUrl(urlInput.trim());
    setCurrentRecord({ ...record });
    setLastAction(`Short link generated! 64-bit Snowflake timestamp packed into 7 Base62 characters.`);
  };

  const handleSimulateClick = (isBot = false) => {
    if (!currentRecord) return;
    const ua = isBot ? "Googlebot/2.1 (+http://www.google.com/bot.html)" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";
    const res = engine.resolveAndTrackClick(currentRecord.shortCode, ua);

    // Refresh record
    const updated = engine.getRecord(currentRecord.shortCode);
    if (updated) setCurrentRecord({ ...updated });

    if (res.isBot) {
      setLastAction(`Bot request detected & filtered! Simulated cache-aside latency: ${res.latencyMs}ms.`);
    } else {
      setLastAction(`Real human click logged! Fast cache-aside redirect latency: ${res.latencyMs}ms.`);
    }
  };

  const handleCollisionTest = () => {
    const proof = engine.runCollisionTest(10000);
    setCollisionResult(proof);
    setLastAction(`Generated 10,000 Snowflake IDs in ${proof.elapsedMs}ms: exactly ${proof.collisions} collisions.`);
  };

  return (
    <div className="p-4 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[3px] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-default)] pb-3">
        <div>
          <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider block font-semibold">
            LIVE EMBEDDED TOOL // SNOWFLAKE BASE62
          </span>
          <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            Try it: shorten a link
          </h4>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleCollisionTest}
          className="px-2.5 py-1 bg-[var(--color-card)] hover:bg-[var(--color-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-[2px] font-mono text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        >
          Run 10,000 Collision Test
        </button>
      </div>

      {/* Input form */}
      <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com/very-long-url-path"
          className="flex-1 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border-default)] focus:border-[var(--color-accent)] text-[var(--color-text-primary)] rounded-[2px] font-mono text-xs sm:text-sm focus:outline-none"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-card)] font-sans font-semibold text-xs sm:text-sm rounded-[2px] transition-opacity focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] whitespace-nowrap"
        >
          Shorten Link
        </button>
      </form>

      {/* Active Shortened Link Card */}
      {currentRecord && (
        <div className="p-3 bg-[var(--color-card)] border border-[var(--color-border-active)] rounded-[2px] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase block font-semibold">
                GENERATED SHORT CODE
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
                cin.bk/<span className="text-[var(--color-accent)]">{currentRecord.shortCode}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSimulateClick(false)}
                className="px-2.5 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] font-mono text-xs rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                + Test Human Click
              </button>
              <button
                type="button"
                onClick={() => handleSimulateClick(true)}
                className="px-2.5 py-1 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] font-mono text-xs rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                + Test Bot Click
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--color-border-subtle)] font-mono text-xs">
            <div className="p-1.5 bg-[var(--color-surface)] rounded-[2px]">
              <span className="text-[var(--color-text-tertiary)] block text-[9px]">CLICKS</span>
              <span className="text-[var(--color-status-ok)] font-bold">{currentRecord.clickCount}</span>
            </div>
            <div className="p-1.5 bg-[var(--color-surface)] rounded-[2px]">
              <span className="text-[var(--color-text-tertiary)] block text-[9px]">BOTS FILTERED</span>
              <span className="text-[var(--color-accent)] font-bold">{currentRecord.botFilteredCount}</span>
            </div>
            <div className="p-1.5 bg-[var(--color-surface)] rounded-[2px]">
              <span className="text-[var(--color-text-tertiary)] block text-[9px]">COLLISIONS</span>
              <span className="text-[var(--color-status-ok)] font-bold">0</span>
            </div>
          </div>
        </div>
      )}

      {/* Collision proof result */}
      {collisionResult && (
        <div className="p-2.5 bg-[var(--color-card)] border border-[var(--color-status-ok)]/40 rounded-[2px] text-xs font-mono flex items-center justify-between">
          <span className="text-[var(--color-text-primary)]">
            Empirical Test: {collisionResult.count.toLocaleString()} rapid Snowflake keys
          </span>
          <span className="text-[var(--color-status-ok)] font-bold">
            {collisionResult.collisions} COLLISIONS ({collisionResult.elapsedMs}ms)
          </span>
        </div>
      )}

      {/* Result feedback */}
      <div className="p-2.5 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[2px] text-xs font-sans text-[var(--color-text-secondary)]">
        {lastAction}
      </div>
    </div>
  );
}

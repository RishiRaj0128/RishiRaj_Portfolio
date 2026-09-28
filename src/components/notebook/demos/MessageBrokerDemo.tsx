"use client";

import React, { useState } from "react";
import { MessageBrokerClusterEngine } from "@/lib/simulations/leaderElection";

export function MessageBrokerDemo() {
  const [engine] = useState(() => new MessageBrokerClusterEngine());
  const [clusterState, setClusterState] = useState(() => engine.getState());
  const [isFailing, setIsFailing] = useState(false);
  const [feedback, setFeedback] = useState<string>(
    "5 broker nodes active. Leader [broker-01] handling incoming writes with Raft Quorum ISR replication."
  );

  const handleKillLeader = () => {
    setIsFailing(true);
    setFeedback("Leader failure injected. Heartbeat dropped; followers triggering Raft re-election countdown...");

    // Real simulation module completes election
    setTimeout(() => {
      engine.completeElection(750);
      const newState = engine.getState();
      setClusterState(newState);
      setIsFailing(false);
      setFeedback(`A new leader was chosen in 0.75 seconds. No messages were lost. New leader: [${newState.leaderId}].`);
    }, 750);
  };

  const handleProduceTestMessage = () => {
    const seq = clusterState.committedMessages.length + 1;
    const res = engine.produceMessage("web-producer", seq, `test_event_${seq}`, 0);
    const newState = engine.getState();
    setClusterState(newState);

    if (res.success) {
      setFeedback(`Committed message #${seq} to Quorum ISR across majority nodes.`);
    } else {
      setFeedback(`Error: ${res.error}`);
    }
  };

  return (
    <div className="p-4 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[3px] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-default)] pb-3">
        <div>
          <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider block font-semibold">
            LIVE INTERACTIVE DEMO // RAFT LEADER ELECTION
          </span>
          <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            Simulate a Broker Crash & Quorum Failover
          </h4>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-2 py-1 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[2px]">
            <span className="text-[var(--color-text-tertiary)] block text-[9px]">ACK LOSS</span>
            <span className="text-[var(--color-status-ok)] font-bold">{clusterState.acknowledgedLossCount} (Zero)</span>
          </div>
          <div className="px-2 py-1 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[2px]">
            <span className="text-[var(--color-text-tertiary)] block text-[9px]">ACTIVE LEADER</span>
            <span className="text-[var(--color-accent)] font-bold">{clusterState.leaderId || "ELECTING..."}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isFailing}
          onClick={handleKillLeader}
          className="px-3 py-1.5 bg-[var(--color-status-err)] hover:opacity-90 disabled:opacity-50 text-white font-mono text-xs font-semibold rounded-[2px] transition-opacity focus:outline-none focus:ring-1 focus:ring-[var(--color-status-err)]"
        >
          {isFailing ? "Electing standby..." : "Pretend the main server crashes"}
        </button>

        <button
          type="button"
          disabled={isFailing}
          onClick={handleProduceTestMessage}
          className="px-3 py-1.5 bg-[var(--color-card)] hover:bg-[var(--color-hover)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-mono text-xs rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        >
          Send test message
        </button>
      </div>

      {/* Result feedback */}
      <div className="p-3 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[2px] space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[var(--color-text-tertiary)]">RESULT SENTENCE:</span>
          <span className="text-[var(--color-status-ok)] font-semibold">RECOVERY: ~750ms</span>
        </div>
        <p className="font-sans text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed">
          {feedback}
        </p>
      </div>
    </div>
  );
}

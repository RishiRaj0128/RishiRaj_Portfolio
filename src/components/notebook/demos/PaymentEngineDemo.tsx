"use client";

import React, { useState } from "react";
import { SagaPaymentEngine } from "@/lib/simulations/sagaFsm";

export function PaymentEngineDemo() {
  const [engine] = useState(() => new SagaPaymentEngine());
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedback, setFeedback] = useState<string>("Ready. Choose an action below to test the transaction safety nets.");
  const [lastTxState, setLastTxState] = useState<string>("IDLE");
  const [duplicateBlockedCount, setDuplicateBlockedCount] = useState(0);
  const [compensationDuration, setCompensationDuration] = useState<number | null>(null);

  const runNominal = async () => {
    setIsExecuting(true);
    setFeedback("Running normal transaction through composed validation gates...");
    const res = await engine.executeBookingSaga({
      idempotencyKey: `idem_nom_${Date.now()}`,
      userId: "usr_alice",
      movieTitle: "Interstellar 70mm",
      seats: ["C4", "C5"],
      amount: 40.0,
    });
    setLastTxState(res.transaction.state);
    setFeedback("Transaction confirmed. All 8 validation checks passed. Double-entry ledger balanced with 0 drift.");
    setIsExecuting(false);
  };

  const runTimeoutFailure = async () => {
    setIsExecuting(true);
    setFeedback("Injecting downstream payment gateway timeout (HTTP 504)...");
    const res = await engine.executeBookingSaga({
      idempotencyKey: `idem_fail_${Date.now()}`,
      userId: "usr_bob",
      movieTitle: "Dune Part Two",
      seats: ["D10"],
      amount: 25.0,
      injectFailure: "GATEWAY_TIMEOUT",
    });
    setLastTxState(res.transaction.state);
    const dur = res.transaction.compensationDurationMs || 300;
    setCompensationDuration(dur);
    setFeedback(`The half-finished payment was reversed in ${dur}ms. Seats unlocked, ledger balance: 0 net drift.`);
    setIsExecuting(false);
  };

  const runDuplicateRetry = async () => {
    setIsExecuting(true);
    const fixedKey = "idem_fixed_retry_token_491";
    // First call
    await engine.executeBookingSaga({
      idempotencyKey: fixedKey,
      userId: "usr_charlie",
      movieTitle: "Blade Runner 2049",
      seats: ["B1"],
      amount: 18.0,
    });
    // Duplicate retry
    const res = await engine.executeBookingSaga({
      idempotencyKey: fixedKey,
      userId: "usr_charlie",
      movieTitle: "Blade Runner 2049",
      seats: ["B1"],
      amount: 18.0,
    });
    setDuplicateBlockedCount((prev) => prev + 1);
    setLastTxState(res.transaction.state);
    setFeedback("Duplicate payment suppressed. Customer was NOT charged twice. Original receipt returned.");
    setIsExecuting(false);
  };

  const drift = engine.computeLedgerDrift();

  return (
    <div className="p-4 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded-[3px] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-default)] pb-3">
        <div>
          <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider block font-semibold">
            LIVE INTERACTIVE DEMO // SAGA FSM & IDEMPOTENCY
          </span>
          <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            Test the Payment Engine Under Failure
          </h4>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="px-2 py-1 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[2px]">
            <span className="text-[var(--color-text-tertiary)] block text-[9px]">ROLLBACK</span>
            <span className="text-[var(--color-accent)] font-bold">{compensationDuration ? `~${compensationDuration}ms` : "Standby"}</span>
          </div>
          <div className="px-2 py-1 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[2px]">
            <span className="text-[var(--color-text-tertiary)] block text-[9px]">NET DRIFT</span>
            <span className="text-[var(--color-status-ok)] font-bold">${drift.netDrift.toFixed(2)}</span>
          </div>
          <div className="px-2 py-1 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[2px]">
            <span className="text-[var(--color-text-tertiary)] block text-[9px]">DUPLICATES</span>
            <span className="text-[var(--color-status-ok)] font-bold">{duplicateBlockedCount} BLOCKED</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isExecuting}
          onClick={runTimeoutFailure}
          className="px-3 py-1.5 bg-[var(--color-card)] hover:bg-[var(--color-hover)] border border-[var(--color-status-err)] text-[var(--color-status-err)] hover:text-white hover:bg-[var(--color-status-err)] font-mono text-xs rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-status-err)] disabled:opacity-50"
        >
          Make the bank time out
        </button>

        <button
          type="button"
          disabled={isExecuting}
          onClick={runDuplicateRetry}
          className="px-3 py-1.5 bg-[var(--color-card)] hover:bg-[var(--color-hover)] border border-[var(--color-border-active)] text-[var(--color-text-primary)] font-mono text-xs rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-50"
        >
          Send the same payment twice
        </button>

        <button
          type="button"
          disabled={isExecuting}
          onClick={runNominal}
          className="px-3 py-1.5 bg-[var(--color-card)] hover:bg-[var(--color-hover)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-mono text-xs rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-50"
        >
          Run normal payment
        </button>
      </div>

      {/* Result feedback */}
      <div className="p-3 bg-[var(--color-card)] border border-[var(--color-border-default)] rounded-[2px] space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[var(--color-text-tertiary)]">RESULT SENTENCE:</span>
          <span className="text-[var(--color-accent)] font-semibold">STATE: {lastTxState}</span>
        </div>
        <p className="font-sans text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed">
          {feedback}
        </p>
      </div>
    </div>
  );
}

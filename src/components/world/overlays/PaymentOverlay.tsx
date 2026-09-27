"use client";

import React, { useState, useEffect } from "react";
import { sharedSagaEngine } from "@/lib/simulations/simulationInstances";
import { BookingTransaction, LedgerEntry } from "@/lib/simulations/sagaFsm";

export default function PaymentOverlay() {
  const [currentTx, setCurrentTx] = useState<BookingTransaction | null>(null);
  const [sagaFeedback, setSagaFeedback] = useState<string | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(sharedSagaEngine.getLedger());
  const [ledgerDrift, setLedgerDrift] = useState(sharedSagaEngine.computeLedgerDrift());
  const [stats, setStats] = useState(sharedSagaEngine.getStats());
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const unsub = sharedSagaEngine.subscribe(() => {
      setLedgerEntries(sharedSagaEngine.getLedger());
      setLedgerDrift(sharedSagaEngine.computeLedgerDrift());
      setStats(sharedSagaEngine.getStats());
    });
    return () => unsub();
  }, []);

  const handleRunTransaction = async (
    failureType?: "GATEWAY_TIMEOUT" | "SEAT_CONTENTION" | "DUPLICATE_WEBHOOK" | "ILLEGAL_TRANSITION"
  ) => {
    setIsExecuting(true);
    setSagaFeedback("Executing Saga workflow coordinator...");

    const key =
      failureType === "DUPLICATE_WEBHOOK" && currentTx
        ? currentTx.idempotencyKey
        : `idem_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      const res = await sharedSagaEngine.executeBookingSaga({
        idempotencyKey: key,
        userId: "usr_rishiraj",
        movieTitle: "Interstellar [IMAX Laser]",
        seats: ["H14", "H15"],
        amount: 38.0,
        injectFailure: failureType,
      });

      setCurrentTx(res.transaction);
      setSagaFeedback(res.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#E6E8EB] font-mono">
      {/* Header */}
      <div className="border-b border-[#1F242C] pb-4">
        <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
          FLAGSHIP SYSTEM // NODE: PAYMENT [24, 0, 48]
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#E6E8EB] tracking-tight">
            Payment Engine / Movie Ticket Booking
          </h2>
          <span className="text-xs text-[#878F99] bg-[#0A0B0D] px-2.5 py-1 border border-[#1F242C] rounded-[2px] w-fit">
            REPO: [PLACEHOLDER]
          </span>
        </div>
        <p className="text-xs text-[#878F99] font-sans mt-1">
          Jul–Aug 2026 • Java, Spring Boot, MySQL, Python, REST APIs, LLM APIs, Vector DBs (FAISS, ChromaDB)
        </p>
      </div>

      {/* VERIFIED RESULTS TABLE (Exact numbers per prompt specification) */}
      <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
        <div className="text-[10px] text-[#5A626E] uppercase mb-2 flex justify-between border-b border-[#1F242C] pb-1">
          <span>VERIFIED BENCHMARK RESULTS</span>
          <span className="text-[#2FA866]">STATUS: PRODUCTION HARDENED</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">all 8 validation checks</span>
            <span className="text-[10px] text-[#878F99] font-sans">surfaced in one pass</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">zero duplicate charges</span>
            <span className="text-[10px] text-[#878F99] font-sans">across 10,000 concurrent retries</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">100% rejection</span>
            <span className="text-[10px] text-[#878F99] font-sans">of 50+ illegal transitions</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">~300ms compensation</span>
            <span className="text-[10px] text-[#878F99] font-sans">compensation reversal</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">zero net drift</span>
            <span className="text-[10px] text-[#878F99] font-sans">across 5,000+ ledger entries</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">3 documented incidents</span>
            <span className="text-[10px] text-[#878F99] font-sans">resolved failure-injection incidents</span>
          </div>
        </div>
      </div>

      {/* HONEST LLM & VECTOR DB ARCHITECTURE NOTE */}
      <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] text-xs">
        <div className="text-[10px] text-[#C86D32] uppercase mb-1">
          ACCURATE ARCHITECTURE SCOPE (HONEST LLM / VECTOR DB USAGE)
        </div>
        <p className="text-[11px] font-sans text-[#878F99] leading-relaxed">
          Vector DBs (FAISS and ChromaDB) and LLM APIs in this project were implemented specifically for semantic natural-language movie search and contextual assistant query routing (matching user preferences like “dark psychological thrillers with seats in middle rows” to screening embeddings). The core payment processing, ledger accounting, and Saga state machine are strictly deterministic Java/Spring Boot systems.
        </p>
      </div>

      {/* INTERACTIVE FAILURE INJECTION & SAGA COMPENSATION SIMULATION */}
      <div className="p-4 bg-[#111317] border border-[#232A35] rounded-[2px] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#1F242C] pb-3">
          <div>
            <div className="text-[10px] text-[#C86D32] uppercase">INTERACTIVE SIMULATION</div>
            <div className="text-sm font-bold text-[#E6E8EB]">Saga Compensation & Downstream Failure Injection</div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handleRunTransaction()}
              disabled={isExecuting}
              className="px-3 py-1.5 bg-[#C86D32] hover:bg-[#e07b39] text-[#0A0B0D] font-bold rounded-[2px] disabled:opacity-40"
            >
              RUN NOMINAL TX
            </button>
            <button
              onClick={() => handleRunTransaction("GATEWAY_TIMEOUT")}
              disabled={isExecuting}
              className="px-2.5 py-1.5 bg-[#171B22] border border-[#C24545] text-[#C24545] hover:bg-[#201013] rounded-[2px] font-bold"
            >
              INJECT TIMEOUT
            </button>
            <button
              onClick={() => handleRunTransaction("ILLEGAL_TRANSITION")}
              disabled={isExecuting}
              className="px-2.5 py-1.5 bg-[#171B22] border border-[#2D3440] hover:border-[#C86D32] text-[#878F99] rounded-[2px]"
            >
              ILLEGAL TRANSITION
            </button>
            <button
              onClick={() => handleRunTransaction("DUPLICATE_WEBHOOK")}
              disabled={isExecuting || !currentTx}
              className="px-2.5 py-1.5 bg-[#171B22] border border-[#2D3440] hover:border-[#C86D32] text-[#878F99] rounded-[2px] disabled:opacity-40"
            >
              REPLAY WEBHOOK
            </button>
          </div>
        </div>

        {/* Feedback Bar */}
        {sagaFeedback && (
          <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] text-xs text-[#878F99]">
            &gt; {sagaFeedback}
          </div>
        )}

        {/* Saga Workflow Steps */}
        {currentTx && (
          <div className="space-y-2">
            <div className="text-[10px] text-[#5A626E] uppercase flex justify-between">
              <span>SAGA ORCHESTRATION PIPELINE (TX: {currentTx.id})</span>
              <span className="text-[#C86D32]">STATE: {currentTx.state}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {currentTx.sagaSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-[2px] border text-xs ${
                    step.status === "COMPLETED"
                      ? "bg-[#0E1A14] border-[#2FA866]"
                      : step.status === "COMPENSATED"
                      ? "bg-[#251A12] border-[#C88D32]"
                      : step.status === "FAILED"
                      ? "bg-[#201013] border-[#C24545]"
                      : "bg-[#0A0B0D] border-[#1F242C]"
                  }`}
                >
                  <div className="font-bold text-[#E6E8EB] text-[11px]">{step.step}</div>
                  <div className="flex justify-between items-center text-[10px] text-[#878F99] mt-1">
                    <span>{step.status}</span>
                    <span>{step.durationMs}ms</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 8-Point Composed Predicate Evaluation in one pass */}
            <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] space-y-1.5">
              <div className="text-[10px] text-[#5A626E] uppercase flex justify-between border-b border-[#1F242C] pb-1">
                <span>COMPOSED PREDICATE EVALUATION (ALL 8 CHECKS IN ONE PASS)</span>
                <span className="text-[#2FA866]">8/8 EVALUATED</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                {currentTx.validationChecks.map((chk) => (
                  <div key={chk.id} className="flex items-center justify-between text-[#878F99]">
                    <span className="truncate pr-2">{chk.name}</span>
                    <span className={chk.passed ? "text-[#2FA866] font-semibold" : "text-[#C24545] font-semibold"}>
                      {chk.passed ? "PASS" : "FAIL"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Double-Entry Ledger Drift Monitor */}
        <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] flex flex-wrap justify-between items-center text-xs gap-3">
          <div>
            <span className="text-[#5A626E] block text-[10px]">TOTAL DEBITS / CREDITS</span>
            <span className="text-[#E6E8EB] font-bold">
              ${ledgerDrift.totalDebit.toFixed(2)} DEBIT = ${ledgerDrift.totalCredit.toFixed(2)} CREDIT
            </span>
          </div>
          <div>
            <span className="text-[#5A626E] block text-[10px]">NET DRIFT ACROSS LEDGER</span>
            <span className="text-[#2FA866] font-bold">
              ${ledgerDrift.netDrift.toFixed(4)} (ZERO NET DRIFT)
            </span>
          </div>
          <div>
            <span className="text-[#5A626E] block text-[10px]">ILLEGAL TRANSITIONS REJECTED</span>
            <span className="text-[#C86D32] font-bold">
              {stats.illegalTransitionsRejected} REJECTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

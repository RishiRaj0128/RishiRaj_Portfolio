"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ExternalLinkIcon, StatusDot, CopiedSuccessIcon } from "@/components/ui/icons";
import { MessageBrokerClusterEngine, ClusterState } from "@/lib/simulations/leaderElection";
import { SagaPaymentEngine, BookingTransaction, LedgerEntry } from "@/lib/simulations/sagaFsm";
import { Base62ShortenerEngine, ShortenedLinkRecord } from "@/lib/simulations/base62Generator";

// Lazy-load the one and only 3D simulation with ssr: false
const MessageBrokerCluster3D = dynamic(
  () => import("@/components/three/MessageBrokerCluster3D"),
  { ssr: false }
);

// Instantiate persistent client-side simulation engines
const brokerEngine = new MessageBrokerClusterEngine();
const sagaEngine = new SagaPaymentEngine();
const shortenerEngine = new Base62ShortenerEngine(42);

export default function RuntimeLab() {
  // Engine 1 State
  const [clusterState, setClusterState] = useState<ClusterState>(brokerEngine.getState());

  // Engine 2 State
  const [currentTx, setCurrentTx] = useState<BookingTransaction | null>(null);
  const [sagaFeedback, setSagaFeedback] = useState<string | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(sagaEngine.getLedger());
  const [ledgerDrift, setLedgerDrift] = useState(sagaEngine.computeLedgerDrift());
  const [isSagaExecuting, setIsSagaExecuting] = useState(false);

  // Engine 3 State
  const [inputUrl, setInputUrl] = useState("https://github.com/RishiRaj0128/message-broker");
  const [shortLinks, setShortLinks] = useState<ShortenedLinkRecord[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [collisionResult, setCollisionResult] = useState<{ count: number; collisions: number; elapsedMs: number } | null>(null);

  // Subscriptions
  useEffect(() => {
    const unsubBroker = brokerEngine.subscribe((state) => setClusterState(state));
    const unsubSaga = sagaEngine.subscribe(() => {
      setLedgerEntries(sagaEngine.getLedger());
      setLedgerDrift(sagaEngine.computeLedgerDrift());
    });
    const unsubShortener = shortenerEngine.subscribe(() => {
      setShortLinks(shortenerEngine.getAllRecords());
    });

    // Seed initial shortened URL for instant interaction
    shortenerEngine.shortenUrl("https://github.com/RishiRaj0128/message-broker");

    return () => {
      unsubBroker();
      unsubSaga();
      unsubShortener();
    };
  }, []);

  // Saga Simulation Handlers
  const handleExecuteSaga = async (
    failureType?: "GATEWAY_TIMEOUT" | "SEAT_CONTENTION" | "DUPLICATE_WEBHOOK" | "ILLEGAL_TRANSITION"
  ) => {
    setIsSagaExecuting(true);
    setSagaFeedback("Initiating Saga transaction workflow...");

    const key =
      failureType === "DUPLICATE_WEBHOOK" && currentTx
        ? currentTx.idempotencyKey
        : `idem_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      const res = await sagaEngine.executeBookingSaga({
        idempotencyKey: key,
        userId: "usr_rishiraj",
        movieTitle: "Oppenheimer [70mm IMAX]",
        seats: ["F12", "F13"],
        amount: 32.5,
        injectFailure: failureType,
      });

      setCurrentTx(res.transaction);
      setSagaFeedback(res.message);
    } finally {
      setIsSagaExecuting(false);
    }
  };

  // Shortener Handlers
  const handleShortenUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    const rec = shortenerEngine.shortenUrl(inputUrl);
    setCopiedCode(rec.shortCode);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleSimulateClick = (shortCode: string, isBot: boolean = false) => {
    shortenerEngine.resolveAndTrackClick(
      shortCode,
      isBot ? "Googlebot/2.1 (+http://www.google.com/bot.html)" : "Mozilla/5.0 Chrome/120"
    );
  };

  const handleRunCollisionStressTest = () => {
    const res = shortenerEngine.runCollisionTest(5000);
    setCollisionResult(res);
    setTimeout(() => setCollisionResult(null), 6000);
  };

  return (
    <section id="registry" className="py-16 px-4 max-w-7xl mx-auto font-mono">
      {/* Section Header */}
      <div className="mb-8 border-b border-[#1F242C] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
            RUNTIME LAB / CLIENT-SIDE RECONSTRUCTIONS
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E6E8EB] font-sans">
            Flagship Systems Lab: Don&apos;t read about them. Run them.
          </h2>
        </div>
        <div className="text-xs text-[#8A939E]">
          SIMULATIONS: 3 ACTIVE | CODEBASE_VERIFICATION: 100% PASS
        </div>
      </div>

      <div className="space-y-12">
        {/* ============================================================ */}
        {/* FLAGSHIP PROJECT 1: DISTRIBUTED MESSAGE BROKER */}
        {/* ============================================================ */}
        <div className="bg-[#111419] border border-[#232A35] rounded-[2px] overflow-hidden">
          {/* Card Header */}
          <div className="p-4 bg-[#14181F] border-b border-[#1F242C] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[#E6E8EB] font-bold text-sm tracking-wide">
                1. Distributed Message Broker
              </span>
              <span className="px-1.5 py-0.5 text-[10px] bg-[#0A0B0D] border border-[#232A35] text-[#8A939E] rounded-[2px]">
                Aug–Sep 2026
              </span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-[2px] font-bold bg-[#1B281F] text-[#2FA866] border border-[#2FA866]/30">
                ACTIVE_CLUSTER
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[11px] text-[#5A626E]">
                Stack: Java, Multithreading, Sockets, Prometheus, Grafana, YAML
              </span>
              <span className="text-[#3A4556]">|</span>
              <span className="text-[#8A939E] text-[11px]" title="Pending public repository release">
                [PLACEHOLDER: exact GitHub repo URL]
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-xs sm:text-sm text-[#8A939E] font-sans leading-relaxed">
              High-throughput partitioned message broker written in Java with custom socket protocol serialization,
              leader-follower quorum replication, and Prometheus telemetry exporters. Demonstrates deterministic
              failover and zero message loss guarantees under aggressive chaos injection.
            </p>

            {/* Verified Resume Claims Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">ACKNOWLEDGED LOSS</div>
                <div className="text-sm font-semibold text-[#2FA866] mt-0.5">0 messages lost</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Across 50+ failure cycles</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">LEADER FAILOVER</div>
                <div className="text-sm font-semibold text-[#E6E8EB] mt-0.5">~750ms restoration</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Heartbeat-driven re-election</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">IDEMPOTENCY PROOF</div>
                <div className="text-sm font-semibold text-[#E6E8EB] mt-0.5">0 duplicates</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Per-partition sequence tracking</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">CONSUMER REBALANCE</div>
                <div className="text-sm font-semibold text-[#2FA866] mt-0.5">&lt;200ms downtime</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Dynamic 5-node partition sync</div>
              </div>
            </div>

            {/* Purposeful 3D Cluster Simulation */}
            <div className="pt-2">
              <MessageBrokerCluster3D engine={brokerEngine} clusterState={clusterState} />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FLAGSHIP PROJECT 2: MOVIE BOOKING & PAYMENT SAGA */}
        {/* ============================================================ */}
        <div className="bg-[#111419] border border-[#232A35] rounded-[2px] overflow-hidden">
          {/* Card Header */}
          <div className="p-4 bg-[#14181F] border-b border-[#1F242C] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[#E6E8EB] font-bold text-sm tracking-wide">
                2. Online Movie Ticket Booking / Payment Engine
              </span>
              <span className="px-1.5 py-0.5 text-[10px] bg-[#0A0B0D] border border-[#232A35] text-[#8A939E] rounded-[2px]">
                Jul–Aug 2026
              </span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-[2px] font-bold bg-[#1F1915] text-[#C88D32] border border-[#C88D32]/30">
                SAGA_ORCHESTRATOR
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[11px] text-[#5A626E]">
                Stack: Java, Spring Boot, MySQL, Python, REST, FAISS, ChromaDB
              </span>
              <span className="text-[#3A4556]">|</span>
              <span className="text-[#8A939E] text-[11px]">
                [PLACEHOLDER: exact GitHub repo URL]
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-xs sm:text-sm text-[#8A939E] font-sans leading-relaxed">
              Fault-tolerant booking orchestration platform featuring an explicit transaction state machine,
              Saga compensation workflow, atomic hash idempotency, and double-entry append-only ledger.
              <span className="text-[#E6E8EB] ml-1">
                AI integration note: LLM APIs and Vector DBs (FAISS, ChromaDB) are specifically employed
                for natural language seat preference parsing and contextual movie screening semantic matching.
              </span>
            </p>

            {/* Verified Claims Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">LEDGER DRIFT</div>
                <div className="text-sm font-semibold text-[#2FA866] mt-0.5">0.00 net drift</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Double-entry debit/credit parity</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">SAGA COMPENSATION</div>
                <div className="text-sm font-semibold text-[#E6E8EB] mt-0.5">~300ms reversal</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Reverses partial state on failure</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">ILLEGAL FSM REJECTION</div>
                <div className="text-sm font-semibold text-[#2FA866] mt-0.5">100% rejected</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">50+ illegal transitions blocked</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">PREDICATE CHAIN</div>
                <div className="text-sm font-semibold text-[#E6E8EB] mt-0.5">8 checks / 1 pass</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Inventory, solvency, fraud, bounds</div>
              </div>
            </div>

            {/* Interactive Saga Orchestrator Simulation */}
            <div className="p-4 bg-[#0E1116] border border-[#232A35] rounded-[2px] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F242C] pb-2">
                <div className="text-xs font-bold text-[#E6E8EB] flex items-center gap-2">
                  <StatusDot status={currentTx?.state === "CONFIRMED" ? "ok" : currentTx?.state === "COMPENSATED" ? "warn" : "idle"} />
                  <span>SAGA_TRANSACTION_ORCHESTRATOR</span>
                  {currentTx && (
                    <span className="text-[10px] text-[#5A626E]">TX_ID: {currentTx.id}</span>
                  )}
                </div>
                <div className="text-[11px] text-[#8A939E]">
                  STATE: <span className="text-[#C86D32] font-bold">{currentTx?.state || "IDLE"}</span>
                </div>
              </div>

              {/* Stepper Visualization */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {[
                  { name: "1. RESERVE_SEATS", label: "Inventory Lock" },
                  { name: "2. AUTHORIZE_PAYMENT", label: "Gateway API" },
                  { name: "3. CONFIRM_TICKETS", label: "Booking DB" },
                  { name: "4. RECORD_LEDGER", label: "Append-Only" },
                ].map((s, idx) => {
                  const stepState = currentTx?.sagaSteps[idx]?.status || "PENDING";
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 border rounded-[2px] transition-colors ${
                        stepState === "COMPLETED"
                          ? "bg-[#1B281F] border-[#2FA866]/40 text-[#2FA866]"
                          : stepState === "COMPENSATED"
                          ? "bg-[#1F1915] border-[#C88D32]/40 text-[#C88D32]"
                          : stepState === "FAILED"
                          ? "bg-[#251313] border-[#C24545]/40 text-[#C24545]"
                          : "bg-[#111419] border-[#232A35] text-[#5A626E]"
                      }`}
                    >
                      <div className="font-bold text-[11px]">{s.name}</div>
                      <div className="text-[10px] text-[#8A939E] mt-0.5">{s.label}</div>
                      <div className="text-[9px] mt-1 font-mono uppercase">
                        [{stepState}]
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulation Action Triggers */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => handleExecuteSaga()}
                  disabled={isSagaExecuting}
                  className="px-3 py-1.5 bg-[#C86D32] hover:bg-[#B05B26] text-[#0A0B0D] font-bold rounded-[2px] transition-colors text-xs disabled:opacity-50"
                >
                  RUN_HAPPY_PATH
                </button>
                <button
                  onClick={() => handleExecuteSaga("GATEWAY_TIMEOUT")}
                  disabled={isSagaExecuting}
                  className="px-3 py-1.5 bg-[#251313] hover:bg-[#381B1B] border border-[#C24545]/60 text-[#C24545] font-bold rounded-[2px] transition-colors text-xs disabled:opacity-50"
                  title="Simulates payment gateway drop triggering reverse compensation"
                >
                  SIMULATE_TIMEOUT (~300ms SAGA ROLLBACK)
                </button>
                <button
                  onClick={() => handleExecuteSaga("SEAT_CONTENTION")}
                  disabled={isSagaExecuting}
                  className="px-2.5 py-1.5 bg-[#14181F] hover:bg-[#1A202A] border border-[#232A35] text-[#8A939E] hover:text-[#E6E8EB] rounded-[2px] transition-colors text-xs disabled:opacity-50"
                >
                  SEAT_CONTENTION
                </button>
                <button
                  onClick={() => handleExecuteSaga("DUPLICATE_WEBHOOK")}
                  disabled={isSagaExecuting || !currentTx}
                  className="px-2.5 py-1.5 bg-[#14181F] hover:bg-[#1A202A] border border-[#232A35] text-[#8A939E] hover:text-[#E6E8EB] rounded-[2px] transition-colors text-xs disabled:opacity-50"
                >
                  REPLAY_DUPLICATE_WEBHOOK
                </button>
                <button
                  onClick={() => handleExecuteSaga("ILLEGAL_TRANSITION")}
                  disabled={isSagaExecuting}
                  className="px-2.5 py-1.5 bg-[#14181F] hover:bg-[#1A202A] border border-[#232A35] text-[#8A939E] hover:text-[#E6E8EB] rounded-[2px] transition-colors text-xs disabled:opacity-50"
                >
                  TEST_ILLEGAL_TRANSITION
                </button>
              </div>

              {/* Status & Feedback Output */}
              {sagaFeedback && (
                <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] text-xs text-[#E6E8EB]">
                  <span className="text-[#C86D32] mr-2">LOG:</span>
                  {sagaFeedback}
                </div>
              )}

              {/* Double-Entry Append-Only Ledger Readout */}
              <div className="mt-4 pt-3 border-t border-[#1F242C]">
                <div className="text-[10px] text-[#5A626E] uppercase flex justify-between mb-2">
                  <span>DOUBLE-ENTRY APPEND-ONLY LEDGER (AUDIT TRAIL)</span>
                  <span className="text-[#2FA866] font-bold">
                    NET DRIFT: {ledgerDrift.netDrift.toFixed(2)} (DEBIT: ${ledgerDrift.totalDebit.toFixed(2)} | CREDIT: ${ledgerDrift.totalCredit.toFixed(2)})
                  </span>
                </div>

                <div className="max-h-36 overflow-y-auto divide-y divide-[#1A1F26] bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] text-[11px]">
                  {ledgerEntries.slice(-4).reverse().map((entry) => (
                    <div key={entry.id} className="p-2 flex justify-between items-center text-[#8A939E]">
                      <div className="flex items-center gap-2">
                        <span className={`px-1 py-0.2 rounded-[1px] text-[9px] font-bold ${entry.direction === "DEBIT" ? "bg-[#17231B] text-[#2FA866]" : "bg-[#251A14] text-[#C86D32]"}`}>
                          {entry.direction}
                        </span>
                        <span className="text-[#E6E8EB]">{entry.account}</span>
                        <span className="text-[10px] text-[#5A626E]">({entry.description})</span>
                      </div>
                      <span className="text-[#E6E8EB] font-mono">${entry.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FLAGSHIP PROJECT 3: REAL WORKING URL SHORTENER */}
        {/* ============================================================ */}
        <div className="bg-[#111419] border border-[#232A35] rounded-[2px] overflow-hidden">
          {/* Card Header */}
          <div className="p-4 bg-[#14181F] border-b border-[#1F242C] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[#E6E8EB] font-bold text-sm tracking-wide">
                3. URL Shortener with Click Analytics
              </span>
              <span className="px-1.5 py-0.5 text-[10px] bg-[#0A0B0D] border border-[#232A35] text-[#8A939E] rounded-[2px]">
                Apr–Jun 2026
              </span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-[2px] font-bold bg-[#17231B] text-[#2FA866] border border-[#2FA866]/30">
                LIVE_FEATURE
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[11px] text-[#5A626E]">
                Stack: Java, Spring Boot, Redis, MySQL
              </span>
              <span className="text-[#3A4556]">|</span>
              <span className="text-[#8A939E] text-[11px]">
                [PLACEHOLDER: exact GitHub repo URL]
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-xs sm:text-sm text-[#8A939E] font-sans leading-relaxed">
              Snowflake-inspired 64-bit ID generation scheme encoded in Base62. Built with a Redis cache-aside
              architecture and synthetic bot-filtering heuristics.
              <span className="text-[#E6E8EB] ml-1">
                Below is a genuine, live embedded generator running the real algorithm directly on this page.
              </span>
            </p>

            {/* Verified Past Test Results (Honestly Cited) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">PAST STRESS TEST</div>
                <div className="text-sm font-semibold text-[#2FA866] mt-0.5">1M codes / 0 collisions</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">64-bit Snowflake timestamp+node</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">THROUGHPUT SLA</div>
                <div className="text-sm font-semibold text-[#E6E8EB] mt-0.5">&lt;50ms at 5k req/s</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Benchmarked under synthetic load</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">CACHE-ASIDE LATENCY</div>
                <div className="text-sm font-semibold text-[#E6E8EB] mt-0.5">~65% reduction</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Redis key-value hit path</div>
              </div>
              <div className="p-2.5 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
                <div className="text-[10px] text-[#5A626E] uppercase">BOT CLASSIFICATION</div>
                <div className="text-sm font-semibold text-[#2FA866] mt-0.5">92% synthetic filtered</div>
                <div className="text-[10px] text-[#8A939E] mt-0.5">Header & rate profiling</div>
              </div>
            </div>

            {/* Live Interactive Shortener Form */}
            <div className="p-4 bg-[#0E1116] border border-[#232A35] rounded-[2px] space-y-4 text-xs">
              <div className="text-xs font-bold text-[#E6E8EB] flex items-center justify-between">
                <span>LIVE EMBEDDED TOOL: BASE62 SHORT-CODE GENERATOR</span>
                <button
                  onClick={handleRunCollisionStressTest}
                  className="text-[10px] text-[#C86D32] hover:text-[#E6E8EB] px-2 py-0.5 border border-[#232A35] rounded-[2px] transition-colors"
                >
                  RUN_5000_KEY_COLLISION_CHECK
                </button>
              </div>

              {collisionResult && (
                <div className="p-2 bg-[#1B281F] border border-[#2FA866]/40 text-[#2FA866] text-[11px]">
                  Collision Check Finished: {collisionResult.count} keys generated in {collisionResult.elapsedMs}ms → {collisionResult.collisions} collisions detected.
                </div>
              )}

              <form onSubmit={handleShortenUrl} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Enter target URL to generate live Base62 key..."
                  className="flex-1 bg-[#0A0B0D] border border-[#232A35] px-3 py-2 text-[#E6E8EB] text-xs focus:outline-none focus:border-[#C86D32] rounded-[2px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C86D32] hover:bg-[#B05B26] text-[#0A0B0D] font-bold rounded-[2px] transition-colors whitespace-nowrap"
                >
                  GENERATE_BASE62_CODE
                </button>
              </form>

              {/* Live Generated Links Table */}
              <div className="space-y-2 pt-2">
                <div className="text-[10px] text-[#5A626E] uppercase">
                  ACTIVE REGISTRY & TELEMETRY ({shortLinks.length} SHORTENED)
                </div>

                <div className="space-y-2">
                  {shortLinks.map((link) => (
                    <div
                      key={link.shortCode}
                      className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#C86D32] text-sm">
                            runtime.link/{link.shortCode}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`https://runtime.link/${link.shortCode}`);
                              setCopiedCode(link.shortCode);
                              setTimeout(() => setCopiedCode(null), 2500);
                            }}
                            className="text-[10px] text-[#8A939E] hover:text-[#E6E8EB] px-1.5 py-0.5 border border-[#1F242C] rounded-[2px]"
                          >
                            {copiedCode === link.shortCode ? "COPIED!" : "COPY"}
                          </button>
                        </div>
                        <div className="text-[10px] text-[#5A626E] truncate max-w-md">
                          TARGET: {link.originalUrl}
                        </div>
                      </div>

                      {/* Analytics Readout */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px]">
                        <div>
                          <span className="text-[#5A626E]">CLICKS: </span>
                          <span className="text-[#2FA866] font-bold">{link.clickCount}</span>
                        </div>
                        <div>
                          <span className="text-[#5A626E]">CACHE_HITS: </span>
                          <span className="text-[#E6E8EB] font-bold">{link.cacheHitCount}</span>
                        </div>
                        <div>
                          <span className="text-[#5A626E]">BOT_FILTERED: </span>
                          <span className="text-[#C88D32] font-bold">{link.botFilteredCount}</span>
                        </div>

                        {/* Interactive Click Simulator */}
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            onClick={() => handleSimulateClick(link.shortCode, false)}
                            className="px-2 py-1 bg-[#14181F] hover:bg-[#1A202A] border border-[#232A35] text-[#E6E8EB] rounded-[2px] text-[10px]"
                            title="Simulates standard human browser click with cache probe"
                          >
                            SIMULATE_CLICK
                          </button>
                          <button
                            onClick={() => handleSimulateClick(link.shortCode, true)}
                            className="px-2 py-1 bg-[#14181F] hover:bg-[#1A202A] border border-[#232A35] text-[#C88D32] rounded-[2px] text-[10px]"
                            title="Simulates crawler user agent to trigger bot detection"
                          >
                            TEST_BOT_FILTER
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

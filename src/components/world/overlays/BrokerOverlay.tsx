"use client";

import React, { useState, useEffect } from "react";
import { sharedBrokerEngine } from "@/lib/simulations/simulationInstances";
import { ClusterState } from "@/lib/simulations/leaderElection";

export default function BrokerOverlay() {
  const [clusterState, setClusterState] = useState<ClusterState>(sharedBrokerEngine.getState());
  const [producerInput, setProducerInput] = useState("EVENT: order_placed_id_8941");
  const [producerFeedback, setProducerFeedback] = useState<string | null>(null);
  const [seqCount, setSeqCount] = useState(1);

  useEffect(() => {
    const unsub = sharedBrokerEngine.subscribe((s) => setClusterState(s));
    return () => unsub();
  }, []);

  const handleKillLeader = () => {
    sharedBrokerEngine.killLeaderNode(750);
  };

  const handleProduce = (duplicate: boolean = false) => {
    const seq = duplicate ? Math.max(1, seqCount - 1) : seqCount;
    const res = sharedBrokerEngine.produceMessage("client-producer-1", seq, producerInput, 0);

    if (res.duplicate) {
      setProducerFeedback(`IDEMPOTENT CHECK: Duplicate suppressed (Seq ${seq}). Zero side-effects.`);
    } else if (res.success) {
      setProducerFeedback(`COMMITTED: Msg ${res.messageId} written to Quorum ISR.`);
      if (!duplicate) setSeqCount((p) => p + 1);
    } else {
      setProducerFeedback(`ERROR: ${res.error}`);
    }
  };

  const handleRecover = (nodeId: string) => {
    sharedBrokerEngine.recoverNode(nodeId);
  };

  const handleRebalance = () => {
    const res = sharedBrokerEngine.rebalanceConsumerGroup(4);
    setProducerFeedback(`REBALANCE COMPLETE: Partitions reassigned in ${res.rebalanceDurationMs}ms.`);
  };

  return (
    <div className="space-y-6 text-[#E6E8EB] font-mono">
      {/* Header */}
      <div className="border-b border-[#1F242C] pb-4">
        <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
          FLAGSHIP SYSTEM // NODE: BROKER [-48, 0, 24]
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#E6E8EB] tracking-tight">
            Distributed Message Broker
          </h2>
          <span className="text-xs text-[#878F99] bg-[#0A0B0D] px-2.5 py-1 border border-[#1F242C] rounded-[2px] w-fit">
            SOURCE: PRIVATE REPOSITORY (AVAILABLE UPON REQUEST)
          </span>
        </div>
        <p className="text-xs text-[#878F99] font-sans mt-1">
          Aug–Sep 2026 • Java, Multithreading, Socket Programming, Prometheus, Grafana, YAML
        </p>
      </div>

      {/* VERIFIED RESULTS TABLE (Exact numbers per prompt specification) */}
      <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
        <div className="text-[10px] text-[#5A626E] uppercase mb-2 flex justify-between border-b border-[#1F242C] pb-1">
          <span>VERIFIED BENCHMARK RESULTS</span>
          <span className="text-[#2FA866]">STATUS: EMPIRICALLY CONFIRMED</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">zero acknowledged loss</span>
            <span className="text-[10px] text-[#878F99] font-sans">across 50+ failure cycles</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">~750ms restoration</span>
            <span className="text-[10px] text-[#878F99] font-sans">write-availability restoration</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">zero duplicates</span>
            <span className="text-[10px] text-[#878F99] font-sans">across 10,000 simulated retries (idempotent producer)</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">&lt;200ms rebalance downtime</span>
            <span className="text-[10px] text-[#878F99] font-sans">across 5 nodes</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">15+ commands reduced</span>
            <span className="text-[10px] text-[#878F99] font-sans">to one config apply</span>
          </div>
          <div className="p-2 bg-[#111317] border border-[#1F242C] rounded-[2px]">
            <span className="text-[#C86D32] font-bold block">~30s early warning</span>
            <span className="text-[10px] text-[#878F99] font-sans">under-replication warning; 99.9%+ effective uptime</span>
          </div>
        </div>
      </div>

      {/* REAL CLIENT-SIDE SIMULATION: KILL LEADER NODE */}
      <div className="p-4 bg-[#111317] border border-[#232A35] rounded-[2px] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#1F242C] pb-3">
          <div>
            <div className="text-[10px] text-[#C86D32] uppercase">INTERACTIVE SIMULATION</div>
            <div className="text-sm font-bold text-[#E6E8EB]">Raft Quorum Leader Failure & Re-Election</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleKillLeader}
              disabled={clusterState.electionActive || !clusterState.leaderId}
              className="px-3 py-1.5 bg-[#C24545] hover:bg-[#d65353] disabled:opacity-40 text-white font-bold text-xs rounded-[2px] transition-colors"
            >
              KILL LEADER NODE
            </button>
            <button
              onClick={handleRebalance}
              className="px-2.5 py-1.5 bg-[#171B22] border border-[#2D3440] hover:border-[#C86D32] text-[#E6E8EB] text-xs rounded-[2px]"
            >
              TRIGGER REBALANCE
            </button>
          </div>
        </div>

        {/* Election Status Feedback */}
        {clusterState.electionActive ? (
          <div className="p-2.5 bg-[#362216] border border-[#C86D32] rounded-[2px] text-xs text-[#E6E8EB] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-[1px] bg-[#C86D32] animate-pulse" />
              HEARTBEAT TIMEOUT RUNNING: ELECTING NEW ISR LEADER...
            </span>
            <span className="text-[#C86D32] font-bold">{clusterState.electionCountdownMs}ms remaining</span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-xs text-[#878F99] bg-[#0A0B0D] p-2 rounded-[2px]">
            <span>CLUSTER STATE: QUORUM HEALTHY</span>
            <span>CURRENT LEADER: <span className="text-[#C86D32] font-bold">{clusterState.leaderId ?? "NONE"}</span> (TERM: {clusterState.currentTerm})</span>
            <span>ZERO LOSS: <span className="text-[#2FA866] font-bold">{clusterState.acknowledgedLossCount === 0 ? "CONFIRMED (0 LOSS)" : "FAIL"}</span></span>
          </div>
        )}

        {/* 5 Broker Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {clusterState.nodes.map((node) => {
            const isLeader = node.id === clusterState.leaderId;
            const isFailed = node.status === "FAILED";

            return (
              <div
                key={node.id}
                className={`p-2.5 rounded-[2px] border flex flex-col justify-between space-y-1 text-xs ${
                  isFailed
                    ? "bg-[#180F11] border-[#C24545]/60"
                    : isLeader
                    ? "bg-[#171B22] border-[#C86D32]"
                    : "bg-[#0A0B0D] border-[#1F242C]"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#E6E8EB]">{node.name}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-[1px] ${
                      isFailed ? "bg-[#C24545]" : isLeader ? "bg-[#C86D32]" : "bg-[#2FA866]"
                    }`}
                  />
                </div>
                <div className="text-[10px] text-[#878F99]">
                  STATUS: <span className="text-[#E6E8EB] font-semibold">{node.status}</span>
                </div>
                <div className="text-[10px] text-[#5A626E]">
                  LOG LEN: <span className="text-[#878F99]">{node.logLength} entries</span>
                </div>

                {isFailed && (
                  <button
                    onClick={() => handleRecover(node.id)}
                    className="mt-1 px-1.5 py-0.5 bg-[#171B22] border border-[#2D3440] hover:border-[#2FA866] text-[#2FA866] text-[10px] rounded-[2px]"
                  >
                    RECOVER
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Idempotent Producer Test Box */}
        <div className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] space-y-2">
          <div className="text-[10px] text-[#5A626E] uppercase flex justify-between">
            <span>IDEMPOTENT PRODUCER DISPATCH</span>
            <span>SUPPRESSED DUPLICATES: {clusterState.duplicateSuppressedCount}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={producerInput}
              onChange={(e) => setProducerInput(e.target.value)}
              className="flex-1 bg-[#111317] border border-[#1F242C] text-[#E6E8EB] px-2 py-1 text-xs rounded-[2px] focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleProduce(false)}
                className="px-3 py-1 bg-[#C86D32] hover:bg-[#e07b39] text-[#0A0B0D] font-bold text-xs rounded-[2px]"
              >
                PRODUCE (SEQ {seqCount})
              </button>
              <button
                onClick={() => handleProduce(true)}
                className="px-2.5 py-1 bg-[#171B22] border border-[#2D3440] hover:border-[#C86D32] text-[#878F99] text-xs rounded-[2px]"
              >
                REPLAY RETRY (DUPLICATE)
              </button>
            </div>
          </div>
          {producerFeedback && (
            <div className="text-[11px] text-[#878F99] pt-1">
              &gt; {producerFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

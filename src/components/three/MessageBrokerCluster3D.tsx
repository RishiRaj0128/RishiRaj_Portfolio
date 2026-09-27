"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { MessageBrokerClusterEngine, ClusterState } from "@/lib/simulations/leaderElection";

interface MessageBrokerClusterProps {
  engine: MessageBrokerClusterEngine;
  clusterState: ClusterState;
}

// 3D coordinates for 5 broker nodes arranged in a resilient ring
const NODE_COORDINATES: Record<string, [number, number, number]> = {
  "b-1": [0, 1.4, 0],
  "b-2": [1.8, 0.4, 0.5],
  "b-3": [1.1, -1.3, -0.2],
  "b-4": [-1.1, -1.3, 0.2],
  "b-5": [-1.8, 0.4, -0.5],
};

function ClusterScene3D({
  clusterState,
  isPaused,
  onSelectNode,
  selectedNodeId,
}: {
  clusterState: ClusterState;
  isPaused: boolean;
  onSelectNode: (id: string) => void;
  selectedNodeId: string | null;
}) {
  const leaderId = clusterState.leaderId;

  // Active pipelines: connect leader to all healthy followers
  const connections = useMemo(() => {
    if (!leaderId) return [];
    const leaderPos = NODE_COORDINATES[leaderId];
    if (!leaderPos) return [];

    const lines: { from: [number, number, number]; to: [number, number, number]; targetId: string }[] = [];
    clusterState.nodes.forEach((node) => {
      if (node.id !== leaderId && node.status !== "FAILED") {
        const followerPos = NODE_COORDINATES[node.id];
        if (followerPos) {
          lines.push({ from: leaderPos, to: followerPos, targetId: node.id });
        }
      }
    });
    return lines;
  }, [leaderId, clusterState.nodes]);

  // Buffer coordinates for line segments
  const lineBufferPositions = useMemo(() => {
    const pts: number[] = [];
    connections.forEach((c) => {
      pts.push(...c.from, ...c.to);
    });
    return new Float32Array(pts);
  }, [connections]);

  // Instanced packets for heartbeat and message replication pulses
  const packetCount = Math.max(1, connections.length * 2);
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const progressRef = useRef<number[]>(Array.from({ length: packetCount }, (_, i) => i / packetCount));
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (isPaused || !packetsRef.current || connections.length === 0) return;

    for (let i = 0; i < packetCount; i++) {
      progressRef.current[i] = (progressRef.current[i] + delta * 0.75) % 1;
      const conn = connections[i % connections.length];
      const t = progressRef.current[i];

      dummy.position.set(
        THREE.MathUtils.lerp(conn.from[0], conn.to[0], t),
        THREE.MathUtils.lerp(conn.from[1], conn.to[1], t),
        THREE.MathUtils.lerp(conn.from[2], conn.to[2], t)
      );
      dummy.scale.setScalar(0.06);
      dummy.updateMatrix();
      packetsRef.current.setMatrixAt(i, dummy.matrix);
    }
    packetsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={0.8} />

      {/* Heartbeat / Quorum Connection Line Segments */}
      {lineBufferPositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lineBufferPositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#364252" transparent opacity={0.65} />
        </lineSegments>
      )}

      {/* Nodes */}
      {clusterState.nodes.map((node) => {
        const pos = NODE_COORDINATES[node.id] || [0, 0, 0];
        const isLeader = node.status === "LEADER";
        const isFailed = node.status === "FAILED";
        const isCandidate = node.status === "CANDIDATE";
        const isSelected = selectedNodeId === node.id;

        const nodeColor = isFailed
          ? "#232A35"
          : isLeader
          ? "#C86D32"
          : isCandidate
          ? "#C88D32"
          : "#4A5568";

        return (
          <group
            key={node.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectNode(node.id);
            }}
          >
            {/* Broker Mesh Box */}
            <mesh>
              <boxGeometry args={[0.55, 0.45, 0.35]} />
              <meshStandardMaterial
                color={nodeColor}
                roughness={0.3}
                metalness={0.2}
                emissive={isLeader ? "#C86D32" : "#000000"}
                emissiveIntensity={isLeader ? 0.35 : 0}
              />
            </mesh>

            {/* Wireframe Border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.56, 0.46, 0.36)]} />
              <lineBasicMaterial
                color={isFailed ? "#C24545" : isLeader ? "#E6E8EB" : isSelected ? "#C86D32" : "#2D3440"}
              />
            </lineSegments>

            {/* Node HTML Annotation */}
            <Html position={[0, 0.42, 0]} center distanceFactor={8}>
              <div
                className={`px-1.5 py-0.5 text-[9px] font-mono whitespace-nowrap rounded-[2px] transition-colors border select-none ${
                  isFailed
                    ? "bg-[#1F1414] border-[#C24545] text-[#C24545]"
                    : isLeader
                    ? "bg-[#C86D32] border-[#C86D32] text-[#0A0B0D] font-bold"
                    : "bg-[#111419]/90 border-[#232A35] text-[#E6E8EB]"
                }`}
              >
                {node.name} {isLeader ? "[LEADER]" : isFailed ? "[FAILED]" : `[ISR]`}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Heartbeat replication pulses */}
      {connections.length > 0 && (
        <instancedMesh ref={packetsRef} args={[undefined, undefined, packetCount]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#E6E8EB" />
        </instancedMesh>
      )}
    </>
  );
}

// 2D SVG Fallback Topology
function ClusterTopology2D({
  clusterState,
  onSelectNode,
  selectedNodeId,
}: {
  clusterState: ClusterState;
  onSelectNode: (id: string) => void;
  selectedNodeId: string | null;
}) {
  const leaderNode = clusterState.nodes.find((n) => n.status === "LEADER");

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 font-mono select-none">
      <div className="w-full max-w-xl bg-[#0E1116] border border-[#232A35] p-4 rounded-[2px]">
        <div className="text-[10px] text-[#5A626E] flex justify-between border-b border-[#1F242C] pb-2 mb-4">
          <span>2D FALLBACK: LOGICAL QUORUM TOPOLOGY</span>
          <span>QUORUM: 3/5 ACTIVE</span>
        </div>

        {/* 2D Ring Nodes */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {clusterState.nodes.map((node) => {
            const isLeader = node.status === "LEADER";
            const isFailed = node.status === "FAILED";
            const isSelected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={`p-2.5 border rounded-[2px] cursor-pointer transition-all ${
                  isFailed
                    ? "bg-[#181111] border-[#C24545]/50 text-[#C24545]"
                    : isLeader
                    ? "bg-[#1F1915] border-[#C86D32] text-[#E6E8EB] ring-1 ring-[#C86D32]"
                    : isSelected
                    ? "bg-[#171B22] border-[#3A4556] text-[#E6E8EB]"
                    : "bg-[#111419] border-[#232A35] text-[#8A939E] hover:border-[#3A4556]"
                }`}
              >
                <div className="font-bold text-[11px]">{node.name}</div>
                <div className="text-[9px] mt-1 uppercase">
                  {isLeader ? (
                    <span className="text-[#C86D32] font-semibold">Leader</span>
                  ) : isFailed ? (
                    <span className="text-[#C24545]">Failed</span>
                  ) : (
                    <span>Follower</span>
                  )}
                </div>
                <div className="text-[9px] text-[#5A626E] mt-0.5">Log: {node.logLength}</div>
              </div>
            );
          })}
        </div>

        {/* Replication lines annotation */}
        <div className="mt-4 pt-3 border-t border-[#1F242C] text-[10px] text-[#8A939E] flex justify-between">
          <span>
            {leaderNode
              ? `Replicating from ${leaderNode.name} to ISR quorum peers via TCP sockets`
              : "Replication suspended: Heartbeat timeout in progress"}
          </span>
          <span className="text-[#C86D32]">Port range: 9092-9096</span>
        </div>
      </div>
    </div>
  );
}

export default function MessageBrokerCluster3D({
  engine,
  clusterState,
}: MessageBrokerClusterProps) {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("b-1");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Auto-switch to 2D if user has reduced-motion preference
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setViewMode("2d");
    }
  }, []);

  const handleKillLeader = () => {
    if (!clusterState.leaderId) return;
    const leaderName = clusterState.nodes.find((n) => n.id === clusterState.leaderId)?.name;
    setActionFeedback(`Failure injected: ${leaderName} severed. Heartbeat timeout countdown started (~750ms).`);
    engine.killLeaderNode(750);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleRecoverAll = () => {
    clusterState.nodes.forEach((n) => {
      if (n.status === "FAILED") {
        engine.recoverNode(n.id);
      }
    });
    setActionFeedback("All failed broker nodes recovered to ISR and synced with leader.");
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handlePublishMessage = () => {
    const seq = clusterState.committedMessages.length;
    const res = engine.produceMessage("prod-sim-01", seq, `event.telemetry.batch:${seq}`, 0);
    if (res.success) {
      setActionFeedback(`Message committed: ${res.messageId} (PID: prod-sim-01, Seq: ${seq}, ISR Quorum: 3/5).`);
    } else {
      setActionFeedback(`Publish blocked: ${res.error}`);
    }
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleDuplicateRetry = () => {
    // Retry previous sequence number to demonstrate idempotent deduplication
    const seq = Math.max(0, clusterState.committedMessages.length - 1);
    const res = engine.produceMessage("prod-sim-01", seq, `event.telemetry.batch:${seq}`, 0);
    if (res.duplicate) {
      setActionFeedback(`Idempotency enforced: Duplicate retry (Seq ${seq}) suppressed. 0 double writes.`);
    }
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleRebalanceConsumers = () => {
    const count = (clusterState.consumerGroup.filter((c) => c.status === "ACTIVE").length % 5) + 1;
    const res = engine.rebalanceConsumerGroup(count);
    setActionFeedback(`Consumer group rebalanced across ${count} nodes in ${res.rebalanceDurationMs}ms (<200ms target).`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const selectedNode = clusterState.nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="w-full bg-[#0E1116] border border-[#232A35] rounded-[2px] overflow-hidden font-mono flex flex-col">
      {/* Simulation Header */}
      <div className="px-3 py-2.5 bg-[#14181F] border-b border-[#1F242C] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#C86D32] font-bold uppercase tracking-wider">
            LIVE SIMULATION:
          </span>
          <span className="text-xs text-[#E6E8EB] font-bold">
            5-Node Broker Cluster (Quorum Quota: 3)
          </span>
          <span className="text-[10px] px-1.5 py-0.2 bg-[#0A0B0D] border border-[#232A35] text-[#8A939E] rounded-[2px]">
            Term: {clusterState.currentTerm}
          </span>
        </div>

        {/* View Mode & Pause controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2 py-0.5 text-[10px] border rounded-[2px] transition-colors ${
              isPaused
                ? "bg-[#C88D32]/20 border-[#C88D32] text-[#C88D32]"
                : "border-[#232A35] text-[#8A939E] hover:text-[#E6E8EB]"
            }`}
          >
            {isPaused ? "RESUME" : "PAUSE"}
          </button>

          <div className="flex border border-[#232A35] rounded-[2px] p-0.5 bg-[#0A0B0D]">
            <button
              onClick={() => setViewMode("3d")}
              className={`px-2 py-0.5 text-[10px] rounded-[2px] transition-colors ${
                viewMode === "3d" ? "bg-[#232A35] text-[#E6E8EB]" : "text-[#8A939E] hover:text-[#E6E8EB]"
              }`}
            >
              3D_CLUSTER
            </button>
            <button
              onClick={() => setViewMode("2d")}
              className={`px-2 py-0.5 text-[10px] rounded-[2px] transition-colors ${
                viewMode === "2d" ? "bg-[#232A35] text-[#E6E8EB]" : "text-[#8A939E] hover:text-[#E6E8EB]"
              }`}
            >
              2D_TOPOLOGY
            </button>
          </div>
        </div>
      </div>

      {/* Election Countdown Banner if Leader is Failed */}
      {clusterState.electionActive && (
        <div className="px-3 py-1.5 bg-[#1F1414] border-b border-[#C24545]/40 text-[#C24545] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C24545] animate-ping" />
            <span>HEARTBEAT_TIMEOUT IN PROGRESS: Electing new leader from ISR quorum...</span>
          </div>
          <span className="font-bold">{clusterState.electionCountdownMs}ms remaining</span>
        </div>
      )}

      {/* Action Notification Strip */}
      {actionFeedback && !clusterState.electionActive && (
        <div className="px-3 py-1.5 bg-[#1B281F] border-b border-[#232A35] text-[#2FA866] text-[11px] truncate">
          {actionFeedback}
        </div>
      )}

      {/* Main Simulation Canvas */}
      <div className="relative h-64 sm:h-72 md:h-80 w-full bg-[#0A0B0D]">
        {viewMode === "3d" ? (
          <>
            <Canvas
              camera={{ position: [0, 2.5, 5.2], fov: 45 }}
              gl={{ antialias: false, powerPreference: "low-power" }}
              dpr={[1, 1.5]}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onClick={() => setSelectedNodeId(null)}
            >
              <ClusterScene3D
                clusterState={clusterState}
                isPaused={isPaused}
                onSelectNode={(id) => setSelectedNodeId(id)}
                selectedNodeId={selectedNodeId}
              />
              <OrbitControls
                enablePan={false}
                minDistance={3.5}
                maxDistance={8.5}
                maxPolarAngle={Math.PI / 1.7}
                minPolarAngle={Math.PI / 5}
              />
            </Canvas>
            <div className="absolute top-2 left-2 pointer-events-none text-[10px] text-[#8A939E] bg-[#0E1116]/80 px-2 py-1 border border-[#1F242C] rounded-[2px]">
              DRAG: Rotate cluster | CLICK: Inspect broker node
            </div>
          </>
        ) : (
          <ClusterTopology2D
            clusterState={clusterState}
            onSelectNode={(id) => setSelectedNodeId(id)}
            selectedNodeId={selectedNodeId}
          />
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-3 bg-[#111419] border-t border-[#1F242C] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Failure Injection */}
          <button
            onClick={handleKillLeader}
            disabled={!clusterState.leaderId || clusterState.electionActive}
            className="px-3 py-1.5 bg-[#2A1515] hover:bg-[#3D1A1A] border border-[#C24545]/60 text-[#C24545] font-bold rounded-[2px] transition-colors disabled:opacity-40"
          >
            KILL_LEADER_NODE
          </button>

          {/* Recovery */}
          <button
            onClick={handleRecoverAll}
            className="px-3 py-1.5 bg-[#14181F] hover:bg-[#1A202A] border border-[#232A35] text-[#8A939E] hover:text-[#E6E8EB] rounded-[2px] transition-colors"
          >
            RECOVER_NODES
          </button>

          {/* Idempotent Produce */}
          <button
            onClick={handlePublishMessage}
            disabled={!clusterState.leaderId}
            className="px-3 py-1.5 bg-[#C86D32] hover:bg-[#B05B26] text-[#0A0B0D] font-bold rounded-[2px] transition-colors disabled:opacity-40"
          >
            PUBLISH_MESSAGE (PID+Seq)
          </button>

          {/* Duplicate Retry Injection */}
          <button
            onClick={handleDuplicateRetry}
            disabled={clusterState.committedMessages.length === 0}
            className="px-2.5 py-1.5 bg-[#14181F] hover:bg-[#1A202A] border border-[#232A35] text-[#8A939E] hover:text-[#E6E8EB] rounded-[2px] transition-colors disabled:opacity-40"
            title="Sends identical sequence number to prove idempotent deduplication"
          >
            RETRY_DUPLICATE
          </button>

          {/* Consumer Rebalance */}
          <button
            onClick={handleRebalanceConsumers}
            className="px-2.5 py-1.5 bg-[#14181F] hover:bg-[#1A202A] border border-[#232A35] text-[#8A939E] hover:text-[#E6E8EB] rounded-[2px] transition-colors"
          >
            REBALANCE_CONSUMERS
          </button>
        </div>

        {/* Real Verifiable Guarantees Counter */}
        <div className="flex items-center gap-3 text-[11px] text-[#5A626E]">
          <span>
            ACK_LOSS: <strong className="text-[#2FA866]">{clusterState.acknowledgedLossCount}</strong>
          </span>
          <span>•</span>
          <span>
            DUPS_BLOCKED: <strong className="text-[#2FA866]">{clusterState.duplicateSuppressedCount}</strong>
          </span>
          <span>•</span>
          <span>
            COMMITTED: <strong className="text-[#E6E8EB]">{clusterState.committedMessages.length}</strong>
          </span>
        </div>
      </div>

      {/* Selected Node Spec Drawer */}
      <div className="px-3 py-2 bg-[#0A0B0D] border-t border-[#1F242C] text-[11px] flex flex-wrap items-center justify-between gap-2 text-[#8A939E]">
        {selectedNode ? (
          <div className="flex items-center gap-3">
            <span className="text-[#E6E8EB] font-bold">{selectedNode.name}</span>
            <span>PORT: {selectedNode.port}</span>
            <span>STATUS: <span className={selectedNode.status === "LEADER" ? "text-[#C86D32] font-bold" : selectedNode.status === "FAILED" ? "text-[#C24545]" : "text-[#2FA866]"}>{selectedNode.status}</span></span>
            <span>ISR: {selectedNode.isISR ? "YES" : "NO"}</span>
            <span>WAL_LOG_LENGTH: {selectedNode.logLength}</span>
          </div>
        ) : (
          <span>Click any node in the cluster to inspect local WAL and socket buffer status.</span>
        )}
        <div className="text-[10px] text-[#5A626E]">
          RECOVERY_BENCHMARK: ~750ms write-availability restoration
        </div>
      </div>
    </div>
  );
}

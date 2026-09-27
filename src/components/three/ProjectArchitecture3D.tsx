"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * 3D DISTRIBUTED ARCHITECTURE MAP
 *
 * Explicitly labeled:
 * [PLACEHOLDER: Event-Driven Consensus & Ingestion Cluster - pending Rishi's production repo link]
 *
 * Models real distributed topologies:
 * Ingress Gateway -> Event Bus (Kafka/NATS) -> Partitioned Workers -> Raft Consensus -> Write-Ahead Log (WAL)
 */

interface ServiceNode {
  id: string;
  label: string;
  role: string;
  pos: [number, number, number];
  color: string;
}

const SERVICE_NODES: ServiceNode[] = [
  { id: "ingress", label: "ingress-gw", role: "TLS / Rate Limiting", pos: [-3.2, 0, 0], color: "#C86D32" },
  { id: "queue", label: "nats-jetstream", role: "Durable Event Stream", pos: [-1.4, 0, 0.5], color: "#3878A8" },
  { id: "worker-1", label: "worker-pool-01", role: "Idempotent Execution", pos: [0.6, 1.2, -0.4], color: "#5A6678" },
  { id: "worker-2", label: "worker-pool-02", role: "Idempotent Execution", pos: [0.6, -1.2, 0.4], color: "#5A6678" },
  { id: "raft", label: "raft-quorum", role: "Leader Election / Paxos", pos: [2.5, 0.7, 0], color: "#2FA866" },
  { id: "wal", label: "wal-storage", role: "Append-Only State Machine", pos: [4.0, -0.4, -0.2], color: "#8A939E" },
];

const PIPELINES: [string, string][] = [
  ["ingress", "queue"],
  ["queue", "worker-1"],
  ["queue", "worker-2"],
  ["worker-1", "raft"],
  ["worker-2", "raft"],
  ["raft", "wal"],
];

function InteractiveTopologyScene({ activeNode, onSelectNode }: {
  activeNode: string | null;
  onSelectNode: (id: string | null) => void;
}) {
  const nodeMap = useMemo(() => {
    const map = new Map<string, ServiceNode>();
    SERVICE_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  // Compute line segments
  const pipePositions = useMemo(() => {
    const points: number[] = [];
    PIPELINES.forEach(([srcId, dstId]) => {
      const src = nodeMap.get(srcId);
      const dst = nodeMap.get(dstId);
      if (src && dst) {
        points.push(...src.pos, ...dst.pos);
      }
    });
    return new Float32Array(points);
  }, [nodeMap]);

  // Request packets traveling through pipelines
  const packetCount = 6;
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const packetT = useRef(Array.from({ length: packetCount }, (_, i) => i / packetCount));
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (packetsRef.current) {
      for (let i = 0; i < packetCount; i++) {
        packetT.current[i] = (packetT.current[i] + delta * 0.4) % 1;
        const [srcId, dstId] = PIPELINES[i % PIPELINES.length];
        const src = nodeMap.get(srcId);
        const dst = nodeMap.get(dstId);
        if (src && dst) {
          const t = packetT.current[i];
          dummy.position.set(
            THREE.MathUtils.lerp(src.pos[0], dst.pos[0], t),
            THREE.MathUtils.lerp(src.pos[1], dst.pos[1], t),
            THREE.MathUtils.lerp(src.pos[2], dst.pos[2], t)
          );
          dummy.scale.setScalar(0.06);
          dummy.updateMatrix();
          packetsRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      packetsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pipePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#2D3644" transparent opacity={0.6} />
      </lineSegments>

      {/* Services in 3D space */}
      {SERVICE_NODES.map((node) => {
        const isSelected = activeNode === node.id;
        return (
          <group
            key={node.id}
            position={node.pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectNode(isSelected ? null : node.id);
            }}
          >
            {/* Core Box */}
            <mesh>
              <boxGeometry args={[0.55, 0.4, 0.3]} />
              <meshStandardMaterial
                color={isSelected ? "#C86D32" : node.color}
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>

            {/* Wireframe Outline */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.56, 0.41, 0.31)]} />
              <lineBasicMaterial color={isSelected ? "#E6E8EB" : "#3A4556"} />
            </lineSegments>

            {/* Label in 3D space */}
            <Html position={[0, 0.35, 0]} center distanceFactor={10}>
              <div
                className={`px-1.5 py-0.5 text-[10px] font-mono whitespace-nowrap rounded-[2px] transition-colors ${
                  isSelected
                    ? "bg-[#C86D32] text-[#0A0B0D] font-bold"
                    : "bg-[#111419]/90 text-[#E6E8EB] border border-[#232A35]"
                }`}
              >
                {node.label}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Animated Request Packets */}
      <instancedMesh ref={packetsRef} args={[undefined, undefined, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#E6E8EB" />
      </instancedMesh>
    </>
  );
}

// 2D SVG Schematic View
function Schematic2DView({
  activeNode,
  onSelectNode,
}: {
  activeNode: string | null;
  onSelectNode: (id: string | null) => void;
}) {
  return (
    <div className="w-full h-full p-4 flex flex-col justify-center items-center font-mono">
      <div className="w-full max-w-2xl bg-[#0E1116] border border-[#232A35] p-4 rounded-[2px]">
        <div className="text-[11px] text-[#8A939E] border-b border-[#1F242C] pb-2 mb-4 flex justify-between">
          <span>TOPOLOGY: 2D LOGICAL FLOW</span>
          <span>PROTOCOL: gRPC / Raft Quorum</span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div
            onClick={() => onSelectNode("ingress")}
            className={`p-2.5 border rounded-[2px] cursor-pointer text-center w-full md:w-32 transition-colors ${
              activeNode === "ingress"
                ? "border-[#C86D32] bg-[#1F1915]"
                : "border-[#232A35] bg-[#111419] hover:border-[#3A4556]"
            }`}
          >
            <div className="font-semibold text-[#E6E8EB]">ingress-gw</div>
            <div className="text-[10px] text-[#8A939E]">TLS Termination</div>
          </div>
          <div className="text-[#8A939E] text-xs">→</div>
          <div
            onClick={() => onSelectNode("queue")}
            className={`p-2.5 border rounded-[2px] cursor-pointer text-center w-full md:w-32 transition-colors ${
              activeNode === "queue"
                ? "border-[#C86D32] bg-[#1F1915]"
                : "border-[#232A35] bg-[#111419] hover:border-[#3A4556]"
            }`}
          >
            <div className="font-semibold text-[#E6E8EB]">nats-jetstream</div>
            <div className="text-[10px] text-[#8A939E]">Durable Stream</div>
          </div>
          <div className="text-[#8A939E] text-xs">→</div>
          <div className="flex flex-col gap-2 w-full md:w-32">
            <div
              onClick={() => onSelectNode("worker-1")}
              className={`p-2 border rounded-[2px] cursor-pointer text-center transition-colors ${
                activeNode === "worker-1"
                  ? "border-[#C86D32] bg-[#1F1915]"
                  : "border-[#232A35] bg-[#111419] hover:border-[#3A4556]"
              }`}
            >
              <div className="font-semibold text-[#E6E8EB]">worker-01</div>
              <div className="text-[9px] text-[#8A939E]">Async Task</div>
            </div>
            <div
              onClick={() => onSelectNode("worker-2")}
              className={`p-2 border rounded-[2px] cursor-pointer text-center transition-colors ${
                activeNode === "worker-2"
                  ? "border-[#C86D32] bg-[#1F1915]"
                  : "border-[#232A35] bg-[#111419] hover:border-[#3A4556]"
              }`}
            >
              <div className="font-semibold text-[#E6E8EB]">worker-02</div>
              <div className="text-[9px] text-[#8A939E]">Async Task</div>
            </div>
          </div>
          <div className="text-[#8A939E] text-xs">→</div>
          <div
            onClick={() => onSelectNode("raft")}
            className={`p-2.5 border rounded-[2px] cursor-pointer text-center w-full md:w-32 transition-colors ${
              activeNode === "raft"
                ? "border-[#C86D32] bg-[#1F1915]"
                : "border-[#232A35] bg-[#111419] hover:border-[#3A4556]"
            }`}
          >
            <div className="font-semibold text-[#2FA866]">raft-quorum</div>
            <div className="text-[10px] text-[#8A939E]">3-Node Quorum</div>
          </div>
          <div className="text-[#8A939E] text-xs">→</div>
          <div
            onClick={() => onSelectNode("wal")}
            className={`p-2.5 border rounded-[2px] cursor-pointer text-center w-full md:w-28 transition-colors ${
              activeNode === "wal"
                ? "border-[#C86D32] bg-[#1F1915]"
                : "border-[#232A35] bg-[#111419] hover:border-[#3A4556]"
            }`}
          >
            <div className="font-semibold text-[#E6E8EB]">wal-storage</div>
            <div className="text-[10px] text-[#8A939E]">Append Log</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectArchitecture3D() {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [activeNode, setActiveNode] = useState<string | null>("raft");

  const selectedNodeInfo = useMemo(() => {
    return SERVICE_NODES.find((n) => n.id === activeNode) || null;
  }, [activeNode]);

  return (
    <div className="w-full bg-[#0E1116] border border-[#232A35] rounded-[2px] overflow-hidden flex flex-col font-mono">
      {/* Topology Header & Controls */}
      <div className="px-3 py-2 bg-[#14181F] border-b border-[#1F242C] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#C86D32]">SYS-DIAGRAM:</span>
          <span className="text-xs text-[#E6E8EB] font-mono">
            [PLACEHOLDER: Event-Driven Consensus & Ingestion Cluster]
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* 3D vs 2D Toggle */}
          <div className="flex border border-[#232A35] rounded-[2px] p-0.5 bg-[#0A0B0D]">
            <button
              onClick={() => setViewMode("3d")}
              className={`px-2 py-0.5 text-[10px] transition-colors rounded-[2px] ${
                viewMode === "3d" ? "bg-[#232A35] text-[#E6E8EB]" : "text-[#8A939E] hover:text-[#E6E8EB]"
              }`}
            >
              3D_TOPOLOGY
            </button>
            <button
              onClick={() => setViewMode("2d")}
              className={`px-2 py-0.5 text-[10px] transition-colors rounded-[2px] ${
                viewMode === "2d" ? "bg-[#232A35] text-[#E6E8EB]" : "text-[#8A939E] hover:text-[#E6E8EB]"
              }`}
            >
              2D_SCHEMATIC
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative h-72 md:h-80 w-full bg-[#0A0B0D]">
        {viewMode === "3d" ? (
          <>
            <Canvas
              camera={{ position: [0, 2, 7], fov: 45 }}
              gl={{ antialias: false, powerPreference: "low-power" }}
              dpr={[1, 1.5]}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onClick={() => setActiveNode(null)}
            >
              <InteractiveTopologyScene
                activeNode={activeNode}
                onSelectNode={(id) => setActiveNode(id)}
              />
              <OrbitControls
                enablePan={false}
                minDistance={4}
                maxDistance={11}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
            <div className="absolute top-2 left-2 pointer-events-none text-[10px] text-[#8A939E] bg-[#0E1116]/80 px-2 py-1 border border-[#1F242C] rounded-[2px]">
              DRAG: Orbit view | SCROLL: Zoom | CLICK: Inspect node
            </div>
          </>
        ) : (
          <Schematic2DView activeNode={activeNode} onSelectNode={setActiveNode} />
        )}
      </div>

      {/* Inspector Drawer: Shows details for selected node */}
      <div className="px-3 py-2 bg-[#111419] border-t border-[#1F242C] text-xs flex flex-wrap items-center justify-between gap-2">
        {selectedNodeInfo ? (
          <div className="flex items-center gap-3">
            <span className="text-[#C86D32] text-[11px] font-bold">NODE: {selectedNodeInfo.label}</span>
            <span className="text-[#8A939E]">ROLE: {selectedNodeInfo.role}</span>
            <span className="text-[10px] text-[#5A626E]">POS: [{selectedNodeInfo.pos.join(", ")}]</span>
          </div>
        ) : (
          <span className="text-[#8A939E] text-[11px]">Select any service node to inspect telemetry specs.</span>
        )}
        <div className="text-[10px] text-[#5A626E]">
          LATENCY TARGET: &lt;1.8ms p99 (Raft quorum round-trip)
        </div>
      </div>
    </div>
  );
}

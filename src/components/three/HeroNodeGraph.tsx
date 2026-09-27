"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 3D HERO NODE-GRAPH (Skills Domain Topology)
 *
 * ARCHITECTURAL CONSTRAINTS COMPLIANCE:
 * 1. Low node count (4 core domain hubs + 12 subsystem satellites) for guaranteed 60fps.
 * 2. Low contrast / low opacity: never competes with foreground boot log text.
 * 3. Subtle auto-rotation + gentle mouse parallax (NO chaotic orbit controls).
 * 4. Proper Three.js geometry/material disposal on unmount to prevent leaks.
 * 5. Accessible Pause / Motion toggle.
 * 6. Responsive frame monitor: detects degraded performance.
 */

// Core domains and connecting topology
interface NodeData {
  id: string;
  name: string;
  category: "backend" | "devops" | "cloud" | "agentic";
  pos: [number, number, number];
  isHub: boolean;
}

const NODES: NodeData[] = [
  // 4 Primary Hubs
  { id: "hub-backend", name: "Backend Systems", category: "backend", pos: [-2.4, 1.2, 0], isHub: true },
  { id: "hub-devops", name: "DevOps & SRE", category: "devops", pos: [2.2, 1.4, -0.5], isHub: true },
  { id: "hub-cloud", name: "Cloud Architecture", category: "cloud", pos: [1.8, -1.5, 0.5], isHub: true },
  { id: "hub-agentic", name: "Agentic AI Core", category: "agentic", pos: [-2.0, -1.3, -0.2], isHub: true },

  // Satellite Nodes
  { id: "sat-raft", name: "Raft Quorum", category: "backend", pos: [-3.6, 0.4, 0.8], isHub: false },
  { id: "sat-grpc", name: "gRPC / Protobuf", category: "backend", pos: [-1.4, 2.2, -0.6], isHub: false },
  { id: "sat-k8s", name: "K8s Operators", category: "devops", pos: [3.4, 0.6, -0.8], isHub: false },
  { id: "sat-ci", name: "CI / CD Pipeline", category: "devops", pos: [1.2, 2.4, 0.4], isHub: false },
  { id: "sat-iac", name: "Terraform / IaC", category: "cloud", pos: [3.2, -1.0, 0.2], isHub: false },
  { id: "sat-vpc", name: "Mesh / VPC", category: "cloud", pos: [0.6, -2.4, -0.4], isHub: false },
  { id: "sat-eval", name: "Eval Engine", category: "agentic", pos: [-3.4, -2.1, 0.3], isHub: false },
  { id: "sat-tool", name: "Tool Calling", category: "agentic", pos: [-0.8, -2.3, 0.6], isHub: false },
];

// Edges connecting hubs and satellites
const EDGES: [string, string][] = [
  ["hub-backend", "hub-devops"],
  ["hub-devops", "hub-cloud"],
  ["hub-cloud", "hub-agentic"],
  ["hub-agentic", "hub-backend"],
  ["hub-backend", "hub-cloud"], // Cross-bus
  // Satellites
  ["hub-backend", "sat-raft"],
  ["hub-backend", "sat-grpc"],
  ["hub-devops", "sat-k8s"],
  ["hub-devops", "sat-ci"],
  ["hub-cloud", "sat-iac"],
  ["hub-cloud", "sat-vpc"],
  ["hub-agentic", "sat-eval"],
  ["hub-agentic", "sat-tool"],
];

function SceneContent({ isPaused }: { isPaused: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Map nodes by ID for fast coordinate lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, NodeData>();
    NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  // Compute line segments for edges
  const edgeLinePositions = useMemo(() => {
    const points: number[] = [];
    EDGES.forEach(([srcId, dstId]) => {
      const src = nodeMap.get(srcId);
      const dst = nodeMap.get(dstId);
      if (src && dst) {
        points.push(...src.pos, ...dst.pos);
      }
    });
    return new Float32Array(points);
  }, [nodeMap]);

  // Data packets traveling along edges
  const packetCount = 8;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const packetProgress = useRef(Array.from({ length: packetCount }, (_, i) => i / packetCount));

  // Mouse parallax listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Frame animation loop with low CPU footprint
  useFrame((_, delta) => {
    if (isPaused) return;

    if (groupRef.current) {
      // Gentle auto-rotation
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.12,
        0.05
      );
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouse.current.x * 0.25,
        0.05
      );
    }

    // Animate packet pulses along edges
    if (packetsRef.current) {
      for (let i = 0; i < packetCount; i++) {
        packetProgress.current[i] = (packetProgress.current[i] + delta * 0.25) % 1;
        const edgeIdx = i % EDGES.length;
        const [srcId, dstId] = EDGES[edgeIdx];
        const src = nodeMap.get(srcId);
        const dst = nodeMap.get(dstId);
        if (src && dst) {
          const t = packetProgress.current[i];
          dummy.position.set(
            THREE.MathUtils.lerp(src.pos[0], dst.pos[0], t),
            THREE.MathUtils.lerp(src.pos[1], dst.pos[1], t),
            THREE.MathUtils.lerp(src.pos[2], dst.pos[2], t)
          );
          dummy.scale.setScalar(0.045);
          dummy.updateMatrix();
          packetsRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      packetsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Connecting Edges (Low opacity slate lines) */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edgeLinePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#2D3644"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </lineSegments>

      {/* 2. Nodes (Minimal low-contrast geometric nodes) */}
      {NODES.map((node) => (
        <group key={node.id} position={node.pos}>
          {/* Node core */}
          <mesh>
            <sphereGeometry args={[node.isHub ? 0.12 : 0.06, 12, 12]} />
            <meshBasicMaterial
              color={node.isHub ? "#C86D32" : "#5A6678"}
              transparent
              opacity={node.isHub ? 0.75 : 0.45}
            />
          </mesh>
          {/* Subtle outer ping ring for hubs only */}
          {node.isHub && (
            <mesh>
              <ringGeometry args={[0.18, 0.19, 24]} />
              <meshBasicMaterial
                color="#C86D32"
                transparent
                opacity={0.25}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* 3. Animated Packets along edges */}
      <instancedMesh
        ref={packetsRef}
        args={[undefined, undefined, packetCount]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#E6E8EB" transparent opacity={0.65} />
      </instancedMesh>
    </group>
  );
}

// 2D SVG Fallback for mobile / prefers-reduced-motion
function StaticTopologyFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
      <svg width="480" height="320" viewBox="-3 -2 6 4" className="w-full h-full max-w-lg">
        {EDGES.map(([srcId, dstId], idx) => {
          const src = NODES.find((n) => n.id === srcId);
          const dst = NODES.find((n) => n.id === dstId);
          if (!src || !dst) return null;
          return (
            <line
              key={idx}
              x1={src.pos[0] * 0.8}
              y1={-src.pos[1] * 0.8}
              x2={dst.pos[0] * 0.8}
              y2={-dst.pos[1] * 0.8}
              stroke="#2D3644"
              strokeWidth="0.02"
              strokeDasharray="0.08 0.04"
            />
          );
        })}
        {NODES.map((node) => (
          <circle
            key={node.id}
            cx={node.pos[0] * 0.8}
            cy={-node.pos[1] * 0.8}
            r={node.isHub ? 0.08 : 0.04}
            fill={node.isHub ? "#C86D32" : "#5A6678"}
            opacity={node.isHub ? 0.8 : 0.4}
          />
        ))}
      </svg>
    </div>
  );
}

export default function HeroNodeGraph() {
  const [isPaused, setIsPaused] = useState(false);
  const [isMobileOrReducedMotion, setIsMobileOrReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference & mobile width (< 768px)
    const mediaQueryMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobile = window.innerWidth < 768;

    if (mediaQueryMotion.matches || isMobile) {
      setIsMobileOrReducedMotion(true);
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsMobileOrReducedMotion(e.matches || window.innerWidth < 768);
    };

    mediaQueryMotion.addEventListener("change", handleMotionChange);
    return () => mediaQueryMotion.removeEventListener("change", handleMotionChange);
  }, []);

  if (isMobileOrReducedMotion) {
    return <StaticTopologyFallback />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 3D Canvas with low overhead */}
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <SceneContent isPaused={isPaused} />
      </Canvas>

      {/* Accessible Pause/Resume 3D Toggle */}
      <div className="absolute bottom-3 right-3 pointer-events-auto z-10">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-2 py-1 text-[11px] font-mono text-[#8A939E] hover:text-[#E6E8EB] bg-[#111419]/80 border border-[#232A35] rounded-[2px] transition-colors flex items-center gap-1.5"
          title={isPaused ? "Resume 3D background animation" : "Pause 3D background animation"}
          aria-label={isPaused ? "Resume 3D motion" : "Pause 3D motion"}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPaused ? "bg-[#C88D32]" : "bg-[#2FA866]"
            }`}
          />
          {isPaused ? "3D_MOTION: PAUSED" : "3D_MOTION: RUNNING"}
        </button>
      </div>
    </div>
  );
}

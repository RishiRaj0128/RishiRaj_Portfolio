"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { NETWORK_NODES, NETWORK_CONDUITS, NetworkNodeDef } from "@/lib/world/worldTopology";

interface NodeStructuresProps {
  onNodeClick: (node: NetworkNodeDef) => void;
  activeNodeId: string | null;
  visitedNodeIds?: string[];
  securitySeverity?: "ok" | "warn" | "err";
}

export default function NodeStructures3D({
  onNodeClick,
  activeNodeId,
  visitedNodeIds = [],
  securitySeverity = "warn",
}: NodeStructuresProps) {
  // Conduit packet pulse animation
  const pulseGroupRef = useRef<THREE.Group>(null);

  // Pre-calculate conduit segment curves and packet positions
  const conduitsData = useMemo(() => {
    return NETWORK_CONDUITS.map((c) => {
      const fromNode = NETWORK_NODES.find((n) => n.id === c.fromId);
      const toNode = NETWORK_NODES.find((n) => n.id === c.toId);
      if (!fromNode || !toNode) return null;

      const p1 = new THREE.Vector3(...fromNode.position);
      const p2 = new THREE.Vector3(...toNode.position);
      p1.y = 0.2;
      p2.y = 0.2;

      // Middle elevation curve
      const mid = p1.clone().lerp(p2, 0.5);
      mid.y = 0.6;

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(24);
      return { curve, points, fromId: c.fromId, toId: c.toId };
    }).filter(Boolean) as { curve: THREE.QuadraticBezierCurve3; points: THREE.Vector3[]; fromId: string; toId: string }[];
  }, []);

  // Server rack silhouettes around outer perimeter
  const serverRacks = useMemo(() => {
    const racks = [];
    const count = 32;
    const radius = 95;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius + (Math.sin(i * 3) * 6);
      const z = Math.sin(angle) * radius + (Math.cos(i * 2) * 6);
      const height = 12 + (i % 5) * 4;
      const width = 3 + (i % 3) * 1.5;
      racks.push({ x, z, height, width, rotation: angle + Math.PI / 2 });
    }
    return racks;
  }, []);

  // Conduit packet animation
  useFrame((state) => {
    if (!pulseGroupRef.current) return;
    const t = state.clock.elapsedTime * 0.45;
    pulseGroupRef.current.children.forEach((child, idx) => {
      const conduit = conduitsData[idx % conduitsData.length];
      if (conduit) {
        const isVisited =
          visitedNodeIds.includes(conduit.fromId) || visitedNodeIds.includes(conduit.toId);
        const speedMultiplier = isVisited ? 1.4 : 1.0;
        const progress = (t * speedMultiplier + idx * 0.15) % 1.0;
        const pt = conduit.curve.getPoint(progress);
        child.position.copy(pt);
      }
    });
  });

  const securityColor =
    securitySeverity === "ok"
      ? "#2FA866"
      : securitySeverity === "err"
      ? "#C24545"
      : "#C88D32";

  return (
    <group>
      {/* GROUND PLANE & NETWORK TOPOLOGY BUS GRID */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[260, 260, 32, 32]} />
        <meshStandardMaterial
          color="#0A0B0D"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Grid line overlay */}
      <gridHelper
        args={[240, 60, "#2D3440", "#171B22"]}
        position={[0, 0.02, 0]}
      />

      {/* Distant Server Rack Silhouettes (Industrial Datacenter Perimeter) */}
      {serverRacks.map((rack, idx) => (
        <group key={idx} position={[rack.x, rack.height / 2, rack.z]} rotation={[0, rack.rotation, 0]}>
          <mesh>
            <boxGeometry args={[rack.width, rack.height, 1.8]} />
            <meshStandardMaterial
              color="#0F1116"
              roughness={0.85}
              metalness={0.3}
            />
          </mesh>
          {/* Subtle LED status lines on rack faces */}
          <mesh position={[0, (idx % 3) * 1.5 - 2, 0.95]}>
            <boxGeometry args={[rack.width * 0.7, 0.08, 0.05]} />
            <meshBasicMaterial
              color={idx % 4 === 0 ? "#C86D32" : "#2FA866"}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>
      ))}

      {/* Animated Conduit Lines connecting nodes with PERSISTENT VISITED LIGHTING */}
      {conduitsData.map((conduit, idx) => {
        const isVisitedConduit =
          visitedNodeIds.includes(conduit.fromId) && visitedNodeIds.includes(conduit.toId);
        const isPartiallyVisited =
          visitedNodeIds.includes(conduit.fromId) || visitedNodeIds.includes(conduit.toId);

        const lineGeom = new THREE.BufferGeometry().setFromPoints(conduit.points);
        return (
          <line key={idx}>
            <bufferGeometry attach="geometry" {...lineGeom} />
            <lineBasicMaterial
              attach="material"
              color={isVisitedConduit ? "#C86D32" : isPartiallyVisited ? "#8A542A" : "#2D3440"}
              transparent
              opacity={isVisitedConduit ? 0.95 : isPartiallyVisited ? 0.75 : 0.45}
              linewidth={isVisitedConduit ? 2 : 1}
            />
          </line>
        );
      })}

      {/* Data Packet Pulses traveling along conduits */}
      <group ref={pulseGroupRef}>
        {conduitsData.map((conduit, idx) => {
          const isVisitedConduit =
            visitedNodeIds.includes(conduit.fromId) || visitedNodeIds.includes(conduit.toId);
          return (
            <mesh key={idx}>
              <boxGeometry args={[0.3, 0.15, 0.5]} />
              <meshBasicMaterial color={isVisitedConduit ? "#C86D32" : "#5A626E"} />
            </mesh>
          );
        })}
      </group>

      {/* 3D NODE STRUCTURES */}
      {NETWORK_NODES.map((node) => {
        const isCurrent = activeNodeId === node.id;
        const isVisited = visitedNodeIds.includes(node.id);

        return (
          <group
            key={node.id}
            position={node.position}
            onClick={() => onNodeClick(node)}
            onPointerOver={() => {
              if (typeof document !== "undefined") document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              if (typeof document !== "undefined") document.body.style.cursor = "auto";
            }}
          >
            {/* Ground Proximity Docking Ring with Persistent Visited Glow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
              <ringGeometry args={[node.dockingRadius - 0.4, node.dockingRadius, 48]} />
              <meshBasicMaterial
                color={isCurrent ? "#C86D32" : isVisited ? "#8F4B1E" : "#1F242C"}
                transparent
                opacity={isCurrent ? 0.95 : isVisited ? 0.7 : 0.35}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Inner Proximity Disk Indicator */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <circleGeometry args={[2.5, 32]} />
              <meshBasicMaterial
                color={isCurrent ? "#362216" : isVisited ? "#1A1512" : "#111419"}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* NODE ARCHITECTURAL GEOMETRIES */}
            {node.id === "ingress" && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 2.5, 0]}>
                  <torusGeometry args={[2.2, 0.18, 12, 32]} />
                  <meshStandardMaterial color="#C86D32" metalness={0.7} roughness={0.3} />
                </mesh>
                <mesh position={[0, 1.8, 0]}>
                  <cylinderGeometry args={[0.8, 1.2, 3.6, 6]} />
                  <meshStandardMaterial color="#171B22" metalness={0.8} roughness={0.4} />
                </mesh>
                <pointLight position={[0, 3.5, 0]} color="#C86D32" intensity={1.5} distance={12} />
              </group>
            )}

            {node.id === "status" && (
              <group position={[0, 0, 0]}>
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i / 6) * Math.PI * 2;
                  const x = Math.cos(angle) * 1.8;
                  const z = Math.sin(angle) * 1.8;
                  const height = 2.5 + (i % 3) * 0.8;
                  return (
                    <group key={i} position={[x, height / 2, z]}>
                      <mesh>
                        <cylinderGeometry args={[0.35, 0.45, height, 6]} />
                        <meshStandardMaterial color="#171B22" metalness={0.6} roughness={0.4} />
                      </mesh>
                      <mesh position={[0, height / 2 + 0.1, 0]}>
                        <sphereGeometry args={[0.12, 12, 12]} />
                        <meshBasicMaterial color="#2FA866" />
                      </mesh>
                    </group>
                  );
                })}
              </group>
            )}

            {node.id === "broker" && (
              <group position={[0, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.5, 0]}>
                  <torusGeometry args={[1.9, 0.1, 8, 32]} />
                  <meshBasicMaterial color="#C86D32" transparent opacity={0.6} />
                </mesh>
                {[0, 1, 2, 3, 4].map((i) => {
                  const angle = (i / 5) * Math.PI * 2;
                  const x = Math.cos(angle) * 1.9;
                  const z = Math.sin(angle) * 1.9;
                  const isLeader = i === 0;
                  return (
                    <group key={i} position={[x, 1.5, z]}>
                      <mesh>
                        <boxGeometry args={[0.6, 3.0, 0.6]} />
                        <meshStandardMaterial color={isLeader ? "#2D3440" : "#171B22"} metalness={0.7} />
                      </mesh>
                      <mesh position={[0, 1.6, 0]}>
                        <boxGeometry args={[0.2, 0.2, 0.2]} />
                        <meshBasicMaterial color={isLeader ? "#C86D32" : "#2FA866"} />
                      </mesh>
                    </group>
                  );
                })}
              </group>
            )}

            {node.id === "payment" && (
              <group position={[0, 0, 0]}>
                <mesh position={[-0.9, 2.0, 0]}>
                  <boxGeometry args={[0.8, 4.0, 1.2]} />
                  <meshStandardMaterial color="#171B22" metalness={0.8} roughness={0.3} />
                </mesh>
                <mesh position={[0.9, 2.0, 0]}>
                  <boxGeometry args={[0.8, 4.0, 1.2]} />
                  <meshStandardMaterial color="#171B22" metalness={0.8} roughness={0.3} />
                </mesh>
                <mesh position={[0, 2.0, 0]}>
                  <torusGeometry args={[1.4, 0.08, 8, 24]} />
                  <meshBasicMaterial color="#C86D32" />
                </mesh>
              </group>
            )}

            {node.id === "shortener" && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 2.2, 0]}>
                  <octahedronGeometry args={[1.4, 0]} />
                  <meshStandardMaterial color="#1F242C" metalness={0.7} roughness={0.2} />
                </mesh>
                <mesh position={[0, 2.2, 0]}>
                  <torusGeometry args={[2.0, 0.06, 8, 32]} />
                  <meshBasicMaterial color="#C86D32" transparent opacity={0.7} />
                </mesh>
              </group>
            )}

            {node.id === "achievements" && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 0.4, 0]}>
                  <cylinderGeometry args={[1.8, 2.2, 0.8, 6]} />
                  <meshStandardMaterial color="#171B22" metalness={0.6} />
                </mesh>
                <mesh position={[0, 1.8, 0]}>
                  <cylinderGeometry args={[0.4, 0.7, 2.4, 6]} />
                  <meshStandardMaterial color="#2D3440" metalness={0.8} roughness={0.2} />
                </mesh>
              </group>
            )}

            {node.id === "security" && (
              // Security: Hardened firewall monolith with dynamic severity tinting
              <group position={[0, 0, 0]}>
                <mesh position={[0, 1.8, 0]}>
                  <boxGeometry args={[3.2, 3.6, 0.6]} />
                  <meshStandardMaterial color="#171B22" metalness={0.9} roughness={0.3} />
                </mesh>
                {/* Dynamic severity caution perimeter line */}
                <mesh position={[0, 1.8, 0.35]}>
                  <planeGeometry args={[2.8, 0.16]} />
                  <meshBasicMaterial color={securityColor} />
                </mesh>
                {/* Perimeter warning beacon */}
                <mesh position={[0, 3.8, 0]}>
                  <sphereGeometry args={[0.15, 12, 12]} />
                  <meshBasicMaterial color={securityColor} />
                </mesh>
                <pointLight position={[0, 4.0, 0]} color={securityColor} intensity={1.4} distance={8} />
              </group>
            )}

            {node.id === "contact" && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 1.0, 0]}>
                  <cylinderGeometry args={[0.3, 0.5, 2.0, 8]} />
                  <meshStandardMaterial color="#171B22" metalness={0.7} />
                </mesh>
                <mesh position={[0, 2.6, 0]} rotation={[0.4, 0, 0]}>
                  <sphereGeometry args={[1.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
                  <meshStandardMaterial color="#232A35" side={THREE.DoubleSide} metalness={0.8} />
                </mesh>
                <mesh position={[0, 3.2, -0.4]}>
                  <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
                  <meshBasicMaterial color="#C86D32" />
                </mesh>
                <pointLight position={[0, 3.8, -0.4]} color="#C86D32" intensity={1.8} distance={10} />
              </group>
            )}

            {/* FLOATING 3D BILLBOARD TEXT / LABEL */}
            <Html
              position={[0, 4.4, 0]}
              center
              distanceFactor={35}
              zIndexRange={[10, 0]}
              className="pointer-events-none select-none"
            >
              <div
                className={`flex flex-col items-center px-2 py-1 rounded-[2px] border text-center transition-all ${
                  isCurrent
                    ? "bg-[#111317] border-[#C86D32]"
                    : isVisited
                    ? "bg-[#111317]/95 border-[#8F4B1E]"
                    : "bg-[#0A0B0D]/90 border-[#1F242C]"
                }`}
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-[1px]"
                    style={{
                      backgroundColor:
                        node.id === "security"
                          ? securityColor
                          : node.status === "ACTIVE"
                          ? "#2FA866"
                          : "#C86D32",
                    }}
                  />
                  <span className="font-bold text-[#E6E8EB] tracking-wider text-[11px] whitespace-nowrap">
                    {node.label}
                  </span>
                  {isVisited && (
                    <span className="text-[9px] text-[#C86D32] font-semibold tracking-tighter">
                      [VISITED]
                    </span>
                  )}
                </div>
                <div className="text-[9px] text-[#878F99] whitespace-nowrap">
                  {node.sublabel}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

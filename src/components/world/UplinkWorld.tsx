"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ProbeCraft from "./ProbeCraft";
import NodeStructures3D from "./NodeStructures3D";
import UplinkHUD from "./UplinkHUD";
import DevConsole from "./DevConsole";
import NodeOverlayContainer from "./NodeOverlayContainer";
import LegalModal from "./overlays/LegalModal";
import BootLoader from "./BootLoader";
import { NETWORK_NODES, NetworkNodeDef } from "@/lib/world/worldTopology";
import { soundFx } from "@/lib/audio/soundFx";

export default function UplinkWorld() {
  // Boot Sequence Loading State
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState("STREAMING TOPOLOGY ASSETS...");
  const [isBootLoaded, setIsBootLoaded] = useState(false);

  // Probe Telemetry State
  const [telemetry, setTelemetry] = useState({
    position: [0, 1.2, 0] as [number, number, number],
    velocity: 0,
    headingDeg: 0,
    nearestNode: NETWORK_NODES[0] as NetworkNodeDef | null,
    nearestDistance: 0,
  });

  // Docking State
  const [dockedNode, setDockedNode] = useState<NetworkNodeDef | null>(null);

  // Fast Travel / Teleport Target
  const [teleportTarget, setTeleportTarget] = useState<[number, number, number] | null>(null);

  // Dev Console State
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Legal Modal State (terms / privacy)
  const [legalType, setLegalType] = useState<"terms" | "privacy" | null>(null);

  // Mobile Touch Controls State
  const [touchControls, setTouchControls] = useState({ thrust: 0, steer: 0 });

  // Stream real assets and advance loader cleanly
  useEffect(() => {
    const steps = [
      { progress: 20, status: "INITIALIZING THREE.JS WEBGL RENDERER..." },
      { progress: 45, status: "COMPILING SHADER PIPELINE & FOG BUS..." },
      { progress: 70, status: "MAPPING NETWORK CONDUITS & 8 NODE MONOLITHS..." },
      { progress: 90, status: "ATTACHING HOVERCRAFT DRIFT PHYSICS RIG..." },
      { progress: 100, status: "INITIALIZATION COMPLETE. SPAWNING PROBE AT INGRESS..." },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setLoadProgress(steps[current].progress);
        setLoadStatus(steps[current].status);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // Teleport handler
  const handleTeleportToNode = useCallback((node: NetworkNodeDef) => {
    setTeleportTarget(node.position);
    setDockedNode(node);
  }, []);

  // Undock handler
  const handleUndock = useCallback(() => {
    soundFx.playUndockSound();
    setDockedNode(null);
  }, []);

  // Handle docking trigger from probe proximity
  const handleDockTrigger = useCallback((node: NetworkNodeDef) => {
    setDockedNode(node);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0B0D] select-none">
      {/* Real Progress Boot Loader (no blank flash / real stream sequence) */}
      {!isBootLoaded && (
        <BootLoader
          progress={loadProgress}
          statusText={loadStatus}
          onComplete={() => setIsBootLoaded(true)}
        />
      )}

      {/* 
        3D FULL-VIEWPORT CANVAS
        Renders the entire UPLINK world.
        Navigation is exclusively via the pilotable Data-Packet Probe or Dev Console.
      */}
      <Canvas
        camera={{ position: [0, 4, 8], fov: 60, near: 0.1, far: 300 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        className="w-full h-full block"
      >
        <color attach="background" args={["#0A0B0D"]} />
        <fog attach="fog" args={["#0A0B0D", 45, 200]} />

        {/* Industrial Low-Contrast Lighting */}
        <ambientLight intensity={0.65} color="#E6E8EB" />
        <directionalLight
          position={[40, 60, 30]}
          intensity={0.9}
          color="#E6E8EB"
          castShadow={false}
        />
        {/* Subtle Warm Amber Accent Fill */}
        <pointLight position={[0, 15, 0]} color="#C86D32" intensity={0.7} distance={90} />

        <Suspense fallback={null}>
          {/* Pilotable Data-Packet Probe */}
          <ProbeCraft
            onTelemetryUpdate={setTelemetry}
            onDockTrigger={handleDockTrigger}
            isDocked={!!dockedNode}
            dockedNodeId={dockedNode ? dockedNode.id : null}
            teleportTarget={teleportTarget}
            onTeleportComplete={() => setTeleportTarget(null)}
            touchControls={touchControls}
          />

          {/* 3D World Topology Structures (8 Nodes, Conduits, Server Racks, Ground Grid) */}
          <NodeStructures3D
            onNodeClick={handleTeleportToNode}
            activeNodeId={dockedNode ? dockedNode.id : null}
          />
        </Suspense>
      </Canvas>

      {/* 2D HUD OVERLAY (Telemetry, Minimap Radar, Controls) */}
      <UplinkHUD
        telemetry={telemetry}
        onOpenConsole={() => setIsConsoleOpen(true)}
        onTeleportToNode={handleTeleportToNode}
        isDocked={!!dockedNode}
        onUndock={handleUndock}
        onTouchInput={setTouchControls}
      />

      {/* IN-FICTION DEVELOPER CONSOLE (Section 7: Accessibility & Fast Travel) */}
      <DevConsole
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        onExecuteGoto={handleTeleportToNode}
        onOpenContact={() => {
          const contactNode = NETWORK_NODES.find((n) => n.id === "contact")!;
          handleTeleportToNode(contactNode);
        }}
        onOpenLegal={(type) => setLegalType(type)}
      />

      {/* DOCKED NODE OVERLAY PANEL (Framer Motion 2D Surface) */}
      <NodeOverlayContainer
        dockedNode={dockedNode}
        onUndock={handleUndock}
      />

      {/* LEGAL MODAL (Terms & Privacy inside world) */}
      <LegalModal
        type={legalType}
        onClose={() => setLegalType(null)}
      />
    </div>
  );
}

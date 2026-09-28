"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NETWORK_NODES, NetworkNodeDef, WORLD_BOUNDS } from "@/lib/world/worldTopology";
import { soundFx } from "@/lib/audio/soundFx";

interface UplinkHUDProps {
  telemetry: {
    position: [number, number, number];
    velocity: number;
    headingDeg: number;
    nearestNode: NetworkNodeDef | null;
    nearestDistance: number;
  };
  onOpenConsole: () => void;
  onTeleportToNode: (node: NetworkNodeDef) => void;
  isDocked: boolean;
  onUndock: () => void;
  onTouchInput: (controls: { thrust: number; steer: number }) => void;
  visitedNodeIds?: string[];
  handshakeState?: { node: NetworkNodeDef; step: 1 | 2 | 3 } | null;
}

export default function UplinkHUD({
  telemetry,
  onOpenConsole,
  onTeleportToNode,
  isDocked,
  onUndock,
  onTouchInput,
  visitedNodeIds = [],
  handshakeState = null,
}: UplinkHUDProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [hasUserPiloted, setHasUserPiloted] = useState(false);
  const [isTouchDevice] = useState(() =>
    typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
  const [hoveredNode, setHoveredNode] = useState<NetworkNodeDef | null>(null);

  if (!hasUserPiloted && telemetry.velocity > 0.5) {
    setHasUserPiloted(true);
  }

  const toggleAudio = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    soundFx.setMuted(next);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 font-mono select-none flex flex-col justify-between p-3 sm:p-5">
      {/* TOP HEADER / STATUS BAR */}
      <header className="pointer-events-auto flex flex-wrap justify-between items-center bg-[#111317]/90 border border-[#1F242C] rounded-[2px] px-3 py-2 text-xs backdrop-blur-none gap-2">
        {/* Brand / System Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[1px] bg-[#C86D32] animate-pulse" />
            <span className="font-bold text-[#E6E8EB] tracking-wider">UPLINK</span>
            <span className="text-[#5A626E] hidden sm:inline">{"// NETWORK TOPOLOGY"}</span>
          </div>

          <div className="h-3 w-[1px] bg-[#1F242C] hidden sm:block" />

          {/* Telemetry Coordinates */}
          <div className="text-[11px] text-[#878F99] hidden md:flex items-center gap-3">
            <span>
              POS: <span className="text-[#E6E8EB]">[{telemetry.position[0]}, {telemetry.position[2]}]</span>
            </span>
            <span>
              SPD: <span className="text-[#E6E8EB]">{telemetry.velocity} u/s</span>
            </span>
            <span>
              HDG: <span className="text-[#E6E8EB]">{telemetry.headingDeg}°</span>
            </span>
          </div>
        </div>

        {/* Nearest Node Waypoint Tracker */}
        <div className="flex items-center gap-2 text-[11px]">
          {telemetry.nearestNode && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-1.5 bg-[#0A0B0D] px-2.5 py-1 border border-[#1F242C] rounded-[2px]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#5A626E]">TARGET:</span>
                <span className="text-[#C86D32] font-semibold">{telemetry.nearestNode.label}</span>
                <span className="text-[#878F99]">({telemetry.nearestDistance}m)</span>
              </div>
              {telemetry.nearestNode.plainSubtitle && (
                <span className="text-[10px] text-[#878F99] font-sans">
                  [{telemetry.nearestNode.plainSubtitle}]
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Fast-Travel */}
        <div className="flex items-center gap-2 text-xs">
          {/* Back to Notebook Link */}
          <Link
            href="/"
            className="px-2.5 py-1 bg-[#1A1512] border border-[#C86D32] hover:bg-[#C86D32]/20 text-[#C86D32] rounded-[2px] text-xs font-mono font-bold transition-colors inline-flex items-center gap-1"
            title="Return to the server-rendered Engineer's Notebook"
          >
            <span>← Notebook</span>
          </Link>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            title="Toggle procedural audio FX"
            className={`px-2 py-1 border rounded-[2px] transition-colors ${
              !isAudioMuted
                ? "bg-[#362216] border-[#C86D32] text-[#E6E8EB]"
                : "bg-[#0A0B0D] border-[#1F242C] text-[#878F99] hover:border-[#2D3440]"
            }`}
          >
            AUDIO: {!isAudioMuted ? "ON" : "MUTED"}
          </button>

          {/* Quick Jump Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickJump((prev) => !prev)}
              className="px-2 py-1 bg-[#0A0B0D] border border-[#1F242C] text-[#878F99] hover:border-[#2D3440] hover:text-[#E6E8EB] rounded-[2px]"
            >
              NODES [{visitedNodeIds.length}/{NETWORK_NODES.length}]
            </button>

            {showQuickJump && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-[#111317] border border-[#2D3440] rounded-[2px] p-1.5 space-y-1 z-50">
                <div className="text-[10px] text-[#5A626E] px-2 py-0.5 border-b border-[#1F242C] flex justify-between">
                  <span>TELEPORT TO NODE</span>
                  <span>VISITED: {visitedNodeIds.length}</span>
                </div>
                {NETWORK_NODES.map((n) => {
                  const isVisited = visitedNodeIds.includes(n.id);
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        onTeleportToNode(n);
                        setShowQuickJump(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-[11px] text-[#878F99] hover:text-[#E6E8EB] hover:bg-[#1E232C] rounded-[2px] flex justify-between items-center"
                    >
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-[1px]"
                            style={{
                              backgroundColor:
                                n.status === "ACTIVE"
                                  ? "#2FA866"
                                  : n.status === "PENDING_AUDIT"
                                  ? "#C88D32"
                                  : "#C86D32",
                            }}
                          />
                          <span className={isVisited ? "text-[#E6E8EB] font-bold" : ""}>{n.label}</span>
                        </span>
                        {n.plainSubtitle && (
                          <span className="text-[9px] text-[#878F99] font-sans pl-3">
                            {n.plainSubtitle}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-[#5A626E]">{n.port}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dev Console Toggle Button */}
          <button
            onClick={onOpenConsole}
            className="px-2 py-1 bg-[#C86D32] text-[#0A0B0D] font-bold border border-[#C86D32] hover:bg-[#e07b39] rounded-[2px] flex items-center gap-1"
          >
            <span>CONSOLE</span>
            <span className="text-[10px] opacity-80">[ ` ]</span>
          </button>
        </div>
      </header>

      {/* CENTER HUD: TCP HANDSHAKE ANIMATION OR CONTROLS HINT */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-none">
        {/* TCP HANDSHAKE DOCKING SEQUENCE (SYN -> SYN-ACK -> ACK) */}
        {handshakeState ? (
          <div className="pointer-events-auto bg-[#111317]/95 border border-[#C86D32] px-5 py-3 rounded-[2px] text-xs max-w-md w-full shadow-none space-y-2">
            <div className="flex justify-between items-center border-b border-[#1F242C] pb-1 text-[10px] text-[#C86D32] font-bold">
              <span>TCP TRANSPORT HANDSHAKE</span>
              <span>{handshakeState.node.port}</span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className={handshakeState.step >= 1 ? "text-[#E6E8EB]" : "text-[#5A626E]"}>
                <span className="text-[#C86D32]">[SYN]</span> Probing {handshakeState.node.label}...
              </div>
              <div className={handshakeState.step >= 2 ? "text-[#E6E8EB]" : "text-[#5A626E]"}>
                <span className="text-[#C88D32]">[SYN-ACK]</span> {handshakeState.node.name} acknowledged (RTT: 0.8ms)
              </div>
              <div className={handshakeState.step >= 3 ? "text-[#2FA866] font-bold" : "text-[#5A626E]"}>
                <span className="text-[#2FA866]">[ACK]</span> Connection established. Mounting service overlay...
              </div>
            </div>
          </div>
        ) : isDocked ? (
          <div className="pointer-events-auto bg-[#111317]/95 border border-[#C86D32] px-4 py-2 rounded-[2px] text-center max-w-sm">
            <div className="text-[10px] text-[#C86D32] font-bold tracking-widest uppercase">
              PROBE DOCKED AT NODE
            </div>
            <div className="text-xs text-[#878F99] mt-0.5">
              Inspect section content above or press ESC to resume flight.
            </div>
            <button
              onClick={onUndock}
              className="mt-2 px-3 py-1 bg-[#C86D32] text-[#0A0B0D] font-bold text-xs rounded-[2px] hover:bg-[#e07b39]"
            >
              RESUME FLIGHT [ESC]
            </button>
          </div>
        ) : (
          !hasUserPiloted && (
            <div className="bg-[#111317]/90 border border-[#1F242C] px-4 py-2.5 rounded-[2px] text-center max-w-md">
              <div className="text-xs text-[#E6E8EB] font-bold tracking-wide mb-1">
                PILOT THE DATA-PACKET PROBE
              </div>
              <div className="text-[11px] text-[#878F99] space-y-0.5">
                <div>WASD or Arrow Keys for thrust & banking steer</div>
                <div>Approach any node to auto-dock via TCP handshake</div>
                <div>Press [ ` ] (backtick) anytime for dev console fast-travel</div>
              </div>
            </div>
          )
        )}
      </div>

      {/* BOTTOM LAYER: RADAR MINIMAP & TOUCH CONTROLS */}
      <div className="flex justify-between items-end gap-4">
        {/* On-Screen Mobile Touch Controls (shown on touch devices) */}
        {isTouchDevice ? (
          <div className="pointer-events-auto flex gap-3 bg-[#111317]/90 border border-[#1F242C] p-2 rounded-[2px]">
            {/* Thrust buttons */}
            <div className="flex flex-col gap-1">
              <button
                onTouchStart={() => onTouchInput({ thrust: 1, steer: 0 })}
                onTouchEnd={() => onTouchInput({ thrust: 0, steer: 0 })}
                className="w-12 h-12 bg-[#171B22] border border-[#2D3440] text-[#E6E8EB] active:bg-[#C86D32] active:text-[#0A0B0D] rounded-[2px] font-bold text-xs"
              >
                FWD
              </button>
              <button
                onTouchStart={() => onTouchInput({ thrust: -0.6, steer: 0 })}
                onTouchEnd={() => onTouchInput({ thrust: 0, steer: 0 })}
                className="w-12 h-12 bg-[#171B22] border border-[#2D3440] text-[#E6E8EB] active:bg-[#C86D32] active:text-[#0A0B0D] rounded-[2px] font-bold text-xs"
              >
                REV
              </button>
            </div>
            {/* Steer buttons */}
            <div className="flex gap-1 items-center">
              <button
                onTouchStart={() => onTouchInput({ thrust: 0, steer: 1 })}
                onTouchEnd={() => onTouchInput({ thrust: 0, steer: 0 })}
                className="w-12 h-12 bg-[#171B22] border border-[#2D3440] text-[#E6E8EB] active:bg-[#C86D32] active:text-[#0A0B0D] rounded-[2px] font-bold text-xs"
              >
                LEFT
              </button>
              <button
                onTouchStart={() => onTouchInput({ thrust: 0, steer: -1 })}
                onTouchEnd={() => onTouchInput({ thrust: 0, steer: 0 })}
                className="w-12 h-12 bg-[#171B22] border border-[#2D3440] text-[#E6E8EB] active:bg-[#C86D32] active:text-[#0A0B0D] rounded-[2px] font-bold text-xs"
              >
                RIGHT
              </button>
            </div>
          </div>
        ) : (
          /* Desktop Keyboard hint footer */
          <div className="bg-[#111317]/80 border border-[#1F242C] px-3 py-1.5 rounded-[2px] text-[11px] text-[#5A626E] hidden sm:block">
            <span>CONTROLS: [W/S] THRUST • [A/D] STEER • [`] CONSOLE • [ESC] UNDOCK</span>
          </div>
        )}

        {/* HIGH-PRECISION NETWORK TOPOLOGY RADAR MINIMAP */}
        <div className="pointer-events-auto bg-[#111317]/95 border border-[#1F242C] p-2.5 rounded-[2px] flex flex-col items-center">
          <div className="flex justify-between items-center w-full text-[9px] text-[#5A626E] uppercase mb-1 tracking-wider">
            <span>TOPOLOGY RADAR</span>
            <span>100M RANGE</span>
          </div>

          <div className="relative">
            <svg width="128" height="128" viewBox="0 0 128 128" className="bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
              {/* Range Rings with Distance Markers */}
              <circle cx="64" cy="64" r="58" fill="none" stroke="#1F242C" strokeWidth="1" />
              <circle cx="64" cy="64" r="38" fill="none" stroke="#1F242C" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="64" cy="64" r="18" fill="none" stroke="#1F242C" strokeWidth="0.6" strokeDasharray="2 2" />
              <line x1="64" y1="4" x2="64" y2="124" stroke="#1F242C" strokeWidth="0.6" />
              <line x1="4" y1="64" x2="124" y2="64" stroke="#1F242C" strokeWidth="0.6" />

              {/* Range labels */}
              <text x="66" y="24" fill="#3A4556" fontSize="7" fontFamily="monospace">60m</text>
              <text x="66" y="44" fill="#3A4556" fontSize="7" fontFamily="monospace">30m</text>

              {/* Radar Nodes Blips color-coded by status token */}
              {NETWORK_NODES.map((node) => {
                const scale = 58 / WORLD_BOUNDS.maxRadius;
                const bx = 64 + node.position[0] * scale;
                const by = 64 + node.position[2] * scale;
                const isNearest = telemetry.nearestNode?.id === node.id;
                const isVisited = visitedNodeIds.includes(node.id);

                const statusColor =
                  node.id === "ingress" || node.id === "contact"
                    ? "#C86D32"
                    : node.status === "ACTIVE"
                    ? "#2FA866"
                    : node.status === "PENDING_AUDIT"
                    ? "#C88D32"
                    : "#C86D32";

                return (
                  <g
                    key={node.id}
                    onClick={() => onTeleportToNode(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    {/* Persistent Visited Ring */}
                    {isVisited && (
                      <circle
                        cx={bx}
                        cy={by}
                        r="4.5"
                        fill="none"
                        stroke="#C86D32"
                        strokeWidth="0.8"
                        opacity="0.8"
                      />
                    )}
                    <circle
                      cx={bx}
                      cy={by}
                      r={isNearest ? "3.2" : "2.2"}
                      fill={isNearest ? "#C86D32" : statusColor}
                    />
                  </g>
                );
              })}

              {/* Probe Blip + Heading Cone + Velocity Vector */}
              {(() => {
                const scale = 58 / WORLD_BOUNDS.maxRadius;
                const px = 64 + telemetry.position[0] * scale;
                const py = 64 + telemetry.position[2] * scale;
                const rad = (telemetry.headingDeg * Math.PI) / 180;
                const hx = px - Math.sin(rad) * 7;
                const hy = py - Math.cos(rad) * 7;

                return (
                  <g>
                    {/* Probe position blip */}
                    <circle cx={px} cy={py} r="2.8" fill="#E6E8EB" />
                    {/* Heading indicator vector */}
                    <line x1={px} y1={py} x2={hx} y2={hy} stroke="#C86D32" strokeWidth="1.5" />
                  </g>
                );
              })()}
            </svg>

            {/* Hover tooltip over radar blip */}
            {hoveredNode && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#171B22] border border-[#2D3440] px-2 py-0.5 rounded-[2px] text-[9px] text-[#E6E8EB] whitespace-nowrap z-50">
                {hoveredNode.label} ({hoveredNode.port})
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

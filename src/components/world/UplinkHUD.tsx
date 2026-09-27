"use client";

import React, { useState, useEffect } from "react";
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
}

export default function UplinkHUD({
  telemetry,
  onOpenConsole,
  onTeleportToNode,
  isDocked,
  onUndock,
  onTouchInput,
}: UplinkHUDProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [hasUserPiloted, setHasUserPiloted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices
  useEffect(() => {
    if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
      setIsTouchDevice(true);
    }
  }, []);

  // Track if user has piloted probe
  useEffect(() => {
    if (telemetry.velocity > 0.5) {
      setHasUserPiloted(true);
    }
  }, [telemetry.velocity]);

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
            <span className="text-[#5A626E] hidden sm:inline">// NETWORK TOPOLOGY</span>
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
            <div className="flex items-center gap-1.5 bg-[#0A0B0D] px-2 py-0.5 border border-[#1F242C] rounded-[2px]">
              <span className="text-[#5A626E]">TARGET:</span>
              <span className="text-[#C86D32] font-semibold">{telemetry.nearestNode.label}</span>
              <span className="text-[#878F99]">({telemetry.nearestDistance}m)</span>
            </div>
          )}
        </div>

        {/* Action Controls & Fast-Travel */}
        <div className="flex items-center gap-2 text-xs">
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
              NODES [{NETWORK_NODES.length}]
            </button>

            {showQuickJump && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-[#111317] border border-[#2D3440] rounded-[2px] p-1.5 space-y-1 z-50">
                <div className="text-[10px] text-[#5A626E] px-2 py-0.5 border-b border-[#1F242C]">
                  SELECT NODE TO TELEPORT
                </div>
                {NETWORK_NODES.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onTeleportToNode(n);
                      setShowQuickJump(false);
                    }}
                    className="w-full text-left px-2 py-1 text-[11px] text-[#878F99] hover:text-[#E6E8EB] hover:bg-[#1E232C] rounded-[2px] flex justify-between items-center"
                  >
                    <span>{n.label}</span>
                    <span className="text-[9px] text-[#5A626E]">{n.port}</span>
                  </button>
                ))}
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

      {/* CENTER HUD: DOCKED STATUS BANNER OR CONTROLS HINT */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-none">
        {isDocked ? (
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
            <div className="bg-[#111317]/90 border border-[#1F242C] px-4 py-2.5 rounded-[2px] text-center max-w-md animate-fade-in">
              <div className="text-xs text-[#E6E8EB] font-bold tracking-wide mb-1">
                PILOT THE DATA-PACKET PROBE
              </div>
              <div className="text-[11px] text-[#878F99] space-y-0.5">
                <div>WASD or Arrow Keys for thrust & banking steer</div>
                <div>Approach any node to auto-dock and reveal content</div>
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

        {/* Network Topology Vector Radar Minimap */}
        <div className="pointer-events-auto bg-[#111317]/90 border border-[#1F242C] p-2 rounded-[2px] flex flex-col items-center">
          <div className="text-[9px] text-[#5A626E] uppercase mb-1 tracking-wider">
            RADAR // TOPOLOGY
          </div>
          <svg width="110" height="110" viewBox="0 0 110 110" className="bg-[#0A0B0D] border border-[#1F242C] rounded-[2px]">
            {/* Range Rings */}
            <circle cx="55" cy="55" r="50" fill="none" stroke="#1F242C" strokeWidth="1" />
            <circle cx="55" cy="55" r="28" fill="none" stroke="#1F242C" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="55" y1="5" x2="55" y2="105" stroke="#1F242C" strokeWidth="0.6" />
            <line x1="5" y1="55" x2="105" y2="55" stroke="#1F242C" strokeWidth="0.6" />

            {/* Radar Nodes Blips */}
            {NETWORK_NODES.map((node) => {
              // Map world coordinates [-100, 100] to [10, 100]
              const scale = 50 / WORLD_BOUNDS.maxRadius;
              const bx = 55 + node.position[0] * scale;
              const by = 55 + node.position[2] * scale;
              const isNearest = telemetry.nearestNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  onClick={() => onTeleportToNode(node)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={bx}
                    cy={by}
                    r={isNearest ? "3" : "2"}
                    fill={isNearest ? "#C86D32" : "#878F99"}
                  />
                </g>
              );
            })}

            {/* Probe Blip + Heading Indicator */}
            {(() => {
              const scale = 50 / WORLD_BOUNDS.maxRadius;
              const px = 55 + telemetry.position[0] * scale;
              const py = 55 + telemetry.position[2] * scale;
              const rad = (telemetry.headingDeg * Math.PI) / 180;
              const hx = px - Math.sin(rad) * 6;
              const hy = py - Math.cos(rad) * 6;

              return (
                <g>
                  <circle cx={px} cy={py} r="2.5" fill="#E6E8EB" />
                  <line x1={px} y1={py} x2={hx} y2={hy} stroke="#C86D32" strokeWidth="1.5" />
                </g>
              );
            })()}
          </svg>
        </div>
      </div>
    </div>
  );
}

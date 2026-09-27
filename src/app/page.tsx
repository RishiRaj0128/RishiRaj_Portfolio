"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically load the 3D Uplink World with ssr: false for client-side WebGL rendering
const UplinkWorld = dynamic(() => import("@/components/world/UplinkWorld"), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-[#0A0B0D] text-[#E6E8EB] flex flex-col justify-between p-6 sm:p-12 font-mono">
      <div className="flex justify-between items-center text-xs text-[#878F99] border-b border-[#1F242C] pb-4">
        <span className="font-bold text-[#E6E8EB]">UPLINK // TOPOLOGY BOOT SEQUENCE</span>
        <span className="text-[#C86D32]">INITIALIZING WEBGL CANVAS...</span>
      </div>
      <div className="text-xs text-[#878F99] space-y-2 max-w-md">
        <div>STREAMING DISTRIBUTED NETWORK ENVIRONMENT...</div>
        <div>PREPARING DATA-PACKET PROBE CRAFT...</div>
      </div>
      <div className="text-[11px] text-[#5A626E] border-t border-[#1F242C] pt-3">
        HOST: RISHI RAJ • BACKEND DISTRIBUTED SYSTEMS
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0A0B0D] selection:bg-[#C86D32] selection:text-[#0A0B0D]">
      <UplinkWorld />
    </main>
  );
}

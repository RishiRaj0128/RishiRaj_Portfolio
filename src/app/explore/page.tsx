"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically load the 3D Uplink World with ssr: false for client-side WebGL rendering
const UplinkWorld = dynamic(() => import("@/components/world/UplinkWorld"), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-[#0A0B0D] text-[#E6E8EB] flex flex-col justify-between p-6 sm:p-12 font-mono select-none">
      <div className="flex justify-between items-center text-xs text-[#878F99] border-b border-[#1F242C] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-[1px] bg-[#C86D32] animate-ping" />
          <span className="font-bold text-[#E6E8EB]">UPLINK // TOPOLOGY BOOT SEQUENCE</span>
        </div>
        <Link
          href="/"
          className="text-[#C86D32] hover:underline inline-flex items-center gap-1 font-semibold"
        >
          ← Return to Notebook
        </Link>
      </div>
      <div className="text-xs text-[#878F99] space-y-2 max-w-md">
        <div className="text-[#C86D32]">INITIALIZING WEBGL 3D ENVIRONMENT...</div>
        <div>STREAMING DISTRIBUTED NETWORK TOPOLOGY...</div>
        <div>PREPARING DATA-PACKET PROBE CRAFT & DRIFT RIG...</div>
      </div>
      <div className="text-[11px] text-[#5A626E] border-t border-[#1F242C] pt-3 flex justify-between">
        <span>HOST: RISHI RAJ • BACKEND DISTRIBUTED SYSTEMS</span>
        <span>PRESS [`] OR CLICK TERMINAL IN WORLD FOR DEV CONSOLE</span>
      </div>
    </div>
  ),
});

export default function ExplorePage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0A0B0D] selection:bg-[#C86D32] selection:text-[#0A0B0D]">
      <UplinkWorld />
    </main>
  );
}

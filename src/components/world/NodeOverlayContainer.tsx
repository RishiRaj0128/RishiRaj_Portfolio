"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NetworkNodeDef } from "@/lib/world/worldTopology";
import IngressOverlay from "./overlays/IngressOverlay";
import StatusOverlay from "./overlays/StatusOverlay";
import BrokerOverlay from "./overlays/BrokerOverlay";
import PaymentOverlay from "./overlays/PaymentOverlay";
import ShortenerOverlay from "./overlays/ShortenerOverlay";
import AchievementsOverlay from "./overlays/AchievementsOverlay";
import SecurityOverlay from "./overlays/SecurityOverlay";
import ContactOverlay from "./overlays/ContactOverlay";

interface NodeOverlayContainerProps {
  dockedNode: NetworkNodeDef | null;
  onUndock: () => void;
}

export default function NodeOverlayContainer({ dockedNode, onUndock }: NodeOverlayContainerProps) {
  // ESC key listener to undock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dockedNode) {
        e.preventDefault();
        onUndock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dockedNode, onUndock]);

  return (
    <AnimatePresence>
      {dockedNode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dockedNode.label}
          className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-auto"
        >
          {/* Subtle Dim Backdrop (No liquid glass / No heavy blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onUndock}
            className="fixed inset-0 bg-[#0A0B0D]/80"
          />

          {/* 2D Overlay Panel (Strict compliance: 2-4px radius, 1px border, NO drop shadows) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-4xl bg-[#111317] border border-[#2D3440] rounded-[2px] max-h-[88vh] flex flex-col z-10 shadow-none overflow-hidden my-auto"
          >
            {/* Top Dock Header Bar */}
            <div className="p-3 sm:p-4 bg-[#171B22] border-b border-[#1F242C] flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-[1px] bg-[#C86D32]" />
                <span className="font-bold text-[#E6E8EB] tracking-wider">{dockedNode.label}</span>
                <span className="text-[#5A626E] hidden sm:inline">[{dockedNode.position[0]}, {dockedNode.position[2]}]</span>
                <span className="text-[#878F99] hidden md:inline">• {dockedNode.port}</span>
              </div>

              {/* Clear "RESUME FLIGHT" control per prompt requirement */}
              <button
                onClick={onUndock}
                className="px-3 py-1 bg-[#C86D32] hover:bg-[#e07b39] text-[#0A0B0D] font-bold text-xs rounded-[2px] transition-colors flex items-center gap-1.5"
              >
                <span>RESUME FLIGHT</span>
                <span className="text-[10px] opacity-80">[ESC]</span>
              </button>
            </div>

            {/* Scrollable Overlay Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {dockedNode.id === "ingress" && <IngressOverlay />}
              {dockedNode.id === "status" && <StatusOverlay />}
              {dockedNode.id === "broker" && <BrokerOverlay />}
              {dockedNode.id === "payment" && <PaymentOverlay />}
              {dockedNode.id === "shortener" && <ShortenerOverlay />}
              {dockedNode.id === "achievements" && <AchievementsOverlay />}
              {dockedNode.id === "security" && <SecurityOverlay />}
              {dockedNode.id === "contact" && <ContactOverlay />}
            </div>

            {/* Bottom Footer Strip */}
            <div className="p-2.5 bg-[#0A0B0D] border-t border-[#1F242C] flex justify-between items-center text-[11px] font-mono text-[#5A626E]">
              <span>UPLINK DOCKED TELEMETRY // PERSISTENT RUNTIME</span>
              <button
                onClick={onUndock}
                className="text-[#878F99] hover:text-[#E6E8EB] underline"
              >
                Close & Resume Flight
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

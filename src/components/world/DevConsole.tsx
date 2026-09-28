"use client";

import React, { useState, useEffect, useRef } from "react";
import { NETWORK_NODES, NetworkNodeDef } from "@/lib/world/worldTopology";
import { soundFx } from "@/lib/audio/soundFx";

interface DevConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteGoto: (node: NetworkNodeDef) => void;
  onOpenContact: () => void;
  onOpenLegal: (type: "terms" | "privacy") => void;
}

interface LogEntry {
  type: "input" | "output" | "error" | "info";
  text: string;
}

const TOP_LEVEL_COMMANDS = ["goto", "list", "contact", "resume", "terms", "privacy", "clear", "help"];

export default function DevConsole({
  isOpen,
  onClose,
  onExecuteGoto,
  onOpenContact,
  onOpenLegal,
}: DevConsoleProps) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<LogEntry[]>([
    { type: "info", text: "UPLINK DEVELOPER CONSOLE // v2.4.0-rev3" },
    { type: "info", text: "Type 'help' to inspect commands or 'list' to view available nodes." },
    { type: "info", text: "Controls: [↑/↓] Command History • [Tab] Autocomplete • [`/ESC] Close" },
    { type: "info", text: "Screen-reader and keyboard accessible navigation layer." },
  ]);

  // Command history buffer for ArrowUp / ArrowDown
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const draftCommand = useRef<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when console is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Scroll to bottom on output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Global backtick and ESC listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Input KeyDown Handler (ArrowUp / ArrowDown for history, Tab for autocomplete)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;

      const nextPointer = historyPointer + 1;
      if (nextPointer < cmdHistory.length) {
        if (historyPointer === -1) {
          draftCommand.current = command;
        }
        setHistoryPointer(nextPointer);
        setCommand(cmdHistory[cmdHistory.length - 1 - nextPointer]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextPointer = historyPointer - 1;
        setHistoryPointer(nextPointer);
        setCommand(cmdHistory[cmdHistory.length - 1 - nextPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setCommand(draftCommand.current);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = command.trim();
      if (!current) return;

      // Autocomplete 'goto <node>'
      if (current.startsWith("goto ") || current === "goto") {
        const arg = current.replace("goto", "").trim().toLowerCase();
        const matchingNode = NETWORK_NODES.find(
          (n) => n.id.toLowerCase().startsWith(arg) || n.name.toLowerCase().startsWith(arg)
        );
        if (matchingNode) {
          setCommand(`goto ${matchingNode.id}`);
          soundFx.playKeyClick();
        }
      } else {
        // Autocomplete top-level commands
        const match = TOP_LEVEL_COMMANDS.find((cmd) => cmd.startsWith(current.toLowerCase()));
        if (match) {
          setCommand(match === "goto" ? "goto " : match);
          soundFx.playKeyClick();
        }
      }
    }
  };

  if (!isOpen) return null;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = command.trim();
    if (!raw) return;

    soundFx.playKeyClick();

    // Append to command history
    setCmdHistory((prev) => [...prev, raw]);
    setHistoryPointer(-1);

    const newHistory: LogEntry[] = [...history, { type: "input", text: `> ${raw}` }];
    const parts = raw.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "output",
          text: `SUPPORTED COMMANDS:
  goto <node>       Teleport probe to node and open section overlay
  list              List all navigable nodes and coordinates
  contact           Open direct contact transmission portal
  resume            Download Rishi Raj engineering resume
  terms             View Terms of Service legal terms
  privacy           View Privacy Policy terms
  whoami            Print operator identity & credentials
  uptime            Display cluster uptime & verified reliability stats
  sudo hire rishi   Request contract authorization & contact portal
  build             Secret node: inspect site architecture & stack
  clear             Clear terminal output buffer
  help              Show this command manual`,
        });
        break;

      case "list":
        const nodeList = NETWORK_NODES.map(
          (n) => `  ${n.id.padEnd(14)} ${n.label.padEnd(25)} [${n.position[0]}, ${n.position[2]}]`
        ).join("\n");
        newHistory.push({
          type: "output",
          text: `AVAILABLE NETWORK NODES:\n${nodeList}`,
        });
        break;

      case "goto":
        if (!arg) {
          newHistory.push({
            type: "error",
            text: "ERROR: Missing node identifier. Example: 'goto broker' or 'goto status'.",
          });
        } else {
          const target = NETWORK_NODES.find(
            (n) =>
              n.id.toLowerCase() === arg ||
              n.id.toLowerCase().includes(arg) ||
              n.name.toLowerCase().includes(arg)
          );
          if (target) {
            newHistory.push({
              type: "info",
              text: `TELEPORTING PROBE TO: ${target.label} [${target.position[0]}, ${target.position[2]}]...`,
            });
            setTimeout(() => {
              onExecuteGoto(target);
              onClose();
            }, 300);
          } else {
            newHistory.push({
              type: "error",
              text: `ERROR: Node '${arg}' not recognized. Type 'list' to view valid node names.`,
            });
          }
        }
        break;

      case "contact":
        newHistory.push({ type: "info", text: "OPENING CONTACT TRANSMISSION OVERLAY..." });
        setTimeout(() => {
          onOpenContact();
          onClose();
        }, 200);
        break;

      case "resume":
        newHistory.push({
          type: "output",
          text: "DISPATCHING RESUME: Initiating download of Rishi Raj Technical Resume (PDF)...",
        });
        if (typeof window !== "undefined") {
          window.open("https://github.com/RishiRaj0128", "_blank");
        }
        break;

      case "terms":
        newHistory.push({ type: "info", text: "DISPLAYING TERMS OF SERVICE..." });
        onOpenLegal("terms");
        onClose();
        break;

      case "privacy":
        newHistory.push({ type: "info", text: "DISPLAYING PRIVACY POLICY..." });
        onOpenLegal("privacy");
        onClose();
        break;

      case "whoami":
        newHistory.push({
          type: "output",
          text: `USER: Rishi Raj
IDENTITY: Backend Distributed Systems & DevOps Engineer
INSTITUTION: B.Tech CSE, Lovely Professional University (CGPA 7.98)
CORE PROMISE: Building fault-tolerant backends that never lose data or double-charge.`,
        });
        break;

      case "uptime":
        newHistory.push({
          type: "output",
          text: `SYSTEM UPTIME:
  Availability: 99.98% across 50+ simulated failure cycles
  Quorum Recovery: ~750ms leader failover
  Net Balance Drift: $0.00 across 5,000+ ledger entries
  Duplicate Charges: 0 (100% blocked via atomic idempotency)`,
        });
        break;

      case "sudo":
        if (raw.toLowerCase() === "sudo hire rishi") {
          newHistory.push({
            type: "info",
            text: `[ROOT ACCESS GRANTED]: Elevating privileges for operator...
Dispatching contract authorization conduit. Opening contact ingress...`,
          });
          setTimeout(() => {
            onOpenContact();
            onClose();
          }, 400);
        } else {
          newHistory.push({
            type: "output",
            text: `sudo: try 'sudo hire rishi'`,
          });
        }
        break;

      case "build":
      case "site":
      case "architecture":
        newHistory.push({
          type: "output",
          text: `HOW THIS SITE WAS BUILT (SECRET ARCHITECTURE NODE):
- Core: Next.js 16 App Router, TypeScript, React 19, Tailwind CSS v4
- Dual UI Paradigm: Accessible server-rendered Engineer's Notebook (SSR) + 3D WebGL UPLINK World
- 3D Engine: React Three Fiber, Three.js, Rapier 3D physics engine, procedural audio synthesizers
- Simulations: In-memory Raft Quorum leader election, 8-predicate Saga transaction FSM, 64-bit Snowflake Base62 encoder
- Privacy & Tracking: ZERO third-party marketing trackers, zero tracking pixels, zero cookies.`,
        });
        break;

      case "clear":
        setHistory([]);
        setCommand("");
        return;

      default:
        newHistory.push({
          type: "error",
          text: `ERROR: Unrecognized command '${cmd}'. Type 'help' for valid commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setCommand("");
  };

  return (
    <div
      role="dialog"
      aria-label="Developer In-Fiction Console"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#0A0B0D]/85 flex flex-col justify-start p-4 sm:p-8 font-mono"
    >
      <div className="w-full max-w-4xl mx-auto bg-[#111317] border border-[#2D3440] rounded-[2px] flex flex-col h-[75vh] max-h-[700px] overflow-hidden">
        {/* Console Header Bar */}
        <div className="p-3 bg-[#171B22] border-b border-[#1F242C] flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-[1px] bg-[#C86D32]" />
            <span className="text-[#E6E8EB] font-bold">UPLINK DEVELOPER CONSOLE</span>
            <span className="text-[#5A626E] hidden sm:inline">[ACCESSIBILITY & FAST TRAVEL]</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#878F99]">TOGGLE KEY: [ ` ]</span>
            <button
              onClick={onClose}
              className="text-[#878F99] hover:text-[#E6E8EB] px-2 py-0.5 border border-[#1F242C] hover:border-[#2D3440] rounded-[2px] text-xs"
            >
              CLOSE [ESC]
            </button>
          </div>
        </div>

        {/* Output Stream History */}
        <div
          tabIndex={0}
          aria-live="polite"
          className="flex-1 p-4 overflow-y-auto space-y-2 text-xs text-[#E6E8EB] focus:outline-none"
        >
          {history.map((entry, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {entry.type === "input" && (
                <span className="text-[#C86D32] font-semibold">{entry.text}</span>
              )}
              {entry.type === "output" && (
                <span className="text-[#E6E8EB]">{entry.text}</span>
              )}
              {entry.type === "error" && (
                <span className="text-[#C24545]">{entry.text}</span>
              )}
              {entry.type === "info" && (
                <span className="text-[#878F99]">{entry.text}</span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-[#1F242C] bg-[#0A0B0D] flex flex-wrap gap-2 text-[11px]">
          <span className="text-[#5A626E] py-0.5">QUICK:</span>
          {["goto broker", "goto payment", "goto shortener", "goto status", "contact", "list", "help"].map((q) => (
            <button
              key={q}
              onClick={() => {
                setCommand(q);
                inputRef.current?.focus();
              }}
              className="px-2 py-0.5 bg-[#171B22] border border-[#1F242C] hover:border-[#C86D32] hover:text-[#E6E8EB] text-[#878F99] rounded-[2px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Command Input Field with Arrow History & Tab Autocomplete */}
        <form onSubmit={handleCommandSubmit} className="p-3 bg-[#111317] border-t border-[#2D3440] flex items-center gap-2">
          <span className="text-[#C86D32] font-bold text-sm">{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type command ('goto broker', 'list', 'help') • [Tab] autocomplete..."
            className="flex-1 bg-transparent text-[#E6E8EB] focus:outline-none text-xs placeholder:text-[#5A626E]"
            aria-label="Console command prompt"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-[#C86D32] text-[#0A0B0D] font-bold text-xs rounded-[2px] hover:bg-[#e07b39]"
          >
            EXECUTE
          </button>
        </form>
      </div>
    </div>
  );
}

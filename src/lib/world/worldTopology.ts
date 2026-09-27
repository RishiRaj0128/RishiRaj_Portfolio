/**
 * WORLD TOPOLOGY SPECIFICATION — "UPLINK"
 * 3D Coordinate mapping, node definitions, and network conduits.
 */

export interface NetworkNodeDef {
  id: string;
  name: string;
  category: "gateway" | "status" | "flagship" | "waypoint" | "security" | "egress";
  position: [number, number, number];
  dockingRadius: number;
  label: string;
  sublabel: string;
  port?: string;
  status: "ACTIVE" | "PENDING_AUDIT" | "STANDBY" | "TRANSMITTING";
  description: string;
}

export interface ConduitDef {
  fromId: string;
  toId: string;
}

export const WORLD_BOUNDS = {
  maxRadius: 105,
  repulsionForce: 0.18,
};

export const NETWORK_NODES: NetworkNodeDef[] = [
  {
    id: "ingress",
    name: "Ingress Gateway",
    category: "gateway",
    position: [0, 0, 0],
    dockingRadius: 7.5,
    label: "INGRESS // ABOUT",
    sublabel: "HOST: RISHI RAJ • BOOT SEQUENCE",
    port: "PORT 80/443",
    status: "ACTIVE",
    description: "Primary system ingress. Visitor probe spawn coordinates. Backend distributed systems & DevOps portfolio.",
  },
  {
    id: "status",
    name: "Service Registry & Skills",
    category: "status",
    position: [-34, 0, -28],
    dockingRadius: 8.5,
    label: "STATUS // SERVICES",
    sublabel: "CORE SKILLS & TECH REGISTRY",
    port: "PORT 8500",
    status: "ACTIVE",
    description: "Operational skills matrix styled as live service health monitors across Languages, Cloud, Backend, and Data.",
  },
  {
    id: "broker",
    name: "Distributed Message Broker",
    category: "flagship",
    position: [-48, 0, 24],
    dockingRadius: 8.5,
    label: "FLAGSHIP // BROKER",
    sublabel: "RAFT QUORUM & ISR REPLICATION",
    port: "PORT 9092",
    status: "ACTIVE",
    description: "5-node Raft consensus cluster with client-side leader election state machine and zero loss verification.",
  },
  {
    id: "payment",
    name: "Payment Engine & Saga FSM",
    category: "flagship",
    position: [24, 0, 48],
    dockingRadius: 8.5,
    label: "FLAGSHIP // PAYMENT",
    sublabel: "SAGA FSM & ZERO-DRIFT LEDGER",
    port: "PORT 8443",
    status: "ACTIVE",
    description: "Distributed transaction coordinator with composed predicates, downstream failure rollback, and double-entry ledger.",
  },
  {
    id: "shortener",
    name: "URL Shortener & Telemetry",
    category: "flagship",
    position: [48, 0, -24],
    dockingRadius: 8.5,
    label: "FLAGSHIP // SHORTENER",
    sublabel: "BASE62 SNOWFLAKE & CACHE-ASIDE",
    port: "PORT 8080",
    status: "ACTIVE",
    description: "Real working Base62 short-code generator, click analytics telemetry, and collision-resistance proof.",
  },
  {
    id: "achievements",
    name: "Verified Benchmarks",
    category: "waypoint",
    position: [-16, 0, -52],
    dockingRadius: 8.0,
    label: "WAYPOINT // CREDENTIALS",
    sublabel: "LEETCODE • COGNITIA • DBMS",
    port: "PORT 2026",
    status: "ACTIVE",
    description: "Academic credentials, 100+ LeetCode DSA milestones, Cognitia finalist standing, and Infosys DBMS certification.",
  },
  {
    id: "security",
    name: "Security Postmortem",
    category: "security",
    position: [36, 0, -44],
    dockingRadius: 8.0,
    label: "SECURITY // POSTMORTEM",
    sublabel: "STRIX AUDIT [PRE-LAUNCH PENDING]",
    port: "PORT 9443",
    status: "PENDING_AUDIT",
    description: "Defensive architecture postmortem layout. Flagged pending real Strix penetration scan per launch guardrail.",
  },
  {
    id: "contact",
    name: "Egress Uplink Dish",
    category: "egress",
    position: [0, 0, 64],
    dockingRadius: 8.5,
    label: "EGRESS // TRANSMIT",
    sublabel: "DISPATCH PACKET • CONTACT FORM",
    port: "PORT 587",
    status: "TRANSMITTING",
    description: "Outbound packet transmission node. Secure contact form with honeypot spam protection, direct email, and socials.",
  },
];

export const NETWORK_CONDUITS: ConduitDef[] = [
  // Hub-and-spoke from Ingress
  { fromId: "ingress", toId: "status" },
  { fromId: "ingress", toId: "broker" },
  { fromId: "ingress", toId: "payment" },
  { fromId: "ingress", toId: "shortener" },
  { fromId: "ingress", toId: "contact" },
  // Perimeter ring conduits
  { fromId: "status", toId: "achievements" },
  { fromId: "achievements", toId: "security" },
  { fromId: "security", toId: "shortener" },
  { fromId: "shortener", toId: "payment" },
  { fromId: "payment", toId: "contact" },
  { fromId: "contact", toId: "broker" },
  { fromId: "broker", toId: "status" },
];

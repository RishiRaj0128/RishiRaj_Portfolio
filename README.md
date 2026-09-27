# "UPLINK" — Drivable Network Portfolio
**Operator: Rishi Raj | Backend Distributed Systems / DevOps / Cloud Architecture**

UPLINK is a fully navigable 3D portfolio world where the visitor pilots a data-packet probe through an abstract network-topology environment. Approaching a service node docks the probe and reveals that node's verified content, architecture benchmarks, and interactive simulation engines.

---

## Technical Stack & Primitives

- **Framework**: Next.js (App Router) + React 19 + TypeScript
- **3D Graphics & Physics**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Craft Flight Model**: Procedural hovercraft flight physics (momentum, drift, banking roll, thruster glow, soft boundary repulsion)
- **Overlay Panels**: Framer Motion for smooth 2D surface transitions
- **Styling**: Tailwind CSS + custom design tokens (`src/styles/tokens.ts`)
- **Typography**: `IBM Plex Mono` (telemetry, console, benchmarks) + `Public Sans` (headings & structural copy)
- **Audio**: Web Audio API procedural sound synthesizer (`src/lib/audio/soundFx.ts`) — user toggleable, polite, zero asset dependencies

---

## World Topology & Nodes

The world is an abstract network topology with 8 interconnected nodes:

1. **INGRESS // ABOUT** `[0, 0]` (Port 80/443)  
   Primary probe spawn point. Rishi Raj engineering profile, core philosophy, and host boot sequence telemetry.
2. **STATUS // SERVICES** `[-34, -28]` (Port 8500)  
   Operational skills matrix styled as live service health monitors across Core Languages, CS Fundamentals, Backend, Cloud/DevOps, Data, and ML/EDA.
3. **FLAGSHIP // MESSAGE BROKER** `[-48, 24]` (Port 9092)  
   5-node Raft consensus cluster with client-side leader election state machine, heartbeat failure detection, and idempotent producer.  
   *Verified stats*: Zero acknowledged loss across 50+ failure cycles, ~750ms write-availability restoration, zero duplicates across 10,000 retries, <200ms rebalance downtime.
4. **FLAGSHIP // PAYMENT ENGINE** `[24, 48]` (Port 8443)  
   Saga compensation workflow & transaction FSM. Composed 8-point predicate evaluation, downstream failure injection, and double-entry ledger with zero net drift.  
   *Honest AI scope*: Vector DBs (FAISS, ChromaDB) and LLMs were used strictly for semantic movie query search and routing; core transactions and ledger accounting are 100% deterministic Java/Spring Boot.
5. **FLAGSHIP // URL SHORTENER** `[48, -24]` (Port 8080)  
   Real working embedded Base62 short-code generator with 64-bit Snowflake IDs, live click analytics, cache-aside latency tracking, synthetic bot detection, and collision-resistance test.  
   *Verified past stats*: 1M collision-free codes under stress test, sub-50ms redirects at 5,000 events/sec, 92% synthetic bot detection, ~65% latency reduction via Redis.
6. **WAYPOINT // ACHIEVEMENTS** `[-16, -52]` (Port 2026)  
   Factual benchmarks: 100+ LeetCode DSA problems solved, Top 25/200 teams at Cognitia (LPU), Infosys Springboard DBMS certification, and B.Tech CSE at Lovely Professional University (CGPA 7.98).
7. **SECURITY // POSTMORTEM** `[36, -44]` (Port 9443)  
   Security architecture postmortem layout. Flagged pending real Strix penetration scan per launch guardrail.
8. **EGRESS // TRANSMIT** `[0, 64]` (Port 587)  
   High-gain transmitter dish. Defensive contact form with honeypot spam protection, timing validation, direct email (`rishiraj02989@gmail.com`), GitHub, LinkedIn, and cURL generator.

---

## Navigation & Controls

### Flight Controls (Primary Navigation)
- **[W] / [Arrow Up]**: Forward thrust
- **[S] / [Arrow Down]**: Reverse / Brake
- **[A] / [Arrow Left]**: Steer left (gentle banking roll)
- **[D] / [Arrow Right]**: Steer right (gentle banking roll)
- **Proximity Docking**: Approach within ~8 meters of any node to auto-dock and open its section overlay.
- **[ESC]**: Resume flight / undock from current node.
- **Mobile Touch Controls**: On-screen twin virtual controls (Thrust + Steer) appear on touch/mobile viewports.

### Developer Console (Accessibility & Fast Travel)
Press the backtick key (**`**) or click the **CONSOLE** button in the HUD header to open the Quake/Half-Life-style terminal overlay. This is the sanctioned non-flight accessibility route through the site.

Supported commands:
```bash
goto <node-name>   # Teleport probe directly to node and open overlay (e.g. goto broker, goto payment)
list               # List all 8 network nodes with coordinates and ports
contact            # Teleport directly to Egress transmission node and open contact form
resume             # Download / open Rishi Raj engineering resume
terms              # View Terms of Service
privacy            # View Privacy Policy
clear              # Clear terminal output buffer
help               # List all supported commands
```

---

## Remaining [PLACEHOLDER] Items (Pre-Launch Checklist)

In strict adherence to the project guardrails, the following items are explicitly marked as placeholders pending production links:

- [ ] **GitHub Repository URLs**:
  - Distributed Message Broker repo: `[PLACEHOLDER]`
  - Payment Engine / Movie Booking repo: `[PLACEHOLDER]`
  - URL Shortener repo: `[PLACEHOLDER]`
- [ ] **Real Strix Security Audit**:
  - The Security Node is currently marked as `[PLACEHOLDER: PENDING REAL STRIX AUDIT]` in compliance with Rule #33. Execute `strix` against Rishi's production repository and populate actual findings prior to public launch.
- [ ] **Contact Email Dispatch**:
  - Production deployment should wire `RESEND_API_KEY` in environment variables for live SMTP email dispatch.

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/RishiRaj0128/RishiRaj_Portfolio.git
cd RishiRaj_Portfolio

# Install dependencies
npm install

# Run unit tests
npm test

# Run Next.js local development server
npm run dev
```

Visit `http://localhost:3000` to pilot the probe through UPLINK.

### Production Build

```bash
npm run build
npm run start
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

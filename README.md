# Rishi Raj — Portfolio & Systems Engineering Notebook
**Operator: Rishi Raj | Backend Distributed Systems / Fault Tolerance / DevOps**

> "Rishi builds the behind-the-scenes systems that keep apps from crashing, losing data, or charging customers twice."

A high-performance portfolio engineered with a dual presentation architecture:
1. **The Engineer's Notebook (Default)**: A server-rendered, indexable, fast, accessible page styled like a well-kept technical notebook (warm cream paper, deep ink typography, blueprint SVG line schematics, margin notes, highlighter accents, and a signature 3-way audience switch).
2. **UPLINK Explore Mode (`/explore`)**: An interactive 3D WebGL network topology world where visitors pilot a data-packet probe through interconnected cluster nodes.

---

## 1. Technical Stack & Architecture

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + custom warm cream notebook and dark mode tokens
- **Typography**: 
  - Headlines & Margin Notes: `Newsreader` (editorial serif)
  - Body Copy: `Public Sans` (18px minimum for readability)
  - Telemetry & Metrics: `IBM Plex Mono`
- **Simulations**: Pure TypeScript distributed systems state machines (Raft Quorum Leader Election, Saga FSM with idempotency and compensation rollback, 64-bit Snowflake Base62 URL shortener)
- **3D World (`/explore`)**: Three.js + React Three Fiber + Drei + Rapier 3D physics (lazy-loaded with `next/dynamic` to ensure 0 WebGL payload on the home page)
- **Email Ingress**: Next.js Serverless Route (`/api/contact`) protected by honeypot, request velocity checks, in-memory rate limiting, and optional Resend dispatch
- **Privacy Guarantee**: Zero tracking cookies, zero third-party analytics pixels, zero behavioral scripts

---

## 2. Signature Features

### Three-Way Audience Switch (Simple | Recruiter | Engineer)
A persistent control in the notebook header that dynamically switches copy across the site:
- **Simple**: Plain English everyday analogies with zero technical jargon.
- **Recruiter**: Impact first, verified empirical results, core languages, and tools.
- **Engineer**: Exact architecture, state machine transitions, algorithms, and numbers.
- **Shareable & Accessible**: URL reflects mode via `?view=engineer`, persists in `localStorage`, and announces transitions via `aria-live`.
- **Jargon Tooltips**: In Simple and Recruiter modes, technical terms can be tapped or hovered for instant 1-line plain definitions.

### "Break It" Interactive Server Comparison
Located in the hero section, this demo runs real simulation code side by side:
- **Without Reliable Systems**: When the server crashes, in-flight orders vanish and a retrying customer is billed twice.
- **With Systems Like I Build**: Heartbeat detects the outage, Raft Quorum elects a standby leader in ~750ms, the Saga compensator rolls back uncommitted steps, and orders survive with zero duplicate charges.
- **Computed Metrics**: Counters (orders lost, duplicates blocked, failover time) are calculated in real time by the underlying simulation engines, not hard-coded constants.

### "What Happens When You Press Pay" (Scroll Story)
A chapter-based journey tracking a payment through six critical stages:
1. **Client Ingress (App)**: Attaching an atomic idempotency key to prevent double clicks.
2. **Message Broker (Queue)**: Appending to a 5-node cluster with Raft Quorum replication.
3. **Validation Engine (Check)**: 8 domain predicates evaluated in a single pass.
4. **Payment Gateway (Bank)**: Saga orchestrator executing compensating actions on timeout.
5. **Audit Ledger (Ledger)**: Double-entry accounting with $0.00 net balance drift.
6. **URL Shortener (Receipt)**: 64-bit Snowflake ID packed into a 7-character Base62 code.

### Editorial Project Presentation
Rather than three equal cards in a row, projects are presented in an editorial layout (one large featured project, two stacked entries) with three distinct layers:
1. **Layer A**: Plain English analogy.
2. **Layer B**: 2–3 sentences on what was built.
3. **Layer C**: Collapsible technical details, exact verified metrics, and stack tags.
4. **Live Embedded Demos**: Functional controls to crash the leader, inject bank timeouts, and generate shortened links directly on the page.

---

## 3. Verified Benchmark Numbers (Simulated Tests)

All metrics displayed across the portfolio represent empirical results from the owner's simulated tests:

| System | Verified Metric | Test Context |
| :--- | :--- | :--- |
| **Payment Engine** | All 8 checks passed in 1 pass | Composed predicate chain evaluation |
| **Payment Engine** | Zero duplicate charges | 10,000 concurrent retry attempts |
| **Payment Engine** | 100% rejection | 50+ out-of-order illegal state transitions |
| **Payment Engine** | ~300ms compensation | Downstream gateway timeout rollback |
| **Payment Engine** | Zero net drift ($0.00) | 5,000+ double-entry ledger records |
| **Message Broker** | Zero acknowledged loss | 50+ leader failure cycles |
| **Message Broker** | ~750ms recovery | Write-availability restoration |
| **Message Broker** | Zero duplicates | 10,000 simulated producer retries |
| **Message Broker** | <200ms rebalance | Partition reassignment across 5 nodes |
| **URL Shortener** | 1,000,000 collision-free codes | Continuous Snowflake stress test |
| **URL Shortener** | Sub-50ms redirects | 5,000 events/second with Redis cache-aside |
| **URL Shortener** | 92% bot detection | Synthetic crawler traffic classification |

---

## 4. How to Edit Content per Audience Level

All portfolio copy is centralized in a single typed content file:
`src/lib/content/portfolioContent.ts`

To update copy for any project, hero statement, or story stop, locate the corresponding object and edit the `simple`, `recruiter`, or `engineer` property:

```typescript
headline: {
  simple: "Behind-the-scenes systems built so apps never crash...",
  recruiter: "Backend & Distributed Systems Engineer specializing in fault tolerance...",
  engineer: "Designing idempotent transaction engines, Raft consensus brokers..."
}
```

TypeScript ensures that all three versions are present and properly typed.

---

## 5. Running & Testing Locally

```bash
# Clone the repository
git clone https://github.com/RishiRaj0128/RishiRaj_Portfolio.git
cd RishiRaj_Portfolio

# Install dependencies
npm install

# Run all simulation unit tests (Message Broker, Saga FSM, Snowflake Base62, Break-it demo)
npm test

# Run development server
npm run dev

# Build production bundle (SSG / SSR validation)
npm run build
```

---

## 6. Screenshot Regeneration Script

Project previews can be captured at 1440x900 using the committed Playwright script:

```bash
# Run screenshot capture script
node scripts/capture-screenshots.mjs
```

Screenshots are saved directly to `/public/projects/`.

---

## 7. Remaining [PLACEHOLDER] Items Checklist

The following items are designated placeholders for the owner to drop in:

- [ ] **Owner's Headshot Photo**: Drop `rishi.jpg` into `/public/rishi.jpg`. The site automatically detects it and crops it to a plain rectangle with a 1px border.
- [ ] **About Paragraph**: Personalize `PORTFOLIO_CONTENT.about.paragraph` in `src/lib/content/portfolioContent.ts` with Rishi's exact words.
- [ ] **Target Roles**: Adjust `PORTFOLIO_CONTENT.personal.openToRoles` if new roles or target locations are desired.
- [ ] **Message Broker Repository**: Replace the private repository note with the public URL when open-sourced.
- [ ] **URL Shortener Repository**: Replace the private repository note with the public URL when open-sourced.
- [ ] **Strix Penetration Audit**: Run `strix` against Rishi's production repository and populate actual findings in `PORTFOLIO_CONTENT.securityStatus`.
- [ ] **Production Email API Key**: Set `RESEND_API_KEY` in environment variables (`.env.local`) for live email delivery via `POST /api/contact`.
- [ ] **Custom Domain**: Bind custom domain to Vercel/Netlify hosting configuration.

---

## 8. License

MIT License • Copyright (c) 2026 Rishi Raj.

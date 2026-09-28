export type AudienceMode = "simple" | "recruiter" | "engineer";

export interface JargonTerm {
  term: string;
  definition: string;
}

export interface StoryStop {
  id: string;
  stepNumber: number;
  title: Record<AudienceMode, string>;
  componentName: string;
  whatCouldGoWrong: Record<AudienceMode, string>;
  whatPreventsIt: Record<AudienceMode, string>;
  projectLinkId: "payment" | "broker" | "shortener";
  diagramType: "app" | "queue" | "check" | "bank" | "ledger" | "receipt";
  marginNote?: string;
}

export interface ProjectContent {
  id: "payment" | "broker" | "shortener";
  title: Record<AudienceMode, string>;
  tagline: Record<AudienceMode, string>;
  analogy: string; // Plain English analogy
  whatIBuilt: Record<AudienceMode, string[]>;
  liveUrl?: string;
  repoUrl?: string;
  isPrivateRepo?: boolean;
  incidentLogUrl?: string;
  technologies: string[];
  verifiedMetrics: {
    stat: string;
    label: string;
    sublabel: string;
  }[];
  llmArchitectureNote?: string;
  diagramType: "broker" | "payment" | "shortener";
  storyChapterNumber: number;
  imageCaption: string;
  imageSrc: string;
}

export interface SkillCategory {
  categoryName: string;
  description: string;
  skills: {
    name: string;
    levelOrNote?: string;
    jargonKey?: string;
  }[];
}

export interface TimelineEntry {
  period: string;
  role: string;
  organization: string;
  location?: string;
  type: "internship" | "education" | "achievement" | "certification";
  highlights: string[];
}

export const JARGON_DICTIONARY: Record<string, string> = {
  "idempotency": "Making sure an action happens only once, even if a user or system retries it five times.",
  "idempotent": "Safe to repeat without unintended side effects like billing twice.",
  "raft quorum": "A consensus rule where a majority of servers must agree before saving data or picking a new leader.",
  "leader election": "When the main server crashes, the other servers vote automatically to pick a replacement in milliseconds.",
  "saga pattern": "A sequence of steps with matching 'undo' actions if any step fails midway.",
  "compensation": "An automatic undo step that restores balances or unlocks inventory when an operation fails.",
  "base62": "Converting numbers into short strings using 0-9, a-z, and A-Z (like Bitly link codes).",
  "snowflake id": "A 64-bit unique number generated using timestamp, machine ID, and sequence counter.",
  "in-sync replicas": "Backup servers that have received every piece of data up to the current second.",
  "double-entry ledger": "An accounting log where every debit has an equal credit, preventing money from vanishing.",
  "redis cache-aside": "Checking fast memory first, and only querying the slow database if data isn't cached.",
  "faiss/chromadb": "Special databases that search by meaning rather than exact keywords (e.g. finding 'tense space drama').",
  "minikube/k3s": "Lightweight, container-orchestration environments for running microservices reliably.",
  "prometheus/grafana": "Telemetry collectors and dashboards that alert engineers before servers run out of memory.",
  "rest api": "Standard web protocols apps use to ask servers for data or trigger actions.",
  "oauth": "A secure industry standard for logging in without sharing passwords.",
  "terraform": "Writing computer code that automatically sets up cloud servers and networks.",
  "docker": "Packaging code with all its dependencies so it runs identically on any computer.",
};

export const PORTFOLIO_CONTENT = {
  personal: {
    name: "Rishi Raj",
    email: "rishiraj02989@gmail.com",
    linkedin: "https://www.linkedin.com/in/rishiraj28/",
    github: "https://github.com/RishiRaj0128",
    education: "B.Tech CSE, Lovely Professional University (CGPA 7.98, 2024 to present)",
    openToRoles: [
      "Distributed Systems Intern",
      "Backend Engineering Intern",
      "Cloud Infrastructure / DevOps Intern"
    ],
    statusMessage: "Open to internships & freelance work",
  },

  hero: {
    promise: "Rishi builds the behind-the-scenes systems that keep apps from crashing, losing data, or charging customers twice.",
    headline: {
      simple: "Behind-the-scenes systems built so apps never crash, lose orders, or double-bill.",
      recruiter: "Backend & Distributed Systems Engineer specializing in fault tolerance, high concurrency, and zero data loss.",
      engineer: "Designing idempotent transaction engines, Raft-based consensus brokers, and high-throughput microservices in Java & C++."
    },
    subhead: {
      simple: "Most software breaks when thousands of people click at once or a server dies. I build the safety nets, automatic undos, and queue systems that keep everything running smoothly.",
      recruiter: "B.Tech Computer Science student at LPU (CGPA 7.98) with AI/ML internship experience at Edunet (IBM SkillsBuild), 100+ LeetCode problems, and empirically verified distributed simulation engines.",
      engineer: "Implementing double-entry saga FSMs with zero net drift, Raft quorum leader elections with <750ms recovery, and 64-bit Snowflake Base62 generators with zero collisions."
    },
  },

  breakItDemo: {
    tagline: "INTERACTIVE CRASH COMPARISON",
    title: "Watch what happens when a checkout server drops offline",
    subtitle: "Compare a standard fragile web architecture against an idempotent, fault-tolerant distributed system.",
    buttonCrash: "Crash the server",
    buttonReset: "Run again with randomized timing",
    simulationLabel: "Simulation running genuine distributed consensus & saga compensation code",
    withoutSystem: {
      title: "Without reliable systems",
      subtitle: "Standard direct HTTP calls & naive database writes",
      description: "When the server drops, in-flight orders vanish into thin air, and anxious shoppers who refresh the page get charged twice.",
    },
    withSystem: {
      title: "With systems like I build",
      subtitle: "Idempotent payment saga + quorum leader failover",
      description: "A heartbeat detects the crash, elects a standby replica in ~750ms, safely compensates partial charges, and recovers every customer order.",
    },
  },

  storyStops: [
    {
      id: "stop-1",
      stepNumber: 1,
      title: {
        simple: "1. The App: You click 'Pay $40'",
        recruiter: "1. Client Ingress: User initiates payment authorization",
        engineer: "1. Ingress Layer: Client generates atomic idempotency token & dispatches payload"
      },
      componentName: "Client Ingress",
      whatCouldGoWrong: {
        simple: "If your phone signal drops or you double-tap the button in panic, the app might accidentally send two payments.",
        recruiter: "Network flakiness and impatient retries risk firing duplicate HTTP POST requests into payment gateways.",
        engineer: "Network partition or user retries can cause identical payload replays, triggering concurrent un-isolated mutations."
      },
      whatPreventsIt: {
        simple: "Every request gets an invisible, unique stamp before it leaves your phone. If a duplicate arrives, the server recognizes it and ignores the repeat.",
        recruiter: "Atomic idempotency keys register each intent once, ensuring repeated requests return the original receipt with zero duplicate charges.",
        engineer: "Client attaches a 128-bit UUID idempotency token cached atomically in memory/Redis before any downstream RPC execution."
      },
      projectLinkId: "payment",
      diagramType: "app",
      marginNote: "first defense: stop double clicks at the door",
    },
    {
      id: "stop-2",
      stepNumber: 2,
      title: {
        simple: "2. The Queue: Stashing the order safely",
        recruiter: "2. Message Broker: Durable event queuing & log replication",
        engineer: "2. Broker Ingestion: Append-only log with Raft quorum ISR replication"
      },
      componentName: "Distributed Message Broker",
      whatCouldGoWrong: {
        simple: "If the main server loses power while accepting thousands of tickets, unprocessed orders could vanish completely.",
        recruiter: "A sudden traffic spike or hardware outage can wipe volatile memory, causing permanent transaction loss.",
        engineer: "Hardware failure during leader node execution can drop in-flight packets if uncommitted to a quorum of replicas."
      },
      whatPreventsIt: {
        simple: "The order is copied across five standby nodes before telling you 'received'. If the leader crashes, another node takes over in 0.75 seconds.",
        recruiter: "My distributed message broker uses Raft quorum replication (majority 3 of 5) to guarantee zero acknowledged message loss.",
        engineer: "The producer requires an ISR ack (all 3 quorum replicas written to disk) before advancing sequence offsets, surviving 50+ failure cycles."
      },
      projectLinkId: "broker",
      diagramType: "queue",
      marginNote: "data copied 3 times before we say OK",
    },
    {
      id: "stop-3",
      stepNumber: 3,
      title: {
        simple: "3. The Check: Verifying the rules",
        recruiter: "3. Business Predicates: Composed validation engine",
        engineer: "3. Validation FSM: Composed Predicate evaluation & state verification"
      },
      componentName: "Validation & Predicate Engine",
      whatCouldGoWrong: {
        simple: "Two people might try to buy the exact same cinema seat at the exact same fraction of a second.",
        recruiter: "Race conditions during high-demand drops can double-sell seats or bypass checkout expiration timers.",
        engineer: "Concurrent non-deterministic requests can cause inventory contention, negative wallet balance, or session TTL overruns."
      },
      whatPreventsIt: {
        simple: "All eight rules (seat availability, balance, timers, fraud checks) are tested in a single fast pass before touching any bank.",
        recruiter: "A composed predicate chain evaluates 8 domain validations simultaneously, rejecting illegal transitions with 100% accuracy.",
        engineer: "Deterministic predicate composition runs in O(1) time complexity, gating state transition to SEATS_RESERVED before payment invocation."
      },
      projectLinkId: "payment",
      diagramType: "check",
      marginNote: "8 checks in 1 pass, no race conditions",
    },
    {
      id: "stop-4",
      stepNumber: 4,
      title: {
        simple: "4. The Bank: Reaching the card network",
        recruiter: "4. Gateway Integration: Resilient payment authorization & timeout handling",
        engineer: "4. Payment Gateway: Distributed Saga orchestrator with automatic compensation"
      },
      componentName: "Payment Gateway & Saga Orchestrator",
      whatCouldGoWrong: {
        simple: "The bank takes your money, but the cinema server crashes before issuing the ticket. You are out $40 with no seat.",
        recruiter: "External banking API timeouts can leave distributed transactions in an inconsistent, half-completed state.",
        engineer: "Downstream third-party HTTP gateway timeouts (504s) trigger partial commit states across seat inventory and user accounts."
      },
      whatPreventsIt: {
        simple: "An automatic 'undo stamp' (the Saga pattern) detects the timeout, rolls back the seat lock, and refunds your money in ~300ms.",
        recruiter: "Saga compensation state machine reverses partial transactions in ~300ms, restoring total system balance automatically.",
        engineer: "On failure injection or gateway drop, orchestrator transitions state to COMPENSATING, executing compensating REST actions across all services."
      },
      projectLinkId: "payment",
      diagramType: "bank",
      marginNote: "if bank times out, undo reverses in ~300ms",
    },
    {
      id: "stop-5",
      stepNumber: 5,
      title: {
        simple: "5. The Ledger: Writing the permanent record",
        recruiter: "5. Audit Ledger: Double-entry financial accounting",
        engineer: "5. Double-Entry Accounting: Append-only ledger with zero drift guarantees"
      },
      componentName: "Financial Ledger",
      whatCouldGoWrong: {
        simple: "Money numbers can get rounded or recorded in one table but not another, leaving accounting out of balance.",
        recruiter: "Database write errors or unhandled edge cases can result in financial reconciliation discrepancies and audit failures.",
        engineer: "Single-sided balance mutations or asynchronous race conditions introduce reconciliation drift between user float and clearinghouse."
      },
      whatPreventsIt: {
        simple: "Every cent deducted from one account must be added to another in a tamper-proof log. In over 5,000 entries, net error is exactly zero.",
        recruiter: "Double-entry bookkeeping guarantees that total debits equal total credits with zero net balance drift across thousands of entries.",
        engineer: "Strict debit/credit invariant validation: sum(DEBIT) === sum(CREDIT), verified across 5,000+ simulated ledger transactions."
      },
      projectLinkId: "payment",
      diagramType: "ledger",
      marginNote: "every debit matches a credit. net drift = $0.00",
    },
    {
      id: "stop-6",
      stepNumber: 6,
      title: {
        simple: "6. The Receipt: Creating a tiny shareable link",
        recruiter: "6. Egress & Shortening: High-throughput URL shortening & telemetry",
        engineer: "6. Link Generation: 64-bit Snowflake ID & Base62 encoding engine"
      },
      componentName: "URL Shortener & Telemetry",
      whatCouldGoWrong: {
        simple: "The confirmation link is 120 characters long, hard to text, slow to open, or counted by bots rather than real humans.",
        recruiter: "Unoptimized redirect redirects increase latency, and crawler bots pollute engagement metrics.",
        engineer: "Hash collisions in naive shorteners overwrite previous records, while slow database queries throttle redirect throughput."
      },
      whatPreventsIt: {
        simple: "A tiny 7-character code is generated from a 64-bit counter that never collides. Real clicks are counted while filtering 92% of bots.",
        recruiter: "Base62 Snowflake algorithm guarantees 1M collision-free codes, sub-50ms Redis redirects, and 92% synthetic bot detection.",
        engineer: "Bit-packed 64-bit Snowflake ID (time + worker + seq) mapped to Base62, backed by Redis cache-aside reducing lookup latency by ~65%."
      },
      projectLinkId: "shortener",
      diagramType: "receipt",
      marginNote: "64-bit snowflake ID converted into 7 characters",
    }
  ] as StoryStop[],

  projects: [
    {
      id: "payment",
      storyChapterNumber: 1,
      title: {
        simple: "Payment Engine & Movie Booking System",
        recruiter: "Payment Engine: Fault-Tolerant Saga Orchestration",
        engineer: "Distributed Saga Payment Engine & Deterministic State Machine"
      },
      tagline: {
        simple: "The system that guarantees you never get charged twice for a movie ticket.",
        recruiter: "Spring Boot microservice with atomic idempotency, 8-check predicate validation, and zero ledger drift.",
        engineer: "Double-entry append-only ledger, composed predicate chains, and Saga compensation under failure injection."
      },
      analogy: "Like an automatic undo stamp on a paper contract: if the payment fails halfway through, the system reverses every step so nobody loses money.",
      whatIBuilt: {
        simple: [
          "Built a booking checkout system where all 8 business rules (seats, balances, fraud scores, time limits) are evaluated before charging your card.",
          "Added an automatic rollback mechanism: if the banking network drops during checkout, your seats are released and partial charges are refunded within 0.3 seconds.",
          "Tested with 10,000 simulated double-clicks and repeated requests, proving zero duplicate charges were ever processed."
        ],
        recruiter: [
          "Engineered a production-hardened payment and movie reservation backend in Java and Spring Boot with MySQL and Redis.",
          "Implemented atomic idempotency keys that successfully blocked 100% of duplicate charges across 10,000 concurrent retry attempts.",
          "Designed a double-entry financial ledger verified across 5,000+ entries with zero net balance drift."
        ],
        engineer: [
          "Designed an explicit Finite State Machine governing transaction lifecycle (INITIALIZED → SEATS_RESERVED → PAYMENT_PENDING → CONFIRMED/COMPENSATED) that rejects 100% of illegal state jumps.",
          "Architected a Saga compensation orchestrator that detects downstream gateway timeouts and initiates compensating transactions within ~300ms.",
          "Maintained a double-entry append-only accounting ledger with invariant sum(DEBIT) === sum(CREDIT) across 5,000+ transactions."
        ]
      },
      liveUrl: "https://coruscating-eclair-2724dd.netlify.app/",
      repoUrl: "https://github.com/RishiRaj0128/Cinebook-Movie-Booking-Platform_Rishi_Raj",
      incidentLogUrl: "https://github.com/RishiRaj0128/Cinebook-Movie-Booking-Platform_Rishi_Raj/blob/main/INCIDENTS.md",
      technologies: ["Java", "Spring Boot", "MySQL", "Redis", "REST APIs", "FAISS / ChromaDB (Semantic Search)"],
      verifiedMetrics: [
        { stat: "all 8 checks", label: "Validation checks", sublabel: "surfaced in one fast pass" },
        { stat: "zero duplicate charges", label: "Concurrent retries", sublabel: "across 10,000 simulated attempts" },
        { stat: "100% rejection", label: "Illegal transitions", sublabel: "of 50+ out-of-order state transitions" },
        { stat: "~300ms rollback", label: "Saga compensation", sublabel: "compensation reversal on timeout" },
        { stat: "zero net drift", label: "Financial ledger", sublabel: "across 5,000+ double-entry records" },
        { stat: "3 documented incidents", label: "Failure injection", sublabel: "empirically resolved postmortems" }
      ],
      llmArchitectureNote: "Honest Scope Note: Vector DBs (FAISS and ChromaDB) and LLM APIs in this project are strictly used for semantic natural-language movie search and query routing (matching user preferences like 'dark psychological thrillers' to screening embeddings). The core payment processing, ledger accounting, and Saga state machine are strictly deterministic Java/Spring Boot systems.",
      diagramType: "payment",
      imageCaption: "Live app • Cinebook Movie Booking Frontend",
      imageSrc: "/projects/cinebook-preview.webp"
    },
    {
      id: "broker",
      storyChapterNumber: 2,
      title: {
        simple: "Distributed Message Broker",
        recruiter: "Distributed Message Broker: Raft Consensus Cluster",
        engineer: "Quorum-Replicated Message Broker & ISR State Machine"
      },
      tagline: {
        simple: "A post office that keeps delivering mail even if the main building catches fire.",
        recruiter: "5-node Java cluster with Raft leader election, ~750ms failover, and zero acknowledged message loss.",
        engineer: "Partitioned commit log, ISR heartbeat monitor, and idempotent sequence deduplication in pure Java."
      },
      analogy: "Like a post office with five branches constantly copying each other's mailbags. Even if the central branch suddenly shuts down, another one steps up immediately without losing a single letter.",
      whatIBuilt: {
        simple: [
          "Built a 5-server network that queues customer orders and system events so they are never lost when traffic surges.",
          "Programmed an automatic voting system: if the leader server dies, the remaining four servers detect it and elect a new leader in 0.75 seconds.",
          "Simulated over 50 complete server failure cycles, proving zero acknowledged messages were ever lost."
        ],
        recruiter: [
          "Engineered a distributed message queue in Java using multithreading and socket programming with Prometheus/Grafana telemetry.",
          "Achieved ~750ms write-availability recovery during leader node failure using Quorum ISR election.",
          "Eliminated duplicate message delivery across 10,000 simulated producer retries via sequence deduplication."
        ],
        engineer: [
          "Implemented Raft consensus quorum (majority 3 of 5) with dynamic In-Sync Replicas (ISR) tracking and heartbeat failure detection.",
          "Constructed idempotent producer pipeline indexing `${producerId}-${partition}` sequence offsets to suppress duplicate retries.",
          "Dynamic consumer group rebalancing completing partition reassignment in <200ms across 5 nodes."
        ]
      },
      isPrivateRepo: true,
      repoUrl: undefined,
      technologies: ["Java", "Multithreading", "Socket Programming", "Prometheus", "Grafana", "Docker", "YAML"],
      verifiedMetrics: [
        { stat: "zero acknowledged loss", label: "Message durability", sublabel: "across 50+ failure cycles" },
        { stat: "~750ms recovery", label: "Leader election", sublabel: "write-availability restored" },
        { stat: "zero duplicates", label: "Idempotent producer", sublabel: "across 10,000 simulated retries" },
        { stat: "<200ms rebalance", label: "Consumer group", sublabel: "downtime across 5 cluster nodes" },
        { stat: "15+ commands reduced", label: "DevOps automation", sublabel: "to one config apply" },
        { stat: "~30s early warning", label: "Telemetry alert", sublabel: "under-replication warning in Grafana" }
      ],
      diagramType: "broker",
      imageCaption: "Architecture sketch • 5-Node Quorum Consensus Cluster",
      imageSrc: "/projects/broker-preview.webp"
    },
    {
      id: "shortener",
      storyChapterNumber: 3,
      title: {
        simple: "URL Shortener & Real Click Analytics",
        recruiter: "URL Shortener: Snowflake Base62 Microservice",
        engineer: "High-Throughput Base62 Snowflake Generator & Telemetry Engine"
      },
      tagline: {
        simple: "Turns long URLs into tiny, collision-free links and tracks every real click.",
        recruiter: "Spring Boot, Redis, and MySQL service generating collision-free 64-bit IDs with sub-50ms cached redirects.",
        engineer: "Bit-packed Snowflake ID scheme, Base62 encoding, and Redis cache-aside reducing latency by ~65%."
      },
      analogy: "Like a high-speed coat check at a concert: it trades your bulky winter coat for a tiny brass token, and returns the exact coat the moment you hand it back.",
      whatIBuilt: {
        simple: [
          "Built a link shortener that compresses long URLs into short 7-letter codes using a unique time-based mathematical formula.",
          "Added real-time click counting that spots crawler bots and filters them out so you only see genuine human clicks.",
          "Connected a high-speed memory cache (Redis) that serves link clicks in under 50 milliseconds."
        ],
        recruiter: [
          "Built a production-grade URL shortener with Spring Boot, Redis, and MySQL, featuring real-time bot telemetry.",
          "Stress-tested with 1,000,000 generated short codes with zero collisions using a 64-bit Snowflake generator.",
          "Implemented Redis cache-aside architecture, achieving ~65% redirect latency reduction."
        ],
        engineer: [
          "Engineered 64-bit Snowflake ID generator (41 bits timestamp delta + 10 bits worker ID + 12 bits sequence) mapped to Base62 alphanumeric set.",
          "Benchmarked sub-50ms redirect response times under 5,000 simulated requests/second with cache-aside Redis lookups.",
          "Automated synthetic bot classification filtering 92% of automated crawler traffic based on User-Agent heuristics and request velocity."
        ]
      },
      isPrivateRepo: true,
      repoUrl: undefined,
      technologies: ["Java", "Spring Boot", "Redis", "MySQL", "REST APIs", "Base62 Encoding", "Snowflake Scheme"],
      verifiedMetrics: [
        { stat: "1M collision-free", label: "Snowflake generation", sublabel: "under continuous stress test" },
        { stat: "sub-50ms redirects", label: "Response latency", sublabel: "at 5,000 events/sec throughput" },
        { stat: "92% bot detection", label: "Traffic classification", sublabel: "synthetic crawler filtering" },
        { stat: "~65% latency drop", label: "Redis cache-aside", sublabel: "compared to direct DB queries" }
      ],
      diagramType: "shortener",
      imageCaption: "Live interactive tool • Base62 link shortener running below",
      imageSrc: "/projects/shortener-preview.webp"
    }
  ] as ProjectContent[],

  skills: [
    {
      categoryName: "Languages I write",
      description: "Core languages used for systems programming, concurrency, and algorithms.",
      skills: [
        { name: "Java", levelOrNote: "Multithreading, Spring Boot, Socket Programming", jargonKey: "spring boot" },
        { name: "C++", levelOrNote: "Data structures, memory models, low-level optimization" },
        { name: "Python", levelOrNote: "FastAPI, script automation, data pipelines", jargonKey: "fastapi" }
      ]
    },
    {
      categoryName: "Tools that keep apps running",
      description: "Architecture patterns and frameworks built to prevent downtime.",
      skills: [
        { name: "Spring Boot", levelOrNote: "Enterprise microservices, FSMs", jargonKey: "spring boot" },
        { name: "FastAPI", levelOrNote: "High-throughput asynchronous APIs", jargonKey: "rest api" },
        { name: "Distributed Systems Basics", levelOrNote: "Consensus, replication, partitioning", jargonKey: "raft quorum" },
        { name: "Saga Pattern & FSMs", levelOrNote: "Compensating transactions, idempotency", jargonKey: "saga pattern" },
        { name: "REST APIs & OAuth", levelOrNote: "Standardized protocols, secure auth", jargonKey: "oauth" }
      ]
    },
    {
      categoryName: "Where I deploy & automate",
      description: "Cloud platforms, infrastructure as code, and continuous deployment.",
      skills: [
        { name: "Docker", levelOrNote: "Containerization & multi-stage builds", jargonKey: "docker" },
        { name: "Kubernetes (Minikube / k3s)", levelOrNote: "Local clusters, ingress, replica sets", jargonKey: "minikube/k3s" },
        { name: "Terraform", levelOrNote: "Declarative cloud infrastructure provisioning", jargonKey: "terraform" },
        { name: "GitHub Actions & Argo CD", levelOrNote: "Automated test suites & GitOps continuous delivery" },
        { name: "Prometheus & Grafana", levelOrNote: "Cluster health metrics & anomaly alert rules", jargonKey: "prometheus/grafana" },
        { name: "Cloud Platforms", levelOrNote: "AWS, GCP, Oracle Cloud Infrastructure (OCI)" },
        { name: "Linux Administration", levelOrNote: "Shell scripting, networking, systemd processes" }
      ]
    },
    {
      categoryName: "Where data lives",
      description: "Persistent storage, transactional stores, and in-memory caches.",
      skills: [
        { name: "PostgreSQL & MySQL", levelOrNote: "ACID compliance, index tuning, transaction isolation", jargonKey: "double-entry ledger" },
        { name: "Redis", levelOrNote: "Cache-aside lookups, atomic counters, TTL eviction", jargonKey: "redis cache-aside" },
        { name: "MongoDB", levelOrNote: "Document store, flexible schema ingestion" },
        { name: "NumPy & Pandas", levelOrNote: "Data frame transformation & telemetry analysis" },
        { name: "FAISS & ChromaDB", levelOrNote: "Vector similarity search for semantic queries", jargonKey: "faiss/chromadb" }
      ]
    }
  ] as SkillCategory[],

  principles: [
    {
      title: "1. I break things on purpose to test them",
      description: "A system isn't proven reliable because it works on a sunny afternoon. I inject network timeouts, drop leader nodes midway through checkout, and replay duplicate requests until the recovery logic is bulletproof."
    },
    {
      title: "2. I measure results empirically",
      description: "No vague claims like 'ultra-fast' or 'enterprise-grade'. Every metric on this page comes from real simulated tests with measured recovery windows (~750ms leader failover, zero lost messages, zero duplicate charges)."
    },
    {
      title: "3. I explain things clearly",
      description: "Complex distributed systems are only useful if the people funding, building, and operating them understand what they do. I explain architecture in plain everyday language before diving into the code."
    }
  ],

  about: {
    heading: "About Me",
    paragraph: "I am a Computer Science undergraduate at Lovely Professional University focused on backend engineering and distributed systems. While many developers focus exclusively on what users see on screen, my passion is the invisible architecture underneath: the consensus protocols that elect replacement servers when hardware fails, the idempotency keys that prevent double-billing, and the durable message queues that safeguard data during traffic spikes. When I'm not studying operating systems and database theory, you can find me solving algorithmic challenges on LeetCode or writing scripts to simulate network partitions.",
    videoPlaceholderText: "30-second introduction video slot [PLACEHOLDER]",
  },

  timeline: [
    {
      period: "2024 – Present",
      role: "B.Tech in Computer Science and Engineering",
      organization: "Lovely Professional University",
      type: "education",
      highlights: [
        "Academic CGPA: 7.98",
        "Core coursework: Operating Systems, Object-Oriented Design, Database Management Systems, Data Structures & Algorithms, Distributed Systems Basics"
      ]
    },
    {
      period: "Jun 2025 – Jul 2025",
      role: "AI / ML Intern",
      organization: "Edunet Foundation (AICTE-IBM SkillsBuild)",
      type: "internship",
      highlights: [
        "Completed industry-oriented internship covering machine learning pipelines, predictive modeling, and data evaluation.",
        "Engineered end-to-end classification prototypes using Python, Pandas, and Scikit-learn."
      ]
    },
    {
      period: "2024 – 2026",
      role: "Competitive Algorithms & Benchmarks",
      organization: "LeetCode & Competitive Coding",
      type: "achievement",
      highlights: [
        "100+ LeetCode problems solved with emphasis on Graphs, Dynamic Programming, and Concurrency.",
        "Finalist in Top 25 out of 200 competing engineering teams at Cognitia technical festival (LPU)."
      ]
    },
    {
      period: "2025",
      role: "Database Management Systems Certification",
      organization: "Infosys Springboard",
      type: "certification",
      highlights: [
        "Mastery of relational database schema normalization, transaction isolation levels (ACID), and SQL query execution plans."
      ]
    }
  ] as TimelineEntry[],

  securityStatus: {
    statusBadge: "SECURITY AUDIT IN PROGRESS",
    auditTool: "Strix Automated Pentest Suite (github.com/usestrix/strix)",
    description: "Defensive architecture review is underway. In accordance with strict portfolio integrity rules, zero fabricated vulnerabilities are reported. Once an automated scan finishes against Rishi's repositories, a verified postmortem of findings and fixes will be published here.",
    plannedScope: [
      { area: "Input Sanitization", details: "Memory bounds, SQL injection, and socket deserialization checks" },
      { area: "Authentication & Replay", details: "OAuth token lifecycles, CSRF protections, and idempotency key uniqueness" },
      { area: "SSRF & Redirect Ingress", details: "URL shortener protocol filtering and host domain verification" }
    ]
  }
};

import React from "react";

interface BlueprintProps {
  className?: string;
  amberHighlight?: boolean;
}

/**
 * 1. App Ingress Diagram
 * Shows client mobile/terminal attaching an atomic idempotency key
 */
export function AppBlueprint({ className = "w-full h-44" }: BlueprintProps) {
  return (
    <svg
      viewBox="0 0 360 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Blueprint showing client request with unique idempotency token"
    >
      <rect x="2" y="2" width="356" height="176" rx="3" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      {/* Device frame */}
      <rect x="40" y="30" width="100" height="120" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="40" y1="46" x2="140" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="90" cy="38" r="2.5" fill="currentColor" opacity="0.6" />
      <rect x="52" y="60" width="76" height="14" rx="2" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="1" />
      <text x="90" y="70" textAnchor="middle" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)">
        PAY $40.00
      </text>
      <rect x="52" y="84" width="76" height="40" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="58" y1="94" x2="110" y2="94" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="58" y1="104" x2="98" y2="104" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="58" y1="114" x2="118" y2="114" stroke="currentColor" strokeWidth="1" opacity="0.4" />

      {/* Dispatched packet */}
      <path d="M 140 67 L 220 67" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="224,67 218,63 218,71" fill="var(--color-accent)" />
      
      {/* Idempotency Token box */}
      <rect x="150" y="40" width="70" height="20" rx="2" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1" />
      <text x="185" y="53" textAnchor="middle" fill="var(--color-accent)" fontSize="7.5" fontFamily="var(--font-mono)">
        #idem_8f3a
      </text>

      {/* Ingress Gateway */}
      <rect x="230" y="30" width="90" height="120" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <text x="275" y="48" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="var(--font-sans)" fontWeight="bold">
        INGRESS GATE
      </text>
      <line x1="230" y1="56" x2="320" y2="56" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Deduplication cache */}
      <rect x="240" y="68" width="70" height="30" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1" />
      <text x="275" y="80" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">
        IDEMPOTENCY CACHE
      </text>
      <text x="275" y="91" textAnchor="middle" fill="var(--color-status-ok)" fontSize="7" fontFamily="var(--font-mono)">
        DUP CHECK: PASS
      </text>
      <rect x="240" y="108" width="70" height="28" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1" />
      <text x="275" y="125" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">
        RATE LIMIT: 5/s
      </text>
    </svg>
  );
}

/**
 * 2. Message Queue Diagram
 * 5-node broker cluster showing leader node and Quorum replication (3 of 5)
 */
export function QueueBlueprint({ className = "w-full h-44" }: BlueprintProps) {
  return (
    <svg
      viewBox="0 0 360 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Blueprint showing 5-node message broker cluster with Raft leader election"
    >
      <rect x="2" y="2" width="356" height="176" rx="3" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      
      {/* Quorum Zone indicator */}
      <rect x="20" y="20" width="320" height="140" rx="3" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <text x="35" y="36" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)">
        RAFT QUORUM ZONE (MAJORITY: 3 / 5)
      </text>

      {/* Leader Node */}
      <g transform="translate(40, 50)">
        <rect x="0" y="0" width="65" height="90" rx="2" fill="var(--color-base)" stroke="var(--color-accent)" strokeWidth="1.5" />
        <rect x="0" y="0" width="65" height="18" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="1" />
        <text x="32" y="12" textAnchor="middle" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)" fontWeight="bold">
          LEADER [B1]
        </text>
        <line x1="8" y1="30" x2="57" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="8" y1="42" x2="57" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <text x="32" y="65" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">
          LOG OFFSETS
        </text>
        <text x="32" y="78" textAnchor="middle" fill="var(--color-status-ok)" fontSize="7" fontFamily="var(--font-mono)">
          ISR: ACTIVE
        </text>
      </g>

      {/* Heartbeat replication lines */}
      <path d="M 105 75 L 140 55" stroke="var(--color-accent)" strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M 105 95 L 140 95" stroke="var(--color-accent)" strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M 105 115 L 140 135" stroke="var(--color-accent)" strokeWidth="1.2" strokeDasharray="2 2" />

      {/* Follower Nodes */}
      <g transform="translate(145, 38)">
        <rect x="0" y="0" width="55" height="34" rx="2" fill="var(--color-base)" stroke="currentColor" strokeWidth="1" />
        <text x="27" y="14" textAnchor="middle" fill="currentColor" fontSize="7.5" fontFamily="var(--font-mono)">
          FOLLOWER B2
        </text>
        <text x="27" y="26" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          IN-SYNC (ISR)
        </text>
      </g>
      <g transform="translate(145, 78)">
        <rect x="0" y="0" width="55" height="34" rx="2" fill="var(--color-base)" stroke="currentColor" strokeWidth="1" />
        <text x="27" y="14" textAnchor="middle" fill="currentColor" fontSize="7.5" fontFamily="var(--font-mono)">
          FOLLOWER B3
        </text>
        <text x="27" y="26" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          IN-SYNC (ISR)
        </text>
      </g>
      <g transform="translate(145, 118)">
        <rect x="0" y="0" width="55" height="34" rx="2" fill="var(--color-base)" stroke="currentColor" strokeWidth="1" />
        <text x="27" y="14" textAnchor="middle" fill="currentColor" fontSize="7.5" fontFamily="var(--font-mono)">
          FOLLOWER B4
        </text>
        <text x="27" y="26" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          IN-SYNC (ISR)
        </text>
      </g>

      {/* Standby B5 */}
      <g transform="translate(230, 78)">
        <rect x="0" y="0" width="55" height="34" rx="2" fill="var(--color-base)" stroke="currentColor" strokeWidth="1" opacity="0.7" />
        <text x="27" y="14" textAnchor="middle" fill="currentColor" fontSize="7.5" fontFamily="var(--font-mono)">
          STANDBY B5
        </text>
        <text x="27" y="26" textAnchor="middle" fill="currentColor" opacity="0.6" fontSize="6.5" fontFamily="var(--font-mono)">
          REPLICA
        </text>
      </g>

      <path d="M 200 95 L 230 95" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      
      {/* Consumer group */}
      <g transform="translate(295, 60)">
        <rect x="0" y="0" width="38" height="70" rx="2" fill="var(--color-base)" stroke="currentColor" strokeWidth="1" />
        <text x="19" y="18" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="var(--font-sans)" fontWeight="bold">
          CONSUMER
        </text>
        <text x="19" y="32" textAnchor="middle" fill="currentColor" fontSize="6.5" fontFamily="var(--font-mono)">
          GROUP
        </text>
        <text x="19" y="52" textAnchor="middle" fill="var(--color-accent)" fontSize="6.5" fontFamily="var(--font-mono)">
          P0..P4
        </text>
      </g>
      <path d="M 285 95 L 295 95" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/**
 * 3. Validation Check Diagram
 * Composed predicate chain evaluating 8 domain rules in one pass
 */
export function CheckBlueprint({ className = "w-full h-44" }: BlueprintProps) {
  return (
    <svg
      viewBox="0 0 360 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Blueprint showing 8-predicate composed validation pipeline"
    >
      <rect x="2" y="2" width="356" height="176" rx="3" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      
      {/* Ingress packet */}
      <rect x="20" y="70" width="60" height="40" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1" />
      <text x="50" y="88" textAnchor="middle" fill="currentColor" fontSize="7.5" fontFamily="var(--font-mono)">
        TX_REQUEST
      </text>
      <text x="50" y="99" textAnchor="middle" fill="var(--color-accent)" fontSize="7" fontFamily="var(--font-mono)">
        2 Seats • $40
      </text>

      <path d="M 80 90 L 105 90" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="107,90 102,86 102,94" fill="currentColor" />

      {/* Composed Predicate Engine Box */}
      <rect x="110" y="25" width="165" height="130" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.5" />
      <text x="192" y="42" textAnchor="middle" fill="currentColor" fontSize="8.5" fontFamily="var(--font-sans)" fontWeight="bold">
        COMPOSED PREDICATE PIPELINE
      </text>
      <text x="192" y="52" textAnchor="middle" fill="var(--color-accent)" fontSize="7" fontFamily="var(--font-mono)">
        ALL 8 CHECKS RUN IN 1 PASS
      </text>
      <line x1="110" y1="58" x2="275" y2="58" stroke="currentColor" strokeWidth="1" opacity="0.4" />

      {/* 8 checks mini badges */}
      <g transform="translate(118, 66)">
        <rect x="0" y="0" width="70" height="16" rx="1.5" fill="var(--color-base)" stroke="var(--color-status-ok)" strokeWidth="1" />
        <text x="35" y="11" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          1. Seat Lock ✓
        </text>
      </g>
      <g transform="translate(196, 66)">
        <rect x="0" y="0" width="70" height="16" rx="1.5" fill="var(--color-base)" stroke="var(--color-status-ok)" strokeWidth="1" />
        <text x="35" y="11" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          2. Solvency ✓
        </text>
      </g>
      <g transform="translate(118, 86)">
        <rect x="0" y="0" width="70" height="16" rx="1.5" fill="var(--color-base)" stroke="var(--color-status-ok)" strokeWidth="1" />
        <text x="35" y="11" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          3. Session TTL ✓
        </text>
      </g>
      <g transform="translate(196, 86)">
        <rect x="0" y="0" width="70" height="16" rx="1.5" fill="var(--color-base)" stroke="var(--color-status-ok)" strokeWidth="1" />
        <text x="35" y="11" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          4. Amount Bounds ✓
        </text>
      </g>
      <g transform="translate(118, 106)">
        <rect x="0" y="0" width="70" height="16" rx="1.5" fill="var(--color-base)" stroke="var(--color-status-ok)" strokeWidth="1" />
        <text x="35" y="11" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          5. Idempotency ✓
        </text>
      </g>
      <g transform="translate(196, 106)">
        <rect x="0" y="0" width="70" height="16" rx="1.5" fill="var(--color-base)" stroke="var(--color-status-ok)" strokeWidth="1" />
        <text x="35" y="11" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          6. Showtime Win ✓
        </text>
      </g>
      <g transform="translate(118, 126)">
        <rect x="0" y="0" width="70" height="16" rx="1.5" fill="var(--color-base)" stroke="var(--color-status-ok)" strokeWidth="1" />
        <text x="35" y="11" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          7. Theater Ping ✓
        </text>
      </g>
      <g transform="translate(196, 126)">
        <rect x="0" y="0" width="70" height="16" rx="1.5" fill="var(--color-base)" stroke="var(--color-status-ok)" strokeWidth="1" />
        <text x="35" y="11" textAnchor="middle" fill="var(--color-status-ok)" fontSize="6.5" fontFamily="var(--font-mono)">
          8. Fraud Score ✓
        </text>
      </g>

      <path d="M 275 90 L 295 90" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="297,90 292,86 292,94" fill="currentColor" />

      {/* Target state */}
      <rect x="300" y="70" width="45" height="40" rx="2" fill="var(--color-base)" stroke="var(--color-accent)" strokeWidth="1.5" />
      <text x="322" y="86" textAnchor="middle" fill="var(--color-accent)" fontSize="6.5" fontFamily="var(--font-mono)" fontWeight="bold">
        SEATS
      </text>
      <text x="322" y="98" textAnchor="middle" fill="var(--color-accent)" fontSize="6.5" fontFamily="var(--font-mono)" fontWeight="bold">
        LOCKED
      </text>
    </svg>
  );
}

/**
 * 4. Bank Saga Orchestration Diagram
 * Shows payment gateway call with automatic compensation rollback path
 */
export function BankBlueprint({ className = "w-full h-44" }: BlueprintProps) {
  return (
    <svg
      viewBox="0 0 360 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Blueprint showing Saga orchestrator and compensation rollback"
    >
      <rect x="2" y="2" width="356" height="176" rx="3" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      
      {/* Saga Orchestrator */}
      <g transform="translate(30, 40)">
        <rect x="0" y="0" width="100" height="100" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.5" />
        <rect x="0" y="0" width="100" height="20" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="1" />
        <text x="50" y="14" textAnchor="middle" fill="var(--color-accent)" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="bold">
          SAGA ORCHESTRATOR
        </text>
        <text x="50" y="42" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">
          STEP: AUTH_PAYMENT
        </text>
        <text x="50" y="58" textAnchor="middle" fill="var(--color-status-warn)" fontSize="7" fontFamily="var(--font-mono)">
          TIMEOUT WATCH: 300ms
        </text>
        <text x="50" y="78" textAnchor="middle" fill="currentColor" opacity="0.7" fontSize="7" fontFamily="var(--font-mono)">
          FSM: PAYMENT_PENDING
        </text>
      </g>

      {/* Outbound call to Bank Gateway */}
      <path d="M 130 65 L 230 65" stroke="var(--color-accent)" strokeWidth="1.5" />
      <polygon points="232,65 226,61 226,69" fill="var(--color-accent)" />
      <text x="180" y="58" textAnchor="middle" fill="var(--color-accent)" fontSize="7" fontFamily="var(--font-mono)">
        HTTP POST /authorize
      </text>

      {/* Bank Gateway */}
      <g transform="translate(235, 40)">
        <rect x="0" y="0" width="95" height="100" rx="2" fill="var(--color-base)" stroke="currentColor" strokeWidth="1.5" />
        <text x="47" y="24" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="var(--font-sans)" fontWeight="bold">
          BANKING API
        </text>
        <line x1="10" y1="34" x2="85" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <text x="47" y="55" textAnchor="middle" fill="currentColor" opacity="0.7" fontSize="7" fontFamily="var(--font-mono)">
          VISA / MASTERCARD
        </text>
        <rect x="15" y="70" width="65" height="20" rx="1.5" fill="var(--color-surface)" stroke="var(--color-status-err)" strokeWidth="1" />
        <text x="47" y="83" textAnchor="middle" fill="var(--color-status-err)" fontSize="6.5" fontFamily="var(--font-mono)">
          IF 504 TIMEOUT
        </text>
      </g>

      {/* Saga Compensation Reversal path (Return loop) */}
      <path d="M 235 115 L 130 115" stroke="var(--color-status-err)" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="128,115 134,111 134,119" fill="var(--color-status-err)" />
      <text x="180" y="130" textAnchor="middle" fill="var(--color-status-err)" fontSize="7" fontFamily="var(--font-mono)">
        COMPENSATION: REVERSE SEAT LOCK
      </text>
    </svg>
  );
}

/**
 * 5. Double-Entry Ledger Diagram
 * Shows debit matching credit with zero net drift
 */
export function LedgerBlueprint({ className = "w-full h-44" }: BlueprintProps) {
  return (
    <svg
      viewBox="0 0 360 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Blueprint showing double-entry append-only financial ledger"
    >
      <rect x="2" y="2" width="356" height="176" rx="3" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      
      {/* Title */}
      <text x="180" y="28" textAnchor="middle" fill="currentColor" fontSize="8.5" fontFamily="var(--font-sans)" fontWeight="bold">
        APPEND-ONLY DOUBLE-ENTRY GENERAL LEDGER
      </text>
      <text x="180" y="40" textAnchor="middle" fill="var(--color-accent)" fontSize="7" fontFamily="var(--font-mono)">
        INVARIANT: SUM(DEBIT) === SUM(CREDIT) • NET DRIFT: $0.00
      </text>

      {/* Ledger Table */}
      <rect x="30" y="50" width="300" height="95" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1" />
      {/* Header row */}
      <line x1="30" y1="72" x2="330" y2="72" stroke="currentColor" strokeWidth="1" />
      <text x="50" y="65" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">TX ID</text>
      <text x="110" y="65" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">ACCOUNT</text>
      <text x="190" y="65" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">DIRECTION</text>
      <text x="260" y="65" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">AMOUNT</text>
      <text x="310" y="65" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">STATUS</text>

      {/* Row 1 */}
      <line x1="30" y1="94" x2="330" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <text x="50" y="86" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">tx_891</text>
      <text x="110" y="86" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">USER_FLOAT</text>
      <text x="190" y="86" fill="var(--color-accent)" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">DEBIT (-)</text>
      <text x="260" y="86" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">$40.00</text>
      <text x="310" y="86" fill="var(--color-status-ok)" fontSize="7" fontFamily="var(--font-mono)">POSTED</text>

      {/* Row 2 */}
      <line x1="30" y1="116" x2="330" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <text x="50" y="108" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">tx_891</text>
      <text x="110" y="108" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">THEATER_MERCH</text>
      <text x="190" y="108" fill="var(--color-status-ok)" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">CREDIT (+)</text>
      <text x="260" y="108" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">$40.00</text>
      <text x="310" y="108" fill="var(--color-status-ok)" fontSize="7" fontFamily="var(--font-mono)">POSTED</text>

      {/* Balancing Summary */}
      <text x="50" y="132" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)">TOTAL BALANCED: 5,000+ ENTRIES</text>
      <text x="260" y="132" fill="var(--color-status-ok)" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="bold">NET DRIFT: $0.00</text>
    </svg>
  );
}

/**
 * 6. Snowflake Base62 Shortener Diagram
 * 64-bit ID generator converting timestamp, worker ID, sequence to Base62 short code
 */
export function ReceiptBlueprint({ className = "w-full h-44" }: BlueprintProps) {
  return (
    <svg
      viewBox="0 0 360 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Blueprint showing 64-bit Snowflake ID generation and Base62 encoding"
    >
      <rect x="2" y="2" width="356" height="176" rx="3" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

      {/* Title */}
      <text x="180" y="26" textAnchor="middle" fill="currentColor" fontSize="8.5" fontFamily="var(--font-sans)" fontWeight="bold">
        64-BIT SNOWFLAKE ID BIT-PACKER & BASE62 ENCODER
      </text>

      {/* 64-bit decomposition bar */}
      <g transform="translate(30, 42)">
        <rect x="0" y="0" width="170" height="32" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1" />
        <text x="85" y="16" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">
          41 BITS: TIMESTAMP DELTA
        </text>
        <text x="85" y="26" textAnchor="middle" fill="currentColor" opacity="0.7" fontSize="6" fontFamily="var(--font-mono)">
          69 years of millisecond precision
        </text>

        <rect x="175" y="0" width="65" height="32" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1" />
        <text x="207" y="16" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">
          10 BITS
        </text>
        <text x="207" y="26" textAnchor="middle" fill="currentColor" opacity="0.7" fontSize="6" fontFamily="var(--font-mono)">
          Worker 0..1023
        </text>

        <rect x="245" y="0" width="55" height="32" rx="2" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1" />
        <text x="272" y="16" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold">
          12 BITS
        </text>
        <text x="272" y="26" textAnchor="middle" fill="currentColor" opacity="0.7" fontSize="6" fontFamily="var(--font-mono)">
          Seq 0..4095
        </text>
      </g>

      {/* Arrow down to Base62 */}
      <path d="M 180 80 L 180 100" stroke="var(--color-accent)" strokeWidth="1.5" />
      <polygon points="180,103 176,97 184,97" fill="var(--color-accent)" />

      {/* Base62 conversion box */}
      <g transform="translate(60, 108)">
        <rect x="0" y="0" width="240" height="48" rx="2" fill="var(--color-base)" stroke="var(--color-accent)" strokeWidth="1.5" />
        <text x="120" y="20" textAnchor="middle" fill="var(--color-accent)" fontSize="8" fontFamily="var(--font-mono)" fontWeight="bold">
          BASE62 ALPHANUMERIC DICTIONARY: [0-9 a-z A-Z]
        </text>
        <text x="120" y="36" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">
          cin.bk/<tspan fill="var(--color-accent)" fontWeight="bold">7qK9mX2</tspan> • ZERO COLLISIONS ACROSS 1M
        </text>
      </g>
    </svg>
  );
}

/**
 * Hand-drawn style amber underline for Rishi's name
 */
export function AmberUnderline({ className = "w-36 h-2 text-[#B8622A]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M 2 4 Q 40 7 80 4 T 158 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Small guide probe icon that travels along the scroll line
 */
export function ProbeGuideIcon({ className = "w-4 h-4 text-accent" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon points="12,2 22,20 12,16 2,20" fill="var(--color-accent)" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="11" r="2" fill="#FAF6EF" />
    </svg>
  );
}

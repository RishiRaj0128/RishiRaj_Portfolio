import React from "react";

/**
 * CUSTOM CONTROL PLANE ICONS & STATUS SHAPES
 * Strictly avoiding Lucide, Feather, FontAwesome, or generic AI icon packs.
 * Minimalist, precise, stroke-based industrial SVG glyphs.
 */

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// 1. Plain CSS-drawn Status Indicator (no icon library used)
export function StatusDot({
  status,
  className = "",
  ping = false,
}: {
  status: "ok" | "warn" | "err" | "info" | "idle";
  className?: string;
  ping?: boolean;
}) {
  const colorMap = {
    ok: "bg-[#2FA866]",
    warn: "bg-[#C88D32]",
    err: "bg-[#C24545]",
    info: "bg-[#3878A8]",
    idle: "bg-[#5A626E]",
  };

  return (
    <span className={`relative inline-flex items-center justify-center w-2.5 h-2.5 ${className}`}>
      {ping && status === "ok" && (
        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-[#2FA866]" />
      )}
      <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${colorMap[status]}`} />
    </span>
  );
}

// 2. Network / Topology Node Icon
export function NetworkNodeIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="4" height="4" />
      <rect x="10" y="2" width="4" height="4" />
      <rect x="6" y="10" width="4" height="4" />
      <path d="M4 6v2.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V6" />
      <path d="M8 9v1" />
    </svg>
  );
}

// 3. Distributed Tracing / Span Icon
export function TraceSpanIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      {...props}
    >
      <line x1="2" y1="4" x2="14" y2="4" strokeDasharray="1 2" strokeOpacity="0.4" />
      <rect x="3" y="3" width="5" height="2" fill="currentColor" stroke="none" />
      <line x1="2" y1="8" x2="14" y2="8" strokeDasharray="1 2" strokeOpacity="0.4" />
      <rect x="6" y="7" width="7" height="2" fill="currentColor" stroke="none" />
      <line x1="2" y1="12" x2="14" y2="12" strokeDasharray="1 2" strokeOpacity="0.4" />
      <rect x="4" y="11" width="4" height="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 4. Server / Container Icon
export function ServerIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="12" height="5" rx="1" />
      <rect x="2" y="9" width="12" height="5" rx="1" />
      <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor" />
      <circle cx="11.5" cy="11.5" r="0.75" fill="currentColor" />
      <line x1="4" y1="4.5" x2="7" y2="4.5" />
      <line x1="4" y1="11.5" x2="7" y2="11.5" />
    </svg>
  );
}

// 5. Security Postmortem / Audit Shield Icon
export function ShieldAuditIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8 2L3 4v4c0 3.5 2.5 5.5 5 6 2.5-.5 5-2.5 5-6V4L8 2z" />
      <path d="M8 6v3" />
      <circle cx="8" cy="11" r="0.5" fill="currentColor" />
    </svg>
  );
}

// 6. Agentic CPU / Execution Core Icon
export function CpuCoreIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      {...props}
    >
      <rect x="4" y="4" width="8" height="8" rx="1" />
      <line x1="2" y1="6" x2="4" y2="6" />
      <line x1="2" y1="10" x2="4" y2="10" />
      <line x1="12" y1="6" x2="14" y2="6" />
      <line x1="12" y1="10" x2="14" y2="10" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="6" y1="12" x2="6" y2="14" />
      <line x1="10" y1="12" x2="10" y2="14" />
      <rect x="6.5" y="6.5" width="3" height="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 7. Search / Command Palette Icon
export function SearchIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      {...props}
    >
      <circle cx="7" cy="7" r="4.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" />
    </svg>
  );
}

// 8. External Link Arrow Icon
export function ExternalLinkIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M10.5 3.5h-5M10.5 3.5v5M10.5 3.5L4 10" />
    </svg>
  );
}

// 9. Copy Payload Icon
export function CopyIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      {...props}
    >
      <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
      <path d="M9.5 2.5h-6a1 1 0 00-1 1v6" />
    </svg>
  );
}

// 10. Checkmark for temporary copied feedback
export function CopiedSuccessIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="2.5 7.5 5.5 10.5 11.5 3.5" />
    </svg>
  );
}

// 11. Chevron Icon
export function ChevronDownIcon({
  size = 14,
  className = "",
  rotated = false,
  ...props
}: IconProps & { rotated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${rotated ? "rotate-180" : ""} ${className}`}
      {...props}
    >
      <polyline points="3.5 5.25 7 8.75 10.5 5.25" />
    </svg>
  );
}

// 12. Close / Dismiss Icon
export function CloseIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="3" y1="3" x2="11" y2="11" />
      <line x1="11" y1="3" x2="3" y2="11" />
    </svg>
  );
}

// 13. Play / Pause 3D scene toggles
export function PauseIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      {...props}
    >
      <rect x="3" y="2.5" width="2.5" height="9" />
      <rect x="8.5" y="2.5" width="2.5" height="9" />
    </svg>
  );
}

export function PlayIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="currentColor"
      className={className}
      {...props}
    >
      <polygon points="3.5,2 11.5,7 3.5,12" />
    </svg>
  );
}

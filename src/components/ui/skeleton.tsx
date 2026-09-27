import React from "react";

/**
 * CONTROL PLANE SKELETON COMPONENT
 * Adheres strictly to Rule #11: "any async content MUST show a real skeleton/loading state, never a blank flash or spinner-only"
 * Uses low-contrast monochrome pulse (no rainbow, no pastel, no purple).
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = "", width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#171B22] border border-[#232A35] rounded-[2px] ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

// Monospace Code Line Skeleton
export function SkeletonTextLine({
  width = "100%",
  className = "",
}: {
  width?: string | number;
  className?: string;
}) {
  return <Skeleton className={`h-4 my-1 ${className}`} width={width} />;
}

// Latency Ping Matrix Skeleton
export function SkeletonPingWidget() {
  return (
    <div className="p-3 bg-[#111419] border border-[#1F242C] rounded-[2px] font-mono text-xs space-y-2">
      <div className="flex justify-between items-center">
        <Skeleton width="110px" className="h-3.5" />
        <Skeleton width="45px" className="h-3.5" />
      </div>
      <div className="flex items-baseline gap-2">
        <Skeleton width="70px" className="h-7" />
        <Skeleton width="60px" className="h-3" />
      </div>
      <div className="grid grid-cols-5 gap-1 pt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6" />
        ))}
      </div>
      <div className="flex justify-between pt-1">
        <Skeleton width="90px" className="h-2.5" />
        <Skeleton width="50px" className="h-2.5" />
      </div>
    </div>
  );
}

// GitHub Contribution Graph Skeleton
export function SkeletonGitHubMatrix() {
  return (
    <div className="p-3 bg-[#111419] border border-[#1F242C] rounded-[2px] font-mono text-xs space-y-2.5">
      <div className="flex justify-between items-center">
        <Skeleton width="140px" className="h-3.5" />
        <Skeleton width="80px" className="h-3" />
      </div>
      <div className="flex gap-1 overflow-x-hidden pt-1">
        {Array.from({ length: 28 }).map((_, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, rowIdx) => (
              <Skeleton key={rowIdx} className="w-2.5 h-2.5" />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-1 text-[10px]">
        <Skeleton width="120px" className="h-2.5" />
        <Skeleton width="70px" className="h-2.5" />
      </div>
    </div>
  );
}

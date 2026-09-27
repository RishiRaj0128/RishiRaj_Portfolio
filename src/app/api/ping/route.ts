import { NextResponse } from "next/server";

/**
 * Dedicated Edge Ping Endpoint
 * Allows the browser to measure true round-trip network transit time (TTFB).
 * Reports server processing duration via Server-Timing header so client can
 * subtract execution time and measure pure wire latency.
 */
export async function GET() {
  const start = performance.now();
  const timestamp = Date.now();
  
  const serverDur = (performance.now() - start).toFixed(2);
  
  return NextResponse.json(
    {
      status: "healthy",
      timestamp,
      echo: "pong",
      region: process.env.VERCEL_REGION || "local-edge",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Server-Timing": `app;dur=${serverDur};desc="Execution Duration"`,
        "Content-Type": "application/json",
      },
    }
  );
}

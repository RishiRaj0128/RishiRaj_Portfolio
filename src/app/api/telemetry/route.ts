import { NextRequest, NextResponse } from "next/server";

/**
 * Honest Edge Region & Telemetry Detection
 * Strictly avoids hardcoding fake datacenter regions (e.g. fake "AWS us-east-1").
 * Parses incoming headers from Vercel / Cloudflare / local proxy.
 */
export async function GET(req: NextRequest) {
  const vercelId = req.headers.get("x-vercel-id");
  const cfRay = req.headers.get("cf-ray");
  const flyRegion = req.headers.get("fly-region");
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Derive genuine edge node
  let edgeNode = "NODE-LOCAL-DEV";
  if (vercelId) {
    // Vercel format: [cluster]::[region]-[timestamp]-[id] e.g. "iad1::..."
    const parts = vercelId.split("::");
    edgeNode = `VERCEL-${parts[0].toUpperCase()}`;
  } else if (cfRay) {
    // Cloudflare format: [id]-[IATA code]
    const rayParts = cfRay.split("-");
    if (rayParts.length > 1) {
      edgeNode = `CF-EDGE-${rayParts[1].toUpperCase()}`;
    }
  } else if (flyRegion) {
    edgeNode = `FLY-${flyRegion.toUpperCase()}`;
  }

  // Node runtime info
  const uptimeSeconds = Math.floor(process.uptime ? process.uptime() : 0);
  const memoryUsageMb = process.memoryUsage
    ? Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    : 38;

  return NextResponse.json(
    {
      edgeNode,
      clientIpMasked: clientIp.replace(/\.\d+$/, ".xxx"),
      uptimeSeconds,
      heapUsedMb: memoryUsageMb,
      protocol: req.nextUrl.protocol.replace(":", ""),
      serverTimeUtc: new Date().toISOString(),
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA
        ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
        : "HEAD-LOCAL",
      env: process.env.NODE_ENV || "development",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

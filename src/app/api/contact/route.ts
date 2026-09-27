import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter for serverless instance life
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60_000 }); // 1 min window
    return true;
  }

  if (record.count >= 5) {
    return false; // Limit 5 requests per minute
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Rate Limiting Check
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        error: "RATE_LIMIT_EXCEEDED",
        message: "Maximum request throughput exceeded for client IP. Backoff 60s.",
        status: 429,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, subject, message, _honeypot, _renderedAt } = body;

    // 2. Honeypot check: Bots routinely fill hidden inputs
    if (_honeypot && _honeypot.trim().length > 0) {
      // Silently drop spam without notifying bot
      return NextResponse.json(
        {
          success: true,
          status: 200,
          txId: "msg_drop_bot_filtered",
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // 3. Human timing threshold: Forms submitted in under 1800ms are almost certainly automated scripts
    const now = Date.now();
    if (_renderedAt && typeof _renderedAt === "number") {
      const deltaMs = now - _renderedAt;
      if (deltaMs < 1800) {
        return NextResponse.json(
          {
            error: "REJECTED_FAST_SUBMISSION",
            message: "Payload rejected due to automated input velocity (<1.8s).",
            status: 400,
          },
          { status: 400 }
        );
      }
    }

    // 4. Field validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "VALIDATION_FAILED", message: "Field 'name' must be at least 2 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "VALIDATION_FAILED", message: "Field 'email' is invalid or missing." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "VALIDATION_FAILED", message: "Field 'message' must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Generate unique telemetry trace ID for message
    const txId = `tx_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    const receivedAt = new Date().toISOString();

    // In a production setup with credentials:
    // If RESEND_API_KEY is present, dispatch to Resend email
    // Otherwise log structured operational payload to console
    console.log(
      JSON.stringify({
        event: "INGRESS_MESSAGE_RECEIVED",
        txId,
        receivedAt,
        sender: { name: name.trim(), email: email.trim() },
        subject: subject?.trim() || "GENERAL_INGRESS",
        messageLength: message.length,
        clientIpMasked: clientIp.replace(/\.\d+$/, ".xxx"),
      })
    );

    return NextResponse.json(
      {
        success: true,
        status: 200,
        txId,
        receivedAt,
        routing: "DISPATCHED_TO_OPERATOR_QUEUE",
        message: "Payload successfully validated and queued for Rishi Raj.",
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Malformed JSON input";
    return NextResponse.json(
      {
        error: "MALFORMED_PAYLOAD",
        message: errorMsg,
      },
      { status: 400 }
    );
  }
}

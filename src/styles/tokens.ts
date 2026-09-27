/**
 * DESIGN TOKENS — "Control Plane" Design System
 * RishiRaj_Portfolio
 *
 * DELIBERATE ARCHITECTURAL CHOICES & AVOIDED DEFAULTS:
 * 1. Background (#0A0B0D range): Deliberately chose near-black over pure white (#ffffff) or default neutral grays
 *    to evoke mission-critical NOC/SRE monitor screens.
 * 2. Accent (#C86D32 Muted Burnt Amber): Exactly ONE desaturated, functional accent color. Rejected neon cyan/greens,
 *    pastels, and purple-black gradients which look AI-generated and generic.
 * 3. Elevation via 1px border (#1F242C) and 3% background luminosity step (#12151A), NOT drop shadows.
 *    Shadows blur boundaries and feel consumer/app-like; 1px borders feel like industrial terminal hardware.
 * 4. Corner Radius (2px - 4px max): Rejected oversized rounded corners (16px+) in favor of crisp, engineered corners.
 * 5. Monospace Priority: IBM Plex Mono for all system data, telemetry, latencies, PIDs, and code.
 *    Primary Sans: Public Sans for headings and structural copy (strictly rejected Inter, Geist, and Space Grotesk).
 */

export const TOKENS = {
  colors: {
    // Surfaces
    bgBase: "#0A0B0D", // Void / Deep space background
    bgSurface: "#111317", // Surface panels
    bgElevated: "#171B22", // Elevated panels / widgets
    bgHover: "#1E232C", // Hover state background shift
    
    // Borders
    borderSubtle: "#1F242C", // Dim border (1px)
    borderDefault: "#2D3440", // Strong border (1px)
    borderActive: "#C86D32", // Active amber border
    
    // Single Muted Accent (Desaturated Amber)
    accent: "#C86D32", // Primary focus/action/thruster accent
    accentSubtle: "#362216", // Subtle amber backing
    accentMuted: "rgba(200, 109, 50, 0.15)", // Translucent accent tint
    
    // Typography
    textPrimary: "#E6E8EB", // Primary text
    textMuted: "#878F99", // Muted slate text
    textTertiary: "#5A626E", // Micro readouts/labels
    
    // Status Indicators (Operational State)
    statusOk: "#2FA866", // Healthy service
    statusWarn: "#C88D32", // Warning / pending state
    statusErr: "#C24545", // Error / failure state
  },
  radius: {
    sharp: "2px",
    minimal: "4px",
    // 2D panel radius: 2-4px max (Rule #8)
  },
  typography: {
    mono: "var(--font-mono), 'IBM Plex Mono', monospace",
    sans: "var(--font-sans), 'Public Sans', sans-serif",
  },
} as const;

export type DesignTokens = typeof TOKENS;

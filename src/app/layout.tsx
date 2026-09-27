import type { Metadata, Viewport } from "next";
import { Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Public Sans for crisp technical headings & body
const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// IBM Plex Mono for all telemetry, logs, metrics, code, and status readouts
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "UPLINK // Rishi Raj — Backend Distributed Systems & DevOps",
  description:
    "Navigable 3D network topology portfolio of Rishi Raj. Pilot a data-packet probe through distributed systems nodes with live leader election, Saga payment FSM, and Base62 URL shortener simulations.",
  keywords: [
    "Distributed Systems",
    "DevOps",
    "Cloud Architecture",
    "Java",
    "Spring Boot",
    "Kubernetes",
    "Docker",
    "Terraform",
    "Prometheus",
    "Grafana",
    "MySQL",
    "Redis",
  ],
  authors: [{ name: "Rishi Raj" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Rishi Raj | RUNTIME — Interactive Systems Portfolio",
    description: "Don't read about systems. Run them. Interactive distributed systems lab and engineering telemetry.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0B0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0B0D] text-[#E6E8EB] font-sans">
        {children}
      </body>
    </html>
  );
}

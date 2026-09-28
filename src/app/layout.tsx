import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Newsreader editorial serif for headlines, margin notes, and editorial emphasis
const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

// Public Sans for clean technical body
const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// IBM Plex Mono for telemetry, metrics, code, and status labels
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Rishi Raj — Backend Distributed Systems & Fault Tolerance",
  description:
    "Rishi builds the behind-the-scenes systems that keep apps from crashing, losing data, or charging customers twice.",
  keywords: [
    "Distributed Systems",
    "Fault Tolerance",
    "Idempotency",
    "Saga Pattern",
    "Raft Quorum",
    "Leader Election",
    "Java",
    "Spring Boot",
    "Kubernetes",
    "Docker",
    "Redis",
    "MySQL",
    "DevOps",
  ],
  authors: [{ name: "Rishi Raj" }],
  creator: "Rishi Raj",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Rishi Raj — Backend Distributed Systems & Fault Tolerance",
    description:
      "Rishi builds the behind-the-scenes systems that keep apps from crashing, losing data, or charging customers twice.",
    type: "website",
    locale: "en_US",
    siteName: "Rishi Raj Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishi Raj — Backend Distributed Systems & Fault Tolerance",
    description:
      "Rishi builds the behind-the-scenes systems that keep apps from crashing, losing data, or charging customers twice.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE6",
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
      suppressHydrationWarning
      className={`${newsreader.variable} ${publicSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}

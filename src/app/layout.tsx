import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// next/font self-hosts Inter at build time (no runtime request to Google).
// `variable` exposes it as the CSS var --font-inter, which globals.css feeds
// into the Tailwind --font-sans token.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// IBM Plex Mono — the nav accent face (ties to soper.dev + the circuit/eng
// identity). Exposed as --font-plex-mono → Tailwind's --font-mono token.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Root metadata. `title.template` lets each route set a short title that gets
// wrapped as "<page> — BezaCore Labs"; `title.default` is used where a page
// sets none (e.g. the homepage).
export const metadata: Metadata = {
  metadataBase: new URL("https://bezacore.com"),
  title: {
    default: "BezaCore Labs — Software, AI, and the infrastructure to run it.",
    template: "%s — BezaCore Labs",
  },
  description:
    "BezaCore Labs is a DevOps and AI studio in Michigan that builds and runs cloud-native software — apps, AI features and agents, and the cloud infrastructure and automation behind them.",
  openGraph: {
    type: "website",
    siteName: "BezaCore Labs",
    url: "https://bezacore.com",
    title: "BezaCore Labs — Software, AI, and the infrastructure to run it.",
    description:
      "A DevOps and AI studio that builds and runs cloud-native software — apps, AI and AI agents, and the infrastructure behind them.",
  },
  // Emits <link rel="alternate" type="application/rss+xml"> so feed readers and
  // syndication tools (Hashnode auto-import, aggregators) discover /feed.xml
  // without being told where it is.
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "BezaCore Labs" }],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-base font-sans text-paper antialiased">
        {/* Blueprint grid texture behind everything (fixed, z-index:-1). */}
        <div aria-hidden="true" className="bz-gridfield" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

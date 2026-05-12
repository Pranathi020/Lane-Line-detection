import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://lane-ai.example.com";
const siteName = "LaneAI — Cloud Lane Line Detection";
const description =
  "Cloud-powered computer vision platform for intelligent road lane detection using OpenCV and TensorFlow.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LaneAI — AI Lane Line Detection System",
    template: "%s · LaneAI",
  },
  description,
  keywords: [
    "Lane Detection",
    "AI",
    "Computer Vision",
    "OpenCV",
    "TensorFlow",
    "Autonomous Driving",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    description,
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} font-sans bg-white text-zinc-900`}
      >
        {children}
      </body>
    </html>
  );
}

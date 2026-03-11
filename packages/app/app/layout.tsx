import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Barlow_Condensed, Nunito, DM_Mono } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SparkPack",
  description: "Create and run projector-ready classroom games. Manual editing first, AI later.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${display.variable} ${mono.variable} min-h-screen text-foreground font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}


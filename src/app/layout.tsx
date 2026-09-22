import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { LandingLoader } from "@/components/landing-loader";
import { MotionShell } from "@/components/motion-shell";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "./site-overrides.css";
import "./production-polish.css";
import "./contact-redesign.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Emmanuel Church",
    template: "%s | Emmanuel Church",
  },
  description:
    "Join Emmanuel Church in Abilene, Kansas. Plan a Sunday visit, find a ministry, watch a message, and grow in faith with our church family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <LandingLoader />
        <div className="page-backdrop" />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          <MotionShell>{children}</MotionShell>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

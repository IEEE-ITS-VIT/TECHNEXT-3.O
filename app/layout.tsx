import type { Metadata, Viewport } from "next";
import { FONT_OPTIONS, fontVariables } from "@/lib/fonts";
import { THEME_COLORS, type Appearance, type ThemeColorKey } from "@/lib/settings";
import "./globals.css";
import TechNextNavbar from "@/components/TechNextNavbar";
import TickerBar from "@/components/TickerBar";
import CmsProvider from "@/components/cms/CmsProvider";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

const CSS_VAR: Record<ThemeColorKey, string> = {
  primary: "--c-primary",
  primaryDark: "--c-primary-dark",
  primaryHover: "--c-primary-hover",
  secondary: "--c-secondary",
  accent: "--c-accent",
  accentDark: "--c-accent-dark",
  text: "--c-text",
  muted: "--c-muted",
  surface: "--c-surface",
  border: "--c-border",
};

const hexToRgb = (hex: string) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

// Admin-chosen theme as CSS variables (colours as RGB triplets so Tailwind opacity works).
function themeCss(a: Appearance) {
  const vars: string[] = [];
  for (const key of Object.keys(THEME_COLORS) as ThemeColorKey[]) {
    const rgb = hexToRgb(a.colors[key] ?? THEME_COLORS[key].value);
    if (rgb) vars.push(`${CSS_VAR[key]}: ${rgb};`);
  }
  const font = (k: string, fallback: string) => FONT_OPTIONS[k as keyof typeof FONT_OPTIONS]?.cssVar ?? fallback;
  vars.push(`--font-body: var(${font(a.bodyFont, "--font-inter")});`);
  vars.push(`--font-heading: var(${font(a.headingFont, "--font-jakarta")});`);
  vars.push(`--font-scale: ${Math.min(1.25, Math.max(0.85, Number(a.fontScale) || 1))};`);
  return `:root{${vars.join("")}}`;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "TechNext '28 | National Industrial Expo & Innovation Showcase · VIT Vellore",
    template: "%s",
  },
  description:
    "TechNext '28 is the national industrial expo and innovation showcase at VIT Vellore, held alongside ic-ETITE'28: industry, startup and student stalls, live demos and awards.",
  keywords: ["TechNext '28", "TechNext expo", "industrial expo VIT", "innovation showcase", "startup stalls", "VIT Vellore", "ic-ETITE'28"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  category: "technology",
  openGraph: {
    title: "TechNext '28 — National Industrial Expo & Innovation Showcase",
    description: "Industry, startup and student stalls, live demos and awards at VIT Vellore, alongside ic-ETITE'28.",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "TechNext '28 — Industrial Expo", description: "National industrial expo at VIT Vellore." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#002147",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { links, ticker, appearance, texts, images } = await getSettings();
  return (
    <html lang="en" data-scroll-behavior="smooth" className={fontVariables} suppressHydrationWarning>
      <head>
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeCss(appearance) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ExhibitionEvent",
              name: "TechNext '28 Industrial Expo",
              url: SITE_URL,
              description: "National industrial expo and innovation showcase at VIT Vellore, alongside ic-ETITE'28.",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              location: { "@type": "Place", name: "Vellore Institute of Technology", address: "Vellore, Tamil Nadu, India" },
              organizer: { "@type": "CollegeOrUniversity", name: "Vellore Institute of Technology, Vellore", url: "https://vit.ac.in" },
            }),
          }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-white text-brand-text antialiased"
        suppressHydrationWarning
      >
        <CmsProvider texts={texts} images={images}>
          <TickerBar ticker={ticker} />
          <TechNextNavbar icetiteUrl={links.icetite} boltUrl={links.bolt} />
          <main className="flex-1">{children}</main>
          <SiteFooter links={links} />
          <BackToTop />
        </CmsProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { site } from "@/content/site";
import { UIProvider } from "@/components/ui-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { ShortcutsOverlay } from "@/components/shortcuts-overlay";
import { CiteModal } from "@/components/cite-modal";
import { Conga } from "@/components/conga";
import { SelectionCite } from "@/features/cite-selection";
import { ViewSource } from "@/features/view-source";
import { TLDR_BOOT } from "@/features/tldr/boot";
import { INTRO_BOOT } from "@/components/intro-boot";
import "./globals.css";

const serif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"] });
const sans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The TL;DR and intro boot scripts set classes on <html> before paint, so
    // the server's markup and the first client render can differ there.
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        {TLDR_BOOT ? <script dangerouslySetInnerHTML={{ __html: TLDR_BOOT }} /> : null}
      </head>
      <body className="flex min-h-full flex-col">
        <UIProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CommandPalette />
          <ShortcutsOverlay />
          <CiteModal />
          <Conga />
          <SelectionCite />
          <ViewSource />
        </UIProvider>
      </body>
    </html>
  );
}

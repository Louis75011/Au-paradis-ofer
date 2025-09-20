import type { Metadata } from "next";
import "@/app/globals.css";
import { site } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter, Caveat } from "next/font/google";
import { CookieProvider } from "@/components/CookieContext";
// import CookiePrefs from "@/components/CookiePrefs";
import CookieBanner from "@/components/CookieBanner";
import CookiePrefsDialog from "@/components/CookiePrefsDialog";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-caveat" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url), // 👌 indispensable pour résoudre les URLs relatives
  title: {
    default: `${site.name} – Médiation animale et gîte au contact des chevaux`,
    template: `%s • ${site.name}`,
  },
  description:
    site.description ||
    "Au Paradis O’Fer propose des séances de médiation animale et un gîte chaleureux au contact des chevaux. Découvrez nos activités pour enfants, adultes et familles.",
  keywords: [
    "au paradis ofer",
    "au paradis o'fer",
    "médiation animale",
    "médiation équine",
    "animations équestres",
    "équithérapie",
    "zoothérapie",
    "séances avec chevaux",
    "séjour nature",
    "gîte familial",
    "gîte champêtre",
    "nord de France",
  ],
  verification: {
    google: "BClj06C1NSHiXTWlvaOCC0jU-1ztv_HaxddZ_A2bRMQ",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    title: `${site.name} – Médiation animale et séjours`,
    description:
      "Au Paradis O’Fer : médiation animale, équithérapie et hébergement en gîte au contact des chevaux.",
    url: site.url,
    siteName: site.name,
    images: [
      {
        url: "/images/au-paradis-ofer-02.jpg",
        width: 1200,
        height: 630,
        alt: "Séance de médiation animale avec un cheval",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} – Médiation animale et séjours`,
    description:
      "Découvrez la médiation animale et nos séjours en gîte au contact des chevaux, proposés par Au Paradis O’Fer.",
    images: ["/images/au-paradis-ofer-02.jpg"],
  },
  alternates: {
    canonical: site.url,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${caveat.variable}`}>
      <body className="min-h-screen flex flex-col bg-brand-cream text-slate-900">
        <CookieProvider>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-white rounded px-3 py-2 shadow"
          >
            Aller au contenu
          </a>
          <Header />
          <main id="contenu" className="flex-1 relative">
            {children}
          </main>
          <Footer />
          {/* Montez les composants Cookies en fin de body */}
          {/* <CookiePrefs /> */}
          <CookieBanner />
          <CookiePrefsDialog />
        </CookieProvider>
      </body>
    </html>
  );
}

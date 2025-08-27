import type { Metadata } from "next";
import "@/app/globals.css";
import { site } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter, Caveat } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], weight: ["400","700"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: { default: site.name, template: `%s • ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.name, description: site.description, url: site.url, siteName: site.name,
    images: [{ url: "/images/au-paradis-ofer-02.jpg", width: 1200, height: 630, alt: "Cheval en séance"}],
    locale: "fr_FR", type: "website"
  },
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${caveat.variable}`}>
      <body className="min-h-screen flex flex-col bg-brand-cream text-slate-900">
        {/* Lien d'évitement pour accessibilité clavier */}
        <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-white rounded px-3 py-2 shadow">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" className="flex-1 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

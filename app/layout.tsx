import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnvBanner } from "@/components/env-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bacheo Gran Mendoza",
    template: "%s · Bacheo Gran Mendoza",
  },
  description:
    "Plataforma cívica para reportar baches y problemas viales del Gran Mendoza. Sacá una foto, marcá la ubicación y sumale tu voz al vecino.",
  metadataBase: new URL("https://bacheo-gran-mendoza.vercel.app"),
  openGraph: {
    title: "Bacheo Gran Mendoza",
    description:
      "Plataforma cívica para reportar baches del Gran Mendoza. Seis departamentos, un solo mapa.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${lexend.variable}`}>
      <body className="min-h-screen antialiased">
        <EnvBanner />
        <SiteHeader />
        <main id="contenido" className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

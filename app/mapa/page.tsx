import type { Metadata } from "next";
import Link from "next/link";
import { MapPinned, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "Mapa",
  description: "Mapa interactivo de reportes del Gran Mendoza. Próximamente.",
};

export default function MapaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
      <header>
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
          Mapa del Gran Mendoza
        </h1>
        <p className="mt-3 text-neutral-700 max-w-2xl">
          Todos los reportes georreferenciados en un mapa único, con filtros por
          categoría y estado.
        </p>
      </header>

      <div className="mt-10 relative overflow-hidden rounded-3xl ring-1 ring-neutral-200 bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute top-1/4 left-1/3 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-1/4 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-1/4 left-1/4 h-36 w-36 rounded-full bg-sky-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />

        <div className="relative z-10 grid place-items-center py-24 sm:py-36 text-center px-6">
          <div className="grid place-items-center h-16 w-16 rounded-2xl bg-white shadow-pop ring-1 ring-primary-200">
            <MapPinned className="h-8 w-8 text-primary-600" aria-hidden />
          </div>
          <h2 className="mt-6 font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Mapa interactivo · Próximamente
          </h2>
          <p className="mt-3 max-w-md text-neutral-700">
            Estamos integrando Leaflet con los datos reales. Mientras tanto, mirá
            los reportes en formato lista.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/reportes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-600 transition-colors"
            >
              Ver reportes en lista
            </Link>
            <Link
              href="/reportar"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-800 ring-1 ring-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <Waves className="h-4 w-4" aria-hidden />
              Reportar un problema
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

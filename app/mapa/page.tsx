import type { Metadata } from "next";
import Link from "next/link";
import { Waves } from "lucide-react";
import { reports } from "@/lib/mock-data";
import MendozaMapClient from "@/components/map/mendoza-map-client";

export const metadata: Metadata = {
  title: "Mapa",
  description:
    "Mapa interactivo de reportes del Gran Mendoza con polígonos de los 6 municipios.",
};

export default function MapaPage() {
  const total = reports.length;
  const enObra = reports.filter((r) => r.status === "en-obra").length;
  const resueltos = reports.filter((r) => r.status === "resuelto").length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
            Mapa del Gran Mendoza
          </h1>
          <p className="mt-3 text-neutral-700 max-w-2xl">
            Reportes georreferenciados sobre los 6 municipios del Área
            Metropolitana. Tocá un marker para ver el detalle.
          </p>
        </div>
        <Link
          href="/reportar"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-600 transition-colors self-start sm:self-auto"
        >
          <Waves className="h-4 w-4" aria-hidden />
          Reportar un problema
        </Link>
      </header>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4 max-w-md">
        <Stat label="Total" value={total} />
        <Stat label="En obra" value={enObra} accent="text-amber-700" />
        <Stat label="Resueltos" value={resueltos} accent="text-emerald-700" />
      </div>

      <div className="mt-6">
        <MendozaMapClient />
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        Polígonos: datos abiertos del Gobierno de Argentina (departamentos).
        Tiles: OpenStreetMap.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-neutral-200 px-3 py-2.5">
      <div className={`font-display text-xl font-bold ${accent ?? "text-neutral-900"}`}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-neutral-500">
        {label}
      </div>
    </div>
  );
}

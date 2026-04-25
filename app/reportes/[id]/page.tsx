import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import { categories, statusLabels, statusStyles } from "@/lib/mock-data";
import { photoForCategory } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { AlsoSawButton } from "@/components/also-saw-button";
import { getReport, listReports } from "@/lib/data/reports";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const reports = await listReports();
  return reports.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) return { title: "Reporte no encontrado" };
  const cat = categories.find((c) => c.id === report.category);
  return {
    title: `${cat?.label ?? "Reporte"} en ${report.street}`,
    description: report.description,
  };
}

export default async function ReporteDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  const cat = categories.find((c) => c.id === report.category);
  const Icon = cat?.icon;
  const photo = photoForCategory(report.category, report.daysAgo);

  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/reportes"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Todos los reportes
        </Link>
      </div>

      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
              statusStyles[report.status]
            )}
          >
            {statusLabels[report.status]}
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-black tracking-tight">
            {cat?.label}: {report.street}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
            <span className="font-mono text-primary-700">{report.id}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {report.depto}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              hace {report.daysAgo} {report.daysAgo === 1 ? "día" : "días"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <AlsoSawButton initialCount={report.alsoSaw} />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Compartir
          </button>
        </div>
      </header>

      <div className="mt-6 aspect-[16/9] sm:aspect-[21/9] rounded-3xl relative overflow-hidden ring-1 ring-neutral-200 bg-neutral-100">
        <Image
          src={photo}
          alt={`Foto del reporte en ${report.street}, ${report.depto}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
        />
        {Icon && (
          <Icon
            className="absolute bottom-6 right-6 h-20 w-20 text-white/90 drop-shadow-lg"
            aria-hidden
          />
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="font-display text-xl font-bold">Descripción</h2>
          <p className="mt-3 text-neutral-800 leading-relaxed">{report.description}</p>

          <h2 className="mt-10 font-display text-xl font-bold">Qué pasó con este reporte</h2>
          <ol className="mt-4 relative border-l-2 border-neutral-200 pl-6 space-y-6">
            {report.timeline.map((event, i) => (
              <li key={i} className="relative">
                <span
                  className={cn(
                    "absolute -left-[33px] top-0.5 h-4 w-4 rounded-full border-2 border-white",
                    i === report.timeline.length - 1 ? "bg-primary" : "bg-neutral-300"
                  )}
                  aria-hidden
                />
                <div className="text-xs text-neutral-500">{event.at}</div>
                <div className="font-semibold text-neutral-900">{event.label}</div>
                {event.detail && (
                  <div className="text-sm text-neutral-600">{event.detail}</div>
                )}
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl ring-1 ring-neutral-200 p-5 bg-white shadow-soft">
            <h3 className="font-semibold text-neutral-900">Ubicación</h3>
            <div
              aria-hidden
              className="mt-3 aspect-square rounded-xl bg-gradient-to-br from-primary-50 via-neutral-100 to-primary-50 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:18px_18px] relative"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary-500/60" />
                  <div className="relative h-8 w-8 rounded-full bg-primary grid place-items-center ring-4 ring-white shadow-pop">
                    <MapPin className="h-4 w-4 text-primary-foreground" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-700">{report.street}, {report.depto}</p>
            <p className="mt-1 text-xs text-neutral-500">Mapa integrado: próximamente</p>
          </div>

          <div className="rounded-2xl ring-1 ring-neutral-200 p-5 bg-white shadow-soft">
            <h3 className="font-semibold text-neutral-900 inline-flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary-600" aria-hidden />
              Categoría
            </h3>
            <p className="mt-2 text-sm text-neutral-700">{cat?.label}</p>
            <p className="mt-1 text-xs text-neutral-500">{cat?.description}</p>
          </div>
        </aside>
      </div>
    </article>
  );
}

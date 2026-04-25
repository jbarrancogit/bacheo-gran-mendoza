import type { Metadata } from "next";
import { ReportsExplorer } from "@/components/reports-explorer";
import { listReports } from "@/lib/data/reports";

export const metadata: Metadata = {
  title: "Reportes",
  description: "Reportes públicos de baches y problemas viales del Gran Mendoza.",
};

export default async function ReportesPage() {
  const reports = await listReports();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
      <header className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
          Reportes del Gran Mendoza
        </h1>
        <p className="mt-3 text-neutral-700 max-w-2xl">
          Todos los reportes públicos, ordenados por fecha. Filtrá por categoría,
          departamento o estado.
        </p>
      </header>
      <ReportsExplorer reports={reports} />
    </div>
  );
}

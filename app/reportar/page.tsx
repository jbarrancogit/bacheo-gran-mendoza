import type { Metadata } from "next";
import { ReportWizard } from "@/components/report-wizard";

export const metadata: Metadata = {
  title: "Reportar un problema",
  description: "Sumá tu reporte de bache, luminaria o problema vial del Gran Mendoza.",
};

export default function ReportarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
      <ReportWizard />
    </div>
  );
}

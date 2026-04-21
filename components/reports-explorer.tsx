"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { categories, deptos, reports, statusLabels } from "@/lib/mock-data";
import type { CategoryId, Depto, ReportStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ReportCard } from "./report-card";

const statuses: ReportStatus[] = ["enviado", "recibido", "en-obra", "resuelto"];

export function ReportsExplorer() {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [depto, setDepto] = useState<Depto | "all">("all");
  const [status, setStatus] = useState<ReportStatus | "all">("all");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (depto !== "all" && r.depto !== depto) return false;
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }, [cat, depto, status]);

  return (
    <div>
      <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-4 sm:p-5 mb-6 shadow-soft">
        <h2 className="sr-only">Filtros</h2>
        <div className="flex flex-col gap-4">
          <FilterRow label="Categoría">
            <FilterChip selected={cat === "all"} onSelect={() => setCat("all")}>
              Todas
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                selected={cat === c.id}
                onSelect={() => setCat(c.id)}
              >
                {c.label}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label="Departamento">
            <FilterChip
              selected={depto === "all"}
              onSelect={() => setDepto("all")}
            >
              Todos
            </FilterChip>
            {deptos.map((d) => (
              <FilterChip
                key={d}
                selected={depto === d}
                onSelect={() => setDepto(d)}
              >
                {d}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label="Estado">
            <FilterChip
              selected={status === "all"}
              onSelect={() => setStatus("all")}
            >
              Todos
            </FilterChip>
            {statuses.map((s) => (
              <FilterChip
                key={s}
                selected={status === s}
                onSelect={() => setStatus(s)}
              >
                {statusLabels[s]}
              </FilterChip>
            ))}
          </FilterRow>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-600">
          <span className="font-semibold text-neutral-900">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "reporte" : "reportes"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-neutral-50 ring-1 ring-neutral-200 p-10 text-center"
        >
          <p className="text-neutral-600">Sin reportes con esos filtros. Probá aflojar alguno.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r, i) => (
            <ReportCard key={r.id} report={r} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  children,
  selected,
  onSelect,
}: {
  children: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      )}
    >
      {children}
    </button>
  );
}

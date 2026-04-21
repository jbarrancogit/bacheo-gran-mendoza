"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, MapPin } from "lucide-react";
import {
  categories,
  statusLabels,
  statusStyles,
  type MockReport,
} from "@/lib/mock-data";
import { photoForCategory } from "@/lib/photos";
import { cn } from "@/lib/utils";

export function ReportCard({
  report,
  index = 0,
}: {
  report: MockReport;
  index?: number;
}) {
  const cat = categories.find((c) => c.id === report.category);
  const photo = photoForCategory(report.category, index);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl bg-white ring-1 ring-neutral-200 overflow-hidden shadow-soft hover:shadow-pop hover:ring-primary-300 transition-shadow will-change-transform"
    >
      <Link href={`/reportes/${report.id}`} className="block">
        <div className={cn("aspect-[16/10] relative overflow-hidden bg-gradient-to-br", report.imageBg)}>
          <Image
            src={photo}
            alt={`${cat?.label ?? "Reporte"} en ${report.street}, ${report.depto}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
          />
          <span
            className={cn(
              "absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm",
              statusStyles[report.status]
            )}
          >
            {statusLabels[report.status]}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-mono text-primary-700">{report.id}</span>
            <span aria-hidden>·</span>
            <span>hace {report.daysAgo} {report.daysAgo === 1 ? "día" : "días"}</span>
          </div>
          <h3 className="mt-1 font-semibold text-neutral-900 line-clamp-1">
            {cat?.label}: {report.street}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {report.depto}
          </div>
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
            {report.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              {report.alsoSaw} también lo vieron
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

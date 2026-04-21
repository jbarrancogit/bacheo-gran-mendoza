"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPinned } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-primary-100),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25] bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-700 ring-1 ring-primary-200 shadow-soft"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
          </span>
          Abierto · 6 departamentos del Gran Mendoza
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 font-display text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight text-neutral-900"
        >
          Reportá los baches
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent">
            {" "}de tu barrio.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto"
        >
          Una foto, el GPS de tu celular y una descripción corta. Tu reporte
          queda público en un mapa agregado. El municipio responde. Los vecinos
          también confirman.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/reportar"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-pop hover:bg-primary-600 transition-all hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.5)]"
          >
            Reportar un problema
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <Link
            href="/mapa"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-neutral-800 ring-1 ring-neutral-200 hover:bg-neutral-50 shadow-soft transition-colors"
          >
            <MapPinned className="h-4 w-4" aria-hidden />
            Ver el mapa
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 text-xs text-neutral-500"
        >
          Sin registrarte. Código abierto en GitHub. Cero costo para vos.
        </motion.p>
      </div>
    </section>
  );
}

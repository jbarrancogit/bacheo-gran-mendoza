"use client";

import Image from "next/image";
import { MapPin, Check } from "lucide-react";
import { motion } from "framer-motion";
import { photos } from "@/lib/photos";

/**
 * Mock visual del celular con una pantalla de reporte.
 * Sin interactividad real; solo para mostrar el producto.
 */
export function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${className}`}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div className="relative mx-auto w-[260px] sm:w-[300px] aspect-[9/19] rounded-[2.5rem] bg-neutral-900 p-3 shadow-[0_40px_80px_-20px_rgba(249,115,22,0.35),0_20px_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-neutral-800">
        {/* Notch */}
        <div
          aria-hidden
          className="absolute top-3 left-1/2 -translate-x-1/2 h-6 w-32 rounded-b-2xl bg-neutral-900 z-20"
        />
        {/* Screen */}
        <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-white">
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 pt-3 text-[10px] font-semibold text-neutral-900">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              <span className="h-2 w-3 rounded border border-neutral-900" />
            </span>
          </div>

          {/* App header */}
          <div className="px-4 pt-8 pb-3 bg-gradient-to-b from-primary-50 to-white">
            <div className="flex items-center gap-2">
              <div className="grid place-items-center h-7 w-7 rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
              </div>
              <span className="font-extrabold text-sm text-neutral-900">Bacheo</span>
              <span className="ml-auto text-[10px] font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                Reporte enviado
              </span>
            </div>
          </div>

          {/* Photo */}
          <div className="relative mx-3 mt-1 aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100">
            <Image
              src={photos.baches[0]}
              alt=""
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>

          {/* Meta */}
          <div className="px-4 mt-3">
            <div className="text-[10px] text-primary-700 font-mono font-bold">MZA-83421</div>
            <h3 className="mt-0.5 font-bold text-sm text-neutral-900">Bache en San Martín 1200</h3>
            <div className="mt-0.5 text-[10px] text-neutral-600 flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" aria-hidden />
              Godoy Cruz · hace 2 días
            </div>
          </div>

          {/* Timeline */}
          <div className="px-4 mt-3 space-y-2">
            <div className="flex items-center gap-2 text-[10px]">
              <div className="h-5 w-5 rounded-full bg-emerald-500 text-white grid place-items-center">
                <Check className="h-3 w-3" aria-hidden />
              </div>
              <span className="text-neutral-900 font-semibold">Enviado</span>
              <span className="ml-auto text-neutral-500">hace 2d</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="h-5 w-5 rounded-full bg-emerald-500 text-white grid place-items-center">
                <Check className="h-3 w-3" aria-hidden />
              </div>
              <span className="text-neutral-900 font-semibold">Recibido</span>
              <span className="ml-auto text-neutral-500">hace 1d</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              </div>
              <span className="text-neutral-900 font-semibold">En obra</span>
              <span className="ml-auto text-neutral-500">hoy</span>
            </div>
          </div>

          {/* Also saw */}
          <div className="absolute bottom-4 left-3 right-3">
            <div className="flex items-center justify-between rounded-xl bg-neutral-900 text-white px-3 py-2.5">
              <span className="text-[10px] font-semibold">47 vecinos lo vieron</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">+1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 bg-gradient-to-br from-primary-300/30 via-transparent to-primary-500/20 blur-3xl -z-10"
      />
    </motion.div>
  );
}

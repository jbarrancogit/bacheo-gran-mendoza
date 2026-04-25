"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { stats } from "@/lib/mock-data";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 70 });
  const rounded = useTransform(spring, (v) => Math.floor(v).toLocaleString("es-AR"));

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const entries = [
  { label: "Reportes enviados", value: stats.total },
  { label: "En obra", value: stats.enObra },
  { label: "Resueltos", value: stats.resueltos },
  { label: "Vecinos activos", value: stats.vecinosActivos },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="rounded-2xl bg-gradient-to-br from-primary-50 via-white to-primary-50 ring-1 ring-primary-200 p-6 sm:p-8">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <dt className="text-xs sm:text-sm text-neutral-600">{entry.label}</dt>
              <dd className="mt-1 font-display text-3xl sm:text-4xl font-black text-primary-600 tabular-nums">
                <AnimatedCounter value={entry.value} />
              </dd>
            </motion.div>
          ))}
        </dl>
        <p className="mt-4 text-[11px] text-neutral-500 text-center">
          Cifras de ejemplo. Vamos a publicar datos reales cuando tengamos volumen real.
        </p>
      </div>
    </section>
  );
}

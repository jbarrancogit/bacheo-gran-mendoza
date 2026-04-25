"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const items = [
  {
    quote:
      "Reporté un bache que venía rompiendo cubiertas hace meses. A los 4 días ya estaba la cuadrilla trabajando.",
    name: "Vero",
    role: "Vecina de Godoy Cruz",
  },
  {
    quote:
      "Me gusta que es público. Ves qué municipio responde y cuál no. Eso mueve cosas.",
    name: "Marcelo",
    role: "Vecino de Ciudad",
  },
  {
    quote:
      "Lo usé en tres semáforos distintos. La foto + GPS es todo lo que necesitás.",
    name: "Lu",
    role: "Vecina de Guaymallén",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Lo que dicen los vecinos
        </h2>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <motion.blockquote
            key={t.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="relative rounded-2xl bg-white ring-1 ring-neutral-200 p-6 shadow-soft"
          >
            <Quote className="h-5 w-5 text-primary-400" aria-hidden />
            <p className="mt-3 text-neutral-800 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-4 text-sm">
              <div className="font-semibold text-neutral-900">{t.name}</div>
              <div className="text-neutral-500">{t.role}</div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
      <p className="mt-6 text-[11px] text-neutral-500 text-center">
        Testimonios de ejemplo para el prototipo.
      </p>
    </section>
  );
}

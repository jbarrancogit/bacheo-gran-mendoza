"use client";

import { motion } from "framer-motion";
import { Camera, MapPin, Send } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Sacá la foto",
    description: "Una foto del bache o del problema, directo desde el celular.",
  },
  {
    icon: MapPin,
    title: "Marcá la ubicación",
    description: "Usamos tu GPS para registrar exactamente dónde está.",
  },
  {
    icon: Send,
    title: "Enviá el reporte",
    description: "Llega al municipio que corresponda y podés seguir el estado.",
  },
];

export function Steps() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Tres pasos. Un minuto.
        </h2>
        <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
          Sin registrarte, sin app para instalar, sin formularios eternos.
        </p>
      </div>

      <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl bg-white ring-1 ring-neutral-200 p-6 shadow-soft hover:shadow-pop hover:ring-primary-300 transition-all"
            >
              <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                Paso {i + 1}
              </div>
              <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary-50 text-primary-600">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{step.description}</p>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}

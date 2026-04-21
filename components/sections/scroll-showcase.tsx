"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Camera, MapPin, Send, Check } from "lucide-react";
import { photos } from "@/lib/photos";

/**
 * Sección scroll-linked con 3 "cards" 3D que aparecen en perspectiva
 * y se enderezan a medida que bajás.
 */

type CardDef = {
  icon: typeof Camera;
  title: string;
  description: string;
  photo: string;
  accent: string;
};

const cards: CardDef[] = [
  {
    icon: Camera,
    title: "Sacás la foto",
    description: "Una tomada desde tu celular muestra mejor el problema que cualquier descripción.",
    photo: photos.baches[0],
    accent: "from-primary-400/30 to-primary-600/20",
  },
  {
    icon: MapPin,
    title: "GPS automático",
    description: "La ubicación se registra sola. Vemos exactamente qué esquina, qué cuadra.",
    photo: photos.semaforos[0],
    accent: "from-sky-400/30 to-sky-600/20",
  },
  {
    icon: Send,
    title: "Al municipio correcto",
    description: "Según tu ubicación, el reporte llega al municipio que corresponde. Sin mediadores.",
    photo: photos.veredas[0],
    accent: "from-emerald-400/30 to-emerald-600/20",
  },
  {
    icon: Check,
    title: "Seguimiento público",
    description: "Cada reporte tiene un código. Lo seguís. Otros vecinos confirman. El municipio responde en el mapa.",
    photo: photos.luminaria[0],
    accent: "from-amber-400/30 to-amber-600/20",
  },
];

export function ScrollShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary-50/40 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl sm:text-5xl font-black tracking-tight"
        >
          Del celular al mapa público.
          <br />
          <span className="bg-gradient-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent">
            En menos de un minuto.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-neutral-700 max-w-2xl mx-auto"
        >
          Scrolleá para ver el flujo.
        </motion.p>
      </div>

      <div
        className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8 sm:space-y-16"
        style={{ perspective: "1400px" }}
      >
        {cards.map((card, i) => (
          <Showcase3DCard
            key={card.title}
            card={card}
            index={i}
            scrollProgress={scrollYProgress}
            total={cards.length}
          />
        ))}
      </div>
    </section>
  );
}

function Showcase3DCard({
  card,
  index,
  scrollProgress,
  total,
}: {
  card: CardDef;
  index: number;
  scrollProgress: MotionValue<number>;
  total: number;
}) {
  const segment = 1 / (total + 1);
  const enter = segment * index;
  const peak = segment * (index + 1);

  const rotateX = useTransform(
    scrollProgress,
    [enter, peak],
    [25, 0]
  );
  const y = useTransform(scrollProgress, [enter, peak], [80, 0]);
  const opacity = useTransform(scrollProgress, [enter, peak - 0.05], [0.2, 1]);
  const scale = useTransform(scrollProgress, [enter, peak], [0.92, 1]);

  const reverse = index % 2 === 1;
  const Icon = card.icon;

  return (
    <motion.article
      style={{
        rotateX,
        y,
        opacity,
        scale,
        transformStyle: "preserve-3d",
        transformOrigin: "center bottom",
      }}
      className="group relative"
    >
      <div
        className={`relative rounded-3xl bg-white ring-1 ring-neutral-200 shadow-pop overflow-hidden grid gap-0 md:grid-cols-2 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="relative aspect-[4/3] md:aspect-auto bg-neutral-100 min-h-64">
          <Image
            src={card.photo}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            aria-hidden
            className={`absolute inset-0 bg-gradient-to-br ${card.accent} mix-blend-multiply`}
          />
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-900 backdrop-blur-sm shadow-soft">
            <span className="text-primary-700">{String(index + 1).padStart(2, "0")}</span>
            / {String(total).padStart(2, "0")}
          </div>
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="inline-grid place-items-center h-11 w-11 rounded-xl bg-primary-50 text-primary-600">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="mt-5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            {card.title}
          </h3>
          <p className="mt-3 text-neutral-700 leading-relaxed">{card.description}</p>
        </div>
      </div>
    </motion.article>
  );
}

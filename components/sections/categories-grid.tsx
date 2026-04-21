"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/tilt-card";

export function CategoriesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Seis categorías que cubren lo que ves todos los días
        </h2>
        <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
          El MVP se enfoca en lo que afecta el transitar por la vía pública.
        </p>
      </div>

      <ul
        className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4"
        style={{ perspective: "1000px" }}
      >
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.li
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <TiltCard className="h-full">
                <Link
                  href={`/reportar?categoria=${cat.id}`}
                  className="group relative block rounded-2xl bg-white ring-1 ring-neutral-200 p-5 shadow-soft hover:shadow-pop hover:ring-primary-300 transition-shadow overflow-hidden h-full"
                >
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                      cat.accent
                    )}
                  />
                  <div className="grid place-items-center h-10 w-10 rounded-lg bg-neutral-100 text-neutral-800 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{cat.label}</h3>
                      <p className="mt-1 text-sm text-neutral-600">{cat.description}</p>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      aria-hidden
                    />
                  </div>
                </Link>
              </TiltCard>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

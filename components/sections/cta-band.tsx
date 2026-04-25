import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-8 sm:p-12 shadow-pop">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-black/10 blur-3xl"
        />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ¿Conocés una calle rota?
            </h2>
            <p className="mt-2 text-primary-50 max-w-lg">
              Sumá tu reporte al mapa público del Gran Mendoza. Es anónimo, es rápido, y quedan los datos para el vecino que viene atrás.
            </p>
          </div>
          <Link
            href="/reportar"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-primary-700 shadow-lg hover:bg-primary-50 transition-colors"
          >
            Reportar ahora
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

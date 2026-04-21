"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PartyPopper,
  X,
} from "lucide-react";
import { categories, type CategoryId } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type StepKey = "foto" | "ubicacion" | "categoria" | "confirmar" | "enviado";

const stepOrder: StepKey[] = ["foto", "ubicacion", "categoria", "confirmar"];
const stepLabels: Record<StepKey, string> = {
  foto: "Foto",
  ubicacion: "Ubicación",
  categoria: "Categoría",
  confirmar: "Confirmar",
  enviado: "Enviado",
};

type State = {
  step: StepKey;
  photoUrl: string | null;
  coords: { lat: number; lng: number } | null;
  gpsState: "idle" | "loading" | "ready";
  category: CategoryId | null;
  description: string;
  generatedId: string | null;
  submitting: boolean;
};

const mockCoords = { lat: -32.8908, lng: -68.8272 };

function generateReportId(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `MZA-${n}`;
}

export function ReportWizard() {
  const [state, setState] = useState<State>({
    step: "foto",
    photoUrl: null,
    coords: null,
    gpsState: "idle",
    category: null,
    description: "",
    generatedId: null,
    submitting: false,
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const stepIdx = stepOrder.indexOf(state.step);
  const isFinal = state.step === "enviado";

  function handlePhotoChange(file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setState((s) => ({ ...s, photoUrl: url }));
  }

  function simulateGps() {
    setState((s) => ({ ...s, gpsState: "loading" }));
    setTimeout(() => {
      setState((s) => ({ ...s, gpsState: "ready", coords: mockCoords }));
    }, 1200);
  }

  function canAdvance(step: StepKey): boolean {
    switch (step) {
      case "foto":
        return state.photoUrl !== null;
      case "ubicacion":
        return state.coords !== null;
      case "categoria":
        return state.category !== null && state.description.trim().length >= 10;
      case "confirmar":
        return true;
      case "enviado":
        return false;
    }
  }

  function next() {
    const idx = stepOrder.indexOf(state.step);
    if (idx < stepOrder.length - 1) {
      setState((s) => ({ ...s, step: stepOrder[idx + 1] }));
    }
  }
  function prev() {
    const idx = stepOrder.indexOf(state.step);
    if (idx > 0) setState((s) => ({ ...s, step: stepOrder[idx - 1] }));
  }

  function submit() {
    setState((s) => ({ ...s, submitting: true }));
    setTimeout(() => {
      const id = generateReportId();
      setState((s) => ({
        ...s,
        submitting: false,
        step: "enviado",
        generatedId: id,
      }));
    }, 1100);
  }

  function reset() {
    setState({
      step: "foto",
      photoUrl: null,
      coords: null,
      gpsState: "idle",
      category: null,
      description: "",
      generatedId: null,
      submitting: false,
    });
  }

  if (isFinal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-gradient-to-br from-primary-50 via-white to-primary-50 ring-1 ring-primary-200 p-8 sm:p-12 text-center shadow-pop"
      >
        <div className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-pop">
          <PartyPopper className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-bold tracking-tight">
          ¡Gracias!
        </h1>
        <p className="mt-3 text-neutral-700">
          Tu reporte quedó registrado con el código
        </p>
        <div className="mt-2 inline-block rounded-lg bg-white ring-1 ring-neutral-200 px-4 py-2 font-mono text-xl font-bold text-primary-700 tracking-wider">
          {state.generatedId}
        </div>
        <p className="mt-4 text-sm text-neutral-600 max-w-md mx-auto">
          Guardá este código. Podés compartirlo con otros vecinos que hayan
          visto el mismo problema o seguir el estado desde la página de reportes.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline">
            Reportar otro
          </Button>
          <a
            href={`/reportes`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-600 transition-colors"
          >
            Ver todos los reportes
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <ol className="flex items-center justify-between gap-2 mb-8">
        {stepOrder.map((key, i) => {
          const active = key === state.step;
          const done = i < stepIdx;
          return (
            <li key={key} className="flex-1 flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 shrink-0 rounded-full grid place-items-center text-xs font-bold transition-colors",
                  done && "bg-primary text-primary-foreground",
                  active && "bg-primary-100 text-primary-700 ring-2 ring-primary",
                  !done && !active && "bg-neutral-100 text-neutral-500"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <div className={cn("text-xs font-semibold", active ? "text-neutral-900" : "text-neutral-500")}>
                  {stepLabels[key]}
                </div>
              </div>
              {i < stepOrder.length - 1 && (
                <div className={cn("flex-1 h-0.5 rounded", done ? "bg-primary" : "bg-neutral-200")} aria-hidden />
              )}
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-6 sm:p-8 shadow-soft min-h-[380px]">
        <AnimatePresence mode="wait">
          {state.step === "foto" && (
            <motion.div
              key="foto"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold tracking-tight">
                ¿Podés sacar una foto?
              </h2>
              <p className="mt-2 text-neutral-600 text-sm">
                Una foto clara del problema. Mejor con buena luz, mostrando el contexto.
              </p>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                aria-label="Seleccionar foto"
                onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
              />

              {state.photoUrl ? (
                <div className="mt-6 relative rounded-xl overflow-hidden ring-1 ring-neutral-200 bg-neutral-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state.photoUrl}
                    alt="Foto del problema"
                    className="w-full aspect-video object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setState((s) => ({ ...s, photoUrl: null }))}
                    className="absolute top-2 right-2 rounded-full bg-black/60 text-white p-1.5 hover:bg-black/80"
                    aria-label="Quitar foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-6 w-full rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-primary-50 hover:border-primary-300 p-10 grid place-items-center text-center transition-colors"
                >
                  <div className="grid place-items-center h-12 w-12 rounded-xl bg-primary text-primary-foreground">
                    <Camera className="h-6 w-6" aria-hidden />
                  </div>
                  <p className="mt-4 font-semibold text-neutral-800">Tocá para sacar o subir una foto</p>
                  <p className="mt-1 text-sm text-neutral-600">JPG, PNG o HEIC. Máximo 10 MB.</p>
                </button>
              )}
            </motion.div>
          )}

          {state.step === "ubicacion" && (
            <motion.div
              key="ubicacion"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold tracking-tight">
                ¿Dónde está el problema?
              </h2>
              <p className="mt-2 text-neutral-600 text-sm">
                Usamos tu GPS para registrar la ubicación exacta. El mapa final es público.
              </p>

              <div className="mt-6 rounded-2xl overflow-hidden ring-1 ring-neutral-200">
                <div
                  aria-hidden
                  className="relative h-48 bg-gradient-to-br from-primary-100 via-neutral-100 to-primary-50 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
                >
                  {state.coords && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary-500/60" />
                        <div className="relative h-10 w-10 rounded-full bg-primary grid place-items-center ring-4 ring-white shadow-pop">
                          <MapPin className="h-5 w-5 text-primary-foreground" aria-hidden />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="p-4 bg-white text-sm">
                  {state.gpsState === "idle" && (
                    <Button onClick={simulateGps} variant="default" className="w-full">
                      <MapPin className="h-4 w-4" aria-hidden />
                      Usar mi ubicación
                    </Button>
                  )}
                  {state.gpsState === "loading" && (
                    <div className="flex items-center justify-center gap-2 text-neutral-600 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Obteniendo GPS...
                    </div>
                  )}
                  {state.gpsState === "ready" && state.coords && (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-neutral-500 text-xs">Ubicación aproximada</div>
                        <div className="font-mono text-neutral-900">
                          {state.coords.lat.toFixed(4)}, {state.coords.lng.toFixed(4)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={simulateGps}
                        className="text-xs text-primary-700 hover:underline"
                      >
                        Reintentar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {state.step === "categoria" && (
            <motion.div
              key="categoria"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold tracking-tight">
                ¿Qué tipo de problema es?
              </h2>
              <p className="mt-2 text-neutral-600 text-sm">
                Elegí una categoría y contanos brevemente qué pasa.
              </p>

              <fieldset className="mt-6">
                <legend className="sr-only">Categoría</legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const selected = state.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setState((s) => ({ ...s, category: cat.id }))}
                        aria-pressed={selected}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-xl p-3 text-left ring-1 transition-all",
                          selected
                            ? "bg-primary-50 ring-2 ring-primary text-primary-900 shadow-soft"
                            : "bg-white ring-neutral-200 hover:ring-primary-300 hover:bg-neutral-50"
                        )}
                      >
                        <Icon className="h-5 w-5 text-primary-600" aria-hidden />
                        <span className="text-sm font-semibold">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-6">
                <Label htmlFor="description">Descripción breve</Label>
                <Textarea
                  id="description"
                  placeholder="Ej: pozo grande en el carril derecho, juntaba agua con cada lluvia."
                  rows={4}
                  value={state.description}
                  onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
                  className="mt-2"
                />
                <div className="mt-1 flex justify-between text-xs text-neutral-500">
                  <span>{state.description.length < 10 ? "Mínimo 10 caracteres" : "Se ve bien"}</span>
                  <span>{state.description.length} / 280</span>
                </div>
              </div>
            </motion.div>
          )}

          {state.step === "confirmar" && (
            <motion.div
              key="confirmar"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Revisá antes de enviar
              </h2>
              <p className="mt-2 text-neutral-600 text-sm">
                Una vez enviado, el reporte queda público en el mapa.
              </p>

              <dl className="mt-6 space-y-4">
                {state.photoUrl && (
                  <div>
                    <dt className="text-xs text-neutral-500 mb-1">Foto</dt>
                    <dd>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={state.photoUrl}
                        alt="Foto del problema"
                        className="w-full max-h-56 object-cover rounded-xl ring-1 ring-neutral-200"
                      />
                    </dd>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-neutral-500">Ubicación</dt>
                    <dd className="font-mono text-sm text-neutral-900">
                      {state.coords
                        ? `${state.coords.lat.toFixed(4)}, ${state.coords.lng.toFixed(4)}`
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-neutral-500">Categoría</dt>
                    <dd className="text-sm text-neutral-900">
                      {state.category
                        ? categories.find((c) => c.id === state.category)?.label
                        : "—"}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="text-xs text-neutral-500">Descripción</dt>
                  <dd className="text-sm text-neutral-900 leading-relaxed mt-1">
                    {state.description}
                  </dd>
                </div>
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={prev}
          disabled={stepIdx === 0 || state.submitting}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden /> Atrás
        </Button>

        {state.step !== "confirmar" ? (
          <Button
            type="button"
            onClick={next}
            disabled={!canAdvance(state.step)}
          >
            Siguiente <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={submit}
            disabled={state.submitting}
            className="min-w-36"
          >
            {state.submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Enviando...
              </>
            ) : (
              <>
                Enviar reporte
                <ChevronRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

"use server";

import { z } from "zod";
import { getDb, hasDatabase } from "@/lib/db";
import { reports, statusEvents } from "@/lib/db/schema";
import { resolveDepto } from "@/lib/geo/resolve-depto";

const InputSchema = z.object({
  category: z.enum([
    "baches",
    "luminaria",
    "semaforos",
    "senalizacion",
    "ramas",
    "veredas",
  ]),
  description: z.string().trim().min(10).max(1000),
  lat: z.number().gte(-34).lte(-32),
  lng: z.number().gte(-70).lte(-67),
  addressText: z.string().trim().max(200).optional(),
  anonymousToken: z.string().trim().max(64).optional(),
  // Slice 1: turnstile token opcional. Cuando TURNSTILE_SECRET_KEY esté seteado,
  // se valida; si no, el reporte pasa.
  turnstileToken: z.string().optional(),
});

export type CreateReportInput = z.infer<typeof InputSchema>;

export type CreateReportResult =
  | { ok: true; code: string; demo: boolean }
  | { ok: false; error: string };

function generateCode(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `MZA-${n}`;
}

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // sin clave → modo demo, no validamos
  if (!token) return false;
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
    },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export async function createReport(
  raw: unknown,
): Promise<CreateReportResult> {
  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Datos del reporte inválidos." };
  }
  const input = parsed.data;

  const captchaOk = await verifyTurnstile(input.turnstileToken);
  if (!captchaOk) {
    return { ok: false, error: "Verificación anti-bot fallida." };
  }

  const depto = await resolveDepto(input.lat, input.lng);
  if (!depto) {
    return {
      ok: false,
      error:
        "El punto está fuera del Gran Mendoza. Solo aceptamos reportes en los 6 departamentos del AMB.",
    };
  }

  const code = generateCode();

  if (!hasDatabase()) {
    // Modo demo: no persistimos, devolvemos el código simulado.
    return { ok: true, code, demo: true };
  }

  const db = getDb();
  const [inserted] = await db
    .insert(reports)
    .values({
      code,
      category: input.category,
      lat: input.lat.toString(),
      lng: input.lng.toString(),
      depto,
      addressText: input.addressText,
      description: input.description,
      anonymousToken: input.anonymousToken,
    })
    .returning({ id: reports.id });

  await db.insert(statusEvents).values({
    reportId: inserted.id,
    toStatus: "enviado",
    actorRole: "system",
    detail: "Reporte creado por vecino",
  });

  return { ok: true, code, demo: false };
}

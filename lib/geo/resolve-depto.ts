import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import type { Depto } from "@/lib/mock-data";

const GEOJSON_TO_DEPTO: Record<string, Depto> = {
  CAPITAL: "Ciudad",
  "GODOY CRUZ": "Godoy Cruz",
  GUAYMALLEN: "Guaymallén",
  "LAS HERAS": "Las Heras",
  MAIPU: "Maipú",
  "LUJAN DE CUYO": "Luján de Cuyo",
};

let cached:
  | FeatureCollection<Polygon | MultiPolygon, { departamento: string }>
  | null = null;

async function loadGeo() {
  if (cached) return cached;
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "gran-mendoza.geojson",
  );
  const raw = await readFile(file, "utf8");
  cached = JSON.parse(raw);
  return cached!;
}

/**
 * Devuelve el departamento del Gran Mendoza que contiene el punto, o null si
 * está fuera de los 6 polígonos.
 */
export async function resolveDepto(
  lat: number,
  lng: number,
): Promise<Depto | null> {
  const geo = await loadGeo();
  const pt = point([lng, lat]);
  for (const f of geo.features) {
    if (booleanPointInPolygon(pt, f as Feature<Polygon | MultiPolygon>)) {
      const raw = f.properties?.departamento;
      const mapped = raw ? GEOJSON_TO_DEPTO[raw] : null;
      if (mapped) return mapped;
    }
  }
  return null;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Feature, FeatureCollection } from "geojson";
import {
  reports,
  categories,
  type MockReport,
  type CategoryId,
  type Depto,
} from "@/lib/mock-data";

const GRAN_MENDOZA_CENTER: [number, number] = [-32.92, -68.82];
const INITIAL_ZOOM = 11;

const DEPTO_CENTROIDS: Record<Depto, [number, number]> = {
  Ciudad: [-32.8908, -68.8272],
  "Godoy Cruz": [-32.9276, -68.8419],
  Guaymallén: [-32.9001, -68.8051],
  "Las Heras": [-32.8500, -68.8200],
  Maipú: [-32.9710, -68.7820],
  "Luján de Cuyo": [-33.0301, -68.8780],
};

// Mapeo nombre del GeoJSON (mayúsculas, sin acentos) → label de UI
const GEOJSON_TO_DEPTO: Record<string, Depto> = {
  CAPITAL: "Ciudad",
  "GODOY CRUZ": "Godoy Cruz",
  GUAYMALLEN: "Guaymallén",
  "LAS HERAS": "Las Heras",
  MAIPU: "Maipú",
  "LUJAN DE CUYO": "Luján de Cuyo",
};

const CATEGORY_COLORS: Record<CategoryId, string> = {
  baches: "#ea580c",
  luminaria: "#f59e0b",
  semaforos: "#dc2626",
  senalizacion: "#0284c7",
  ramas: "#059669",
  veredas: "#7c3aed",
};

const STATUS_RING: Record<MockReport["status"], string> = {
  enviado: "#737373",
  recibido: "#0284c7",
  "en-obra": "#d97706",
  resuelto: "#059669",
};

// PRNG determinístico a partir de un string (para jitter estable por reporte)
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32;
}

function reportLatLng(r: MockReport): [number, number] {
  const [lat, lng] = DEPTO_CENTROIDS[r.depto];
  const jitterLat = (hash(r.id) - 0.5) * 0.05;
  const jitterLng = (hash(r.id + "x") - 0.5) * 0.05;
  return [lat + jitterLat, lng + jitterLng];
}

function categoryIcon(cat: CategoryId, status: MockReport["status"]): L.DivIcon {
  const fill = CATEGORY_COLORS[cat];
  const ring = STATUS_RING[status];
  return L.divIcon({
    className: "mendoza-marker",
    html: `<div style="
      width: 28px; height: 28px; border-radius: 50%;
      background: ${fill}; border: 3px solid ${ring};
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      transform: translate(-50%, -100%);
      position: relative;
    "><div style="
      position: absolute; bottom: -8px; left: 50%;
      transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid ${ring};
    "></div></div>`,
    iconSize: [28, 36],
    iconAnchor: [0, 0],
  });
}

const POLYGON_STYLE = {
  weight: 2,
  color: "#ea580c",
  fillColor: "#ea580c",
  fillOpacity: 0.06,
  dashArray: "4 4",
} as const;

const POLYGON_HOVER = {
  fillOpacity: 0.18,
  weight: 3,
  dashArray: "",
} as const;

export default function MendozaMap() {
  const [geo, setGeo] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch("/data/gran-mendoza.geojson")
      .then((r) => r.json())
      .then(setGeo)
      .catch(() => setGeo(null));
  }, []);

  const counts = useMemo(() => {
    const c: Record<Depto, number> = {
      Ciudad: 0,
      "Godoy Cruz": 0,
      Guaymallén: 0,
      "Las Heras": 0,
      Maipú: 0,
      "Luján de Cuyo": 0,
    };
    for (const r of reports) c[r.depto]++;
    return c;
  }, []);

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-3xl ring-1 ring-neutral-200 shadow-pop">
      <MapContainer
        center={GRAN_MENDOZA_CENTER}
        zoom={INITIAL_ZOOM}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geo && (
          <GeoJSON
            data={geo}
            style={() => POLYGON_STYLE}
            onEachFeature={(feature: Feature, layer) => {
              const raw = feature.properties?.departamento as string;
              const depto = GEOJSON_TO_DEPTO[raw] ?? raw;
              const total = counts[depto as Depto] ?? 0;
              layer.bindTooltip(
                `<strong>${depto}</strong><br/>${total} reporte${total === 1 ? "" : "s"}`,
                { sticky: true, direction: "top" },
              );
              layer.on({
                mouseover: (e) => {
                  (e.target as L.Path).setStyle(POLYGON_HOVER);
                },
                mouseout: (e) => {
                  (e.target as L.Path).setStyle(POLYGON_STYLE);
                },
              });
            }}
          />
        )}

        {reports.map((r) => {
          const cat = categories.find((c) => c.id === r.category);
          return (
            <Marker
              key={r.id}
              position={reportLatLng(r)}
              icon={categoryIcon(r.category, r.status)}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-mono text-xs text-neutral-500">{r.id}</div>
                  <div className="mt-1 font-semibold">{cat?.label}</div>
                  <div className="text-neutral-700">{r.street}</div>
                  <div className="text-xs text-neutral-500">
                    {r.depto} · hace {r.daysAgo} día{r.daysAgo === 1 ? "" : "s"}
                  </div>
                  <a
                    href={`/reportes/${r.id}`}
                    className="mt-2 inline-block text-primary-600 underline"
                  >
                    Ver reporte
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-[400] rounded-2xl bg-white/95 backdrop-blur ring-1 ring-neutral-200 p-3 shadow-pop max-w-[200px]">
      <div className="text-xs font-semibold text-neutral-800 mb-2">
        Categorías
      </div>
      <ul className="grid grid-cols-1 gap-1.5">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block h-3 w-3 rounded-full ring-2 ring-white shadow"
              style={{ background: CATEGORY_COLORS[c.id] }}
              aria-hidden
            />
            <span className="text-neutral-700">{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

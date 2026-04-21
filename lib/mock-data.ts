import type { LucideIcon } from "lucide-react";
import {
  Construction,
  Lightbulb,
  TrafficCone,
  SignpostBig,
  TreeDeciduous,
  Footprints,
} from "lucide-react";

export type CategoryId =
  | "baches"
  | "luminaria"
  | "semaforos"
  | "senalizacion"
  | "ramas"
  | "veredas";

export type Category = {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

export const categories: Category[] = [
  {
    id: "baches",
    label: "Baches",
    description: "Pozos, grietas, asfalto hundido o roto.",
    icon: Construction,
    accent: "from-primary-500/20 to-primary-600/10",
  },
  {
    id: "luminaria",
    label: "Luminaria",
    description: "Farolas fundidas, columnas caídas, cables sueltos.",
    icon: Lightbulb,
    accent: "from-amber-500/20 to-amber-600/10",
  },
  {
    id: "semaforos",
    label: "Semáforos",
    description: "Semáforos rotos o que no funcionan.",
    icon: TrafficCone,
    accent: "from-red-500/20 to-red-600/10",
  },
  {
    id: "senalizacion",
    label: "Señalización",
    description: "Carteles caídos, senda peatonal borrada, líneas ausentes.",
    icon: SignpostBig,
    accent: "from-sky-500/20 to-sky-600/10",
  },
  {
    id: "ramas",
    label: "Ramas y árboles",
    description: "Ramas bajas, caídas o árboles que invaden la calzada.",
    icon: TreeDeciduous,
    accent: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    id: "veredas",
    label: "Veredas",
    description: "Veredas rotas o peligrosas para peatones.",
    icon: Footprints,
    accent: "from-violet-500/20 to-violet-600/10",
  },
];

export type ReportStatus = "enviado" | "recibido" | "en-obra" | "resuelto";

export const statusLabels: Record<ReportStatus, string> = {
  enviado: "Enviado",
  recibido: "Recibido",
  "en-obra": "En obra",
  resuelto: "Resuelto",
};

export const statusStyles: Record<ReportStatus, string> = {
  enviado: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
  recibido: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  "en-obra": "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  resuelto: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export type Depto =
  | "Ciudad"
  | "Godoy Cruz"
  | "Guaymallén"
  | "Las Heras"
  | "Maipú"
  | "Luján de Cuyo";

export const deptos: Depto[] = [
  "Ciudad",
  "Godoy Cruz",
  "Guaymallén",
  "Las Heras",
  "Maipú",
  "Luján de Cuyo",
];

export type MockReport = {
  id: string;
  category: CategoryId;
  status: ReportStatus;
  street: string;
  depto: Depto;
  description: string;
  createdAt: string;
  daysAgo: number;
  alsoSaw: number;
  imageBg: string;
  timeline: { at: string; label: string; detail?: string }[];
};

export const reports: MockReport[] = [
  {
    id: "MZA-83421",
    category: "baches",
    status: "en-obra",
    street: "San Martín al 1200",
    depto: "Godoy Cruz",
    description:
      "Pozo profundo en el carril derecho, mojaba con cada lluvia. Roto desde hace semanas.",
    createdAt: "2026-04-12",
    daysAgo: 9,
    alsoSaw: 47,
    imageBg: "from-primary-500/40 via-primary-600/30 to-primary-900/40",
    timeline: [
      { at: "Hace 9 días", label: "Enviado" },
      { at: "Hace 7 días", label: "Recibido", detail: "Municipio de Godoy Cruz" },
      { at: "Hace 2 días", label: "En obra", detail: "Cuadrilla asignada" },
    ],
  },
  {
    id: "MZA-81099",
    category: "luminaria",
    status: "resuelto",
    street: "Pellegrini y Mitre",
    depto: "Ciudad",
    description:
      "Tres farolas apagadas en la esquina. Zona peligrosa de noche.",
    createdAt: "2026-04-05",
    daysAgo: 16,
    alsoSaw: 23,
    imageBg: "from-amber-500/40 via-amber-600/30 to-amber-900/40",
    timeline: [
      { at: "Hace 16 días", label: "Enviado" },
      { at: "Hace 14 días", label: "Recibido", detail: "Municipio Ciudad" },
      { at: "Hace 11 días", label: "En obra" },
      { at: "Hace 3 días", label: "Resuelto", detail: "Luminaria reemplazada" },
    ],
  },
  {
    id: "MZA-82677",
    category: "semaforos",
    status: "recibido",
    street: "Acceso Este km 3",
    depto: "Guaymallén",
    description:
      "Semáforo titilando en ámbar hace 3 días. Riesgo alto en esa intersección.",
    createdAt: "2026-04-17",
    daysAgo: 4,
    alsoSaw: 89,
    imageBg: "from-red-500/40 via-red-600/30 to-red-900/40",
    timeline: [
      { at: "Hace 4 días", label: "Enviado" },
      { at: "Hace 2 días", label: "Recibido", detail: "Vialidad Provincial" },
    ],
  },
  {
    id: "MZA-83901",
    category: "veredas",
    status: "enviado",
    street: "Belgrano 543",
    depto: "Las Heras",
    description:
      "Baldosas levantadas por raíces de árbol. Ya se cayó una persona mayor.",
    createdAt: "2026-04-19",
    daysAgo: 2,
    alsoSaw: 12,
    imageBg: "from-violet-500/40 via-violet-600/30 to-violet-900/40",
    timeline: [{ at: "Hace 2 días", label: "Enviado" }],
  },
  {
    id: "MZA-82044",
    category: "ramas",
    status: "recibido",
    street: "Boulogne Sur Mer 2100",
    depto: "Ciudad",
    description:
      "Rama grande caída tras el viento Zonda. Obstruye medio carril.",
    createdAt: "2026-04-15",
    daysAgo: 6,
    alsoSaw: 34,
    imageBg: "from-emerald-500/40 via-emerald-600/30 to-emerald-900/40",
    timeline: [
      { at: "Hace 6 días", label: "Enviado" },
      { at: "Hace 4 días", label: "Recibido", detail: "Municipio Ciudad" },
    ],
  },
  {
    id: "MZA-83155",
    category: "senalizacion",
    status: "en-obra",
    street: "Ruta 40 km 10",
    depto: "Luján de Cuyo",
    description:
      "Cartel de 'Pare' arrancado. Cruce complicado en horario pico.",
    createdAt: "2026-04-14",
    daysAgo: 7,
    alsoSaw: 18,
    imageBg: "from-sky-500/40 via-sky-600/30 to-sky-900/40",
    timeline: [
      { at: "Hace 7 días", label: "Enviado" },
      { at: "Hace 5 días", label: "Recibido" },
      { at: "Hace 1 día", label: "En obra" },
    ],
  },
  {
    id: "MZA-80883",
    category: "baches",
    status: "resuelto",
    street: "Sarmiento 3000",
    depto: "Maipú",
    description: "Pozo hondo que rompió 4 cubiertas en dos semanas.",
    createdAt: "2026-03-28",
    daysAgo: 24,
    alsoSaw: 61,
    imageBg: "from-primary-500/40 via-primary-600/30 to-primary-900/40",
    timeline: [
      { at: "Hace 24 días", label: "Enviado" },
      { at: "Hace 22 días", label: "Recibido" },
      { at: "Hace 18 días", label: "En obra" },
      { at: "Hace 5 días", label: "Resuelto" },
    ],
  },
  {
    id: "MZA-82511",
    category: "baches",
    status: "enviado",
    street: "Ozamis y Paso",
    depto: "Guaymallén",
    description: "Pozo reciente después de la última lluvia.",
    createdAt: "2026-04-20",
    daysAgo: 1,
    alsoSaw: 7,
    imageBg: "from-primary-500/40 via-primary-600/30 to-primary-900/40",
    timeline: [{ at: "Hace 1 día", label: "Enviado" }],
  },
  {
    id: "MZA-82788",
    category: "luminaria",
    status: "en-obra",
    street: "Avenida Las Heras 1500",
    depto: "Ciudad",
    description: "Columna inclinada, cables colgando cerca del piso.",
    createdAt: "2026-04-16",
    daysAgo: 5,
    alsoSaw: 29,
    imageBg: "from-amber-500/40 via-amber-600/30 to-amber-900/40",
    timeline: [
      { at: "Hace 5 días", label: "Enviado" },
      { at: "Hace 3 días", label: "Recibido" },
      { at: "Hace 1 día", label: "En obra", detail: "EDEMSA notificada" },
    ],
  },
  {
    id: "MZA-82309",
    category: "veredas",
    status: "recibido",
    street: "Tiburcio Benegas 890",
    depto: "Godoy Cruz",
    description: "Vereda rota a lo largo de 20 metros. Intransitable con coche de bebé.",
    createdAt: "2026-04-13",
    daysAgo: 8,
    alsoSaw: 15,
    imageBg: "from-violet-500/40 via-violet-600/30 to-violet-900/40",
    timeline: [
      { at: "Hace 8 días", label: "Enviado" },
      { at: "Hace 6 días", label: "Recibido" },
    ],
  },
  {
    id: "MZA-83700",
    category: "senalizacion",
    status: "enviado",
    street: "Chile y Colón",
    depto: "Ciudad",
    description: "Senda peatonal totalmente borrada.",
    createdAt: "2026-04-18",
    daysAgo: 3,
    alsoSaw: 9,
    imageBg: "from-sky-500/40 via-sky-600/30 to-sky-900/40",
    timeline: [{ at: "Hace 3 días", label: "Enviado" }],
  },
  {
    id: "MZA-82922",
    category: "ramas",
    status: "resuelto",
    street: "Lateral Norte km 5",
    depto: "Las Heras",
    description: "Árbol entero caído tras tormenta.",
    createdAt: "2026-04-08",
    daysAgo: 13,
    alsoSaw: 41,
    imageBg: "from-emerald-500/40 via-emerald-600/30 to-emerald-900/40",
    timeline: [
      { at: "Hace 13 días", label: "Enviado" },
      { at: "Hace 12 días", label: "Recibido" },
      { at: "Hace 10 días", label: "En obra" },
      { at: "Hace 2 días", label: "Resuelto" },
    ],
  },
];

export const stats = {
  total: 1284,
  enObra: 173,
  resueltos: 642,
  vecinosActivos: 3712,
};

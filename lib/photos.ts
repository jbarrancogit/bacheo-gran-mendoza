/**
 * Fotos representativas via Unsplash.
 * Licencia Unsplash permite hotlink y uso comercial/no-comercial sin atribución obligatoria.
 * Para producción conviene cachear en Vercel Blob o similar.
 */

export const photos = {
  // Hero — phone con reporte, foto urbana
  heroStreet:
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",

  // Fotos por categoría (para mocks de reportes)
  baches: [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=800&q=80",
  ],
  luminaria: [
    "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80",
  ],
  semaforos: [
    "https://images.unsplash.com/photo-1495055154266-57bbdeada43e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562016600-ece13e8ba570?auto=format&fit=crop&w=800&q=80",
  ],
  senalizacion: [
    "https://images.unsplash.com/photo-1547147253-ef1fcc989eed?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80",
  ],
  ramas: [
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560714712-5f18b8e0e72d?auto=format&fit=crop&w=800&q=80",
  ],
  veredas: [
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523311229920-b9b4cb2b0b0b?auto=format&fit=crop&w=800&q=80",
  ],

  // Showcase section — antes/después
  showcaseBefore:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80",
  showcaseAfter:
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80",

  // Vecino real reportando desde celular (para mockup)
  vecinoReportando:
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80",

  // Mendoza: montañas + ciudad para ambient
  mendoza:
    "https://images.unsplash.com/photo-1587402092301-725e37c70fd8?auto=format&fit=crop&w=1400&q=80",
} as const;

export function photoForCategory(cat: keyof typeof photoSets, idx = 0): string {
  const arr = photoSets[cat];
  return arr[idx % arr.length];
}

const photoSets: Record<
  "baches" | "luminaria" | "semaforos" | "senalizacion" | "ramas" | "veredas",
  readonly string[]
> = {
  baches: photos.baches,
  luminaria: photos.luminaria,
  semaforos: photos.semaforos,
  senalizacion: photos.senalizacion,
  ramas: photos.ramas,
  veredas: photos.veredas,
};

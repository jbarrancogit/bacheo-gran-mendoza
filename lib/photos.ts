/**
 * Fotos representativas via Unsplash, curadas por categoría real de la plataforma.
 * Licencia Unsplash permite hotlink y uso comercial/no-comercial sin atribución obligatoria.
 * Para producción conviene cachear en Vercel Blob o similar.
 */

const Q = "auto=format&fit=crop&q=80";

export const photos = {
  // Hero — Mendoza ciudad real (montañas + urbe)
  heroStreet: `https://images.unsplash.com/photo-1546863340-7e4e97e46f42?${Q}&w=1400`,

  // Mendoza ambient (paisaje + ciudad para fondos)
  mendoza: `https://images.unsplash.com/photo-1690993444739-c75bef705568?${Q}&w=1400`,

  // Baches / asfalto roto (categoría #1 reportada)
  baches: [
    `https://images.unsplash.com/photo-1658223684971-f262da87168f?${Q}&w=800`,
    `https://images.unsplash.com/photo-1730674337922-0bf08006a66a?${Q}&w=800`,
    `https://images.unsplash.com/photo-1675430427954-2a1c9c8e4a06?${Q}&w=800`,
  ],

  // Luminarias / faroles (rotos o apagados)
  luminaria: [
    `https://images.unsplash.com/photo-1594028235752-10a0cb865c7c?${Q}&w=800`,
    `https://images.unsplash.com/photo-1516654128283-29f6528d3b4b?${Q}&w=800`,
  ],

  // Semáforos
  semaforos: [
    `https://images.unsplash.com/photo-1692471661585-91a0c147606e?${Q}&w=800`,
    `https://images.unsplash.com/photo-1664307015237-f0f6d6f5d913?${Q}&w=800`,
  ],

  // Señalización vial dañada
  senalizacion: [
    `https://images.unsplash.com/photo-1776612649346-c72a8de37463?${Q}&w=800`,
    `https://images.unsplash.com/photo-1759803612770-0330d9081176?${Q}&w=800`,
  ],

  // Ramas / arbolado urbano caído
  ramas: [
    `https://images.unsplash.com/photo-1759214041764-24b9878eb000?${Q}&w=800`,
    `https://images.unsplash.com/photo-1682246968842-37fd860aa728?${Q}&w=800`,
  ],

  // Veredas rotas
  veredas: [
    `https://images.unsplash.com/photo-1717185691293-4ecd7072b847?${Q}&w=800`,
    `https://images.unsplash.com/photo-1575292005386-1d2ba352777d?${Q}&w=800`,
  ],

  // Showcase antes/después — bache → asfalto reparado
  showcaseBefore: `https://images.unsplash.com/photo-1658223684971-f262da87168f?${Q}&w=1000`,
  showcaseAfter: `https://images.unsplash.com/photo-1624084340915-8ef036692deb?${Q}&w=1000`,

  // Vecino reportando — celular fotografiando la calle
  vecinoReportando: `https://images.unsplash.com/photo-1612162888474-cac677fe6372?${Q}&w=900`,
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

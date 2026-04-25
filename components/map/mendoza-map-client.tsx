"use client";

import dynamic from "next/dynamic";

const MendozaMap = dynamic(() => import("./mendoza-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[640px] w-full rounded-3xl ring-1 ring-neutral-200 bg-neutral-50 grid place-items-center">
      <div className="text-sm text-neutral-500">Cargando mapa…</div>
    </div>
  ),
});

export default function MendozaMapClient() {
  return <MendozaMap />;
}

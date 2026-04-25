const env = process.env.NEXT_PUBLIC_ENV ?? "local";

export function EnvBanner() {
  if (env === "prod") return null;
  const label = env.toUpperCase();
  return (
    <div
      role="status"
      aria-label={`Entorno ${label}`}
      className="bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider text-center py-1.5"
    >
      Entorno: {label}
    </div>
  );
}

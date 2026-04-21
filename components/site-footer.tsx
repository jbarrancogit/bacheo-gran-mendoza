import Link from "next/link";
import { Github, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-extrabold text-lg">
            <span className="grid place-items-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-4 w-4" aria-hidden />
            </span>
            <span>Bacheo Gran Mendoza</span>
          </div>
          <p className="mt-3 text-sm text-neutral-600 max-w-md">
            Plataforma cívica e independiente para que los vecinos reporten
            baches y problemas viales en los 6 departamentos del Gran Mendoza.
            Código abierto, datos abiertos.
          </p>
        </div>

        <nav aria-label="Plataforma" className="text-sm">
          <h3 className="font-semibold text-neutral-900 mb-3">Plataforma</h3>
          <ul className="space-y-2 text-neutral-600">
            <li><Link href="/reportar" className="hover:text-primary-600">Reportar</Link></li>
            <li><Link href="/reportes" className="hover:text-primary-600">Reportes</Link></li>
            <li><Link href="/mapa" className="hover:text-primary-600">Mapa</Link></li>
          </ul>
        </nav>

        <nav aria-label="Proyecto" className="text-sm">
          <h3 className="font-semibold text-neutral-900 mb-3">Proyecto</h3>
          <ul className="space-y-2 text-neutral-600">
            <li>
              <a
                href="https://github.com/jbarrancogit/bacheo-gran-mendoza"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primary-600"
              >
                <Github className="h-4 w-4" aria-hidden /> GitHub
              </a>
            </li>
            <li>
              <a
                href="mailto:juan.barranco@alumnos.frm.utn.edu.ar"
                className="inline-flex items-center gap-1.5 hover:text-primary-600"
              >
                <Mail className="h-4 w-4" aria-hidden /> Contacto
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-neutral-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© 2026 Bacheo Gran Mendoza · Código MIT</p>
          <p>Hecho desde Mendoza, Argentina</p>
        </div>
      </div>
    </footer>
  );
}

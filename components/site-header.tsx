"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/reportar", label: "Reportar" },
  { href: "/reportes", label: "Reportes" },
  { href: "/mapa", label: "Mapa" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-4 w-4" aria-hidden />
          </span>
          <span>Bacheo</span>
          <span className="text-neutral-500 font-medium hidden sm:inline">Gran Mendoza</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Principal">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-100"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/reportar"
            className="ml-2 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-600 transition-colors"
          >
            Nuevo reporte
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden border-t border-neutral-200 overflow-hidden"
            aria-label="Mobile"
          >
            <ul className="p-3 flex flex-col gap-1">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-md text-base font-medium",
                        active
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-800 hover:bg-neutral-100"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-1">
                <Link
                  href="/reportar"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-md text-center bg-primary text-primary-foreground font-semibold"
                >
                  Nuevo reporte
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

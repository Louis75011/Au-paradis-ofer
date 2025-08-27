"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";

/** En-tête principal inspiré de la maquette, avec logo et navigation. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

type KnownRoute = Route | "/gite" | "/chiens";

const nav = [
  { href: "/tarifs",  label: "Tarifs" },
  { href: "/about",   label: "À propos" },
  { href: "/gite",    label: "Gîte (à venir)" },
  { href: "/chiens",  label: "Chiens (à venir)" },
  { href: "/contact", label: "Contact" },
] as const satisfies ReadonlyArray<{ href: KnownRoute; label: string }>;

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-brand-dark/95 text-white backdrop-blur">
      <div className="container max-w-7xl flex items-center justify-between py-3">
        <Link href="/" aria-label="Accueil - Au Paradis O'Fer" className="flex items-center gap-3">
          <Image src="/images/logo-sans-fond.png" alt="Logo Au Paradis O'Fer" width={140} height={64} priority />
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={{ pathname: n.href }}
                  className={`hover:underline underline-offset-4 ${pathname === n.href ? "font-semibold" : ""}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="md:hidden rounded bg-white/10 px-3 py-2"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {open && (
        <div id="menu-mobile" className="md:hidden border-t border-white/10 bg-brand-dark">
          <nav className="container max-w-7xl py-2">
            <ul className="flex flex-col gap-2 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={{ pathname: n.href }} className="block rounded px-3 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

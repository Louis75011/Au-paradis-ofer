"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";

type KnownRoute = Route | "/gite" | "/chiens";

const navItems = [
  { href: "/tarifs",  label: "Tarifs" },
  { href: "/about",   label: "À propos" },
  { href: "/gite",    label: "Gîte (à venir)" },
  // { href: "/chiens",  label: "Chiens (à venir)" },
  { href: "/contact", label: "Contact" },
] as const satisfies ReadonlyArray<{ href: KnownRoute; label: string }>;

/** En-tête principal inspiré de la maquette, avec logo et navigation. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[--color-brand-dark] text-white">
      <div className="container max-w-7xl flex items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Accueil - Au Paradis O'Fer" className="flex items-center gap-3">
          <Image src="/images/logo-sans-fond.png" alt="Logo Au Paradis O'Fer" width={140} height={64} priority />
        </Link>

        {/* Desktop */}
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {navItems.map((n) => {
              const active = pathname === n.href;
              return (
                <li key={n.href as string}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded px-2 py-1 hover:underline underline-offset-4 ${active ? "font-semibold bg-white/10" : ""}`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile */}
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
        <div id="menu-mobile" className="md:hidden border-t border-white/10">
          <nav className="container max-w-7xl py-2">
            <ul className="flex flex-col gap-1 text-sm">
              {navItems.map((n) => (
                <li key={n.href as string}>
                  <Link
                    href={n.href}
                    className="block rounded px-3 py-2 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
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

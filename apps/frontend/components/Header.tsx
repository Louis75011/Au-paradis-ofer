"use client";

import Image from "next/image";
import Link from "next/link";
// import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";

type KnownRoute =
  | "/"
  | "/a-propos"
  | "/chevaux"
  | "/installations"
  | "/tarifs"
  | "/gites"
  | "/contact"
  | "/chiens";

const navItems = [
  { href: "/a-propos", label: "À propos" },
  { href: "/chevaux", label: "Nos chevaux" },
  { href: "/installations", label: "Nos installations" },
  { href: "/tarifs", label: "Séances" },
  { href: "/gites", label: "Gîtes" },
  // { href: "/chiens",  label: "Chiens (à venir)" },
  { href: "/contact", label: "Contact" },
] as const satisfies ReadonlyArray<{ href: KnownRoute; label: string }>;

/** En-tête principal inspiré de la maquette, avec logo et navigation. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-brand-dark text-white">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Accueil - Au Paradis O'Fer" className="flex items-center gap-3">
          <Image
            src="/images/logo-sans-fond.png"
            alt="Logo Au Paradis O'Fer"
            width={200} /* un peu plus grand en desktop */
            height={68}
            priority
          />
        </Link>

        {/* Desktop */}
        <nav aria-label="Navigation principale" className="hidden md:block pr-4">
          <ul className="nav-bar">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href as string}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`nav-link underline-offset-4 hover:underline ${active ? "bg-white/10" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile */}
        <button
          className="md:hidden rounded bg-white/10 px-3 py-2 text-base"
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
              {navItems.map((item) => (
                <li key={item.href as string}>
                  <Link
                    href={item.href}
                    className="block rounded px-3 py-3 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
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

// apps/frontend/components/Footer.tsx
import Link from "next/link";
import tracts from "@/data/tracts.json";

export default function Footer() {
  const { tel, mail, adresse } = tracts.coordonnees;

  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 grid gap-6 md:grid-cols-4">
        {/* Identité */}
        <div>
          <p className="font-semibold py-2">Au Paradis O&apos;Fer</p>
          <p className="opacity-90">Centre d’accueil en zoothérapie</p>
          <p className="opacity-90">Médiation animale</p>
        </div>

        {/* Coordonnées */}
        <div>
          <p className="font-semibold py-2">Coordonnées</p>
          <p>
            Tél :{" "}
            <a href={`tel:${tel.replace(/\s/g, "")}`}>
              {tel}
            </a>
          </p>
          <p>
            Email :{" "}
            <a className="text-sm" href={`mailto:${mail}`}>
              {mail}
            </a>
          </p>
          <p className="opacity-90">{adresse}</p>
        </div>

        {/* Horaires */}
        <div>
          <p className="font-semibold py-2">Horaires & Infos</p>
          <p className="opacity-90">Séances sur réservation • Accueil familial</p>
          <p className="opacity-90">
            En semaine, entre 9&nbsp;h et 18&nbsp;h
          </p>
        </div>

        {/* RGPD */}
        <nav aria-label="Liens juridiques">
          <p className="font-semibold py-2">RGPD & Légal</p>
          <ul className="mt-1 space-y-1">
            <li>
              <Link href="/mentions-legales">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/cookies">
                Politique cookies
              </Link>
            </li>
            <li>
              {/* Ce bouton ouvrira votre modal CookiePrefs quand vous l’ajouterez */}
              <button
                type="button"
               
                data-cookieprefs-open="true"
                aria-controls="cookieprefs-dialog"
              >
                Gérer mes cookies
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="text-center bg-black/30 py-3 text-xs">
        © {new Date().getFullYear()} Au Paradis O&apos;Fer
      </div>
    </footer>
  );
}

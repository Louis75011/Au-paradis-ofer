import tarifs from "@/data/tarifs.json";

export const metadata = { title: "Tarifs" };

export default function TarifsPage() {
  return (
    <div className="container mx-auto py-10 px-12">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Tarifs des séances</h1>

      <ul className="grid gap-5 md:grid-cols-2">
        {tarifs.map((t) => (
          <li
            key={t.id}
            className="card group hover-card /* cursor-hoof */ relative p-6"
            aria-label={`${t.intitule}, ${t.duree}, ${t.prix} euros`}
          >
            {/* Petit pictogramme en haut à droite qui se révèle au survol */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              {/* loupe minimaliste en SVG, inline pour éviter une dépendance d’icônes */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="img">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>

            <p className="font-semibold">{t.intitule}</p>
            <p className="text-sm opacity-80">Durée : {t.duree}</p>
            <p className="mt-2 text-lg font-bold">{t.prix} €</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

import gites from "@/data/gites.json";

export const metadata = { title: "Gîte (à venir)" };

type Gite = {
  id: number;
  intitule: string;
  duree: string;
  prix: number;
  unite?: string;        // "€/nuit" | "€/nuit/personne" ...
  capaciteMax?: number;  // 6
  note?: string;         // ex: "+35 € par personne en plus / nuit"
};

export default function GitePage() {
  const offres = gites as Gite[];

  return (
    <div className="page">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Gîte – prochainement</h1>
        <p className="mt-3 max-w-3xl leading-relaxed">
          Nous préparons un hébergement simple et chaleureux sur place pour prolonger l’expérience au contact des chevaux. Informations, photos et réservation arriveront bientôt.
        </p>

        {/* Badge "A venir" discret */}
        <div className="mt-3">
          <span aria-hidden className="badge badge-ghost"><b>Ouverture à venir</b></span>
        </div>
      </header>

      {/* Cartes tarifs gîte (données issues du tract) */}
      <ul className="grid gap-5 md:grid-cols-2">
        {offres.map((o) => (
          <li
            key={o.id}
            className="card hover-card group relative p-6"
            aria-label={`${o.intitule}, ${o.duree}, ${o.prix} ${o.unite ?? "€"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{o.intitule}</p>
                <p className="text-sm opacity-80">Durée : {o.duree}</p>
                {o.capaciteMax ? (
                  <p className="mt-1 text-xs opacity-70">Capacité : jusqu’à {o.capaciteMax} personnes</p>
                ) : null}
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">
                  {o.prix}
                  <span className="text-base align-top"> €</span>
                </p>
                {o.unite && <p className="text-xs opacity-70">{o.unite}</p>}
              </div>
            </div>

            {o.note && <p className="mt-2 text-xs opacity-70">{o.note}</p>}

            {/* Petit pictogramme de regard au survol */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="img">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
          </li>
        ))}
      </ul>

      {/* État d’avancement (conserve section existante) */}
      <div className="mt-8 rounded-2xl border border-dashed border-brand-dark/30 p-6">
        <p className="font-medium">État :</p>
        <ul className="list-disc pl-5">
          <li>Configuration des chambres</li>
          <li>Équipements & sécurité</li>
          <li>Ouverture prévisionnelle : <b>courant 2026</b></li>
        </ul>
      </div>
    </div>
  );
}

import tarifs from "@/data/tarifs.json";
import ReserveButtons from "@/components/ReserveButtons";

export const metadata = { title: "Tarifs" };

export default function TarifsPage({ url }: { url: string }) {
  return (
    <div className="container mx-auto py-10 px-12">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Tarifs des séances de médiation</h1>

      <p>
        Les modalités proposées sont les suivantes&nbsp;: paiement par carte pour les réservations
        de dernière minute, et éventuellement par virement SEPA pour celles planifiées à l’avance. Vous pouvez
        réserver directement via le calendrier ou bien nous contacter.
      </p>
      <br></br>

      <ul className="grid gap-5 md:grid-cols-2">
        {tarifs.map((t) => (
          <li
            key={t.id}
            className="card group hover-card /* cursor-hoof */ bg-brand-sky relative p-6"
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

            {/* state de date à passer ici ? */}
            {/* <ReserveButtons dateISO={selectedDate} /> */}
            {/* Sans date pour l’instant : propose les 2 */}
            <div className="mt-4 flex gap-2">
              <a
                className="btn btn-primary hover-button bg-brand-dark"
                href={process.env.NEXT_PUBLIC_CAL_RUSH!}
                target="_blank"
              >
                Carte
              </a>
              <a
                className="btn btn-ghost hover-button bg-brand-dark"
                href={process.env.NEXT_PUBLIC_CAL_REGULAR!}
                target="_blank"
              >
                SEPA ou carte
              </a>
            </div>
          </li>
        ))}
      </ul>

      {/* Embed Cal.com sur une page (à venir) */}
      {/* <iframe
        src={url}
        style={{ width: "100%", height: "80vh", border: "0", borderRadius: "16px" }}
        loading="lazy"
      /> */}
    </div>
  );
}

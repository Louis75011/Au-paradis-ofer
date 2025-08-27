import tracts from "@/data/tracts.json";

/** Pied de page avec coordonnées et cohérence de charte graphique */
export default function Footer() {
  const { tel, mail, adresse } = tracts.coordonnees;
  return (
    <footer className="mt-12 bg-brand-dark text-white">
      <div className="container max-w-7xl grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="text-xl font-semibold" style={{ fontFamily: "var(--font-caveat)" }}>
            Au Paradis O&apos;Fer
          </p>
          <p className="opacity-90">Centre d’accueil en zoothérapie</p>
        </div>
        <div>
          <p className="font-semibold">Coordonnées</p>
          <address className="not-italic leading-relaxed opacity-90">
            <div>Tél : <a className="underline" href={`tel:${tel.replace(/\s/g, "")}`}>{tel}</a></div>
            <div>Email : <a className="underline" href={`mailto:${mail}`}>{mail}</a></div>
            <div>{adresse}</div>
          </address>
        </div>
        <div>
          <p className="font-semibold">Infos</p>
          <p className="opacity-90">Accueil familial • Sur réservation</p>
          <p className="opacity-90">Sains-lès-Fressin (62)</p>
        </div>
      </div>
      <div className="bg-black/30 py-3 text-center text-xs">© {new Date().getFullYear()} Au Paradis O&apos;Fer</div>
    </footer>
  );
}

import tracts from "@/data/tracts.json";

/** Pied de page avec coordonnées et cohérence de charte graphique */
export default function Footer() {
  const { tel, mail, adresse } = tracts.coordonnees;
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <p className="font-semibold">Au Paradis O&apos;Fer</p>
          <p className="opacity-90">Centre d’accueil en zoothérapie</p>
        </div>
        <div>
          <p className="font-semibold">Coordonnées</p>
          <p>Tél : <a className="underline" href={`tel:${tel.replace(/\s/g, "")}`}>{tel}</a></p>
          <p>Email : <a className="underline" href={`mailto:${mail}`}>{mail}</a></p>
          <p className="opacity-90">{adresse}</p>
        </div>
        <div>
          <p className="font-semibold">Horaires & Infos</p>
          <p className="opacity-90">Séances sur réservation • Accueil familial</p>
        </div>
      </div>
      <div className="text-center bg-black/30 py-3 text-xs">© {new Date().getFullYear()} Au Paradis O&apos;Fer</div>
    </footer>
  );
}

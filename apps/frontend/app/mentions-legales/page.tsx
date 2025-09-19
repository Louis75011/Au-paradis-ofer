import tracts from "@/data/tracts.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales – Au Paradis O’Fer",
};

export default function Page() {
  const { nom, forme, capital, siren, adresse, telephone, mail, directeurPublication, hebergeur } =
    tracts.legales;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 prose prose-neutral">
      <h1 className="text-3xl font-bold">Mentions légales</h1>

      <h2 className="my-2">Éditeur du site</h2>
      <p>
        <strong>{nom}</strong> {forme ? `– ${forme}` : ""}{" "}
        {capital && capital !== "À définir" ? `– Capital ${capital}` : ""}
        <br />
        {siren && siren !== "À définir" ? (
          <>
            SIREN : {siren}
            <br />
          </>
        ) : null}
        {adresse}
        <br />
        Tél. : <a href={`tel:${telephone}`}>{telephone}</a> – Email :{" "}
        <a href={`mailto:${mail}`}>{mail}</a>
      </p>

      <h2 className="my-2">Hébergeur</h2>
      <p>
        <strong>{hebergeur.nom}</strong>
        <br />
        {hebergeur.adresse}
        <br />
        Tél. : {hebergeur.telephone}
      </p>

      <h2>Directeur de la publication</h2>
      <p>{directeurPublication}</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus du site (<em>textes, images, logos, éléments graphiques</em>) sont
        la propriété exclusive de {nom}, sauf mention contraire. Toute reproduction, représentation,
        modification, publication, transmission, ou dénaturation, totale ou partielle, du site ou de
        son contenu est interdite sans autorisation écrite préalable.
      </p>

      <h2>Responsabilité</h2>
      <p>
        {nom} s’efforce de fournir sur ce site des informations aussi précises que possible.
        Toutefois, il ne pourra être tenu responsable des oublis, des inexactitudes et des carences
        dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires qui lui
        fournissent ces informations.
      </p>
    </main>
  );
}

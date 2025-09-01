import Image from "next/image";

export const metadata = { title: "À propos" };

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-12">
      <h1 className="text-3xl max-w-4xl font-bold text-brand-dark">À propos — Au Paradis O’Fer</h1>

      <p className="mt-4 max-w-4xl leading-relaxed">
        Nichée au cœur des <strong>Hauts-de-France</strong>, notre structure{" "}
        <em>Au Paradis O’Fer</em> est un havre de sérénité où la relation entre l’homme et le cheval
        prend toute sa dimension. Ici, le rythme apaisé de la campagne se mêle au souffle des
        crinières, offrant à chacun un moment de ressourcement authentique.
      </p>
      <p className="mt-4 max-w-4xl leading-relaxed">
        Nous proposons des séances de <strong>médiation équine</strong> et des animations équestres
        adaptées à tous les âges et à toutes les situations&nbsp;: enfants en quête de découverte,
        adolescents désireux de gagner confiance, adultes et aînés recherchant détente et réconfort,
        ou encore personnes faisant face à des difficultés sociales ou de santé.
      </p>
      <p className="mt-4 max-w-4xl leading-relaxed">
        Notre démarche est fondée sur l’écoute, le respect et la chaleur humaine. Les chevaux et
        poneys deviennent des compagnons de chemin, aidant à renouer avec soi-même, à vivre
        pleinement l’instant présent, et à goûter la beauté simple de la nature.
      </p>
      <p className="mt-4 max-w-4xl leading-relaxed">
        Notre site évolue&nbsp;: vous y trouverez prochainement un{" "}
        <strong>calendrier interactif</strong>, des <strong>fiches pratiques</strong>, une{" "}
        <strong>galerie photo/vidéo</strong> et un <strong>espace de réservation en ligne</strong>{" "}
        pour faciliter votre venue.
      </p>
      <p className="mt-4 max-w-4xl leading-relaxed">
        Que vous veniez pour une initiation, un moment de bien-être ou un projet d’accompagnement,{" "}
        <em>Au Paradis O’Fer</em> vous accueille avec bienveillance et passion.
      </p>

      <br></br><hr></hr>

      <div className="mt-8 max-w-4xl">
        <p className="mb-4 font-bold">
          Certification officielle « Médiation par l’animal en établissements de soin » délivrée par l’Institut Français de Zoothérapie et enregistrée au Répertoire Spécifique :
        </p>
        <Image
          src="/images/diplome-berangere-mediation-animal.jpg"
          alt="Extrait de la maquette graphique du site Au Paradis O'Fer"
          width={1200}
          height={800}
          className="w-full rounded-2xl shadow"
          priority={false}
        />
      </div>
    </div>
  );
}

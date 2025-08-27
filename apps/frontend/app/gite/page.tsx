export const metadata = { title: "Gîte (à venir)" };

export default function GitePage() {
  return (
    <div className="page">
      <h1 className="text-3xl font-bold text-brand-dark">Gîte – prochainement</h1>
      <p className="mt-4 max-w-2xl">
        Nous préparons un hébergement simple et chaleureux sur place pour prolonger l’expérience
        au contact des chevaux. Informations, photos et réservation arriveront bientôt.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-brand-dark/30 p-6">
        <p className="font-medium">État :</p>
        <ul className="list-disc pl-5">
          <li>Configuration des chambres</li>
          <li>Equipements & sécurité</li>
          <li>Ouverture prévisionnelle : à préciser</li>
        </ul>
      </div>
    </div>
  );
}

// export default function Page() {
//   return null; // TODO: à remplir plus tard
// }

export const metadata = { title: "Animations chiens (à venir)" };

export default function ChiensPage() {
  return (
    <div className="page">
      <h1 className="text-3xl font-bold text-brand-dark">Animations canines – prochainement</h1>
      <p className="mt-4 max-w-2xl">
        Des ateliers ludiques et bienveillants dédiés aux chiens et à leurs maîtres viendront
        compléter nos propositions. Objectifs : sociabilisation, relation, détente en nature.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-brand-dark/30 p-6">
        <p className="font-medium">Pistes de contenu :</p>
        <ul className="list-disc pl-5">
          <li>Découverte et parcours sensoriels</li>
          <li>Moments calmes et médiation</li>
          <li>Conseils d’éduc’ de base et respect de l’animal</li>
        </ul>
      </div>
    </div>
  );
}

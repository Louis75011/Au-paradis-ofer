export const metadata = { title: "Paiement annulé" };
export default function Cancel() {
  return (
    <div className="page">
      <h1 className="text-2xl font-bold text-brand-dark">Paiement annulé</h1>
      <p className="mt-2">Aucun débit n’a été effectué. Vous pouvez choisir un autre créneau.</p>
    </div>
  );
}

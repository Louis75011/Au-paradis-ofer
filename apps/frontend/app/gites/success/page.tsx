export const metadata = { title: "Réservation confirmée" };
export default function Success() {
  return (
    <div className="page">
      <h1 className="text-2xl font-bold text-brand-dark">Merci !</h1>
      <p className="mt-2">Votre paiement est confirmé. Le créneau a été ajouté au calendrier.</p>
    </div>
  );
}

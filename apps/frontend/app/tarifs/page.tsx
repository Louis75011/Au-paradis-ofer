import tarifs from "@/data/tarifs.json";

export const metadata = { title: "Tarifs" };

export default function TarifsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Tarifs des séances</h1>
      <ul className="grid gap-4 md:grid-cols-2">
        {tarifs.map((t) => (
          <li key={t.id} className="card p-5">
            <p className="font-semibold">{t.intitule}</p>
            <p className="text-sm opacity-80">Durée : {t.duree}</p>
            <p className="mt-2 text-lg font-bold">{t.prix} €</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

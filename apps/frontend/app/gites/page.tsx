"use client";

import gites from "@/data/gites.json";
import BookingWidget from "@/components/BookingWidget";

export default function GitePage() {
  const basic = gites.find((g) => g.id === 1);
  const plus = gites.find((g) => g.id === 2);

  return (
    <div className="container mx-auto py-10 px-6 md:px-12">
      <h1 className="text-3xl font-bold text-brand-dark">Gîte – prochainement</h1>
      <p className="mt-3 max-w-4xl">
        Nous préparons un hébergement simple et chaleureux sur place pour prolonger
        l’expérience au contact des chevaux.<br/>Informations, photos et réservation
        arriveront bientôt.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Offre 1 : Gîte simple */}
        {basic && (
          <div className="card bg-brand-sky p-6">
            <p className="font-semibold">{basic.intitule}</p>
            <p className="text-sm opacity-80">Durée : {basic.duree}</p>
            <p className="mt-2 text-2xl font-bold">{basic.prix} €</p>
            {basic.unite && <p className="text-xs opacity-70">{basic.unite}</p>}
            {basic.note && <p className="mt-2 text-xs opacity-70">{basic.note}</p>}

            <div className="mt-4">
              <BookingWidget offer="gite_basic" />
            </div>
          </div>
        )}

        {/* Offre 2 : Gîte + séance */}
        {plus && (
          <div className="card bg-brand-sky p-6">
            <p className="font-semibold">{plus.intitule}</p>
            <p className="text-sm opacity-80">Durée : {plus.duree}</p>
            <p className="mt-2 text-2xl font-bold">{plus.prix} €</p>
            {plus.unite && <p className="text-xs opacity-70">{plus.unite}</p>}
            {plus.note && <p className="mt-2 text-xs opacity-70">{plus.note}</p>}

            <div className="mt-4">
              <BookingWidget offer="gite_plus" />
            </div>
          </div>
        )}
      </div>

      {/* Bloc état d’avancement */}
      <div className="mt-8 rounded-2xl border border-dashed border-brand-dark/30 p-6">
        <p className="font-medium">État d’avancement :</p>
        <ul className="list-disc pl-5">
          <li>Configuration de l’accueil</li>
          <li>Chambres en chantier</li>
          <li>Équipements & sécurité à venir</li>
          <li>
            Ouverture prévisionnelle : <b>courant 2026</b>
          </li>
        </ul>
      </div>
    </div>
  );
}

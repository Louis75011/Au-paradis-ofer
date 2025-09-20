// apps/frontend/app/gites/page.tsx
"use client";

import { useState } from "react";
import gites from "@/data/gites.json";
import BookingWidget from "@/components/BookingWidget";

export default function GitePage() {
  const basic = gites.find((g) => g.id === 1);
  const plus = gites.find((g) => g.id === 2);

  // Optionnel : id de l'offre mise en avant (style)
  const [highlightId] = useState<number | null>(null);

  return (
    <div className="container mx-auto py-10 px-6 md:px-12">
      <h1 className="text-3xl font-bold text-brand-dark">Gîte – prochainement</h1>
      <p className="mt-3 max-w-4xl">
        Nous préparons un hébergement simple et chaleureux sur place pour prolonger l’expérience au
        contact des chevaux.
        <br />
        Informations, photos et réservation arriveront bientôt.
      </p>

      <p className="mt-6 bg-neutral-50 p-4 rounded-md">
        Comme vous le voyez, à terme, les <b>réservations en ligne</b> seront possibles&nbsp;; pour
        le moment, n&apos;hésitez pas à prendre <b>contact</b> avec nous pour en savoir plus sur nos avancées.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Offre 1 : Gîte simple */}
        {basic && (
          <div
            aria-pressed={highlightId === basic.id}
            className={
              "card bg-brand-sky p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-dark " +
              (highlightId === basic.id ? "ring-2 ring-offset-2 ring-brand-dark/30" : "")
            }
          >
            <div className="h-32">
              <p className="font-semibold">{basic.intitule}</p>
              <p className="text-sm opacity-80">Durée : {basic.duree}</p>
              <p className="mt-2 text-2xl font-bold">{basic.prix} €</p>
            </div>
            {basic.unite && <p className="text-xs opacity-70">{basic.unite}</p>}
            {basic.note && <p className="mt-2 text-xs opacity-70">{basic.note}</p>}

            <div className="mt-4">
              {/* ➜ utilise /api/availability/gite */}
              <BookingWidget offer="gite_basic" />
            </div>
          </div>
        )}

        {/* Offre 2 : Gîte + séance */}
        {plus && (
          <div
            aria-pressed={highlightId === plus.id}
            className={
              "card bg-brand-sky p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-dark " +
              (highlightId === plus.id ? "ring-2 ring-offset-2 ring-brand-dark/30" : "")
            }
          >
            <div className="h-26">
              <p className="font-semibold">{plus.intitule}</p>
              <p className="text-sm opacity-80">Durée : {plus.duree}</p>
              <p className="mt-2 text-2xl font-bold">{plus.prix} €</p>
            </div>
            {plus.unite && <p className="text-xs opacity-70">{plus.unite}</p>}
            {plus.note && <p className="mt-2 text-xs opacity-70">{plus.note}</p>}

            <div className="mt-4">
              {/* ➜ utilise /api/availability/gite */}
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

// CODE HISTORIQUE
// const [showParagraph, setShowParagraph] = useState(false);
// contrôle si le clic sur la carte doit révéler le paragraphe
// const [clickEnabled, setClickEnabled] = useState(true);
// const disableTimerRef = useRef<number | null>(null);

// function revealFromCard(id?: number) {
//   if (!clickEnabled) return;
//   setShowParagraph(true);
//   if (typeof id === "number") setHighlightId(id);
// }

// function toggleReveal() {
//   setShowParagraph((s) => !s);
//   if (!showParagraph) setHighlightId(null);
// }

// désactive temporairement le comportement de clic (ex: 10s)
// function disableTemporarily(seconds = 10) {
//   setClickEnabled(false);
//   if (disableTimerRef.current) window.clearTimeout(disableTimerRef.current);
//   disableTimerRef.current = window.setTimeout(() => {
//     setClickEnabled(true);
//     disableTimerRef.current = null;
//   }, seconds * 1000);
// }

// handler accessible (Entrée / Espace) pour les "cartes"
// function handleKeyOnCard(e: React.KeyboardEvent<HTMLDivElement>, id?: number) {
//   if (e.key === "Enter" || e.key === " ") {
//     e.preventDefault();
//     revealFromCard(id);
//   }
// }

// Optionnel : passez cette callback à BookingWidget pour qu'il appelle revealFromWidget()
// function revealFromWidget() {
//   if (!clickEnabled) return;
//   setShowParagraph(true);
//   setHighlightId(null);
// }
{
  /* <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={clickEnabled}
            onChange={(e) => setClickEnabled(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Activer l’affichage du paragraphe au clic</span>
        </label>

        <button
          type="button"
          onClick={() => disableTemporarily(10)}
          className="ml-2 text-sm px-3 py-1 rounded border hover:bg-neutral-50"
        >
          Désactiver 10 s
        </button>

        <button
          type="button"
          onClick={toggleReveal}
          className="ml-auto text-sm px-3 py-1 rounded border bg-brand-sky text-white"
        >
          {showParagraph ? "Masquer l'info" : "Afficher l'info"}
        </button> */
}
// onClick={() => revealFromCard(basic.id)}
// onKeyDown={(e) => handleKeyOnCard(e, basic.id)}
// onClick={() => revealFromCard(plus.id)}
// onKeyDown={(e) => handleKeyOnCard(e, plus.id)}

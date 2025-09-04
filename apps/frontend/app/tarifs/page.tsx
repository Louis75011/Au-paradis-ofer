"use client";

import { useState } from "react";
import Head from "next/head";
import tarifs from "@/data/tarifs.json";
import ReserveButtons from "@/components/ReserveButtons";
import BookingCalendar from "@/components/BookingCalendar";

export default function TarifsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-10 px-12">
      <Head>
        <title>Tarifs</title>
      </Head>

      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Tarifs des séances de médiation</h1>

      <p>
        Les modalités proposées sont les suivantes&nbsp;: <b>paiement</b> par carte pour les{" "}
        <b>réservations</b> de dernière minute, et par virement SEPA pour celles planifiées à
        l’avance. Vous pouvez réserver directement via le calendrier ou bien nous contacter.
      </p>
      <br />

      <ul className="grid gap-5 md:grid-cols-2">
        {tarifs.map((t) => (
          <li
            key={t.id}
            className="card group hover-card bg-brand-sky relative p-6"
            aria-label={`${t.intitule}, ${t.duree}, ${t.prix} euros`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="img">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>

            <p className="font-semibold">{t.intitule}</p>
            <p className="text-sm opacity-80">Durée : {t.duree}</p>
            <p className="mt-2 text-lg font-bold">{t.prix} €</p>

            {/* Boutons Stripe branchés */}
            <ReserveButtons
              dateISO={selectedDate ?? undefined}
              title={t.intitule}
              amountEuro={t.prix}
              tarifId={t.id}
            />
            {selectedDate && (
              <p className="mt-2 text-sm opacity-70">
                Date sélectionnée&nbsp;: <strong>{selectedDate}</strong>
              </p>
            )}
          </li>
        ))}
      </ul>

      <br />
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">
        Le calendrier, en temps réel, des réservations en ligne
      </h1>

      {/* Calendrier avec jours déjà réservés */}
      <BookingCalendar onDateSelected={setSelectedDate} />
    </div>
  );
}

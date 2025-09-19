"use client";

import { useState } from "react";
import Head from "next/head";
import tarifs from "@/data/tarifs.json";
import BookingCalendar from "@/components/BookingCalendar";
import ReserveButtons from "@/components/ReserveButtons"; // ⬅️ conservé volontairement (commenté)

export default function TarifsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showParagraph, setShowParagraph] = useState(false);

  return (
    <div className="container mx-auto py-10 px-6 md:px-12">
      <Head>
        <title>Tarifs</title>
      </Head>

      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Tarifs des séances de médiation</h1>

      <p>
        Nous vous invitons à entrer en contact avec nous directement par courriel afin de convenir du moment exact du rendez-vous. Merci d&apos;avance !
        {/* Le paiement peut être effectué par <b>carte bancaire</b> pour une réservation immédiate ou
        de dernière minute.
        Nous vous invitons toutefois à privilégier le <b>virement SEPA</b>{" "}
        lorsque la réservation est prévue à l’avance (environ cinq jours), et/ou à nous contacter
        directement par courriel afin de convenir du moment exact et de vous enregistrer en tant que
        personne ayant réglé la prestation. Merci d&apos;avance ! */}
      </p>
      <br></br>

      {/* Mise en page responsive : 1 colonne mobile, 2 colonnes desktop */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Colonne gauche : cartes de tarifs (2 colonnes internes sur desktop) */}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {tarifs.map((t) => (
            <li
              key={t.id}
              className="card group hover-card bg-brand-sky relative p-6 cursor-pointer"
              aria-label={`${t.intitule}, ${t.duree}, ${t.prix} euros`}
              onClick={() => setShowParagraph(true)}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="img">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <line
                    x1="16.65"
                    y1="16.65"
                    x2="21"
                    y2="21"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>

              <p className="font-semibold">{t.intitule}</p>
              <p className="text-sm opacity-80">Durée : {t.duree}</p>
              <p className="mt-2 text-lg font-bold">{t.prix} €</p>

              <ReserveButtons
                dateISO={selectedDate ?? undefined}
                title={t.intitule}
                amountEuro={t.prix}
                tarifId={t.id}
              />
              {selectedDate && (
                <p className="mt-2 text-sm opacity-70">
                  Date sélectionnée :{" "}
                  <strong>{new Date(selectedDate).toLocaleDateString("fr-FR")}</strong>
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* Colonne droite : calendrier */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">Dates disponibles</h2>
          <BookingCalendar onDateSelected={setSelectedDate} />
          <p className="mt-2 text-sm opacity-70">
            Les créneaux déjà réservés apparaissent dans le calendrier.
            {/* Cliquez sur un jour pour présélectionner une date. */}
          </p>
        </div>
      </div>

      {/* Paragraphe d’information (conservé, affiché au clic) */}
      {showParagraph && (
        <p className="mt-6">
          À terme, les <b>réservations en ligne</b> seront possibles&nbsp;; pour le moment, nous
          vous invitons à prendre directement <b>contact</b> avec nous.
        </p>
      )}
    </div>
  );
}

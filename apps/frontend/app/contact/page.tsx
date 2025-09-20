"use client";
import BookingCalendar from "@/components/BookingCalendar";
import { useState } from "react";

/** Formulaire de prise de contact simple — envoi vers l'API GraphQL du back. */
export default function ContactPage() {
  const [, setSelectedDate] = useState<string | null>(null);

  {
    /* <form className="mt-6 grid gap-4" onSubmit={onSubmit}> */
  }
  return (
    <div className="container mx-auto max-w-4xl py-10 px-12">
      <h1 className="text-3xl font-bold text-brand-dark">Contact & Réservation</h1>

      <form
        className="mt-6 grid gap-4"
        action="mailto:au.paradis.o.fer@gmail.com"
        method="post"
        encType="text/plain"
      >
        <label className="grid gap-1">
          <span>Nom complet</span>
          <input name="Nom" required className="rounded border px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span>E-mail</span>
          <input name="Email" type="email" required className="rounded border px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span>Date souhaitée</span>
          <input name="Date" type="date" required className="rounded border px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span>Message</span>
          <textarea
            name="Message"
            rows={5}
            placeholder="Votre demande ou précision..."
            className="rounded border px-3 py-2"
          ></textarea>
        </label>
        <button className="rounded bg-brand-dark px-4 py-2 text-white" type="submit">
          Envoyer
        </button>
      </form>

      {/* Calendrier avec jours déjà réservés */}
      <br />
      <br />
      <h2 className="text-3xl font-bold text-brand-dark">Calendrier des séances à déterminer</h2>
        {/* Colonne droite : calendrier */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">Dates disponibles</h2>
          <BookingCalendar onDateSelected={setSelectedDate} />
          <p className="mt-2 text-sm opacity-70">
            {/* Les créneaux réservés apparaitront dans le calendrier. */}
            {/* Cliquez sur un jour pour présélectionner une date. */}
          </p>
        </div>
      </div>
  );
}

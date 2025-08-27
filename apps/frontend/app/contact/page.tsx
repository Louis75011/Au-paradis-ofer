"use client";

import { useState } from "react";

/** Formulaire de prise de contact simple — envoi vers l'API GraphQL du back. */
export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("Envoi en cours...");

    // Mutation GraphQL minimale (demande de réservation)
    const mutation = `
      mutation RequestBooking($input: BookingInput!) {
        requestBooking(input: $input) { id status }
      }
    `;

    const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            fullName: form.get("name"),
            email: form.get("email"),
            date: form.get("date"),
            sessionId: 1
          }
        }
      })
    });

    const json = await res.json();
    if (json.errors) {
      setStatus("Erreur d’envoi. Merci de réessayer.");
    } else {
      setStatus("Merci ! Nous vous recontactons très vite.");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-dark">Contact & Réservation</h1>
      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span>Nom complet</span>
          <input name="name" required className="rounded border px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span>E-mail</span>
          <input name="email" type="email" required className="rounded border px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span>Date souhaitée</span>
          <input name="date" type="date" required className="rounded border px-3 py-2" />
        </label>
        <button className="rounded bg-brand-dark px-4 py-2 text-white" type="submit">Envoyer</button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}

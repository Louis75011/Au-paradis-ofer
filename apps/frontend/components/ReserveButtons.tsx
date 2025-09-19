"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type ReserveButtonsProps = {
  dateISO?: string;
  title: string;
  amountEuro: number;
  tarifId: number;
};

export default function ReserveButtons({
  dateISO,
  title,
  amountEuro,
  tarifId,
}: ReserveButtonsProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function startCheckout(kind: "card" | "sepa") {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ kind, dateISO: dateISO ?? undefined, title, amountEuro, tarifId }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const msg = await res.text();
      alert(`Paiement indisponible : ${msg}`);
      return;
    }
    const { url } = (await res.json()) as { url: string };
    location.href = url;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {/* Paiements Carte & SEPA */}
      <button
        className="btn btn-primary hover-button bg-brand-dark text-white disabled:opacity-60"
        disabled={pending}
        onClick={() => startTransition(() => startCheckout("card"))}
        aria-label="Payer par carte (réservation immédiate)"
        title={dateISO ? `Payer pour le ${dateISO}` : undefined}
      >
        Carte
      </button>

      {/* <div>
      <button className="btn btn-primary">
        Réserver {title} – {amountEuro}€
      </button>
    </div> */}

      <button
        className="btn btn-primary hover-button bg-brand-light text-white disabled:opacity-60"
        disabled={pending}
        onClick={() => startTransition(() => startCheckout("sepa"))}
        aria-label="Payer par SEPA (réservation planifiée)"
        title={dateISO ? `Payer par SEPA pour le ${dateISO}` : undefined}
      >
        SEPA
      </button>

      {/* Contact direct */}
      <button
        className="btn hover-button bg-brand-cream text-black"
        onClick={() => router.push("/contact")}
        aria-label="Nous contacter directement pour réserver"
        title="Nous contacter directement pour réserver"
      >
        Contact
      </button>
    </div>
  );
}

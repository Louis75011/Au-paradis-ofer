"use client";

import { useTransition } from "react";

type Props = {
  dateISO?: string | null;
  title: string;
  amountEuro: number;
  tarifId: string | number; // accepte les deux
};

export default function ReserveButtons({ dateISO, title, amountEuro, tarifId }: Props) {
  const [pending, startTransition] = useTransition();

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
    <div className="mt-4 flex gap-2">
      <button
        className="btn btn-primary hover-button bg-brand-dark disabled:opacity-60"
        disabled={pending}
        onClick={() => startTransition(() => startCheckout("card"))}
        aria-label="Payer par carte (réservation immédiate)"
        title={dateISO ? `Payer pour le ${dateISO}` : undefined}
      >
        Carte
      </button>
      <button
        className="btn btn-primary hover-button bg-brand-light text-white disabled:opacity-60"
        disabled={pending}
        onClick={() => startTransition(() => startCheckout("sepa"))}
        aria-label="Payer par SEPA (réservation planifiée)"
        title={dateISO ? `Payer par SEPA pour le ${dateISO}` : undefined}
      >
        SEPA
      </button>
    </div>
  );
}

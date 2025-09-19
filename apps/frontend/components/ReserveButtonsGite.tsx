"use client";

import { useTransition } from "react";

type ReserveButtonsGiteProps = {
  slotISO: string;
  offer: "gite_basic" | "gite_plus";
};

export default function ReserveButtonsGite({ slotISO, offer }: ReserveButtonsGiteProps) {
  const [pending, startTransition] = useTransition();

  async function startCheckout(method: "card" | "sepa") {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ slotISO, method, offer }),
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
        className="btn btn-primary"
        disabled={pending}
        onClick={() => startTransition(() => startCheckout("card"))}
      >
        Carte
      </button>
      <button
        className="btn btn-primary"
        disabled={pending}
        onClick={() => startTransition(() => startCheckout("sepa"))}
      >
        SEPA
      </button>
    </div>
  );
}

/* ------------------------------------------
   CODE HISTORIQUE (Séance) – conservé en archive
---------------------------------------------
import { useRouter } from "next/navigation";

type ReserveButtonsProps = {
  dateISO?: string;
  title: string;
  amountEuro: number;
  tarifId: number;
};

export default function ReserveButtons({ dateISO, title, amountEuro, tarifId }: ReserveButtonsProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function startCheckout(kind: "card" | "sepa") {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ kind, dateISO, title, amountEuro, tarifId }),
      headers: { "Content-Type": "application/json" },
    });
    ...
  }

  return ( ... );
}
*/

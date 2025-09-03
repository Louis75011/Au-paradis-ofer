export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { differenceInCalendarDays } from "date-fns";

type CheckoutBody = {
  slotISO: string;
  method: "card" | "sepa";
};

// Helper pour appeler l'API Stripe via fetch (Edge/Workers friendly)
async function stripeCreateCheckoutSession(params: Record<string, unknown>) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) body.append(k, String(v));

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Stripe error: ${err}`);
  }
  return res.json();
}
export async function POST(req: NextRequest) {
  try {
    const { slotISO, method } = (await req.json()) as CheckoutBody;

    if (!slotISO || !method) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const sepaMinDays = Number(process.env.NEXT_PUBLIC_SEPA_MIN_DAYS ?? 5);
    const days = differenceInCalendarDays(new Date(slotISO), new Date());

    const allowSepa = method === "sepa" && days >= sepaMinDays;
    const payment_method_types = allowSepa ? ["card", "sepa_debit"] : ["card"];

    const success_url = `${process.env.NEXT_PUBLIC_BASE_URL}/reservation/succes?slot=${encodeURIComponent(slotISO)}`;
    const cancel_url = `${process.env.NEXT_PUBLIC_BASE_URL}/reservation?canceled=1`;

    const session = await stripeCreateCheckoutSession({
      mode: "payment",
      success_url,
      cancel_url,
      // Prix unique (one-time) défini dans Stripe Dashboard
      "line_items[0][price]": process.env.STRIPE_PRICE_EUR!,
      "line_items[0][quantity]": 1,
      // On encode le créneau dans la session
      "metadata[slotISO]": slotISO,
      // Checkout gère la sélection CB/SEPA selon ce que l'on autorise
      payment_method_types: payment_method_types.join(","),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   const { dateISO } = await req.json() as { dateISO: string };
//   if (!dateISO) return NextResponse.json({ error: "dateISO required" }, { status: 400 });

//   const isRush = differenceInCalendarDays(new Date(dateISO), new Date()) < 3;
//   const url = isRush
//     ? process.env.NEXT_PUBLIC_STRIPE_LINK_CARD
//     : process.env.NEXT_PUBLIC_STRIPE_LINK_SEPA;

//   return NextResponse.json({ url });
// }

// // Côté UI :
// async function pay(dateISO: string) {
//   const res = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ dateISO }) });
//   const { url } = await res.json();
//   window.location.href = url;
// }

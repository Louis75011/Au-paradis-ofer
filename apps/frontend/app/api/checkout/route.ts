import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Option A (simple) : ne pas préciser apiVersion → utilise celle du SDK
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;
// Option B (pour figer ?) :
// const stripe = STRIPE_SECRET_KEY
//   ? new Stripe(STRIPE_SECRET_KEY, {
//       apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion,
//     })
//   : null;

type Payload = {
  kind: "card" | "sepa";
  title: string;
  amountEuro: number;
  tarifId: string | number;
  dateISO?: string;
};

function getBaseUrl(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host  = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY manquant" }, { status: 500 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const { kind, title, amountEuro, tarifId, dateISO } = body;

  if (!title || !amountEuro || Number.isNaN(Number(amountEuro))) {
    return NextResponse.json({ error: "title/amountEuro requis" }, { status: 400 });
  }

  const base = getBaseUrl(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      payment_method_types: kind === "sepa" ? ["sepa_debit"] : ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(Number(amountEuro) * 100),
            product_data: {
              name: title,
              description: dateISO
                ? `Réservation pour le ${new Date(dateISO).toLocaleString("fr-FR")}`
                : undefined,
              metadata: { tarifId: String(tarifId) },
            },
          },
        },
      ],
      metadata: {
        tarifId: String(tarifId),
        dateISO: dateISO ?? "",
        kind,
      },
      success_url: `${base}/reservation?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/tarifs?canceled=1`,
      customer_creation: "if_required",
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    // Pas de any : on affine proprement
    const message =
      typeof err === "object" && err !== null && "message" in err
        ? String((err as { message?: unknown }).message)
        : "Erreur Stripe";
    console.error("Stripe error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

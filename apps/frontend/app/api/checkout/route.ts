import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { differenceInCalendarDays } from "date-fns";

export const runtime = "nodejs"; // Stripe nécessite Node

// soit fixer apiVersion...
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
// ...soit laisser Stripe prendre celle de votre compte
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
});

const SEPA_MIN_DAYS = Number(process.env.NEXT_PUBLIC_SEPA_MIN_DAYS ?? 5);

export async function POST(req: NextRequest) {
  const { slotISO, method, offer } = (await req.json()) as {
    slotISO: string;
    method: "card" | "sepa";
    offer: "gite_basic" | "gite_plus";
  };

  if (!slotISO || !offer) {
    return new NextResponse("slotISO/offer manquant", { status: 400 });
  }

  // Vérification SEPA
  const allowSepa = differenceInCalendarDays(new Date(slotISO), new Date()) >= SEPA_MIN_DAYS;
  const payment_method_types: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    method === "sepa"
      ? allowSepa
        ? ["sepa_debit", "card"]
        : ["card"]
      : ["card"];

  // Prix
  const priceId =
    offer === "gite_basic"
      ? process.env.STRIPE_PRICE_GITE_BASIC
      : process.env.STRIPE_PRICE_GITE_PLUS;

  if (!priceId) {
    return new NextResponse("PRICE manquant pour l’offre", { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gite/success?slot=${encodeURIComponent(
      slotISO
    )}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gite/cancel`,
    metadata: {
      kind: "gite",
      offer,
      slotISO,
    },
  });

  return NextResponse.json({ url: session.url });
}

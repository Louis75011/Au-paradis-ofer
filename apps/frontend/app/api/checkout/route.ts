export const runtime = "edge";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { differenceInCalendarDays } from "date-fns";

// POST /api/checkout
// body: { kind: "card" | "sepa", amountEuro: number, title: string, dateISO?: string, tarifId?: string }
// -> { url: string } (page Stripe)

type Payload = {
  kind: "card" | "sepa";
  amountEuro: number;
  title: string;
  dateISO?: string;
  tarifId?: string;
};

interface StripeCheckoutResponse {
  url?: string;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  const { env } = getRequestContext();
  const { STRIPE_SECRET_KEY, NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_SEPA_MIN_DAYS } =
    env as unknown as {
      STRIPE_SECRET_KEY?: string;
      NEXT_PUBLIC_BASE_URL?: string;
      NEXT_PUBLIC_SEPA_MIN_DAYS?: string;
    };

  if (!STRIPE_SECRET_KEY) {
    return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  }
  if (!NEXT_PUBLIC_BASE_URL) {
    return new Response("Missing NEXT_PUBLIC_BASE_URL", { status: 500 });
  }

  const body = (await req.json()) as Payload;
  const amountCents = Math.max(50, Math.round(body.amountEuro * 100));

  // --- logique SEPA : délai minimal ---
  let pmTypes: ("card" | "sepa_debit")[] = ["card"];
  if (body.kind === "sepa") {
    const sepaMinDays = Number(NEXT_PUBLIC_SEPA_MIN_DAYS ?? 5);
    if (body.dateISO) {
      const days = differenceInCalendarDays(new Date(body.dateISO), new Date());
      if (days >= sepaMinDays) {
        pmTypes = ["sepa_debit"];
      }
    } else {
      pmTypes = ["sepa_debit"];
    }
  }

  // --- paramètres Stripe ---
  const params = new URLSearchParams({
    mode: "payment",
    "payment_method_types[]": pmTypes[0],
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(amountCents),
    "line_items[0][price_data][product_data][name]":
      body.title ?? "Séance de médiation",
    "line_items[0][quantity]": "1",
    success_url: `${NEXT_PUBLIC_BASE_URL}/reservation/succes`,
    cancel_url: `${NEXT_PUBLIC_BASE_URL}/reservation?canceled=1`,
    customer_creation: "always",
  });

  if (body.dateISO) params.set("metadata[dateISO]", body.dateISO);
  if (body.tarifId) params.set("metadata[tarifId]", body.tarifId);

  // --- appel Stripe ---
  const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const json = (await resp.json()) as StripeCheckoutResponse;

  if (!resp.ok || !json.url) {
    return new Response(JSON.stringify(json), { status: 500 });
  }

  return Response.json({ url: json.url });
}

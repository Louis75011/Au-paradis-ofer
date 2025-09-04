export const runtime = "edge";
import { differenceInCalendarDays } from "date-fns";
import { getCfEnv } from "@/lib/cf-env";

type Payload = { kind: "card" | "sepa"; amountEuro: number; title: string; dateISO?: string; tarifId?: string; };
interface StripeCheckoutResponse { url?: string; error?: { message: string }; [k: string]: unknown; }

export async function POST(req: Request) {
  const env = await getCfEnv<{
    STRIPE_SECRET_KEY?: string;
    NEXT_PUBLIC_BASE_URL?: string;
    NEXT_PUBLIC_SEPA_MIN_DAYS?: string;
  }>();

  const STRIPE_SECRET_KEY = env?.STRIPE_SECRET_KEY;
  const NEXT_PUBLIC_BASE_URL = env?.NEXT_PUBLIC_BASE_URL;
  const NEXT_PUBLIC_SEPA_MIN_DAYS = Number(env?.NEXT_PUBLIC_SEPA_MIN_DAYS ?? 5);

  if (!STRIPE_SECRET_KEY) return Response.json({ error: "STRIPE_SECRET_KEY manquant" }, { status: 500 });
  if (!NEXT_PUBLIC_BASE_URL) return Response.json({ error: "NEXT_PUBLIC_BASE_URL manquant" }, { status: 500 });

  const body = (await req.json()) as Payload;
  const amountCents = Math.max(50, Math.round(body.amountEuro * 100));

  let pmTypes: ("card" | "sepa_debit")[] = ["card"];
  if (body.kind === "sepa") {
    if (body.dateISO) {
      const days = differenceInCalendarDays(new Date(body.dateISO), new Date());
      if (days >= NEXT_PUBLIC_SEPA_MIN_DAYS) pmTypes = ["sepa_debit"];
    } else {
      pmTypes = ["sepa_debit"];
    }
  }

  const params = new URLSearchParams({
    mode: "payment",
    "payment_method_types[]": pmTypes[0],
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(amountCents),
    "line_items[0][price_data][product_data][name]": body.title ?? "Séance de médiation",
    "line_items[0][quantity]": "1",
    success_url: `${NEXT_PUBLIC_BASE_URL}/reservation/succes`,
    cancel_url: `${NEXT_PUBLIC_BASE_URL}/reservation?canceled=1`,
    customer_creation: "always",
  });
  if (body.dateISO) params.set("metadata[dateISO]", body.dateISO);
  if (body.tarifId) params.set("metadata[tarifId]", body.tarifId);

  const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const json = (await resp.json()) as StripeCheckoutResponse;

  if (!resp.ok || !json.url) return Response.json({ error: json?.error?.message ?? "Stripe error" }, { status: 500 });
  return Response.json({ url: json.url });
}

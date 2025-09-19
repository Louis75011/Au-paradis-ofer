import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // Stripe → Node obligatoire

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as Stripe.LatestApiVersion, // ✅ cast explicite
});

// ---- Ancienne logique KV ----
type Env = { BOOKINGS_KV: KVNamespace };

// ---- Nouvelle logique Google Calendar ----
async function getGoogleAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  const data: { access_token?: string } = await res.json();
  return data.access_token ?? "";
}

export async function POST(
  req: NextRequest,
  ctx: { env: Env } // utile seulement si BOOKINGS_KV est disponible
) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event | null = null;

  try {
    if (sig) {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (e) {
    const err = e instanceof Error ? e : new Error("Erreur Stripe inconnue");
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (!event) return NextResponse.json({ error: "Pas d’événement" }, { status: 400 });

  const type = event.type;

  // ---- Cas 1 : Checkout session terminé → Gîte ----
  if (type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const kind = s.metadata?.kind;
    const slotISO = s.metadata?.slotISO;
    const offer = s.metadata?.offer;

    if (kind === "gite" && slotISO) {
      try {
        const start = new Date(slotISO);
        const end = new Date(start.getTime() + 16 * 60 * 60 * 1000); // 16h arbitraire

        const access_token = await getGoogleAccessToken();
        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            process.env.GOOGLE_CALENDAR_ID!
          )}/events`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              summary: offer === "gite_plus" ? "Gîte + séance" : "Gîte",
              description: `Payé via Stripe - ${s.customer_email ?? ""}`,
              start: { dateTime: start.toISOString() },
              end: { dateTime: end.toISOString() },
            }),
          }
        );
      } catch (err) {
        console.error("Erreur Google Calendar:", err);
      }
    }
  }

  // ---- Cas 2 : Payment intent → Séances (logique KV historique) ----
  if (
    type === "payment_intent.succeeded" ||
    type === "payment_intent.payment_failed" ||
    type === "checkout.session.expired"
  ) {
    const pi = event.data.object as Stripe.PaymentIntent;
    const slotISO = pi.metadata?.slotISO as string | undefined;
    if (!slotISO) return NextResponse.json({ ok: true });

    const key = `hold:${slotISO}`;

    if (type === "payment_intent.succeeded") {
      await ctx.env.BOOKINGS_KV.delete(key);
      await ctx.env.BOOKINGS_KV.put(
        `booked:${slotISO}`,
        JSON.stringify({
          slotISO,
          paidAt: Date.now(),
          method: pi.payment_method_types?.[0] ?? "unknown",
        })
      );
    }

    if (type === "payment_intent.payment_failed" || type === "checkout.session.expired") {
      await ctx.env.BOOKINGS_KV.delete(key);
    }
  }

  return NextResponse.json({ received: true });
}

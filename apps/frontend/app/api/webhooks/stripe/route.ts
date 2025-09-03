import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

type Env = { BOOKINGS_KV: KVNamespace };

// Vérification simple par secret d’URL (optionnel) : ajouter ?secret=… à l’endpoint
export async function POST(req: NextRequest, ctx: { env: Env }) {
  try {
    const raw = await req.text() as string;

    // Ici vérifier la signature Stripe si vous servez en Node compat ; // en Edge, utiliser l’API REST stripe.events.retrieve si besoin. Pour MVP KV, // on accepte et on parse basiquement (Stripe enverra JSON).
    const evt = JSON.parse(raw);

    // On cible surtout payment_intent.succeeded / payment_intent.payment_failed
    const type = evt.type as string;
    const pi = evt.data?.object;
    const slotISO = pi?.metadata?.slotISO as string | undefined;

    if (!slotISO) return NextResponse.json({ ok: true });

    const key = `hold:${slotISO}`;

    if (type === "payment_intent.succeeded") {
      // Confirme la réservation : on passe en clé définitive
      await ctx.env.BOOKINGS_KV.delete(key);
      await ctx.env.BOOKINGS_KV.put(`booked:${slotISO}`, JSON.stringify({ slotISO, paidAt: Date.now(), method: pi.payment_method_types?.[0] ?? "unknown" }));
    }

    if (type === "payment_intent.payment_failed" || type === "checkout.session.expired") {
      // Libère le hold
      await ctx.env.BOOKINGS_KV.delete(key);
    }

    return NextResponse.json({ received: true, raw: Body });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
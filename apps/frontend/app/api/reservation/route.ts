export const runtime = "edge";

import { getCfEnv } from "@/lib/cf-env";

export type BookingBody = {
  dateISO: string;
  status: "reserved" | "hold";
  title?: string;
};

// --- export pour availability ---
export const mockStore: Record<string, BookingBody> = {};

// --- POST : créer ou mettre à jour une réservation ---
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BookingBody;

    console.log("➡️ POST /api/reservation reçu", body);

    if (!body.dateISO || !body.status) {
      return Response.json({ error: "dateISO et status requis" }, { status: 400 });
    }

    const env = getCfEnv<{ BOOKINGS_KV: KVNamespace }>();
    console.log("🌍 ENV détecté :", env ? Object.keys(env) : "aucun");

    if (env?.BOOKINGS_KV) {
      const key = `booking:${body.dateISO}`;
      await env.BOOKINGS_KV.put(key, JSON.stringify(body));
      console.log("✅ Réservation stockée dans KV :", key);
      return Response.json({ ok: true, key, booking: body });
    } else {
      mockStore[body.dateISO] = body;
      console.log("📝 Réservation stockée en mock :", body.dateISO);
      return Response.json({
        ok: true,
        key: `mock:${body.dateISO}`,
        booking: body,
        mock: true,
      });
    }
  } catch (err) {
    console.error("💥 Erreur POST /api/reservation :", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}

// --- DELETE : supprimer une réservation ---
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const dateISO = url.searchParams.get("date");

    console.log("➡️ DELETE /api/reservation", { dateISO });

    if (!dateISO) {
      return Response.json({ error: "paramètre ?date= manquant" }, { status: 400 });
    }

    const env = getCfEnv<{ BOOKINGS_KV: KVNamespace }>();
    console.log("🌍 ENV détecté :", env ? Object.keys(env) : "aucun");

    if (env?.BOOKINGS_KV) {
      await env.BOOKINGS_KV.delete(`booking:${dateISO}`);
      console.log("🗑️ Supprimé dans KV :", dateISO);
      return Response.json({ ok: true });
    } else {
      if (mockStore[dateISO]) {
        delete mockStore[dateISO];
        console.log("🗑️ Supprimé du mock :", dateISO);
        return Response.json({ ok: true, mock: true });
      }
      console.warn("⚠️ Réservation inexistante (mock)", dateISO);
      return Response.json({ error: "Réservation inexistante (mock)" }, { status: 404 });
    }
  } catch (err) {
    console.error("💥 Erreur DELETE /api/reservation :", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}

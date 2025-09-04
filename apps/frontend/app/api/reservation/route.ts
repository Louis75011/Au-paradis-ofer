export const runtime = "edge";

import { getCfEnv } from "@/lib/cf-env";

export type BookingBody = {
  dateISO: string;
  status: "reserved" | "hold";
  title?: string;
};

export const mockStore: Record<string, BookingBody> = {};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BookingBody;
    if (!body.dateISO || !body.status) {
      return Response.json({ error: "dateISO et status requis" }, { status: 400 });
    }

    const env = await getCfEnv<{ BOOKINGS_KV: KVNamespace }>(); // <- await

    if (env?.BOOKINGS_KV) {
      const key = `booking:${body.dateISO}`;
      await env.BOOKINGS_KV.put(key, JSON.stringify(body));
      return Response.json({ ok: true, key, booking: body });
    }

    mockStore[body.dateISO] = body;
    return Response.json({ ok: true, key: `mock:${body.dateISO}`, booking: body, mock: true });

  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const dateISO = url.searchParams.get("date");
    if (!dateISO) {
      return Response.json({ error: "paramètre ?date= manquant" }, { status: 400 });
    }

    const env = await getCfEnv<{ BOOKINGS_KV: KVNamespace }>(); // <- await

    if (env?.BOOKINGS_KV) {
      await env.BOOKINGS_KV.delete(`booking:${dateISO}`);
      return Response.json({ ok: true });
    }

    if (mockStore[dateISO]) {
      delete mockStore[dateISO];
      return Response.json({ ok: true, mock: true });
    }
    return Response.json({ error: "Réservation inexistante (mock)" }, { status: 404 });

  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}

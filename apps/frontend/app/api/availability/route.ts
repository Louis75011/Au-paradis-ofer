export const runtime = "edge";

import { getCfEnv } from "@/lib/cf-env";
import { mockStore } from "../reservation/route";

type BookingBody = {
  dateISO: string;
  status: "reserved" | "hold";
  title?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  display?: "auto" | "background" | "inverse-background" | "none";
  color?: string;
};

export async function GET() {
  try {
    const env = await getCfEnv<{ BOOKINGS_KV: KVNamespace }>();

    // --- Cas Cloudflare KV ---
    if (env?.BOOKINGS_KV) {
      const kv = env.BOOKINGS_KV;
      const list = await kv.list({ prefix: "booking:" });

      const events: CalendarEvent[] = [];
      for (const { name } of list.keys) {
        const json = await kv.get<BookingBody>(name, "json");
        if (json?.dateISO) {
          events.push({
            id: name,
            title: json.title ?? "Réservé",
            start: json.dateISO,
            allDay: true,
            display: "background" as const,
            color: json.status === "hold" ? "#fbbf24" : "#f87171",
          } satisfies CalendarEvent);      // <- vérification de forme
        }
      }

      return Response.json({ events });
    }

    // --- Cas local (mock JSON + mockStore en mémoire) ---
    const mockFile = (await import("@/data/mock-bookings.json")).default as BookingBody[];
    const events: CalendarEvent[] = [];

    for (const [i, m] of mockFile.entries()) {
      events.push({
        id: `mockfile:${i}`,
        title: m.title ?? "Réservé",
        start: m.dateISO,
        allDay: true,
        display: "background" as const,
        color: m.status === "hold" ? "#fbbf24" : "#f87171",
      } satisfies CalendarEvent);
    }

    for (const [dateISO, m] of Object.entries(mockStore)) {
      events.push({
        id: `mockmem:${dateISO}`,
        title: m.title ?? "Réservé",
        start: m.dateISO,
        allDay: true,
        display: "background" as const,
        color: m.status === "hold" ? "#fbbf24" : "#f87171",
      } satisfies CalendarEvent);
    }

    return Response.json({ events });
  } catch (err) {
    console.error("💥 Erreur GET /api/availability :", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}

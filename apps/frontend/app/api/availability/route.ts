export const runtime = "edge";

import { getCfEnv } from "@/lib/cf-env";

// Même type que dans reservation
type BookingBody = {
  dateISO: string;
  status: "reserved" | "hold";
  title?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end?: string;
  allDay?: boolean;
  display?: "auto" | "background" | "inverse-background" | "none";
  color?: string;
};

// --- partage du mockStore avec reservation ---
import { mockStore } from "../reservation/route"; 
// ⬆️ vous devez ajouter `export const mockStore = {}` dans reservation/route.ts

export async function GET() {
  try {
    const env = getCfEnv<{ BOOKINGS_KV: KVNamespace }>();

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
            display: "background",
            color: json.status === "hold" ? "#fbbf24" : "#f87171",
          });
        }
      }

      return Response.json({ events });
    }

    // --- Cas local (mock JSON + mockStore en mémoire) ---
    const mockFile = (await import("@/data/mock-bookings.json")).default as BookingBody[];
    const events: CalendarEvent[] = [];

    // depuis le fichier
    for (const [i, m] of mockFile.entries()) {
      events.push({
        id: `mockfile:${i}`,
        title: m.title ?? "Réservé",
        start: m.dateISO,
        allDay: true,
        display: "background",
        color: m.status === "hold" ? "#fbbf24" : "#f87171",
      });
    }

    // depuis le mockStore (alimenté par POST /api/reservation)
    for (const [dateISO, m] of Object.entries(mockStore)) {
      events.push({
        id: `mockmem:${dateISO}`,
        title: m.title ?? "Réservé",
        start: m.dateISO,
        allDay: true,
        display: "background",
        color: m.status === "hold" ? "#fbbf24" : "#f87171",
      });
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

// App Router - Edge runtime (Cloudflare Pages)
// GET /api/availability  ->  { events: EventInput[] }

export const runtime = "edge";

import { getRequestContext } from "@cloudflare/next-on-pages";

// facultatif : type FullCalendar (évite any)
type CalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end?: string;  // ISO
  allDay?: boolean;
  display?: "auto" | "background" | "inverse-background" | "none" | undefined;
  color?: string;
};

type BookingJSON = {
    dateISO: string;
    status: "reserved" | "hold";
    title?: string;
}

export async function GET() {
  const { env } = getRequestContext();
  const kv = (env as unknown as { BOOKINGS_KV: KVNamespace }).BOOKINGS_KV;

  // On liste les clés "booking:<dateISO>"
  const list = await kv.list({ prefix: "booking:" });

  const events: CalendarEvent[] = [];
  for (const name of list.keys) {
    const json = await kv.get<BookingJSON>(name.name, "json");

    if (json && typeof json === "object" && "dateISO" in json) {
      const { dateISO, status, title } = json;

      events.push({
        id: name.name,
        title: title ?? "Réservé",
        start: dateISO,
        allDay: true,
        display: "background",
        color: status === "hold" ? "#fbbf24" /* amber */ : "#f87171" /* red */,
      });
    }
  }

  return Response.json({ events });
}

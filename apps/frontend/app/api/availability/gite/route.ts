import { getCfEnv } from "@/lib/cf-env";

type BookingBody = {
  dateISO: string;
  status: "reserved" | "hold";
  title?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  allDay?: boolean;
  color?: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const from = fromParam ? new Date(fromParam) : null;
  const to = toParam ? new Date(toParam) : null;
  if (to) to.setDate(to.getDate() + 1);

  const events: CalendarEvent[] = [];

  try {
    const env = await getCfEnv<{ BOOKINGS_KV: KVNamespace }>();
    if (env?.BOOKINGS_KV) {
      const kv = env.BOOKINGS_KV;
      const list = await kv.list({ prefix: "booking:" });
      for (const { name } of list.keys) {
        const json = await kv.get<BookingBody>(name, "json");
        if (json?.dateISO) {
          const d = new Date(json.dateISO);
          if ((!from || d >= from) && (!to || d < to)) {
            events.push({
              id: name,
              title: json.title ?? "Réservé",
              start: json.dateISO,
              allDay: true,
              color: json.status === "hold" ? "#fbbf24" : "#f87171",
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Erreur KV:", err);
  }

  return Response.json({ events });
}

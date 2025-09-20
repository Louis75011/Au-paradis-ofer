import { parseIcsEvents, toISO } from "../../../../lib/ics";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
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

  const icsUrl = process.env.CALENDAR_ICS_URL;
  if (icsUrl) {
    const res = await fetch(icsUrl);
    if (res.ok) {
      const text = await res.text();
      const parsed = parseIcsEvents(text);

      for (const [id, ev] of Object.entries(parsed)) {
        const startISO = toISO(ev.start);
        if (!startISO) continue;

        const startDate = new Date(startISO);
        if ((!from || startDate >= from) && (!to || startDate < to)) {
          events.push({
            id: `ics:${id}`,
            title: ev.summary ?? "Séance",
            start: startISO,
            end: toISO(ev.end),
            allDay: ev.datetype === "date" || false,
            color: "#2563eb",
          });
        }
      }
    }
  }

  return Response.json({ events });
}

import { NextRequest, NextResponse } from "next/server";
import * as ical from "node-ical";

export const runtime = "nodejs"; // node-ical nécessite Node

// ----------------------
// Typage commun
// ----------------------
export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO
  end?: string;
  location?: string | null;
  description?: string | null;
  allDay?: boolean;
}

// ----------------------
// Types Google Calendar
// ----------------------
interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
  location?: string;
  description?: string;
}

interface GoogleCalendarResponse {
  items?: GoogleCalendarEvent[];
}

// ----------------------
// Utilitaire ICS
// ----------------------
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart <= bEnd && bStart <= aEnd;
}

function isVEvent(x: unknown): x is ical.VEvent {
  return typeof x === "object" && x !== null && (x as { type?: string }).type === "VEVENT";
}

// ----------------------
// Utilitaire Google API
// ----------------------
async function getGoogleAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token"
    })
  });

  const data: { access_token?: string } = await res.json();
  return data.access_token as string;
}

// ----------------------
// Handler
// ----------------------
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const startParam = url.searchParams.get("start");
    const endParam = url.searchParams.get("end");
    const rangeStart = startParam ? new Date(startParam) : new Date(Date.now() - 7 * 86400e3);
    const rangeEnd = endParam ? new Date(endParam) : new Date(Date.now() + 90 * 86400e3);

    let events: CalendarEvent[] = [];

    // 2. Google Calendar API
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_CALENDAR_ID) {
      const access_token = await getGoogleAccessToken();

      const r = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          process.env.GOOGLE_CALENDAR_ID!
        )}/events?timeMin=${encodeURIComponent(rangeStart.toISOString())}&timeMax=${encodeURIComponent(
          rangeEnd.toISOString()
        )}&singleEvents=true&orderBy=startTime`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const json: GoogleCalendarResponse = await r.json();
      events = (json.items ?? []).map((e): CalendarEvent => ({
        id: e.id,
        title: e.summary ?? "Réservé",
        start: e.start?.dateTime ?? e.start?.date ?? "",
        end: e.end?.dateTime ?? e.end?.date,
        location: e.location ?? null,
        description: e.description ?? null,
        allDay: Boolean(e.start?.date && !e.start?.dateTime)
      }));
    }

    // 3. Sinon fallback ICS
    else if (process.env.CALENDAR_ICS_URL) {
      const fromURL = ical.async.fromURL as (
        u: string,
        opts?: unknown
      ) => Promise<Record<string, ical.VEvent>>;

      const data = await fromURL(process.env.CALENDAR_ICS_URL!, {
        expand: { start: rangeStart, end: rangeEnd }
      });

      events = Object.values(data)
        .filter(isVEvent)
        .map((e): CalendarEvent => {
          const start =
            e.start instanceof Date ? e.start.toISOString() : new Date(e.start as string).toISOString();
          const end =
            e.end != null
              ? e.end instanceof Date
                ? e.end.toISOString()
                : new Date(e.end as string).toISOString()
              : undefined;

          return {
            id: e.uid ?? `${e.summary ?? "evt"}-${start}`,
            title: e.summary ?? "(Sans titre)",
            start,
            end,
            location: e.location ?? null,
            description: e.description ?? null,
            allDay: Boolean((e as unknown as { datetype?: string }).datetype === "date")
          };
        })
        .filter((ev) =>
          overlaps(new Date(ev.start), new Date(ev.end ?? ev.start), rangeStart, rangeEnd)
        );
    }

    else {
      return NextResponse.json({ error: "Aucune source calendar configurée" }, { status: 500 });
    }

    return NextResponse.json(events);
  } catch (err) {
    console.error("Erreur Calendar:", err);
    return NextResponse.json({ error: "Erreur interne Calendar" }, { status: 500 });
  }
}

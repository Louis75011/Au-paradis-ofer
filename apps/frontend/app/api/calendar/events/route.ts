import { NextRequest, NextResponse } from 'next/server';
import * as ical from 'node-ical';

export const runtime = 'nodejs';       // forcer Node runtime
export const revalidate = 300;         // cache ISR 5 min

// ---- Types sortants vers le frontend
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;        // ISO
  end?: string;         // ISO
  location?: string | null;
  description?: string | null;
  allDay?: boolean;
}

// ---- Utilitaires
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart <= bEnd && bStart <= aEnd;
}

// Type guard : ne garder que les VEVENT
function isVEvent(x: unknown): x is ical.VEvent {
  return typeof x === 'object' && x !== null && (x as { type?: string }).type === 'VEVENT';
}

export async function GET(req: NextRequest) {
  const icsUrl = process.env.CALENDAR_ICS_URL;
  if (!icsUrl) {
    return NextResponse.json({ error: 'CALENDAR_ICS_URL manquant' }, { status: 500 });
  }

  // Fenêtre demandée (ou défaut : -7j → +90j)
  const url = new URL(req.url);
  const startParam = url.searchParams.get('start');
  const endParam = url.searchParams.get('end');
  const rangeStart = startParam ? new Date(startParam) : new Date(Date.now() - 7 * 86400e3);
  const rangeEnd = endParam ? new Date(endParam) : new Date(Date.now() + 90 * 86400e3);

  // NOTE de typage : la définition TS de node-ical ne liste pas encore "expand".
  // On typage-narrow explicitement l'appel pour éviter l'erreur d'overload.
  const fromURL = ical.async.fromURL as (
    u: string,
    opts?: unknown
  ) => Promise<Record<string, unknown>>;

  const data = await fromURL(icsUrl, { expand: { start: rangeStart, end: rangeEnd } });

  const events: CalendarEvent[] = Object.values(data)
    .filter(isVEvent)
    .map((e) => {
      // node-ical garantit Date pour start/end après expand
      const start = e.start instanceof Date ? e.start.toISOString() : new Date(e.start as unknown as string).toISOString();
      const end =
        e.end != null
          ? e.end instanceof Date
            ? e.end.toISOString()
            : new Date(e.end as unknown as string).toISOString()
          : undefined;

      // Heuristique "allDay" minimale (on peut raffiner plus tard si besoin)
      const allDay = Boolean((e as unknown as { datetype?: string }).datetype === 'date');

      return {
        id: e.uid ?? `${e.summary ?? 'evt'}-${start}`,
        title: e.summary ?? '(Sans titre)',
        start,
        end,
        location: e.location ?? null,
        description: e.description ?? null,
        allDay,
      };
    })
    // re-filtrage par sécurité si l’ICS déborde la fenêtre
    .filter((ev) =>
      overlaps(new Date(ev.start), new Date(ev.end ?? ev.start), rangeStart, rangeEnd)
    );

  return NextResponse.json(events);
}

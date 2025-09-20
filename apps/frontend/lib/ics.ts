// apps/frontend/lib/ics.ts
import * as ical from "node-ical";

export type IcsEvent = {
  start: Date | null;
  end?: Date | null;
  summary?: string;
  datetype?: "date" | "date-time";
};

export function parseIcsEvents(icsText: string): Record<string, IcsEvent> {
  const parsed = ical.parseICS(icsText);
  const events: Record<string, IcsEvent> = {};

  for (const [id, ev] of Object.entries(parsed)) {
    if (ev.type === "VEVENT") {
      events[id] = {
        start: ev.start ?? null,
        end: ev.end ?? null,
        summary: ev.summary ?? undefined,
        datetype: ev.datetype as "date" | "date-time" | undefined,
      };
    }
  }
  return events;
}

export function toISO(date: Date | string | null | undefined): string | undefined {
  if (!date) return undefined;
  return new Date(date).toISOString();
}

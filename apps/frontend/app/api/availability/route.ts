// apps/frontend/app/api/availability/route.ts
export const runtime = "edge";

import { getCfEnv } from "@/lib/cf-env"; // optionnel, on le laisse pour Cloudflare KV
// import { logger } from "../../../lib/logger";
// logger.debug("[API availability] called", { from: fromParam, to: toParam });
// logger.warn("[API availability] ICS fetch failed:", res.status, res.statusText);

// types
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
  color?: string;
};

/** -- petits utilitaires ICS (inchangés / robustes) -- */
function parseIcsEvents(icsText: string): Record<string, { summary?: string; start?: string; end?: string; datetype?: "date" | undefined }> {
  const unfolded = icsText.replace(/\r?\n[ \t]/g, "");
  const events: Record<string, { summary?: string; start?: string; end?: string; datetype?: "date" | undefined }> = {};
  const blocks = unfolded.split(/BEGIN:VEVENT/i).slice(1);
  
  let idx = 0;
  for (const blk of blocks) {
    idx++;
    const endIdx = blk.indexOf("END:VEVENT");
    const content = endIdx === -1 ? blk : blk.slice(0, endIdx);
    
    const findProp = (name: string): string | undefined => {
      const re = new RegExp(`${name}(?:;[^:]*)?:([^\\r\\n]+)`, "i");
      const m = content.match(re);
      return m ? m[1].trim() : undefined;
    };

    const rawStart = findProp("DTSTART");
    const rawEnd = findProp("DTEND");
    const rawSummary = findProp("SUMMARY");
    const rawDatetype = /DTSTART[^:\n]*VALUE=DATE/i.test(content) ? "date" : undefined;

    if (rawStart) {
      const key = `evt-${idx}-${(rawStart || "").slice(0, 15).replace(/[^0-9T]/g, "")}`;
      events[key] = { summary: rawSummary, start: rawStart, end: rawEnd, datetype: rawDatetype };
    }
  }

  return events;
}

function icsValueToISO(raw?: string | undefined): string | undefined {
  if (!raw) return undefined;
  const maybe = raw.includes(":") ? raw.split(":").pop() : raw;
  if (!maybe) return undefined;

  if (/^\d{8}$/.test(maybe)) {
    const y = maybe.slice(0, 4), m = maybe.slice(4, 6), d = maybe.slice(6, 8);
    return `${y}-${m}-${d}`;
  }

  const dtMatch = maybe.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (dtMatch) {
    const [, Y, M, D, h, min, s, Z] = dtMatch;
    return `${Y}-${M}-${D}T${h}:${min}:${s}${Z ? "Z" : ""}`;
  }

  const parsed = new Date(maybe);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();

  return undefined;
}
function toISO(input?: string | undefined) { return icsValueToISO(input); }

/** Helper : crée un tableau d'exclusions à partir du param `exclude` et d'une valeur par défaut */
function buildExcludes(param?: string) {
  const defaults = ["gîte", "gite", "gîte", "gîtes"]; // mots exclus par défaut (insensibles à la casse)
  if (!param) return defaults;
  const custom = param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set([...defaults, ...custom]));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const excludeParam = searchParams.get("exclude") ?? undefined;

    const from = fromParam ? new Date(fromParam) : null;
    const to = toParam ? new Date(toParam) : null;
    if (to) to.setDate(to.getDate() + 1); // safe extend

    const LOG = process.env.DEBUG_API === "1";
    // const LOG = false;
    // if (LOG) console.log(`[API availability] called from=${fromParam} to=${toParam} (adjusted-to=${to?.toISOString()}) exclude=${excludeParam ?? ""}`);

    const excludeKeywords = buildExcludes(excludeParam).map((s) => s.toLowerCase());

    const eventsMap = new Map<string, CalendarEvent>();

    // --- 1) Cloudflare KV (optionnel) ---
    try {
      const env = await getCfEnv<{ BOOKINGS_KV: KVNamespace }>();
      if (env?.BOOKINGS_KV) {
        const kv = env.BOOKINGS_KV;
        const list = await kv.list({ prefix: "booking:" });
        // if (LOG) console.log("[API availability] KV list count:", list.keys.length);
        for (const { name } of list.keys) {
          const json = await kv.get<BookingBody>(name, "json");
          if (json?.dateISO) {
            const d = new Date(json.dateISO);
            if ((!from || d >= from) && (!to || d < to)) {
              const title = json.title ?? "Réservé";
              const titleLower = title.toLowerCase();
              const shouldExclude = excludeKeywords.some((k) => titleLower.includes(k));
              if (shouldExclude) {
                // if (LOG) console.log("[API availability] KV excluded by keyword:", { id: name, title });
                continue;
              }
              eventsMap.set(name, {
                id: name,
                title,
                start: json.dateISO,
                allDay: true,
                color: json.status === "hold" ? "#fbbf24" : "#f87171",
              });
            }
          }
        }
      }
    } catch (err: unknown) {
      if (LOG) {
        if (err instanceof Error) console.warn("[API availability] KV not available or error:", err.message);
        else console.warn("[API availability] KV not available");
      }
    }

    // --- 2) ICS Google Calendar ---
    const icsUrl = process.env.CALENDAR_ICS_URL;
    if (icsUrl) {
      // if (LOG) console.log("[API availability] fetching ICS from:", icsUrl);
      const res = await fetch(icsUrl);
      if (!res.ok) {
        if (LOG) console.warn("[API availability] ICS fetch failed:", res.status, res.statusText);
      } else {
        const text = await res.text();
        const parsed = parseIcsEvents(text);
        // if (LOG) console.log("[API availability] ICS parsed events:", Object.keys(parsed).length);

        for (const [id, ev] of Object.entries(parsed)) {
          const startISO = toISO(ev.start);
          const endISO = toISO(ev.end);
          if (!startISO) {
            // if (LOG) console.log("[API availability] ICS event discarded (no start):", { id, summary: ev.summary });
            continue;
          }

          const startDate = new Date(startISO);
          if ((!from || startDate >= from) && (!to || startDate < to)) {
            const title = ev.summary ?? "Séance";
            const titleLower = title.toLowerCase();
            const shouldExclude = excludeKeywords.some((k) => titleLower.includes(k));
            if (shouldExclude) {
              // if (LOG) console.log("[API availability] ICS excluded by keyword:", { id, title });
              continue;
            }

            const eventId = `ics:${id}`;
            eventsMap.set(eventId, {
              id: eventId,
              title,
              start: startISO,
              end: endISO,
              allDay: ev.datetype === "date" || false,
              color: "#2563eb",
            });

            // if (LOG) console.log("[API availability] ICS included:", { id, title, startISO });
          } else {
            // if (LOG) console.log("[API availability] ICS excluded (out of range):", { id, summary: ev.summary, startISO });
          }
        }
      }
    } else {
      // if (LOG) console.log("[API availability] CALENDAR_ICS_URL not configured");
    }

    // final array (dédupliqué par id)
    const events = Array.from(eventsMap.values());

    // if (LOG) console.log(`[API availability] returning ${events.length} events`);
    return Response.json({ events });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("💥 Erreur GET /api/availability :", err.message);
      return Response.json({ error: err.message }, { status: 500 });
    } else {
      console.error("💥 Erreur GET /api/availability (unknown)");
      return Response.json({ error: "Erreur inconnue" }, { status: 500 });
    }
  }
}

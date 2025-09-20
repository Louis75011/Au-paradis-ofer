// apps/frontend/app/components/BookingCalendar.tsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import type { EventInput, DatesSetArg, EventMountArg } from "@fullcalendar/core";

function dedupeById(events: EventInput[] = []) {
  const map = new Map<string, EventInput>();
  for (const e of events) {
    const ext = e as EventInput & { id?: string | number };
    const key = ext.id !== undefined ? String(ext.id) : JSON.stringify(e);
    if (!map.has(key)) map.set(key, e);
  }
  return Array.from(map.values());
}

export default function BookingCalendar({
  onDateSelected,
}: {
  onDateSelected?: (iso: string | null) => void;
}) {
  const calRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [, setLoading] = useState(false);

  const debounceTimerRef = useRef<number | null>(null);
  const pendingAbortRef = useRef<AbortController | null>(null);
  const lastRangeRef = useRef<{ from: string; to: string } | null>(null);

  const doFetch = useCallback(async (from: string, to: string) => {
    const last = lastRangeRef.current;
    if (last && last.from === from && last.to === to) return;

    if (pendingAbortRef.current) {
      pendingAbortRef.current.abort();
      pendingAbortRef.current = null;
    }
    const ac = new AbortController();
    pendingAbortRef.current = ac;

    setLoading(true);
    try {
      const qs = new URLSearchParams({ from, to });
      const res = await fetch(`/api/availability?${qs.toString()}`, { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { events?: EventInput[] } | null;
      const arr = Array.isArray(data?.events) ? data.events : [];
      setEvents(dedupeById(arr));
      lastRangeRef.current = { from, to };
    } catch (err: unknown) {
      // détection safe d'une AbortError sans utiliser `any`
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name?: unknown }).name === "AbortError"
      ) {
        // requête annulée — pas d'erreur à logger
      } else {
        // si vous voulez voir l'erreur en dev, activez DEBUG
        const DEBUG = process.env.NEXT_PUBLIC_DEBUG_CALENDAR === "1";
        if (DEBUG) {
          console.error("[BookingCalendar] fetchEvents error", err);
        }
      }
    } finally {
      pendingAbortRef.current = null;
      setLoading(false);
    }
  }, []);

  const fetchEventsForRange = useCallback(
    (from: string, to: string) => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      const delay = 150;
      debounceTimerRef.current = window.setTimeout(() => {
        debounceTimerRef.current = null;
        void doFetch(from, to);
      }, delay);
    },
    [doFetch],
  );

  function handleDatesSet(arg: DatesSetArg) {
    fetchEventsForRange(arg.startStr, arg.endStr);
  }

  useEffect(() => {
    const api = calRef.current?.getApi();
    if (api) {
      const startStr = api.view.activeStart.toISOString();
      const endStr = api.view.activeEnd.toISOString();
      fetchEventsForRange(startStr, endStr);
    } else {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      fetchEventsForRange(first, last);
    }

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      if (pendingAbortRef.current) {
        pendingAbortRef.current.abort();
        pendingAbortRef.current = null;
      }
    };
  }, [fetchEventsForRange]);

  return (
    <div className="booking-calendar">
      {/* <div className="mb-3 flex items-center gap-3">
        <span className="text-sm opacity-70">Événements chargés :</span>
        <span className="inline-block rounded-full bg-brand-dark/90 px-3 py-1 text-white text-sm">
          {events.length}
        </span>
        {loading && <span className="ml-3 text-sm opacity-80">Chargement…</span>}
      </div> */}

      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale="fr"
        locales={[frLocale]}
        height="auto"
        selectable={true}
        select={(info) => onDateSelected?.(info.startStr ?? null)}
        datesSet={handleDatesSet}
        events={events}
        eventContent={(arg) => (
          <div>
            {arg.timeText && <div className="fc-event-time">{arg.timeText}</div>}
            <div className="fc-event-title">{arg.event.title}</div>
          </div>
        )}
        eventDidMount={(arg: EventMountArg) => {
          const el = arg.el as HTMLElement | null;
          if (el) {
            el.style.backgroundColor = (arg.event.extendedProps?.color as string) || "#2563eb";
            el.style.color = "#ffffff";
          }
        }}
      />
    </div>
  );
}

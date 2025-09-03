"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, DateSelectArg } from "@fullcalendar/core";

// Calendrier des jours réservés

type Props = {
  onDateSelected?: (iso: string | null) => void;
};

export default function BookingCalendar({ onDateSelected }: Props) {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/availability", { cache: "no-store" });
      const data = (await res.json()) as { events: EventInput[] };
      setEvents(data.events ?? []);
    };
    run();
  }, []);

  function handleDateClick(arg: { dateStr: string }) {
    // on ne permet pas de cliquer sur un jour "réservé" (affiché en background) ?
    onDateSelected?.(arg.dateStr);
  }

  function handleSelect(selection: DateSelectArg) {
    onDateSelected?.(selection.startStr);
  }

  return (
    <div className="my-8 rounded-2xl border p-4 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        selectable
        selectMirror
        select={handleSelect}
        dateClick={handleDateClick}
        dayMaxEventRows
        firstDay={1} // lundi
        locale="fr"
      />
      <p className="mt-3 text-sm opacity-80">
        Les jours colorés indiquent des créneaux déjà réservés.
      </p>
    </div>
  );
}

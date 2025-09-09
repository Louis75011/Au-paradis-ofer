'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { EventSourceInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

export interface BookingCalendarProps {
  onDateSelected?: (isoDate: string) => void;
  initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  className?: string;
}

export default function BookingCalendar({
  onDateSelected,
  initialView = 'dayGridMonth',
  className,
}: BookingCalendarProps) {
  // Source d’événements (via votre API Next)
  const sources = useMemo<EventSourceInput[]>(
    () => [{ url: '/api/calendar/events', method: 'GET', failure: () => console.error('Échec chargement agenda') }],
    []
  );

  return (
    <div className={className}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locales={[frLocale]}
        locale="fr"
        height="auto"
        initialView={initialView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        eventSources={sources}
        // Ne pas permettre de sélectionner dans le passé
        validRange={{ start: new Date().toISOString().slice(0, 10) }}
        // Lorsque l’utilisateur clique un jour, on remonte un ISO (date seule, début de journée)
        dateClick={(info) => {
          const iso = new Date(info.dateStr + 'T00:00:00').toISOString();
          onDateSelected?.(iso);
        }}
        // Un petit rendu d’événement plus lisible (facultatif)
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: false }}
      />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import type { EventInput, DateSelectArg } from "@fullcalendar/core";

// // Calendrier des jours réservés

// type Props = {
//   onDateSelected?: (iso: string | null) => void;
// };

// export default function BookingCalendar({ onDateSelected }: Props) {
//   const [events, setEvents] = useState<EventInput[]>([]);

//   useEffect(() => {
//     const run = async () => {
//       const res = await fetch("/api/availability", { cache: "no-store" });
//       const data = (await res.json()) as { events: EventInput[] };
//       setEvents(data.events ?? []);
//     };
//     run();
//   }, []);

//   function handleDateClick(arg: { dateStr: string }) {
//     // on ne permet pas de cliquer sur un jour "réservé" (affiché en background) ?
//     onDateSelected?.(arg.dateStr);
//   }

//   function handleSelect(selection: DateSelectArg) {
//     onDateSelected?.(selection.startStr);
//   }

//   return (
//     <div className="my-8 rounded-2xl border p-4 shadow-sm">
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         height="auto"
//         events={events}
//         selectable
//         selectMirror
//         select={handleSelect}
//         dateClick={handleDateClick}
//         dayMaxEventRows
//         firstDay={1} // lundi
//         locale="fr"
//       />
//       <p className="mt-3 text-sm opacity-80">
//         Les heures et jours colorés indiqueront les créneaux déjà réservés.
//       </p>
//     </div>
//   );
// }

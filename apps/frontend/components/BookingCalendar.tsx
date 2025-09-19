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
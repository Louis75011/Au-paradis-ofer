'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import type { CalendarEvent } from '../api/calendar/events/route';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

export default function AgendaPage() {
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getTime() - 7 * 86400e3).toISOString();
    const end = new Date(now.getTime() + 90 * 86400e3).toISOString();

    fetch(`/api/calendar/events?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
      .then(async (r) => (r.ok ? (r.json() as Promise<CalendarEvent[]>) : Promise.reject(await r.text())))
      .then((data) => setEvents(data))
      .catch((err) => {
        console.error('Erreur agenda', err);
        setEvents([]); // éviter un état bloqué de chargement
      });
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Agenda — Au Paradis O’Fer</h1>
      {events === null ? (
        <p>Chargement de l’agenda…</p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[frLocale]}
          locale="fr"
          height="auto"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
        />
      )}
    </main>
  );
}

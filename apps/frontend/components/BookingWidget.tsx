"use client";
import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { addMinutes, differenceInCalendarDays, formatISO } from "date-fns";

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
};

const SEPA_MIN_DAYS = Number(process.env.NEXT_PUBLIC_SEPA_MIN_DAYS ?? 5);

export default function BookingWidget() {
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const calRef = useRef<FullCalendar | null>(null);
//   const calendarApi = calRef.current?.getApi(); // Accès à l'api
//   calendarApi?.next(); // exemple : passer au mois suivant

  const canUseSEPA = useMemo(() => {
    if (!selectedISO) return false;
    return differenceInCalendarDays(new Date(selectedISO), new Date()) >= SEPA_MIN_DAYS;
  }, [selectedISO]);

  async function createCheckout(method: "card" | "sepa") {
    if (!selectedISO) return alert("Veuillez sélectionner un créneau.");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotISO: selectedISO, method }),
      });
      if (!res.ok) throw new Error("Échec création Checkout");
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("URL Checkout manquante");
      window.location.href = data.url;
    } catch (e) {
      const err = e as Error;
      alert(err.message || "Erreur inattendue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        slotDuration="01:00:00"
        selectable
        selectMirror
        allDaySlot={false}
        height="auto"
        select={(info) => {
          // On force des créneaux d'1h
          const start = info.start;
          const end = addMinutes(start, 60);
          setSelectedISO(formatISO(start));
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        // Option : injecter des événements "occupés" si vous en avez (Phase 2)
        events={async (info, success, failure) => {
          try {
            const qs = new URLSearchParams({ from: info.startStr, to: info.endStr });
            const res = await fetch(`/api/availability?${qs.toString()}`);
            const data = (await res.json()) as { events: Event[] };
            success(data.events);
          } catch (e) {
            const err = e as Error;
            failure(err);
          }
        }}
      />

      <div className="rounded-xl border p-4">
        <p className="mb-2 font-medium">
          Créneau choisi : {selectedISO ? new Date(selectedISO).toLocaleString() : "—"}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="btn btn-primary"
            disabled={!selectedISO || isSubmitting}
            onClick={() => createCheckout("card")}
            title="Paiement immédiat par carte"
          >
            Payer maintenant (CB)
          </button>

          <button
            className="btn btn-ghost"
            disabled={!selectedISO || !canUseSEPA || isSubmitting}
            onClick={() => createCheckout("sepa")}
            title={
              canUseSEPA
                ? "SEPA ou CB (≥ J+5)"
                : `SEPA indisponible : réservez ≥ J+${SEPA_MIN_DAYS}`
            }
          >
            SEPA (ou CB) — ≥ J+{SEPA_MIN_DAYS}
          </button>
        </div>
        {!canUseSEPA && selectedISO && (
          <p className="mt-2 text-sm opacity-80">
            Pour le SEPA, choisissez une date au moins J+{SEPA_MIN_DAYS}.
          </p>
        )}
      </div>
    </div>
  );
}

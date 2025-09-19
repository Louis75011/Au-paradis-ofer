"use client";

import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventInput } from "@fullcalendar/core"; // les deux viennent de core
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { differenceInCalendarDays, formatISO } from "date-fns"; // addMinutes à termes si besoin

const SEPA_MIN_DAYS = Number(process.env.NEXT_PUBLIC_SEPA_MIN_DAYS ?? 5);

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export default function BookingWidget({ offer }: { offer: "gite_basic" | "gite_plus" }) {
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const calRef = useRef<FullCalendar | null>(null);

  const canUseSEPA = useMemo(() => {
    if (!selectedISO) return false;
    return differenceInCalendarDays(new Date(selectedISO), new Date()) >= SEPA_MIN_DAYS;
  }, [selectedISO]);

  async function createCheckout(method: "card" | "sepa") {
    if (!selectedISO) {
      alert("Veuillez sélectionner un créneau.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotISO: selectedISO, method, offer }),
      });

      const data: { url?: string } = await res.json();
      if (!res.ok || !data.url) throw new Error("Échec création Checkout");

      window.location.href = data.url;
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Erreur inattendue");
      alert(err.message);
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
        select={(info: DateSelectArg) => {
          // On force des créneaux d'1h
          const start = info.start;
          // const end = addMinutes(start, 60); // supprimé : inutilisé
          setSelectedISO(formatISO(start));
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={async (info, success, failure) => {
          try {
            const qs = new URLSearchParams({ from: info.startStr, to: info.endStr });
            const res = await fetch(`/api/availability?${qs.toString()}`);
            const data: { events: Event[] } = await res.json();
            success(data.events as EventInput[]);
          } catch (e) {
            const err = e instanceof Error ? e : new Error("Erreur chargement événements");
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
            className="btn btn-primary bg-brand-dark"
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

"use client";
import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { addMinutes, differenceInCalendarDays, formatISO } from "date-fns";

const SEPA_MIN_DAYS = Number(process.env.NEXT_PUBLIC_SEPA_MIN_DAYS ?? 5);

export default function BookingWidget() {
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const calRef = useRef<FullCalendar | null>(null);

  const canUseSEPA = useMemo(() => {
    if (!selectedISO) return false;
    return differenceInCalendarDays(new Date(selectedISO), new Date()) >= SEPA_MIN_DAYS;
  }, [selectedISO]);

  async function createCheckout(method: "card" | "sepa_card") {
    if (!selectedISO) return alert("Veuillez sélectionner un créneau.");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotISO: selectedISO, method }),
      });
      if (!res.ok) throw new Error("Échec création Checkout");
      const { url } = await res.json();
      if (!url) throw new Error("URL Checkout manquante");
      window.location.href = url;
    } catch (e: any) {
      alert(e.message || "Erreur inattendue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <FullCalendar
        ref={calRef as any}
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
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
        // Option : injecter des événements "occupés" si vous en avez (Phase 2)
        events={[]}
      />

      <div className="rounded-xl border p-4">
        <p className="mb-2 font-medium">Créneau choisi : {selectedISO ? new Date(selectedISO).toLocaleString() : "—"}</p>
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
            onClick={() => createCheckout("sepa_card")}
            title={canUseSEPA ? "SEPA ou CB (≥ J+5)" : `SEPA indisponible : réservez ≥ J+${SEPA_MIN_DAYS}`}
          >
            SEPA (ou CB) — ≥ J+{SEPA_MIN_DAYS}
          </button>
        </div>
        {!canUseSEPA && selectedISO && (
          <p className="mt-2 text-sm opacity-80">Pour le SEPA, choisissez une date au moins J+{SEPA_MIN_DAYS}.</p>
        )}
      </div>
    </div>
  );
}
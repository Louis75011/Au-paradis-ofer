// apps/frontend/components/BookingWidget.tsx
"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { differenceInCalendarDays, formatISO } from "date-fns";
import frLocale from "@fullcalendar/core/locales/fr";

const SEPA_MIN_DAYS = Number(process.env.NEXT_PUBLIC_SEPA_MIN_DAYS ?? 5);

type Event = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
};

// --- Hook personnalisé ---
function useIsNarrow(threshold = 1024) {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    function onResize() {
      setIsNarrow(window.innerWidth < threshold);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [threshold]);
  return isNarrow;
}

function formatISOForDisplay(iso?: string | null) {
  if (!iso) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return new Date(iso).toLocaleDateString("fr-FR");
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("fr-FR");
}

export default function BookingWidget({
  offer,
}: {
  offer: "gite_basic" | "gite_plus" | string;
}) {
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [selectedEndISO, setSelectedEndISO] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGiteInfo, setShowGiteInfo] = useState(false);
  const calRef = useRef<FullCalendar | null>(null);

  const isNarrow = useIsNarrow(1024);

  const canUseSEPA = useMemo(() => {
    if (!selectedISO) return false;
    return (
      differenceInCalendarDays(new Date(selectedISO), new Date()) >=
      SEPA_MIN_DAYS
    );
  }, [selectedISO]);

  const isGiteOffer = String(offer).toLowerCase().includes("gite");

  async function createCheckout(method: "card" | "sepa") {
    if (isGiteOffer) {
      setShowGiteInfo(true);
      setTimeout(() => {
        const el = document.getElementById("gite-notice");
        el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
      return;
    }
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

  function handlePayNow() {
    createCheckout("card");
  }
  function handleSEPA() {
    createCheckout("sepa");
  }

  const visuallyDisabledClass = "opacity-60";
  const primaryBtnClass = "btn btn-primary bg-brand-dark";
  const ghostBtnClass = "btn btn-ghost";

  return (
    <div className="space-y-4">
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isNarrow ? "timeGridDay" : "timeGridWeek"}
        slotDuration="01:00:00"
        selectable
        selectMirror
        allDaySlot={false}
        height="auto"
        locales={[frLocale]}
        locale="fr"
        select={(info: DateSelectArg) => {
          const start = info.start;
          const end = info.end ?? null;
          setSelectedISO(formatISO(start));
          setSelectedEndISO(end ? formatISO(end) : null);
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: isNarrow
            ? "timeGridDay"
            : "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={async (info, success, failure) => {
          try {
            const qs = new URLSearchParams({
              from: info.startStr,
              to: info.endStr,
            });

            // 👉 changement ici : endpoint selon l'offre
            const endpoint = isGiteOffer
              ? `/api/availability/gite?${qs.toString()}`
              : `/api/availability/seance?${qs.toString()}`;

            const res = await fetch(endpoint);
            const data = (await res.json()) as { events: Event[] };

            const mapped: EventInput[] = (data.events || [])
              .map((ev: Event) => {
                let startISO = ev.start as string | undefined;
                let endISO = ev.end ?? undefined;
                if (!startISO) return null as unknown as EventInput;

                let isAllDay =
                  !!ev.allDay || /^\d{4}-\d{2}-\d{2}$/.test(startISO);

                if (!endISO) {
                  if (isAllDay) {
                    const d = new Date(startISO);
                    d.setDate(d.getDate() + 1);
                    endISO = d.toISOString().slice(0, 10);
                  } else {
                    const d = new Date(startISO);
                    d.setHours(d.getHours() + 1);
                    endISO = d.toISOString();
                  }
                }

                const startMs = Date.parse(startISO);
                const endMs = endISO ? Date.parse(endISO) : null;
                if (endMs && endMs - startMs >= 20 * 60 * 60 * 1000) {
                  const sDate = new Date(startMs)
                    .toISOString()
                    .slice(0, 10);
                  const eDate = new Date(endMs).toISOString().slice(0, 10);
                  isAllDay = true;
                  startISO = sDate;
                  endISO = eDate;
                }

                return {
                  id: ev.id,
                  title: ev.title,
                  start: startISO,
                  end: endISO,
                  allDay: isAllDay,
                  display: "auto",
                } as EventInput;
              })
              .filter(Boolean) as EventInput[];

            // console.log("mapped events:", mapped);
            success(mapped);
          } catch (e) {
            const err =
              e instanceof Error
                ? e
                : new Error("Erreur chargement événements");
            failure(err);
          }
        }}
      />

      {/* Panneau de sélection et boutons */}
      <div className="rounded-xl border p-4">
        <p className="mb-2 font-medium">Créneau choisi :</p>
        <div className="mb-2">
          <div className="text-sm">
            <strong>Début :</strong>{" "}
            {selectedISO ? formatISOForDisplay(selectedISO) : "—"}
          </div>
          <div className="text-sm">
            <strong>Fin :</strong>{" "}
            {selectedEndISO ? formatISOForDisplay(selectedEndISO) : "—"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePayNow}
            className={`${primaryBtnClass} ${
              !selectedISO || isSubmitting
                ? "opacity-40 cursor-not-allowed"
                : ""
            } ${isGiteOffer ? visuallyDisabledClass : ""}`}
            aria-disabled={!selectedISO || isSubmitting || isGiteOffer}
          >
            Payer maintenant (CB)
          </button>

          <button
            onClick={handleSEPA}
            className={
              canUseSEPA
                ? `btn btn-sepa-enabled ${
                    isGiteOffer ? visuallyDisabledClass : ""
                  }`
                : `${ghostBtnClass} ${
                    !selectedISO || isSubmitting || !canUseSEPA
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  } ${isGiteOffer ? visuallyDisabledClass : ""}`
            }
            aria-disabled={!selectedISO || isSubmitting || !canUseSEPA || isGiteOffer}
          >
            SEPA si ≥ J+{SEPA_MIN_DAYS}
          </button>
        </div>

        {!canUseSEPA && selectedISO && !isGiteOffer && (
          <p className="mt-2 text-sm opacity-80">
            Pour le SEPA, choisissez une date au moins J+{SEPA_MIN_DAYS}.
          </p>
        )}

        {isGiteOffer && showGiteInfo && (
          <p
            id="gite-notice"
            className="mt-3 block rounded border-l-4 border-brand-dark bg-brand-cream p-3 text-sm text-neutral-700 opacity-90"
          >
            Le gîte n’est pas encore disponible à la réservation en ligne.
          </p>
        )}
      </div>
    </div>
  );
}

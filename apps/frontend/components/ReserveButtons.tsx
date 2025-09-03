"use client";
import { differenceInCalendarDays } from "date-fns";

export default function ReserveButtons({ dateISO }: { dateISO: string }) {
  const reg = process.env.NEXT_PUBLIC_CAL_REGULAR!;
  const rush = process.env.NEXT_PUBLIC_CAL_RUSH!;
  const isRush = differenceInCalendarDays(new Date(dateISO), new Date()) < 3;

  const url = isRush ? rush : reg;

  return (
    <div className="mt-4 flex gap-3">
      <a
        className="btn btn-primary"
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label={isRush ? "Réserver (carte uniquement)" : "Réserver (SEPA ou carte)"}
      >
        {isRush ? "Payer par carte (dernière minute)" : "Payer (SEPA préféré)"}
      </a>
      {!isRush && (
        <span className="badge badge-ghost">Préférence : SEPA (frais réduits)</span>
      )}
    </div>
  );
}

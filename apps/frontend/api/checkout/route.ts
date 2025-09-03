import { NextRequest, NextResponse } from "next/server";
import { differenceInCalendarDays } from "date-fns";

// MAIS PASSER PLUTOT PAR CAL.COM ?
// NEXT_PUBLIC_STRIPE_LINK_SEPA=https://buy.stripe.com/test_xxx
// NEXT_PUBLIC_STRIPE_LINK_CARD=https://buy.stripe.com/test_yyy

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { dateISO } = await req.json() as { dateISO: string };
  if (!dateISO) return NextResponse.json({ error: "dateISO required" }, { status: 400 });

  const isRush = differenceInCalendarDays(new Date(dateISO), new Date()) < 3;
  const url = isRush
    ? process.env.NEXT_PUBLIC_STRIPE_LINK_CARD
    : process.env.NEXT_PUBLIC_STRIPE_LINK_SEPA;

  return NextResponse.json({ url });
}

// // Côté UI :
// async function pay(dateISO: string) {
//   const res = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ dateISO }) });
//   const { url } = await res.json();
//   window.location.href = url;
// }

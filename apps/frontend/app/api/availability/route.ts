import { NextResponse } from "next/server";
export const runtime = "edge";

type Env = { BOOKINGS_KV: KVNamespace };

export async function GET(_: Request, ctx: { env: Env }) {
  // Selon Pages/Workers, listez les clés KV (nécessite listing activé) ;
  // à défaut, stockez aussi un index simple en parallèle
  // Ici, on suppose un index JSON sous la clé "index:booked"
  const raw = await ctx.env.BOOKINGS_KV.get("index:booked");
  const list = raw ? JSON.parse(raw) as string[] : [];

  const events = list.map((iso) => ({
    start: iso,
    end: new Date(new Date(iso).getTime() + 60 * 60 * 1000).toISOString(),
    display: "background",
    color: "#fca5a5",
    overlap: false,
  }));

  return NextResponse.json({ events });
}
import { NextRequest } from "next/server";

type Env = {
  BOOKINGS_KV: KVNamespace;
};

export async function onRequestPost({ request, env }: { request: NextRequest; env: Env }) {
  const data = (await request.json()) as unknown;
  await env.BOOKINGS_KV.put(`booking:${Date.now()}`, JSON.stringify(data));
  return new Response("Réservation enregistrée", { status: 200 });
}

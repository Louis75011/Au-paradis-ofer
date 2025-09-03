export async function onRequestPost({ request, env }) {
  const data = await request.json();
  await env.BOOKINGS_KV.put(`booking:${Date.now()}`, JSON.stringify(data));
  return new Response("Réservation enregistrée", { status: 200 });
}

export const runtime = 'edge';

type Env = { BOOKINGS_KV: KVNamespace }; // fourni par @cloudflare/workers-types

export async function POST(
  request: Request,
  ctx: { cloudflare: { env: Env } }
) {
  const { env } = ctx.cloudflare;

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return new Response('JSON invalide', { status: 400 });
  }

  const key = `booking:${Date.now()}`;
  await env.BOOKINGS_KV.put(key, JSON.stringify(data));

  return Response.json({ ok: true, key });
}

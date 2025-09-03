export const runtime = 'edge';
type Env = { BOOKINGS_KV: KVNamespace };
export async function GET(_: Request, ctx: { cloudflare: { env: Env } }) {
  const { env } = ctx.cloudflare;
  await env.BOOKINGS_KV.put('ping', 'pong');
  const v = await env.BOOKINGS_KV.get('ping');
  return Response.json({ v });
}
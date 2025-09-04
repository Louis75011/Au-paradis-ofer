export const runtime = "edge";
import { getCfEnv } from "@/lib/cf-env";

export async function GET() {
  const env = await getCfEnv<{ BOOKINGS_KV: KVNamespace }>();

  if (!env?.BOOKINGS_KV) {
    return Response.json(
      { ok: false, reason: "BOOKINGS_KV missing (binding non exposé au runtime)" },
      { status: 501 }
    );
  }

  const kv = env.BOOKINGS_KV;
  const key = "health::ping";
  await kv.put(key, new Date().toISOString());
  const val = await kv.get(key);

  return Response.json({ ok: true, value: val });
}

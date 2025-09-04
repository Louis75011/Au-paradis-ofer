export const runtime = "edge";

import { getCfEnv, isCloudflare } from "@/lib/cf-env";

export async function GET() {
  const env = getCfEnv();
  if (!isCloudflare() || !env?.BOOKINGS_KV) {
    return Response.json({ ok: false, reason: "Not on Cloudflare or KV missing" }, { status: 501 });
  }
  const kv = env.BOOKINGS_KV;
  const key = "health:ping";
  await kv.put(key, new Date().toISOString());
  const val = await kv.get(key);
  return Response.json({ ok: true, value: val });
}

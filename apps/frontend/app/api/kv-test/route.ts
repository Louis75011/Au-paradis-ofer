// app/api/kv-test/route.ts (ou le fichier de votre capture)
export const runtime = "edge";
import { getCfEnv } from "@/lib/cf-env";

export async function GET() {
  // ✅ attendre l'env et le typer
  const env = await getCfEnv<{ BOOKINGS_KV: KVNamespace }>();

  // ✅ garde : si pas de binding -> 501
  if (!env?.BOOKINGS_KV) {
    return Response.json(
      { ok: false, reason: "KV missing (env.BOOKINGS_KV indisponible)" },
      { status: 501 }
    );
  }

  const kv = env.BOOKINGS_KV;
  const key = "health::ping";

  await kv.put(key, new Date().toISOString());
  const val = await kv.get(key);

  return Response.json({ ok: true, value: val });
}

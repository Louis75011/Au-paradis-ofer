export const runtime = "edge";

export async function GET() {
  const result: Record<string, unknown> = {};

  // 1) cloudflare:env (nouveau)
  try {
    const mod = await (0, eval)(`import("cloudflare:env")`);
    const env = mod?.env;
    result.cf_env_ok = !!env;
    result.cf_env_keys = env ? Object.keys(env) : [];
    result.cf_env_has_BOOKINGS_KV = !!env?.BOOKINGS_KV;
  } catch (e) {
    result.cf_env_error = String(e);
  }

  // 2) cloudflare:workers (ancien)
  try {
    const mod = await (0, eval)(`import("cloudflare:workers")`);
    const env = mod?.env;
    result.cf_workers_ok = !!env;
    result.cf_workers_keys = env ? Object.keys(env) : [];
    result.cf_workers_has_BOOKINGS_KV = !!env?.BOOKINGS_KV;
  } catch (e) {
    result.cf_workers_error = String(e);
  }

  // 3) tentative via globalThis (rare, mais on vérifie)
  const g = globalThis as Record<string, unknown>;
  result.global_has_BOOKINGS_KV = !!g?.BOOKINGS_KV;

  return Response.json(result);
}

export type CfEnv = {
  BOOKINGS_KV: KVNamespace;
  STRIPE_SECRET_KEY?: string;
  NEXT_PUBLIC_BASE_URL?: string;
};

// Étend globalThis pour éviter les `any`
declare global {
  // Variante utilisée par next-on-pages
  var __env: CfEnv | undefined;
  // Variante Workers classique
  var ENV: CfEnv | undefined;
}

// lib/cf-env.ts
let _cachedEnv: unknown;

/**
 * Récupère les bindings Cloudflare au runtime (Pages/Workers).
 * Essaie d'abord `cloudflare:env` (nouveau), puis `cloudflare:workers` (ancien).
 * En local ou si absent => undefined.
 */
export async function getCfEnv<T = Record<string, unknown>>(): Promise<T | undefined> {
  if (_cachedEnv) return _cachedEnv as T;

  // Empêche Webpack/Next de résoudre au build
  const dynImport = (spec: string) => (0, eval)(`import(${JSON.stringify(spec)})`);

  try {
    const mod = await dynImport("cloudflare:env"); // ← priorité au nouveau
    const env = (mod as { env: unknown }).env;
    _cachedEnv = env;
    return env as T;
  } catch {
    // ignore
  }
  try {
    const mod = await dynImport("cloudflare:workers"); // ← fallback ancien
    const env = (mod as { env: unknown }).env;
    _cachedEnv = env;
    return env as T;
  } catch {
    return undefined; // local / pas de bindings
  }
}

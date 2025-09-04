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
 * Récupère les bindings Cloudflare (env) au runtime.
 * - En prod Pages/Workers : renvoie l'objet env (KV, D1, variables…)
 * - En local / build : renvoie undefined (pas de bindings)
 */
export async function getCfEnv<T = Record<string, unknown>>(): Promise<T | undefined> {
  if (_cachedEnv) return _cachedEnv as T;

  try {
    // ⚠️ Important : empêcher Webpack d'essayer de résoudre "cloudflare:workers" au build.
    const mod = await (0, eval)('import("cloudflare:workers")');
    const env = (mod as { env: unknown }).env;
    _cachedEnv = env;
    return env as T;
  } catch {
    // Local/Node : aucun binding disponible
    return undefined;
  }
}

/** Optionnel : petit helper si vous voulez différencier CF au runtime */
export function isCloudflareRuntime(): boolean {
  // Heuristique légère, ne bloque rien si false en local
  return typeof globalThis !== "undefined" && "caches" in globalThis && !("process" in globalThis);
}

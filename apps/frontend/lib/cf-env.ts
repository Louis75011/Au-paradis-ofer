import { getRequestContext } from "@cloudflare/next-on-pages";

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

let _cached: unknown;

export async function getCfEnv<T = Record<string, unknown>>(): Promise<T | undefined> {
  if (_cached) return _cached as T;
  try {
    // Cloudflare Pages/Workers (bindings)
    const { env } = await import('cloudflare:workers');
    _cached = env;
    return env as T;
  } catch {
    // Local / Node sans bindings
    return undefined;
  }
}

export function isCloudflare(): boolean {
  try {
    getRequestContext();
    return true;
  } catch {
    return false;
  }
}

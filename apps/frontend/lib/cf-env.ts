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

export function getCfEnv<TEnv extends Record<string, unknown> = CfEnv>(): TEnv | undefined {
  try {
    if (typeof globalThis !== "undefined" && globalThis.__env) {
      return globalThis.__env as unknown as TEnv;
    }
    if (typeof globalThis !== "undefined" && globalThis.ENV) {
      return globalThis.ENV as unknown as TEnv;
    }
  } catch {
    // silencieux
  }
  return undefined; // en local "next start", on tombera sur le mock
}

export function isCloudflare(): boolean {
  try {
    getRequestContext();
    return true;
  } catch {
    return false;
  }
}

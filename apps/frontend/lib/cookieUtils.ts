// apps/frontend/lib/cookieUtils.ts
export type CookieCategories = {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

export const CONSENT_COOKIE_NAME = "apof_cookie_consent";
export const CONSENT_COOKIE_TTL_DAYS = 180; // durée du consentement

function encode(v: unknown) {
  return encodeURIComponent(JSON.stringify(v));
}
function decode(s: string) {
  try {
    return JSON.parse(decodeURIComponent(s));
  } catch {
    return null;
  }
}

export function readConsentFromCookie(): CookieCategories | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!m) return null;
  const v = m.split("=")[1];
  return decode(v) as CookieCategories | null;
}

export function writeConsentToCookie(payload: CookieCategories) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + CONSENT_COOKIE_TTL_DAYS * 86400e3).toUTCString();
  const v = encode(payload);
  // secure & sameSite for production; adapt domain if besoin
  document.cookie = `${CONSENT_COOKIE_NAME}=${v}; path=/; expires=${expires}; SameSite=Lax`;
}

export function clearConsentCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

// apps/frontend/components/CookieContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import CookieBanner from "./CookieBanner";
import CookiePrefs from "./CookiePrefs";
import { CookieCategories, readConsentFromCookie, writeConsentToCookie } from "../lib/cookieUtils"; // clearConsentCookie, CONSENT_COOKIE_NAME

type CookieContextValue = {
  consent: CookieCategories | null;
  setConsent: (c: CookieCategories) => void;
  acceptAll: () => void;
  refuseAll: () => void;
  openPrefs: () => void;
  closePrefs: () => void;
  isPrefsOpen: boolean;
};

const CookieContext = createContext<CookieContextValue | undefined>(undefined);

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<CookieCategories | null>(null);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydratation côté client
    const c = readConsentFromCookie();
    setConsentState(c);
    setHydrated(true);
  }, []);

  useEffect(() => {
    // chaque fois que consent change, on applique (init scripts etc.)
    if (!hydrated) return;
    if (consent) {
      writeConsentToCookie(consent);
      applyConsentEffects(consent);
    }
  }, [consent, hydrated]);

  function setConsent(c: CookieCategories) {
    // necessary doit toujours être true
    const enforced = { ...c, necessary: true } as CookieCategories;
    setConsentState(enforced);
  }

  function acceptAll() {
    setConsent({ necessary: true, preferences: true, analytics: true, marketing: true });
  }

  function refuseAll() {
    setConsent({ necessary: true, preferences: false, analytics: false, marketing: false });
    // on peut enlever certains cookies tiers si besoin :
    // ex: removeAnalyticsCookies();
  }

  function openPrefs() {
    setIsPrefsOpen(true);
  }
  function closePrefs() {
    setIsPrefsOpen(false);
  }

  const value = useMemo(
    () => ({ consent, setConsent, acceptAll, refuseAll, openPrefs, closePrefs, isPrefsOpen }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [consent, isPrefsOpen],
  );

  return (
    <CookieContext.Provider value={value}>
      {children}
      <CookieBanner />
      <CookiePrefs />
    </CookieContext.Provider>
  );
}

export function useCookie() {
  const ctx = useContext(CookieContext);
  if (!ctx) throw new Error("useCookie must be used inside CookieProvider");
  return ctx;
}

/** Effets à appliquer — ici placeholders : activez vos scripts tiers si consent.analytics etc. */
function applyConsentEffects(consent: CookieCategories) {
  // Analytics
  if (consent.analytics) {
    // ex : window.gtag && window.gtag('consent', 'update', { analytics_storage: 'granted' })
    enableAnalytics();
  } else {
    disableAnalytics();
  }
  // Marketing
  if (consent.marketing) {
    enableMarketing();
  } else {
    disableMarketing();
  }
  // Preferences: particular site prefs (UI) can be toggled client-side
}

function enableAnalytics() {
  window.__APOF_ANALYTICS_ENABLED = true;
}

function disableAnalytics() {
  window.__APOF_ANALYTICS_ENABLED = false;
}

function enableMarketing() {
  window.__APOF_MARKETING_ENABLED = true;
}

function disableMarketing() {
  window.__APOF_MARKETING_ENABLED = false;
}

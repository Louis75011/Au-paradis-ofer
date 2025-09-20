// apps/frontend/components/CookieBanner.tsx
"use client";

import { useEffect, useState } from "react";

// type Prefs = {
//   preferences: boolean;
//   analytics: boolean;
//   marketing: boolean;
// };

// const ALL_TRUE: Prefs = { preferences: true, analytics: true, marketing: true };
// const ALL_FALSE: Prefs = { preferences: false, analytics: false, marketing: false };

// function persistPrefs(p: Prefs) {
//   localStorage.setItem("cookieprefs", JSON.stringify(p));
//   // prévient tous les composants qui écoutent
//   document.dispatchEvent(new CustomEvent("cookieprefs-saved", { detail: p }));
// }

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookieprefs");
    if (!saved) setVisible(true);

    const handler = () => setVisible(false); // cache la bannière quand on reçoit l'événement
    document.addEventListener("cookieprefs-saved", handler);
    return () => document.removeEventListener("cookieprefs-saved", handler);
  }, []);

  function acceptAll() {
    const prefs = { preferences: true, analytics: true, marketing: true };
    localStorage.setItem("cookieprefs", JSON.stringify(prefs));
    document.dispatchEvent(new CustomEvent("cookieprefs-saved", { detail: prefs }));
    setVisible(false);
  }

  function refuseAll() {
    const prefs = { preferences: false, analytics: false, marketing: false };
    localStorage.setItem("cookieprefs", JSON.stringify(prefs));
    document.dispatchEvent(new CustomEvent("cookieprefs-saved", { detail: prefs }));
    setVisible(false);
  }

  function openPrefs() {
    // ouvre via CustomEvent — CookiePrefsDialog écoute "open-cookieprefs"
    document.dispatchEvent(new CustomEvent("open-cookieprefs"));
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-neutral-900 text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm">
        Nous utilisons des cookies essentiels et, avec votre accord, des cookies non essentiels.
        Vous pouvez refuser sans impact.
      </p>
      <div className="flex gap-2">
        <button onClick={refuseAll} className="px-3 py-1 rounded border border-white text-sm">
          Tout refuser
        </button>
        <button onClick={acceptAll} className="px-3 py-1 rounded bg-brand-dark text-sm">
          Tout accepter
        </button>
        <button onClick={openPrefs} className="px-3 py-1 rounded border border-white text-sm">
          Personnaliser
        </button>
      </div>
    </div>
  );
}

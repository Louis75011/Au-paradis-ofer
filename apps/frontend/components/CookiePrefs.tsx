// CookiePrefs.tsx
"use client";
import { useEffect, useState } from "react";

type Cat = "essential" | "analytics" | "media" | "marketing";

const STORAGE_KEY = "apof_consent_v1";

export default function CookiePrefs() {
  const [consent, setConsent] = useState<Record<Cat, boolean>>({
    essential: true,    // toujours vrai
    analytics: false,
    media: false,
    marketing: false,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setConsent(JSON.parse(saved));
  }, []);

  const save = (c: typeof consent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    setConsent(c);
    setOpen(false);
    // Ici, (dés)activez vos scripts selon c.analytics / c.media / c.marketing
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="underline">
        Gérer mes cookies
      </button>
      {open && (
        <div role="dialog" aria-modal className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white max-w-lg w-full p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Préférences cookies</h2>
            <p className="text-sm mb-3">
              Nous utilisons des cookies essentiels au fonctionnement. Les autres catégories sont désactivées par défaut.
            </p>
            <ul className="space-y-2">
              <li><label><input type="checkbox" checked disabled /> Essentiels (toujours actifs)</label></li>
              <li><label><input type="checkbox" checked={consent.analytics} onChange={e => setConsent(c => ({...c, analytics: e.target.checked}))}/> Mesure d’audience</label></li>
              <li><label><input type="checkbox" checked={consent.media} onChange={e => setConsent(c => ({...c, media: e.target.checked}))}/> Vidéos/embeds</label></li>
              <li><label><input type="checkbox" checked={consent.marketing} onChange={e => setConsent(c => ({...c, marketing: e.target.checked}))}/> Marketing</label></li>
            </ul>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => save({ ...consent, analytics:false, media:false, marketing:false })}>Tout refuser</button>
              <button onClick={() => save({ essential:true, analytics:true, media:true, marketing:true })}>Tout accepter</button>
              <button onClick={() => save(consent)} className="font-semibold">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

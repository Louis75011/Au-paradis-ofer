// apps/frontend/components/CookiePrefsDialog.tsx
"use client";

import { useEffect, useState } from "react";

type Prefs = {
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

const defaultPrefs: Prefs = {
  preferences: false,
  analytics: false,
  marketing: false,
};

function persistPrefs(p: Prefs) {
  localStorage.setItem("cookieprefs", JSON.stringify(p));
  document.dispatchEvent(new CustomEvent("cookieprefs-saved", { detail: p }));
}

/**
 * Table de traduction / description (français).
 * L'ordre ici définit aussi l'ordre d'affichage.
 */
const CATEGORIES: {
  key: keyof Prefs;
  label: string;
  desc: string;
}[] = [
  {
    key: "preferences",
    label: "Préférences",
    desc: "Sauvegarde de réglages d'affichage, langue, etc.",
  },
  {
    key: "analytics",
    label: "Analyses",
    desc: "Statistiques anonymes (ex. : Google Analytics).",
  },
  {
    key: "marketing",
    label: "Marketing",
    desc: "Ciblage publicitaire et partage à des tiers.",
  },
];

export default function CookiePrefsDialog() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);

  useEffect(() => {
    const saved = localStorage.getItem("cookieprefs");
    if (saved) {
      try {
        setPrefs(JSON.parse(saved));
      } catch {
        setPrefs(defaultPrefs);
      }
    }
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("open-cookieprefs", handler);
    return () => document.removeEventListener("open-cookieprefs", handler);
  }, []);

  function saveAndClose(newPrefs?: Prefs) {
    const toSave = newPrefs ?? prefs;
    persistPrefs(toSave);
    setPrefs(toSave);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* modal */}
      <div
        role="dialog"
        aria-modal="true"
        id="cookieprefs-dialog"
        className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl"
      >
        <header className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Préférences cookies</h2>
        </header>

        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-neutral-700">
            Choisissez les catégories de cookies que vous autorisez.
          </p>

          {/* affichage contrôlé selon la table CATEGORIES */}
          {CATEGORIES.map(({ key, label, desc }) => {
            const id = `cookiepref_${key}`;
            return (
              <label
                key={key}
                htmlFor={id}
                className="flex justify-between items-center border p-3 rounded cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{label}</span>
                  <span className="text-sm opacity-80">{desc}</span>
                </div>

                <input
                  id={id}
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, [key]: e.target.checked }))
                  }
                  className="h-5 w-5"
                />
              </label>
            );
          })}
        </div>

        <footer className="px-6 py-4 border-t flex justify-between items-center">
          <button
            type="button"
            className="underline text-sm"
            onClick={() =>
              saveAndClose({
                preferences: false,
                analytics: false,
                marketing: false,
              })
            }
          >
            Tout refuser
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              className="px-4 py-2 border rounded"
              onClick={() => setOpen(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-brand-dark text-white"
              onClick={() => saveAndClose()}
            >
              Enregistrer
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// apps/frontend/components/CookiePrefs.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useCookie } from "./CookieContext";
import { CookieCategories } from "../lib/cookieUtils";

/**
 * On suppose CookieCategories similaire à :
 * { necessary: boolean; preferences: boolean; analytics: boolean; marketing: boolean; }
 */

const DEFAULT_LOCAL: CookieCategories = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

function persistPrefsFromCategories(c: CookieCategories) {
  // convertir au format front (sans necessary)
  const prefs = {
    preferences: !!c.preferences,
    analytics: !!c.analytics,
    marketing: !!c.marketing,
  };
  localStorage.setItem("cookieprefs", JSON.stringify(prefs));
  document.dispatchEvent(new CustomEvent("cookieprefs-saved", { detail: prefs }));
}

export default function CookiePrefs() {
  const { consent, setConsent, closePrefs, isPrefsOpen } = useCookie();
  const [local, setLocal] = useState<CookieCategories>(DEFAULT_LOCAL);

  useEffect(() => {
    if (consent) setLocal(consent);
  }, [consent]);

  if (!isPrefsOpen) return null;

  function toggle(k: keyof CookieCategories) {
    if (k === "necessary") return;
    setLocal((s: CookieCategories) => ({
      ...s,
      [k]: !s[k],
    }));
  }

  function save() {
    // mise à jour du contexte + persistance
    setConsent(local);
    persistPrefsFromCategories(local);
    closePrefs();
  }

  function setAllFalse() {
    const updated = { ...local, preferences: false, analytics: false, marketing: false };
    setLocal(updated);
    setConsent(updated);
    persistPrefsFromCategories(updated);
    closePrefs();
  }

  function setAllTrue() {
    const updated = { ...local, preferences: true, analytics: true, marketing: true };
    setLocal(updated);
    setConsent(updated);
    persistPrefsFromCategories(updated);
    closePrefs();
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-md">
        <h3 className="text-xl font-semibold mb-3">Préférences cookies</h3>
        <p className="mb-4 text-sm">Choisissez les catégories de cookies que vous autorisez.</p>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4 p-3 border rounded">
            <div>
              <p className="font-semibold">Essentiels</p>
              <p className="text-sm opacity-80">
                Cookies nécessaires au fonctionnement du site. Toujours activés.
              </p>
            </div>
            <div className="text-sm">Toujours</div>
          </div>

          <div className="flex items-start justify-between gap-4 p-3 border rounded">
            <div>
              <p className="font-semibold">Préférences</p>
              <p className="text-sm opacity-80">Sauvegarde de réglages d&apos;affichage, langue, etc.</p>
            </div>
            <div>
              <button
                className={`btn ${local.preferences ? "btn-primary" : "btn-ghost"}`}
                onClick={() => toggle("preferences")}
              >
                {local.preferences ? "Activé" : "Désactivé"}
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-3 border rounded">
            <div>
              <p className="font-semibold">Analytics</p>
              <p className="text-sm opacity-80">Statistiques anonymes (ex: Google Analytics).</p>
            </div>
            <div>
              <button
                className={`btn ${local.analytics ? "btn-primary" : "btn-ghost"}`}
                onClick={() => toggle("analytics")}
              >
                {local.analytics ? "Activé" : "Désactivé"}
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-3 border rounded">
            <div>
              <p className="font-semibold">Marketing</p>
              <p className="text-sm opacity-80">Ciblage publicitaire et partage à des tiers.</p>
            </div>
            <div>
              <button
                className={`btn ${local.marketing ? "btn-primary" : "btn-ghost"}`}
                onClick={() => toggle("marketing")}
              >
                {local.marketing ? "Activé" : "Désactivé"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="btn"
            onClick={setAllFalse}
          >
            Tout refuser
          </button>
          <button
            className="btn btn-primary"
            onClick={setAllTrue}
          >
            Tout accepter
          </button>
          <button className="btn" onClick={save}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

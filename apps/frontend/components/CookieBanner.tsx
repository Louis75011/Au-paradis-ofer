// apps/frontend/components/CookieBanner.tsx
"use client";

import { useEffect, useState } from "react";

const KEY = "apof_consent_v1";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(KEY)) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const set = (val: Record<string, boolean>) => {
    localStorage.setItem(KEY, JSON.stringify(val));
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(95vw,880px)] bg-white p-3 rounded shadow">
      <p className="text-sm">
        Nous utilisons des cookies essentiels et, avec votre accord, des cookies
        non essentiels. Vous pouvez refuser sans impact.
      </p>
      <div className="mt-2 flex gap-2 justify-end">
        <button
          onClick={() =>
            set({ essential: true, analytics: false, media: false, marketing: false })
          }
        >
          Tout refuser
        </button>
        <button
          onClick={() =>
            set({ essential: true, analytics: true, media: true, marketing: true })
          }
        >
          Tout accepter
        </button>
        <button
          onClick={() => {
            setShow(false);
            document
              .querySelector('[data-cookieprefs-open="true"]')
              ?.dispatchEvent(new Event("click", { bubbles: true }));
          }}
          className="underline"
        >
          Personnaliser
        </button>
      </div>
    </div>
  );
}

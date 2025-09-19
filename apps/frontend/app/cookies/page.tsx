// apps/frontend/app/cookies/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique cookies – Au Paradis O’Fer",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 prose prose-neutral">
      <h1>Politique cookies</h1>
      <p>
        Nous utilisons des cookies essentiels au bon fonctionnement du site.
        Les cookies non essentiels (audience avancée, marketing, médias embarqués)
        ne sont déposés qu’avec votre consentement.
      </p>

      <h2>Mesure d’audience</h2>
      <p>
        Nous privilégions des solutions sans cookies (ex. Cloudflare Web Analytics / mode
        cookieless), exemptées de consentement par la CNIL.
      </p>

      <h2>Gérer vos préférences</h2>
      <p>
        <button
          type="button"
          className="underline"
          data-cookieprefs-open="true"
          aria-controls="cookieprefs-dialog"
        >
          Ouvrir le panneau de préférences
        </button>
      </p>

      <p>
        Vous pouvez également revenir à tout moment via le lien « Gérer mes cookies »
        en pied de page.
      </p>

      <p>
        Voir aussi : <Link href="/confidentialite">Politique de confidentialité</Link>.
      </p>
    </main>
  );
}

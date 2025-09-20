// apps/frontend/app/cookies/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import CookiePrefsOpener from "@/components/CookiePrefsOpener";
// import CookiePrefsDialog from "@/components/CookiePrefsDialog";

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
        {/* remplacez votre bouton HTML par le composant client */}
        <CookiePrefsOpener />
      </p>

      <p>
        Voir aussi : <Link href="/confidentialite">Politique de confidentialité</Link>.
      </p>
    </main>
  );
}

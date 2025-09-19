// apps/frontend/app/confidentialite/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité – Au Paradis O’Fer",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 prose prose-neutral">
      <h1>Politique de confidentialité</h1>
      <p>
        Cette page décrit nos traitements de données (réservations, contact,
        emailing, statistiques) et vos droits RGPD.
      </p>

      <h2>Responsable de traitement</h2>
      <p>Au Paradis O’Fer – coordonnées indiquées dans les mentions légales.</p>

      <h2>Bases légales</h2>
      <ul>
        <li>Exécution du contrat (gestion des demandes et réservations)</li>
        <li>Intérêt légitime (sécurité du site, mesure d’audience sans cookies)</li>
        <li>Consentement (newsletter, cookies non essentiels)</li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Accès, rectification, effacement, limitation, opposition, portabilité.
        Réclamation : CNIL (cnil.fr). Contact : l’adresse email indiquée dans les
        mentions légales.
      </p>

      <h2>Sous-traitants</h2>
      <p>
        Hébergeur, outil d’audience, paiement (Stripe/GoCardless), agenda
        (Cal.com), email transactionnel. Transferts hors UE possibles sur la base
        des clauses contractuelles types.
      </p>

      <h2>Mise à jour</h2>
      <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}.</p>
    </main>
  );
}

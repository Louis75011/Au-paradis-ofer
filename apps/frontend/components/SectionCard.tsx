import { ReactNode } from "react";

/** Petite carte générique pour les blocs d'informations. */
export default function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-brand-sky card p-6">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="leading-relaxed">{children}</div>
    </section>
  );
}

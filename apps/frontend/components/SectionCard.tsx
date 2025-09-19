import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  className?: string; // accepte des classes externes (h-full, etc.)
  bodyClassName?: string; // optionnel : classes pour le conteneur du contenu
};

/** Petite carte générique pour les blocs d'informations. */
export default function SectionCard({
  title,
  children,
  className = "",
  bodyClassName = "",
}: SectionCardProps) {
  return (
    <section
      className={`bg-brand-sky card p-6 border border-black rounded-2xl h-full flex flex-col ${className}`}
    >
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      {/* ✅ le corps prend toute la hauteur disponible */}
      <div className={`leading-relaxed flex-1 min-h-0 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

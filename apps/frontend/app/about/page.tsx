import Image from "next/image";

export const metadata = { title: "À propos" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 grid gap-8">
      <h1 className="text-3xl font-bold text-brand-dark">À propos</h1>
      <p>
        Notre centre propose des séances de médiation équine dans un cadre familial et verdoyant.
        L’accompagnement se veut chaleureux, simple et adapté à chacun.
      </p>
      <Image
        src="/images/maquette.jpg"
        alt="Extrait de la maquette graphique du site Au Paradis O'Fer"
        width={1200}
        height={800}
        className="rounded-2xl shadow"
      />
    </div>
  );
}

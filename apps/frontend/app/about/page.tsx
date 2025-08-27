import Image from "next/image";

export const metadata = { title: "À propos" };

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-12">
      <h1 className="text-3xl max-w-3xl font-bold text-[--color-brand-dark]">À propos</h1>
      <p className="mt-4 max-w-3xl leading-relaxed">
        Notre centre propose des séances de médiation équine dans un cadre familial et verdoyant.
        L’accompagnement se veut chaleureux, simple et adapté à chacun.
      </p>

      <div className="mt-8 max-w-3xl">
        <Image
          src="/images/maquette.jpg"
          alt="Extrait de la maquette graphique du site Au Paradis O'Fer"
          width={1200}
          height={800}
          className="w-full rounded-2xl shadow"
          priority={false}
        />
      </div>
    </div>
  );
}

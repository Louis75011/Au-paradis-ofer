import Image from "next/image";
import SectionCard from "@/components/SectionCard";
import chevauxData from "@/data/chevaux.json";

type Cheval = {
  id: string;
  nom: string;
  type: "poney" | "cheval";
  age: number;
  date_anniversaire: string;
  race: string;
  photo: string;
  resume: string;
};

export const metadata = {
  title: "Nos chevaux",
  description:
    "Découvrez Indy, Patchouli, Poly, Rodéo et Sunny : des équidés calmes et habitués au contact humain.",
};

export default function PageChevaux() {
  const chevaux = chevauxData as Cheval[];

  return (
    <main className="page mx-auto max-w-7xl px-4 md:px-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Nos chevaux</h1>
        <p className="mt-2 opacity-90">
          Des compagnons sélectionnés pour leur douceur, leur stabilité et leur habituation au
          contact humain.
        </p>
      </header>

      {/* ✅ Grille centrée, enfants étirés et rangées égalisées */}
      <div className="mx-auto w-full max-w-7xl grid gap-6 md:grid-cols-2 items-stretch auto-rows-auto md:auto-rows-fr">
        {chevaux.map((c) => (
          <SectionCard key={c.id} title={c.nom} className="h-full">
            <div
              className="
          grid h-full min-h-0 md:min-h-[600px]
          grid-rows-[auto_1fr_auto] gap-4
        "
            >
              <figure className="rounded-xl overflow-hidden">
                <Image
                  src={c.photo}
                  alt={`${c.nom} — ${c.type}`}
                  width={1200}
                  height={900}
                  className="w-full aspect-[4/3] object-cover"
                  priority={false}
                />
              </figure>

              <div className="min-w-0 min-h-0 space-y-3">
                {/* Mobile: texte libre ; Desktop: vous pouvez borner si souhaité */}
                <p className="opacity-90 md:line-clamp-6">{c.resume}</p>
              </div>

              <ul className="text-sm opacity-80 space-y-1">
                <li>
                  <strong>Type :</strong> {c.type}
                </li>
                <li>
                  <strong>Race :</strong> {c.race}
                </li>
                <li>
                  <strong>Date de naissance :</strong> {c.date_anniversaire}
                </li>
              </ul>
            </div>
          </SectionCard>
        ))}
      </div>
    </main>
  );
}

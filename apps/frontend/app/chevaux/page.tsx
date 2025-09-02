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
    <main className="page space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Nos chevaux</h1>
        <p className="mt-2 opacity-90">
          Des compagnons sélectionnés pour leur douceur, leur stabilité et leur habituation au
          contact humain.
        </p>
      </header>

      {chevaux.map((c) => (
        <SectionCard key={c.id} title={c.nom}>
          {/* Image à gauche, texte à droite */}
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <figure className="md:w-[550px] md:shrink-0 rounded-xl overflow-hidden">
              <Image
                src={c.photo}
                alt={`${c.nom} — ${c.type}`}
                width={1200}
                height={900}
                className="w-full aspect-[4/3] object-cover"
                priority={false}
              />
            </figure>

            <div className="min-w-0 space-y-3">
              <p className="opacity-90">{c.resume}</p>

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
                {/* <li>
            <strong>Âge :</strong> {c.age} ans
          </li> */}
              </ul>
            </div>
          </div>
        </SectionCard>
      ))}
    </main>
  );
}

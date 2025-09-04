import Image from "next/image";
import SectionCard from "@/components/SectionCard";
import installationsData from "@/data/installations.json";

type Installation = {
  id: string;
  nom: string;
  dimensions?: string;
  revetement?: string;
  photo: string | null;
  statut: "disponible" | "à venir" | "en travaux";
};

type Installations = {
  intro: string;
  elements: Installation[];
};

export const metadata = {
  title: "Nos installations",
  description:
    "Manège semi-couvert 15×30 m en sable. Sellerie, aire de pansage et accueil à venir.",
};

export default function PageInstallations() {
  const data = installationsData as Installations;
  const { intro, elements } = data;

  const manege = elements.find((e) => e.id === "manege");
  const autres = elements.filter((e) => e.id !== "manege");

  return (
    <main className="page space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Nos installations</h1>
        <p className="mt-2 opacity-90">{intro}</p>
      </header>

      {manege && (
        <SectionCard
          title={`${manege.nom}${
            manege.dimensions ? ` — ${manege.dimensions}` : ""
          }${manege.revetement ? ` · ${manege.revetement}` : ""}`}
        >
          <div className="grid gap-5 md:grid-cols-[minmax(280px,520px),1fr] items-start">
            {manege.photo && (
              <figure className="md:top-20">
                <Image
                  src={manege.photo}
                  alt={manege.nom}
                  width={1400}
                  height={900}
                  className="w-full rounded-xl object-cover aspect-[3/2]"
                  priority={false}
                />
              </figure>
            )}

            <div className="space-y-3">
              <p className="opacity-90">
                Un espace confortable pour des séances sereines, quelles que soient les conditions.
                Statut : <span className="font-semibold">{manege.statut}</span>.
              </p>
            </div>
          </div>
        </SectionCard>
      )}

      <SectionCard title="À venir">
        <ul className="list-disc pl-5 space-y-1">
          {autres.map((it) => (
            <li key={it.id}>
              <span className="font-medium">{it.nom}</span>
              {it.statut ? <span className="opacity-80"> — {it.statut}</span> : null}
            </li>
          ))}
        </ul>
      </SectionCard>
    </main>
  );
}

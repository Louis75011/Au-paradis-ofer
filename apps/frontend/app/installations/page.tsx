import Image from "next/image";
import SectionCard from "@/components/SectionCard";
import installationsData from "@/data/installations.json";

type Statut =
  | "disponible"
  | "à venir"
  | "en travaux"
  | "en travaux bien avancés";

type Installation = {
  id: string;
  nom: string;
  dimensions?: string;
  revetement?: string;
  photos?: string[]; // 👈 désormais un tableau
  statut: Statut;
  resume?: string;
};

type Installations = {
  intro: string;
  elements: Installation[];
};

export const metadata = {
  title: "Nos installations",
  description:
    "Manège semi-couvert 15×30 m en sable. Sellerie, allée praticable, aire de pansage et accueil en cours.",
};

function TitleWithMeta(i: Installation) {
  const parts = [i.nom];
  if (i.dimensions) parts.push(`— ${i.dimensions}`);
  if (i.revetement) parts.push(`· ${i.revetement}`);
  return parts.join(" ");
}

/** Affiche 1, 2 ou 3 photos joliment, sans overlap */
function PhotosGrid({
  photos,
  altBase,
  priority = false,
}: {
  photos: string[];
  altBase: string;
  priority?: boolean;
}) {
  if (!photos?.length) return null;

  // 1 photo : plein cadre
  if (photos.length === 1) {
    return (
      <figure className="md:w-[550px] md:shrink-0 rounded-xl overflow-hidden relative z-0">
        <Image
          src={photos[0]}
          alt={altBase}
          width={1400}
          height={900}
          className="w-full aspect-[3/2] object-cover"
          priority={priority}
        />
      </figure>
    );
  }

  // 2 photos : grille 2 colonnes
  if (photos.length === 2) {
    return (
      <div className="md:w-[550px] md:shrink-0 grid grid-cols-2 gap-3 relative z-0">
        {photos.map((src, idx) => (
          <div key={src} className="rounded-xl overflow-hidden">
            <Image
              src={src}
              alt={`${altBase} — visuel ${idx + 1}`}
              width={900}
              height={675}
              className="w-full aspect-[4/3] object-cover"
              priority={priority && idx === 0}
            />
          </div>
        ))}
      </div>
    );
  }

  // 3+ photos : une grande + deux petites (on ne garde que 3 pour la mise en page)
  const p = photos.slice(0, 3);
  return (
    <div className="md:w-[550px] md:shrink-0 grid grid-cols-2 gap-3 relative z-0">
      <div className="col-span-2 md:col-span-2 rounded-xl overflow-hidden">
        <Image
          src={p[0]}
          alt={`${altBase} — visuel 1`}
          width={1200}
          height={800}
          className="w-full aspect-[16/10] object-cover"
          priority={priority}
        />
      </div>
      <div className="rounded-xl overflow-hidden">
        <Image
          src={p[1]}
          alt={`${altBase} — visuel 2`}
          width={800}
          height={600}
          className="w-full aspect-[4/3] object-cover"
        />
      </div>
      <div className="rounded-xl overflow-hidden">
        <Image
          src={p[2]}
          alt={`${altBase} — visuel 3`}
          width={800}
          height={600}
          className="w-full aspect-[4/3] object-cover"
        />
      </div>
    </div>
  );
}

export default function PageInstallations() {
  const data = installationsData as Installations;
  const { intro, elements } = data;

  // On privilégie l’ordre métier : manège d’abord, puis le reste dans l’ordre du JSON
  const sorted = [
    ...elements.filter((e) => e.id === "manege"),
    ...elements.filter((e) => e.id !== "manege"),
  ];

  return (
    <main className="page space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Nos installations</h1>
        <p className="mt-2 opacity-90">{intro}</p>
      </header>

      {sorted.map((it) => (
        <SectionCard key={it.id} title={TitleWithMeta(it)}>
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <PhotosGrid
              photos={it.photos ?? []}
              altBase={it.nom}
              priority={it.id === "manege"}
            />

            <div className="min-w-0 space-y-3 relative z-10">
              {it.resume && <p className="opacity-90">{it.resume}</p>}
              <p className="text-sm opacity-80">
                Statut : <span className="font-semibold">{it.statut}</span>
              </p>
            </div>
          </div>
        </SectionCard>
      ))}
    </main>
  );
}

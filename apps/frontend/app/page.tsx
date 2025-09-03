import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import SectionCard from "@/components/SectionCard";
import tracts from "@/data/tracts.json";
import tarifsData from "@/data/tarifs.json"; // ← importez vos tarifs

type Tarif = { id: string | number; intitule: string; prix: number };

export default function HomePage() {
  const tarifs = tarifsData as Tarif[]; // typage simple

  return (
    <>
      <section className="relative min-h-[72vh] md:min-h-[78vh] overflow-hidden">
        <HeroCarousel />
        <div className="relative z-10 flex h-full min-h-[62vh] md:min-h-[68vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="hero-title">Centre d’accueil en zoothérapie</h1>
          <p className="hero-subtitle mt-3 max-w-2xl">{tracts.accroche}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link className="btn btn-primary" href="/tarifs">Réserver les séances</Link>
            <Link className="btn btn-ghost" href="/contact">Prendre contact</Link>
          </div>
        </div>
      </section>

      <section className="page py-2 grid gap-6 md:grid-cols-3">
        <SectionCard title="Pourquoi venir ?">
          <ul className="list-disc pl-5">
            {tracts.pourquoi.map((p: string) => <li key={p}>{p}</li>)}
          </ul>
        </SectionCard>

        <SectionCard title="Tarifs en un coup d’œil">
          <ul className="space-y-2">
            {tarifs.slice(0, 3).map((t: Tarif) => (
              <li key={t.id} className="flex items-baseline justify-between">
                <span>{t.intitule}</span>
                <span className="font-semibold">{t.prix} €</span>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <Link className="underline" href="/tarifs">Voir tous les tarifs</Link>
          </div>
        </SectionCard>

        <SectionCard title="Infos & réservation">
          <ul className="list-disc pl-5">
            <li>Contactez-nous pour choisir la formule qui vous convient.</li>
          <li>À termes, vous pourriez probablement réserver en ligne selon notre agenda !</li>
          </ul>
        </SectionCard>
      </section>
    </>
  );
}

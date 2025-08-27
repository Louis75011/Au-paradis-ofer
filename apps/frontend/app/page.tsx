import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import SectionCard from "@/components/SectionCard";
import tracts from "@/data/tracts.json";
import tarifs from "@/data/tarifs.json";

export default function HomePage() {
  return (
    <div className="relative">
      <section className="py-6 sm:py-8 lg:py-10">
        {/* centrage vertical doux + centrage horizontal */}
        <div className="min-h-[0.1vh] grid place-items-center">
          <div className="w-full mx-auto rounded-2xl overflow-hidden shadow-lg">
            <HeroCarousel />
          </div>
        </div>
    </section>

      {/* Bandeau héro par-dessus le carrousel */}
 <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-24 md:py-32">
  <h1 className="hero-title">Centre d’accueil en zoothérapie</h1>
  <p className="hero-subtitle mt-3 max-w-2xl">
    {tracts.accroche}
  </p>
  <div className="mt-6 flex flex-wrap justify-center gap-4">
    <Link className="btn btn-primary" href="/tarifs">
      Découvrir les séances
    </Link>
    <Link className="btn btn-ghost" href="/contact">
      Réserver / Infos
    </Link>
  </div>
</section>

      {/* Cartes d’infos */}
      <section className="page grid gap-6 md:grid-cols-3">
        <SectionCard title="Pourquoi venir ?">
          <ul className="list-disc pl-5">
            {tracts.pourquoi.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </SectionCard>

        <SectionCard title="Tarifs en un coup d’œil">
          <ul className="space-y-2">
            {tarifs.slice(0, 3).map((t) => (
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
          <p>Contactez-nous pour choisir la formule qui vous convient.</p>
          <p className="mt-2">
            <strong>Tél</strong> : <a className="underline" href="tel:+33648342253">06&nbsp;48&nbsp;34&nbsp;22&nbsp;53</a><br />
            <strong>Email</strong> : <a className="underline" href="mailto:au.paradis.o.fer@gmail.com">au.paradis.o.fer@gmail.com</a>
          </p>
        </SectionCard>
      </section>
    </div>
  );
}

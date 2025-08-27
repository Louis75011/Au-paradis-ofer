import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import SectionCard from "@/components/SectionCard";
import tracts from "@/data/tracts.json";
import tarifs from "@/data/tarifs.json";

export default function HomePage() {
  return (
    <div className="relative">
      <HeroCarousel />

      {/* Bandeau héro lisible sur le carrousel */}
      <section className="container max-w-7xl relative z-10 py-20 md:py-28 text-white drop-shadow">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-caveat)" }}>
          Centre d’accueil en zoothérapie
        </h1>
        <p className="mt-3 max-w-2xl text-lg">{tracts.accroche}</p>
        <div className="mt-6 flex gap-3">
          <Link className="btn btn-primary" href="/tarifs">Découvrir les séances</Link>
          <Link className="btn btn-ghost" href="/contact">Réserver / Infos</Link>
        </div>
      </section>

      {/* Contenu en cartes, sans les grandes images de tracts */}
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

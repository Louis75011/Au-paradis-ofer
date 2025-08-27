"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Carrousel décoratif plein écran (<main>) avec fondu + léger kenburns en fondu.
 * SEO : images décoratives -> aria-hidden et alt vide.
 * Performance : Next optimise et précharge la première image.
 */
const IMAGES = [
  { src: "/images/au-paradis-ofer-01.jpg" },
  { src: "/images/au-paradis-ofer-02.jpg" },
  { src: "/images/au-paradis-ofer-03.jpg" }
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {IMAGES.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt="" /* décoratif */
          priority={i === 0}
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          } animate-[kenburns_18s_ease-in-out_infinite]`}
        />
      ))}
      {/* voile pour lisibilité du texte */}
      <div className="absolute inset-0 bg-black/35" />
      {/* nuance vers le beige du site */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[--color-brand-cream]/50" />
    </div>
  );
}

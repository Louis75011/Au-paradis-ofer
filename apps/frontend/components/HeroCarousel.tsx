"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

/** Carrousel décoratif pleine largeur/hauteur avec fondu. */
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
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {IMAGES.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt=""           /* décoratif */
          priority={i === 0}
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-brand-cream/60" />
    </div>
  );
}

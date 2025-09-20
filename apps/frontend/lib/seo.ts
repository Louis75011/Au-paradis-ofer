// Petites métadonnées réutilisables apps\frontend\lib\seo.ts
export const site = {
  name: "Au Paradis O'Fer",
  description: "Centre d’accueil en zoothérapie dans un cadre familial, apaisant et verdoyant.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://au-paradis-ofer.fr",
} as const;
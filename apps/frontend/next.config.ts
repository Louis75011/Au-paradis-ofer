import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Images optimisées
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Supprimer l’en-tête "X-Powered-By: Next.js"
  poweredByHeader: false,

  // Routes typées (Next.js 15)
  typedRoutes: true,

  // On laisse Turbopack gérer le dev (pas de clé "dev" possible ici)
  // Webpack sera utilisé automatiquement en build
};

export default nextConfig;

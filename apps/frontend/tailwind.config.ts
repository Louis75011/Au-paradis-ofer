import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx,css,scss}',
    './components/**/*.{js,ts,jsx,tsx,mdx,css,scss}',
    './src/**/*.{js,ts,jsx,tsx,mdx,css,scss}',
    './.storybook/**/*.{js,ts,tsx,mdx}',
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        brand: {
          dark: "#0f3d2f",   // vert profond (d’après maquette)
          light: "#7cc56b",  // vert clair accents
          cream: "#f5f2ea"   // cartes
        }
      },
      fontFamily: {
        // Titres script : pourra être remplacé par une police Google dans _document?
        display: ["ui-serif", "Georgia"],
        sans: ["ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,.08)"
      },
      borderRadius: { 
        xl: "1rem", "2xl": "1.25rem" 
      },
    }
  },
  plugins: []
} satisfies Config;

# 🐎 Au-Paradis-Ofer — Projet hôtelier animalier & animations équestres

Projet de site **familial et champêtre**, dédié aux **animations équestres** et à l’**accueil en gîte (à venir)**.  
Ce dépôt contient l’architecture **front (Next.js)** et **API back (FastAPI + GraphQL)**.

# TEST RAPIDE 1 CloudFlare : https://au-paradis-ofer.pages.dev/

# TEST RAPIDE 2 Vercel : https://au-paradis-ofer-frontend.vercel.app/

# Voir le dossier image des impressions-écrans

---

## 🚀 Technologies (dernières versions — août 2025)

### Fullstack

- [Next.js](https://nextjs.org/) (React + TypeScript + côté serveur & routes api)
- [TailwindCSS](https://tailwindcss.com/) (design rapide et responsive)
- [pnpm](https://pnpm.io/) (gestionnaire de paquets)
- [debianv12 & Powershell](git, terminaux, déploiement)

---

## 📂 Structure réduite en exemple

```
/au-paradis-ofer
├── frontend/        # Next.js (React/TS) + TailwindCSS + Storybook
│   ├── public/      # images, icônes statiques
│   ├── src/         # pages, composants, hooks
│   └── package.json
├── api/             # FastAPI + GraphQL backend
│   ├── app/         # routes, schémas, modèles
└── README.md
```

---

## ⚙️ Installation & Développement

### Prérequis

- Node.js ≥ 18 + [pnpm](https://pnpm.io/)
- PostgreSQL (local ou cloud)

### Lancer

```bash
cd frontend
pnpm install
pnpm dev
```

👉 dispo sur [http://localhost:3000]
👉 dispo sur [http://localhost:8000/graphql]

---

## 🗺️ Roadmap

### MVP

- Pages principales (Accueil, À propos, Contact)
- Galerie photos / carrousel
- Formulaire de réservation (e-mail)

### V1

- Tarifs dynamiques
- Formulaire de réservation → envoi mail

### V1.1

- Sauvegarde en base des demandes
- Faux paiement (simulation)

### V1.2

- Stockage cloud (images)
- Page **Gîte**

### V2

- Authentification simple
- Mini back-office (gestion tarifs/demandes)
- Paiement réel (Stripe)

---

## 📌 SEO & Optimisation

- Balises `<Image>` de Next.js pour toutes les images
- Balises `meta` optimisées (SEO local + accessibilité ARIA)
- URL lisibles (`/animations/chevaux`, `/gites`, etc.)
- Préparation d’un blog futur pour contenu naturel (référencement long terme)

---

## 🤝 Contributeurs

- Développement & intégration : Louis R.
- Support technique : [VSCode](https://code.visualstudio.com/), [Vercel](https://vercel.com/), [GitHub](https://github.com/)

---

## 📜 Licence

Projet privé, usage personnel/familial.

```

```

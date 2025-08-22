# 🐎 Au-Paradis-Ofer — Projet hôtelier animalier & animations équestres

Projet de site **familial et champêtre**, dédié aux **animations équestres** et à l’**accueil en gîte (à venir)**.  
Ce dépôt contient l’architecture **front (Next.js)** et **API back (FastAPI + GraphQL)**.  

---

## 🚀 Technologies (dernières versions — août 2025)

### Frontend
- [Next.js](https://nextjs.org/) (React + TypeScript)
- [TailwindCSS](https://tailwindcss.com/) (design rapide et responsive)
- [pnpm](https://pnpm.io/) (gestionnaire de paquets)

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)
- [Strawberry GraphQL](https://strawberry.rocks/) (schéma et requêtes GraphQL)
- [SQLAlchemy](https://www.sqlalchemy.org/) + [Alembic](https://alembic.sqlalchemy.org/) (ORM + migrations)
- [PostgreSQL](https://www.postgresql.org/) (base de données)
- [Uvicorn](https://www.uvicorn.org/) (serveur ASGI)

---

## 📂 Structure

```

/au-paradis-ofer
├── frontend/        # Next.js (React/TS) + TailwindCSS
│   ├── public/      # images, icônes statiques
│   ├── src/         # pages, composants, hooks
│   └── package.json
│
├── api/             # FastAPI + GraphQL backend
│   ├── app/         # routes, schémas, modèles
│   ├── alembic/     # migrations
│   └── pyproject.toml
│
└── README.md

````

---

## ⚙️ Installation & Développement

### Prérequis
- Node.js ≥ 18 + [pnpm](https://pnpm.io/)
- Python ≥ 3.12 + `pip`
- PostgreSQL (local ou cloud)

### Lancer le frontend
```bash
cd frontend
pnpm install
pnpm dev
````

👉 dispo sur [http://localhost:3000](http://localhost:3000)

### Lancer le backend

```bash
cd api
python -m venv .venv
source .venv/bin/activate   # ou .\.venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

👉 dispo sur [http://localhost:8000/graphql](http://localhost:8000/graphql)

---

## 🗺️ Roadmap

### MVP

* Pages principales (Accueil, À propos, Contact)
* Galerie photos / carrousel
* Formulaire de réservation (e-mail)

### V1

* Tarifs dynamiques
* Formulaire de réservation → envoi mail

### V1.1

* Sauvegarde en base des demandes
* Faux paiement (simulation)

### V1.2

* Stockage cloud (images)
* Page **Gîte**

### V2

* Authentification simple
* Mini back-office (gestion tarifs/demandes)
* Paiement réel (Stripe)

---

## 📌 SEO & Optimisation

* Balises `<Image>` de Next.js pour toutes les images
* Balises `meta` optimisées (SEO local + accessibilité ARIA)
* URL lisibles (`/animations/chevaux`, `/gite`, etc.)
* Préparation d’un blog futur pour contenu naturel (référencement long terme)

---

## 🤝 Contributeurs

* Développement & intégration : Louis R.
* Support technique : [VSCode](https://code.visualstudio.com/), [Vercel](https://vercel.com/), [GitHub](https://github.com/)

---

## 📜 Licence

Projet privé, usage personnel/familial.

```
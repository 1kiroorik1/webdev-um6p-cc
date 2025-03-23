# Application de Gestion des Emplois

Une application Vue.js pour gérer les offres d'emploi, permettant la visualisation, l'ajout, la modification et la suppression des emplois.

## Fonctionnalités

- Affichage de la liste des emplois disponibles
- Consultation des détails d'un emploi
- Ajout d'un nouvel emploi
- Modification d'un emploi existant
- Suppression d'un emploi

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

## Installation

1. Clonez ce dépôt
2. Installez les dépendances :

```bash
npm install
```

## Démarrage de l'application

Pour lancer l'application avec l'API JSON Server simulée en arrière-plan :

```bash
npm run dev
```

Cette commande lance à la fois :
- Le serveur de développement Vue.js (http://localhost:8080)
- JSON Server comme API mock (http://localhost:3000)

## Commandes individuelles

- Démarrer uniquement le frontend :
```bash
npm run serve
```

- Démarrer uniquement l'API JSON Server :
```bash
npm run api
```

- Compiler pour la production :
```bash
npm run build
```

## Structure du projet

```
jobs-management-app/
├── public/              # Fichiers publics
│   ├── index.html       # Page HTML principale
│   └── favicon.ico      # Icône du site
├── src/                 # Code source
│   ├── assets/          # Images et ressources statiques
│   ├── components/      # Composants Vue.js réutilisables
│   │   ├── JobsList.vue        # Liste des emplois
│   │   ├── JobForm.vue         # Formulaire d'ajout/modification
│   │   ├── JobDetails.vue      # Détails d'un emploi
│   │   └── DeleteConfirmation.vue # Confirmation de suppression
│   ├── views/           # Composants de vue (pages)
│   │   ├── HomeView.vue         # Page d'accueil
│   │   ├── JobDetailsView.vue   # Page de détails d'un emploi
│   │   └── JobFormView.vue      # Page de formulaire
│   ├── router/          # Configuration du routeur Vue
│   │   └── index.js     # Définition des routes
│   ├── services/        # Services et API
│   │   └── JobService.js # Service pour interagir avec l'API
│   ├── App.vue          # Composant racine
│   └── main.js          # Point d'entrée de l'application
├── db.json              # Base de données JSON Server
├── package.json         # Dépendances et scripts
└── README.md            # Documentation du projet
```

## API REST avec JSON Server

L'application utilise JSON Server pour simuler une API REST. Le fichier `db.json` sert de base de données.

### Points d'accès API

- `GET /jobs` - Récupérer tous les emplois
- `GET /jobs/:id` - Récupérer un emploi spécifique
- `POST /jobs` - Créer un nouvel emploi
- `PATCH /jobs/:id` - Mettre à jour un emploi existant
- `DELETE /jobs/:id` - Supprimer un emploi

## Remarques techniques

- L'application utilise Vue.js 3 avec la Composition API
- Le routage est géré par Vue Router
- Les requêtes HTTP sont effectuées avec Axios
- Le style est en CSS pur avec quelques classes utilitaires personnalisées
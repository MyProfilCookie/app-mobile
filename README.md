# Recurrly — Suivi d’abonnements (mobile)

Application mobile **React Native / Expo** pour suivre vos abonnements, anticiper les renouvellements et garder une vue claire sur vos dépenses récurrentes. Le projet s’appuie sur le tutoriel [**Build and Deploy a Full Stack AI SaaS App**](https://youtu.be/4nVoLX2taFg) de **JavaScript Mastery**, adapté en **application native** avec **Clerk** pour l’authentification.

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square" alt="Clerk" />
  <img src="https://img.shields.io/badge/NativeWind-5-38BDF8?style=flat-square" alt="NativeWind" />
</p>

---

## Sommaire

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration Clerk](#configuration-clerk)
- [Lancer l’application](#lancer-lapplication)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Authentification](#authentification)
- [Branches Git](#branches-git)
- [Dépannage](#dépannage)
- [Ressources](#ressources)

---

## Aperçu

**Recurrly** (interface de marque dans l’app) propose une expérience type « dashboard abonnements » :

- un **accueil** avec total des dépenses, échéances à venir et cartes d’abonnements extensibles ;
- des **onglets** dédiés (abonnements, perspectives, compte) ;
- une **connexion sécurisée** via Clerk (e-mail + mot de passe, vérification MFA / Client Trust si activée dans le Dashboard).

Les données d’abonnements affichées aujourd’hui sont des **données de démonstration** (`constants/data.ts`), prêtes à être remplacées par une API ou une base de données.

---

## Fonctionnalités

| Zone | Description |
|------|-------------|
| **Accueil** | Avatar et nom utilisateur (Clerk), total des dépenses, liste horizontale des prochains prélèvements, cartes d’abonnements dépliables |
| **Abonnements** | Vue dédiée aux abonnements (navigation par onglet) |
| **Perspectives** | Espace « insights » (structure prête pour des statistiques) |
| **Compte** | Prénom, nom, e-mail, ID Clerk, date d’inscription, déconnexion |
| **Auth** | Inscription, connexion, vérification par code e-mail (MFA / confiance client) |
| **Premium (optionnel)** | Intégration **Clerk Billing** — page tarifs (web) et bouton d’upgrade (mobile) |

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | [Expo](https://expo.dev) SDK 54 |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| UI | [React Native](https://reactnative.dev) + [NativeWind](https://www.nativewind.dev/) (Tailwind CSS v4) |
| Auth | [@clerk/expo](https://clerk.com/docs/quickstarts/expo) |
| Stockage session | `expo-secure-store` (cache tokens Clerk) |
| Dates / montants | [dayjs](https://day.js.org/) + `Intl` (format `fr-FR`, EUR) |
| Polices | Plus Jakarta Sans (assets locaux) |
| Qualité | ESLint (`eslint-config-expo`) |

---

## Prérequis

- **Node.js** 20.19+ recommandé (voir les avertissements npm si vous utilisez une version plus ancienne)
- **npm** ou **yarn**
- Compte **[Clerk](https://clerk.com)** (instance **Development** pour le dev local)
- **Expo Go** sur téléphone *ou* simulateur iOS / émulateur Android *ou* navigateur (`web`)

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/MyProfilCookie/app-mobile.git
cd app-mobile

# Branche de développement (recommandée)
git checkout dev

# Dépendances
npm install
```

---

## Configuration Clerk

### 1. Variables d’environnement

Copiez le modèle et renseignez votre clé publique :

```bash
cp .env.example .env
```

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Oui | Clé **Publishable** (`pk_test_…`) depuis le Dashboard Clerk |
| `EXPO_PUBLIC_CLERK_PLAN_SLUG` | Non | Slug du plan Billing (ex. `pro`) |
| `EXPO_PUBLIC_CLERK_PLAN_ID` | Non | ID du plan Clerk Billing |

> Ne commitez **jamais** le fichier `.env` (secrets). Il est listé dans `.gitignore`. Utilisez `.env.example` comme référence pour l’équipe. Si `.env` a déjà été poussé sur GitHub, **régénérez la clé Clerk** dans le Dashboard.

### 2. Réglages dans le Dashboard Clerk

Pour l’app **JSM_Recurly** (ou votre instance) :

1. **Configure → API keys** — copier la `Publishable key` dans `.env`
2. **User & authentication → Email** — activer inscription / connexion par e-mail
3. **Password** — activer mot de passe à l’inscription et à la connexion
4. **Multi-factor / Client Trust** — si activé, l’app gère l’écran **code de vérification** après le mot de passe

Synchroniser la clé avec le CLI (optionnel) :

```bash
npm run clerk:env
npm run clerk:doctor
```

---

## Lancer l’application

```bash
# Serveur de développement Metro
npm start

# Avec cache vidé (en cas de bug d’affichage)
npx expo start --clear
```

Raccourcis dans le terminal Expo :

| Touche | Action |
|--------|--------|
| `i` | Ouvrir le simulateur iOS |
| `a` | Ouvrir l’émulateur Android |
| `w` | Ouvrir dans le navigateur |
| `r` | Recharger l’application |

---

## Structure du projet

```
application/
├── app/                      # Routes Expo Router
│   ├── _layout.tsx           # ClerkProvider, polices, splash
│   ├── index.tsx             # Redirection auth → tabs ou sign-in
│   ├── (auth)/               # Connexion / inscription
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/               # Navigation principale (onglets)
│   │   ├── index.tsx         # Accueil
│   │   ├── subscriptions.tsx
│   │   ├── insights.tsx
│   │   └── settings.tsx      # Compte utilisateur
│   ├── onboarding.tsx
│   ├── pricing.tsx           # Tarifs (Clerk Billing, web)
│   └── subscriptions/[id].tsx
├── components/               # UI réutilisable
│   ├── SubscriptionCard.tsx
│   ├── UserAvatar.tsx
│   ├── AuthScreen.tsx
│   └── …
├── constants/                # Données démo, thème, icônes
├── lib/                      # Utilitaires (auth, cache, formatage)
├── assets/                   # Images, polices, icônes onglets
├── global.css                # Styles NativeWind / composants
├── app.json                  # Config Expo
└── .env.example              # Modèle de variables d’environnement
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre Expo / Metro |
| `npm run ios` | Lance sur iOS |
| `npm run android` | Lance sur Android |
| `npm run web` | Lance la version web |
| `npm run lint` | Analyse ESLint |
| `npm run clerk:init` | Initialise Clerk dans le projet |
| `npm run clerk:env` | Récupère les variables Clerk |
| `npm run clerk:doctor` | Vérifie la config Clerk |

---

## Authentification

Flux implémentés côté app :

1. **Inscription** — e-mail, mot de passe (8 caractères min.), code de vérification e-mail
2. **Connexion** — e-mail + mot de passe
3. **Seconde étape** — si Clerk renvoie `needs_second_factor` ou `needs_client_trust`, écran de saisie du code reçu par e-mail
4. **Session** — tokens stockés via `lib/cache.ts` (SecureStore)
5. **Profil** — prénom / nom / e-mail / ID affichés dans **Compte** ; avatar avec initiales ou photo Clerk

Messages d’erreur utilisateur en français : `lib/clerk-errors.ts`.

---

## Branches Git

| Branche | Rôle |
|---------|------|
| `main` | Branche stable |
| `dev` | Développement actif (auth Clerk, UI abonnements) |

```bash
git push -u origin dev   # publier la branche dev
```

Les revues automatiques (**CodeRabbit**) s’exécutent sur les pull requests GitHub.

---

## Dépannage

| Problème | Piste de solution |
|----------|-------------------|
| Page blanche au démarrage | Vérifier `.env` et `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| `429 too_many_requests` (Clerk) | Attendre ~10 min (limite instance Development), ne pas spammer la connexion |
| E-mail déjà pris | Utiliser **Se connecter**, pas **Créer un compte** |
| `needs_second_factor` | Saisir le code reçu par e-mail sur l’écran de vérification |
| Erreur Metro / cache | `npx expo start --clear` puis `r` dans Expo |
| Clé Clerk ≠ projet Dashboard | Aligner la clé `pk_test_` avec l’application **JSM_Recurly** (ou la vôtre) |

---

## Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Clerk + Expo](https://clerk.com/docs/quickstarts/expo)
- [Tutoriel JavaScript Mastery (Recurrly / SaaS)](https://youtu.be/4nVoLX2taFg)
- [Dépôt GitHub](https://github.com/MyProfilCookie/app-mobile)

---

<p align="center">
  <sub>Développé avec Expo & Clerk — branche <code>dev</code></sub>
</p>

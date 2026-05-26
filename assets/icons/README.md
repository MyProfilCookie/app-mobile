# Icônes (`assets/icons/`)

- **Format :** PNG **RGBA**, en général **144×144** px (comme les assets du kit Recurrly).
- **Usage :** chaque fichier est importé dans `constants/icons.ts` puis référencé via `icons.<nom>`.
- **Nouvelles icônes générées** (YouTube, Apple, Slack, Discord, Zoom, Microsoft, Twitch, Google) : SVG → PNG via `npm run generate:icons` (`scripts/generate-subscription-icons.mjs`, dépendance dev `sharp`).
- **Correspondance nom → icône** à l’ajout d’un abonnement : `lib/subscription-create.ts` (`EXACT_NAME_ICON` + `SUBSTRING_ICON`).

Les pictogrammes générés sont des **repères visuels simplifiés** (pas les logos officiels vectoriels des marques).

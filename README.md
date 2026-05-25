# README — Ecclésiaste Lucifer (Bot WhatsApp)

## 🌙 Présentation
Ecclésiaste Lucifer est un bot WhatsApp développé avec @whiskeysockets/baileys et Node.js. Il propose des commandes de gestion de groupe, utilitaires, jeux et quelques intégrations simples. Conçu pour être déployé facilement (ex. Pterodactyl Panel).

---

## ⚙️ Caractéristiques principales
- Commandes de gestion de groupe (kick, promote, demote, tagall, setname, grouplink)
- Commandes utilitaires (alive, ping, speed, repo, owner)
- Mini-jeux et divertissements (joke, dice, coin)
- Base de données JSON locale pour stocker utilisateurs/avertissements
- Structure modulaire : commandes dans /commands, utilitaires dans /utils

---

## Prérequis
- Node.js v22+
- npm ou yarn
- Un numéro WhatsApp pour la connexion du bot
- Accès au dépôt GitHub pour clonage/déploiement

---

## Installation (local / serveur)
1. Cloner le dépôt
```bash
git clone https://github.com/Kelly-parquer/Depot-1.git
cd Depot-1
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
- Copier .env.example → .env et remplir les valeurs nécessaires (TOKEN, OWNER_NUMBER, etc.)
- Exemple de variables (selon votre implémentation) :
  - BOT_PREFIX=.
  - OWNER_NUMBER=242061418303
  - NODE_ENV=production

4. Lancer le bot
```bash
npm start
```

---

## Déploiement (Pterodactyl)
- Egg recommandé : Node.js 22+
- Image Docker : node:22-alpine (optionnel)
- RAM : ≥ 512 MB recommandé
- Commande de démarrage recommandée :
```bash
npm install && npm start
```
- Montez un volume ou conservez le dossier auth_info pour la persistance de la session Baileys.

---

## Commandes disponibles
(Note : préfixe par défaut = .)

- .menu — Affiche le menu complet du bot.
- .ping — Test de latence (Pong).
- .alive — Statut / uptime / mémoire / infos bot.
- .owner — Informations sur le propriétaire du bot.
- .repo — Lien vers le dépôt GitHub.
- .speed — Mesure rapide de la vitesse / latence.
- .tagall — Mentionne tous les membres du groupe (fonctionne uniquement en groupe).
- .kick — Expulse un membre du groupe (nécessite d'être admin). Usage : .kick @membre
- .promote — Promeut un membre en admin (nécessite d'être admin). Usage : .promote @membre
- .demote — Rétrograde un admin (nécessite d'être admin). Usage : .demote @membre
- .grouplink — Récupère le lien d'invitation du groupe (en groupe).
- .setname — Change le nom du groupe (nécessite d'être admin). Usage : .setname Nouveau Nom
- .joke — Envoie une blague aléatoire.
- .dice — Lance un dé aléatoire.
- .coin — Face ou pile (aléatoire).

Remarques :
- Les commandes "en groupe" exigent que la commande soit envoyée dans une conversation de groupe.
- Les commandes admin vérifient si l'utilisateur est admin via socket.groupMetadata.
- Les mentions utilisent le format JID @xxxx@s.whatsapp.net lorsque nécessaire.

---

## Structure du projet
- commands/ — fichiers de commandes (chaque fichier exporte la fonction de commande)
- utils/ — helpers et gestion de la DB (helpers.js, database.js)
- data/ — fichiers JSON (database.json)
- auth_info/ — données de session Baileys (ne pas partager publiquement)
- index.js — point d'entrée (initialisation du bot)
- package.json — dépendances et scripts

---

## Base de données
- Format : JSON (data/database.json)
- Stocke : users, groups, warns, bans, mutes, settings, afk
- Fonctions utilitaires : loadDatabase, saveDatabase, addUser, getUser, addWarn, getWarns, resetWarns, banUser, unbanUser, isBanned

---

## Sécurité & bonnes pratiques
- Ne partagez jamais le dossier auth_info publiquement. Il contient les clés de session du bot.
- Utilisez un .env local exclu du dépôt (présent dans .gitignore).
- Ne mettez pas de tokens/API keys en clair dans le dépôt.
- Limitez les permissions du numéro utilisé au strict nécessaire.

---

## Dépannage
- Le bot ne se connecte pas : supprimez auth_info et relancez ; vérifiez la connexion internet.
- Commandes ne répondent pas : vérifiez le préfixe, les logs, et la présence des fichiers dans /commands.
- Erreurs liées à la bibliothèque Baileys : vérifiez la compatibilité de la version et les changements d'API.

---

## Contribution
- Fork → Branche → Pull Request
- Respecter le style (ESM modules) et la structure existante (/commands pour nouvelles commandes)
- Documenter toute nouvelle commande ajoutée au README

---

## Licence
MIT — voir fichier LICENSE (ou ajouter si nécessaire).

---

## Support / Contact
- Développeur : EMPEROR KELLY Parquer
- WhatsApp : wa.me/242061418303
- Chaîne : https://whatsapp.com/channel/0029VbCjnME6RGJHicRsGd41
- Groupe support : https://chat.whatsapp.com/Cp7YoLYuuwuDC05FMTF1ON?mode=gi_t

---

Besoin que je modifie autre chose dans le README ou que je pousse d'autres fichiers ? — GitHub Copilot Chat Assistant

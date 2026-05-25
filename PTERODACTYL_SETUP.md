Déploiement Pterodactyl - Guide rapide

Ce document décrit comment supprimer l'ancien serveur, créer un serveur propre sur Pterodactyl et déployer votre bot Ecclésiaste Lucifer.

1) Sauvegarder l'ancien serveur
- Arrêtez le serveur depuis le panel.
- Téléchargez auth_info/ et data/ via le File Manager si vous souhaitez garder la session et la DB.
- Téléchargez aussi tout autre fichier important (config, logs).

2) Supprimer l'ancien serveur
- Dans l'interface du panel, sélectionnez votre serveur → Delete / Supprimer.
- Confirmez la suppression.

3) Créer le nouveau serveur
- New Server → Nom : Ecclésiaste-Lucifer
- Egg / Image : Node.js 22 (ou node:22-alpine)
- Resources recommandés : RAM 1 GB, CPU 1 vCore, Disk ≥ 1 GB
- Startup command : npm install && npm start

4) Variables d'environnement (Panel → Variables)
Ajoutez les variables suivantes (correspondent à .env.production.example) :
- BOT_PREFIX=.
- OWNER="EMPEROR KELLY Parquer"
- OWNER_NUMBER=242061418303
- CHANNEL_URL="https://whatsapp.com/channel/0029VbCjnME6RGJHicRsGd41"
- GROUP_URL="https://chat.whatsapp.com/Cp7YoLYuuwuDC05FMTF1ON?mode=gi_t"
- NODE_ENV=production
- Ajoutez ici vos clés privées (API_KEY, DB_URL) uniquement via le panel.

5) Installation du code
Option A - via install script (recommandé):
- Dans l'onglet Install / Scripting du serveur, collez la commande d'installation :

  git clone https://github.com/Kelly-parquer/Depot-1.git . || true
  npm ci --only=production || npm install --production
  mkdir -p auth_info data

- Exécutez l'installation (Run Install) pour que le code soit cloné et installé.

Option B - upload manuel :
- Uploadez l'archive ZIP et dézippez dans le File Manager, puis lancez npm install.

6) Démarrage
- Démarrez le serveur depuis le panel. Sur la première connexion, Baileys peut demander une authentification (QR ou code) et générer auth_info.
- Vérifiez la console pour voir si le bot démarre sans erreurs.

7) Restaurer une sauvegarde (si vous avez auth_info/data sauvegardés)
- Uploadez l'archive backup (backup_*.tar.gz) dans le File Manager.
- Dans la console ou via terminal du panel :
  mkdir -p restore_tmp && tar -xzf /path/to/uploaded/backup.tar.gz -C restore_tmp
  cp -r restore_tmp/auth_info ./auth_info
  cp -r restore_tmp/data ./data

- Redémarrez le serveur.

8) Automatiser les sauvegardes
- Placez backup.sh à la racine (inclus dans le repo). Donnez-lui les droits d'exécution : chmod +x backup.sh
- Vous pouvez utiliser la fonctionnalité Schedules de Pterodactyl pour exécuter sh backup.sh périodiquement (ex: quotidien).

9) Vérifications & dépannage
- Si "module not found": npm install manquant.
- Si Baileys échoue : supprimez auth_info et ré-authentifiez (perte session possible).
- Logs : utilisez la console du panel pour lire les erreurs.

10) Notes de sécurité
- Ne commitez jamais auth_info ou secrets.
- Stockez les variables sensibles via l'onglet Variables du panel.

Besoin que je fasse autre chose (ex: créer la schedule de backup, rendre backup.sh exécutable via commit instructions, ou ajouter un script de restore automatique) ?

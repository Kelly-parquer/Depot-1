import pkg from '@whiskeysockets/baileys';
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, MessageRetryMap, isJidBroadcast } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ╔════════════════════════════════════════════╗
// ║     ECCLÉSIASTE LUCIFER - BOT WHATSAPP    ║
// ║  Développé par: EMPEROR KELLY Parquer    ║
// ╚════════════════════════════════════════════╝

const CONFIG = {
  name: "Ecclésiaste Lucifer",
  prefix: ".",
  owner: "EMPEROR KELLY Parquer",
  ownerNumber: "242061418303",
  devNumber: "242061418303",
  channelUrl: "https://whatsapp.com/channel/0029VbCjnME6RGJHicRsGd41",
  groupUrl: "https://chat.whatsapp.com/Cp7YoLYuuwuDC05FMTF1ON?mode=gi_t"
};

let sock;
let pairingCode = '';
let lastPairingTime = 0;
const PAIRING_COOLDOWN = 60000;

// Logger personnalisé
const logger = {
  info: (msg) => console.log(chalk.cyan(`[INFO] ${msg}`)),
  error: (msg) => console.log(chalk.red(`[ERROR] ${msg}`)),
  success: (msg) => console.log(chalk.green(`[SUCCESS] ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`[WARN] ${msg}`)),
  debug: (msg) => console.log(chalk.magenta(`[DEBUG] ${msg}`))
};

// Générer un code de pairing 8 caractères
function generatePairingCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Créer les répertoires nécessaires
function ensureDirectories() {
  const dirs = ['auth_info', 'data', 'logs', 'cache'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Charger les commandes
async function loadCommands() {
  const commands = {};
  const commandsDir = path.join(__dirname, 'commands');
  
  if (!fs.existsSync(commandsDir)) {
    fs.mkdirSync(commandsDir, { recursive: true });
  }
  
  try {
    const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    
    for (const file of files) {
      try {
        const module = await import(`./commands/${file}`);
        const commandName = file.replace('.js', '');
        commands[commandName] = module.default || module;
      } catch (error) {
        logger.warn(`Erreur lors du chargement de ${file}: ${error.message}`);
      }
    }
  } catch (error) {
    logger.warn(`Erreur lors du chargement des commandes: ${error.message}`);
  }
  
  return commands;
}

// Fonction principale de démarrage
async function startBot() {
  try {
    logger.info('🚀 Démarrage du Bot Ecclésiaste Lucifer...');
    logger.info(`👨‍💻 Développeur: ${CONFIG.owner}`);
    logger.info(`📱 Numéro: ${CONFIG.ownerNumber}`);
    
    ensureDirectories();
    
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth_info'));
    
    sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: { level: 'silent' },
      browser: ['Ecclesiaste Lucifer', 'Safari', '1.0.0'],
      syncFullHistory: false,
      generateHighQualityLinkPreview: true,
      retryRequestDelayMs: 100,
      maxMsgsInMemory: 100
    });
    
    // Charger les commandes
    const commands = await loadCommands();
    logger.success(`✅ ${Object.keys(commands).length} commandes chargées`);
    
    // Événement: Changement de connexion
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr && !pairingCode) {
        const now = Date.now();
        if (now - lastPairingTime > PAIRING_COOLDOWN) {
          pairingCode = generatePairingCode(8);
          lastPairingTime = now;
          
          console.log('\n');
          logger.warn('═══════════════════════════════════════════════════════');
          logger.warn('📱 CONNEXION EN ATTENTE');
          logger.warn('═══════════════════════════════════════════════════════');
          console.log(chalk.cyan.bold(`\n✨ CODE DE CONNEXION: ${pairingCode}\n`));
          logger.warn('📝 INSTRUCTIONS:');
          logger.warn('1. Prenez votre téléphone WhatsApp');
          logger.warn('2. Allez dans: Paramètres > Appareils liés > Lier un appareil');
          logger.warn('3. Scannez le QR code OU entrez le code ci-dessus');
          logger.warn('4. Entrez ce code sur votre console Pterodactyl: ' + chalk.cyan.bold(pairingCode));
          logger.warn('\n═══════════════════════════════════════════════════════\n');
        }
      }
      
      if (connection === 'open') {
        logger.success('✅ Bot connecté avec succès!');
        pairingCode = '';
        
        logger.info(`👤 Connecté en tant que: ${sock.user.name || 'Bot'}`);
        logger.info(`📱 Numéro: ${sock.user.id}`);
        
        // Envoyer un message de confirmation
        await sock.sendMessage(`${CONFIG.ownerNumber}@s.whatsapp.net`, {
          text: `✅ Bot ${CONFIG.name} connecté avec succès!\n\n📊 Dev: ${CONFIG.owner}\n⏰ Heure: ${new Date().toLocaleString('fr-FR')}`
        });
      }
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        logger.warn(`❌ Connexion fermée - Raison: ${lastDisconnect?.error?.message}`);
        if (shouldReconnect) {
          logger.info('🔄 Reconnexion dans 5 secondes...');
          setTimeout(() => startBot(), 5000);
        } else {
          logger.error('Déconnexion permanente - Supprimez le dossier auth_info et redémarrez');
        }
      }
    });
    
    // Sauvegarde des identifiants
    sock.ev.on('creds.update', saveCreds);
    
    // Événement: Réception de messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') {
        for (const message of messages) {
          try {
            await handleMessage(message, sock, commands);
          } catch (error) {
            logger.error(`Erreur lors du traitement du message: ${error.message}`);
          }
        }
      }
    });
    
    // Événement: Mise à jour de groupes
    sock.ev.on('groups.update', async (updates) => {
      for (const update of updates) {
        logger.debug(`Mise à jour du groupe: ${update.id}`);
      }
    });
    
    // Événement: Présence
    sock.ev.on('presence.update', async (presences) => {
      // Gérer la présence des utilisateurs
    });
    
  } catch (error) {
    logger.error(`Erreur au démarrage: ${error.message}`);
    logger.info('🔄 Redémarrage dans 5 secondes...');
    setTimeout(() => startBot(), 5000);
  }
}

// Gestionnaire de messages
async function handleMessage(message, socket, commands) {
  try {
    const { key, message: msg } = message;
    const { remoteJid, fromMe, participant } = key;
    
    if (fromMe || !msg) return;
    
    // Extraire le texte du message
    const messageText = msg.conversation || 
                       msg.extendedTextMessage?.text || 
                       msg.imageMessage?.caption ||
                       msg.videoMessage?.caption || '';
    
    if (!messageText.startsWith(CONFIG.prefix)) return;
    
    // Parser la commande
    const args = messageText.trim().split(/\s+/);
    const commandName = args[0].slice(CONFIG.prefix.length).toLowerCase();
    const commandArgs = args.slice(1);
    
    const isGroupMessage = remoteJid.endsWith('@g.us');
    const sender = participant || remoteJid;
    const isOwner = sender === `${CONFIG.ownerNumber}@s.whatsapp.net`;
    
    logger.debug(`Commande: ${commandName} | Groupe: ${isGroupMessage} | Owner: ${isOwner}`);
    
    // Vérifier si la commande existe
    if (!commands[commandName]) {
      return;
    }
    
    // Contexte de la commande
    const context = {
      socket,
      message,
      remoteJid,
      sender,
      participant,
      commandName,
      args: commandArgs,
      isGroupMessage,
      isOwner,
      logger,
      CONFIG
    };
    
    // Exécuter la commande
    try {
      await commands[commandName](context);
    } catch (cmdError) {
      logger.error(`Erreur dans la commande ${commandName}: ${cmdError.message}`);
      await socket.sendMessage(remoteJid, {
        text: `❌ Erreur: ${cmdError.message}`
      });
    }
    
  } catch (error) {
    logger.error(`Erreur dans handleMessage: ${error.message}`);
  }
}

// Gestion des signaux d'arrêt
process.on('SIGINT', () => {
  logger.warn('\n⚠️  Arrêt du bot (SIGINT)...');
  if (sock) {
    sock.end();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.warn('\n⚠️  Arrêt du bot (SIGTERM)...');
  if (sock) {
    sock.end();
  }
  process.exit(0);
});

// Gestion des erreurs non attrapées
process.on('uncaughtException', (error) => {
  logger.error(`Erreur non attrapée: ${error.message}`);
  console.error(error);
});

process.on('unhandledRejection', (error) => {
  logger.error(`Promesse rejetée: ${error}`);
});

// Démarrer le bot
logger.info('🌙 Ecclésiaste Lucifer - Initialisation...');
startBot();

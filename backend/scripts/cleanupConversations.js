// Script pour nettoyer les conversations après changement de permissions de chat
// À exécuter une seule fois après les modifications de permissions

const path = require("path");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Charger les variables d'environnement comme le fait le serveur
const envCandidates = [
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "..", "..", ".env"),
];
dotenv.config({ path: envCandidates.find((p) => require("fs").existsSync(p)) });

// Connexion à la base de données (même logique que server.js)
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("[DB] MONGODB_URI ou MONGO_URI non défini dans les variables d'environnement");
      process.exit(1);
    }

    console.log("[DB] Connexion à MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    const dbName = mongoose.connection.db.databaseName;
    console.log(`[DB] MongoDB connecté avec succès à la base: ${dbName}`);
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

const cleanupConversations = async () => {
  try {
    console.log('🧹 Début du nettoyage des conversations...');

    // Supprimer toutes les conversations privées et de groupe
    const conversationResult = await Conversation.deleteMany({
      type: { $in: ['private', 'group', 'project'] }
    });

    console.log(`✅ ${conversationResult.deletedCount} conversations supprimées`);

    // Supprimer tous les messages des conversations supprimées
    // Comme on a supprimé toutes les conversations privées/groupes,
    // on supprime tous les messages qui ne sont plus associés à des conversations existantes
    const messageResult = await Message.deleteMany({
      conversation: { $exists: true }
    });

    console.log(`✅ ${messageResult.deletedCount} messages supprimés`);

    console.log('🎉 Nettoyage terminé avec succès !');
    console.log('📝 Les utilisateurs devront recréer leurs conversations selon les nouvelles permissions.');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Exécuter le script
if (require.main === module) {
  connectDB().then(() => {
    cleanupConversations();
  });
}

module.exports = { cleanupConversations };

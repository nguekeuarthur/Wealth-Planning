// Script pour vérifier que tous les mots de passe sont hachés
// À exécuter pour auditer la sécurité des mots de passe

const mongoose = require('mongoose');
const User = require('../models/User');

// Charger les variables d'environnement
const path = require("path");
const dotenv = require("dotenv");
const envCandidates = [
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "..", "..", ".env"),
];
dotenv.config({ path: envCandidates.find((p) => require("fs").existsSync(p)) });

// Connexion à la base de données
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("[DB] MONGODB_URI ou MONGO_URI non défini");
      process.exit(1);
    }

    console.log("[DB] Connexion à MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    const dbName = mongoose.connection.db.databaseName;
    console.log(`[DB] Connecté à la base: ${dbName}`);
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

const verifyPasswords = async () => {
  try {
    console.log('🔍 Vérification des mots de passe...\n');

    // Récupérer tous les utilisateurs avec leur mot de passe
    const users = await User.find({}, 'name email password role').lean();

    console.log(`📊 Total d'utilisateurs: ${users.length}\n`);

    let hashedCount = 0;
    let plainCount = 0;
    let problems = [];

    for (const user of users) {
      const password = user.password;

      // Vérifier si c'est un hash bcrypt (commence par $2a$, $2b$, ou $2y$)
      const isHashed = password && (
        password.startsWith('$2a$') ||
        password.startsWith('$2b$') ||
        password.startsWith('$2y$')
      );

      if (isHashed) {
        hashedCount++;
      } else {
        plainCount++;
        problems.push({
          name: user.name,
          email: user.email,
          role: user.role,
          passwordLength: password ? password.length : 0
        });
      }
    }

    console.log('✅ Mots de passe hachés:', hashedCount);
    console.log('❌ Mots de passe en clair:', plainCount);
    console.log('');

    if (problems.length > 0) {
      console.log('🚨 PROBLÈMES DE SÉCURITÉ DÉTECTÉS:');
      console.log('Les utilisateurs suivants ont des mots de passe non hachés:');
      console.table(problems);
      console.log('');
      console.log('🔧 RECOMMANDATION: Réinitialiser ces mots de passe immédiatement!');
    } else {
      console.log('🎉 TOUS LES MOTS DE PASSE SONT CORRECTEMENT HACHÉS!');
      console.log('La sécurité est assurée. 👍');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Exécuter le script
if (require.main === module) {
  connectDB().then(() => {
    verifyPasswords();
  });
}

module.exports = { verifyPasswords };

/**
 * Script de migration pour ajouter automatiquement les clients dans assignedUsers
 * Cela permet aux clients d'accéder aux projets même s'ils ne sont pas définis comme project.client
 * 
 * Usage: node scripts/migrateProjectClients.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('[MIGRATION] MONGODB_URI non défini dans les variables d\'environnement');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[MIGRATION] ✅ Connecté à MongoDB');
  } catch (error) {
    console.error('[MIGRATION] ❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

const migrateProjects = async () => {
  try {
    console.log('[MIGRATION] 🔄 Début de la migration des projets...\n');

    // Récupérer tous les projets
    const projects = await Project.find({});
    console.log(`[MIGRATION] 📊 ${projects.length} projets trouvés\n`);

    let migratedCount = 0;
    let alreadyCorrectCount = 0;
    let errorCount = 0;

    for (const project of projects) {
      try {
        if (!project.client) {
          console.log(`⚠️  Projet "${project.name}" (${project._id}) : pas de client défini, ignoré`);
          continue;
        }

        const clientIdStr = project.client.toString();
        const assigned = Array.isArray(project.assignedUsers) ? project.assignedUsers : [];
        const assignedStr = assigned.map(id => id.toString());

        if (assignedStr.includes(clientIdStr)) {
          console.log(`✓  Projet "${project.name}" : client déjà dans assignedUsers`);
          alreadyCorrectCount++;
          continue;
        }

        // Ajouter le client dans assignedUsers
        assigned.push(project.client);
        project.assignedUsers = assigned;
        await project.save();

        console.log(`✅ Projet "${project.name}" : client ajouté dans assignedUsers`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Erreur sur le projet "${project.name}" (${project._id}):`, error.message);
        errorCount++;
      }
    }

    console.log('\n[MIGRATION] 📈 Résumé de la migration:');
    console.log(`  • Projets migrés: ${migratedCount}`);
    console.log(`  • Projets déjà corrects: ${alreadyCorrectCount}`);
    console.log(`  • Erreurs: ${errorCount}`);
    console.log(`  • Total: ${projects.length}`);

    if (migratedCount > 0) {
      console.log('\n[MIGRATION] ✅ Migration terminée avec succès !');
    } else {
      console.log('\n[MIGRATION] ℹ️  Aucune migration nécessaire, tous les projets sont déjà corrects.');
    }
  } catch (error) {
    console.error('[MIGRATION] ❌ Erreur lors de la migration:', error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    await migrateProjects();
    
    console.log('\n[MIGRATION] 🏁 Script terminé');
    process.exit(0);
  } catch (error) {
    console.error('[MIGRATION] ❌ Erreur fatale:', error);
    process.exit(1);
  }
};

// Exécuter le script
main();

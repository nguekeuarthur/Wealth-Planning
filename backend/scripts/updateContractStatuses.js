// Script pour mettre à jour les statuts des contrats de "draft" vers "pending"
const mongoose = require('mongoose');
const Document = require('../models/Document');
require('dotenv').config();

const updateContractStatuses = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connecté à MongoDB');

    // Mettre à jour tous les contrats avec status "draft" vers "pending"
    const resultDraft = await Document.updateMany(
      { type: 'contract', status: 'draft' },
      { $set: { status: 'pending' } }
    );

    console.log(`✅ ${resultDraft.modifiedCount} contrat(s) mis à jour de "draft" vers "pending"`);

    // Mettre à jour tous les contrats sans statut (undefined ou null) vers "pending"
    const resultUndefined = await Document.updateMany(
      { type: 'contract', $or: [{ status: null }, { status: { $exists: false } }] },
      { $set: { status: 'pending' } }
    );

    console.log(`✅ ${resultUndefined.modifiedCount} contrat(s) sans statut mis à jour vers "pending"`);

    // Afficher les contrats mis à jour
    const updatedContracts = await Document.find({ type: 'contract' }).select('name status');
    console.log('\n📋 Statuts actuels des contrats :');
    updatedContracts.forEach(contract => {
      console.log(`   - ${contract.name}: ${contract.status}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Déconnexion de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

updateContractStatuses();

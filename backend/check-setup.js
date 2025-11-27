#!/usr/bin/env node

/**
 * Script de vérification de la configuration
 * Exécute: node check-setup.js
 */

require("dotenv").config();

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "EMAIL_FROM",
  "FRONTEND_URL",
];

console.log("🔍 Vérification de la configuration...\n");

let hasErrors = false;

// Vérifier les variables d'environnement
console.log("📋 Variables d'environnement:");
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.error(`  ❌ ${varName} est manquante`);
    hasErrors = true;
  } else {
    // Masquer les valeurs sensibles
    const displayValue =
      varName.includes("PASS") || varName.includes("SECRET")
        ? "***"
        : varName === "MONGO_URI"
        ? value.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
        : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  }
});

// Vérifier le port
const port = process.env.PORT || 8000;
console.log(`\n🌐 Port configuré: ${port}`);

// Vérifier MongoDB URI
if (process.env.MONGO_URI) {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri.includes("wealth-planning")) {
    console.warn(
      "  ⚠️  L'URI MongoDB ne contient pas 'wealth-planning'. Vérifie que tu es connecté à la bonne base."
    );
  }
}

// Vérifier les dépendances
console.log("\n📦 Vérification des dépendances:");
try {
  require("mongoose");
  console.log("  ✅ mongoose");
} catch (e) {
  console.error("  ❌ mongoose manquant. Exécute: npm install");
  hasErrors = true;
}

try {
  require("bcryptjs");
  console.log("  ✅ bcryptjs");
} catch (e) {
  console.error("  ❌ bcryptjs manquant. Exécute: npm install");
  hasErrors = true;
}

try {
  require("jsonwebtoken");
  console.log("  ✅ jsonwebtoken");
} catch (e) {
  console.error("  ❌ jsonwebtoken manquant. Exécute: npm install");
  hasErrors = true;
}

try {
  require("nodemailer");
  console.log("  ✅ nodemailer");
} catch (e) {
  console.error("  ❌ nodemailer manquant. Exécute: npm install");
  hasErrors = true;
}

// Résumé
console.log("\n" + "=".repeat(50));
if (hasErrors) {
  console.error("❌ Des erreurs ont été détectées. Corrige-les avant de continuer.");
  process.exit(1);
} else {
  console.log("✅ Configuration OK ! Tu peux démarrer le serveur avec: npm run dev");
  process.exit(0);
}


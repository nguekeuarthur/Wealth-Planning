# 🎉 Guide de Démarrage - Site Vitrine + Task Manager

## ✅ Étapes d'Installation

### 1️⃣ Installation des Dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend/Task-Manager
npm install
```

---

### 2️⃣ Configuration de l'Environnement

#### Backend - Créer `.env`
```env
PORT=5000
MONGO_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
CLIENT_URL=http://localhost:5173
```

---

### 3️⃣ Démarrer les Serveurs

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Le serveur backend démarrera sur `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend/Task-Manager
npm run dev
```
✅ Le site sera accessible sur `http://localhost:5173`

---

## 🌐 Navigation du Site

### Parcours Utilisateur

```
1. VISITEUR arrive sur → http://localhost:5173/
   ↓
2. Découvre le SITE VITRINE
   - Accueil (fonctionnalités, hero section)
   - À propos (histoire, équipe)
   - Services (détails des fonctionnalités)
   - Contact (formulaire)
   ↓
3. Clique sur "CONNEXION" dans la navbar
   ↓
4. Arrive sur → http://localhost:5173/connexion
   ↓
5. Se connecte avec ses identifiants
   ↓
6. Accède au TASK MANAGER
   - Si Admin → /admin/dashboard
   - Si Member → /user/dashboard
```

---

## 🎨 Structure des Pages

### 📄 Pages Publiques (Accessible à tous)
```
/                    → Home (Landing page)
/about               → À propos
/services            → Services
/contact             → Contact
```

### 🔐 Pages d'Authentification
```
/connexion           → Page de connexion
/signup              → Inscription
```

### 👨‍💼 Pages Admin (Après connexion)
```
/admin/dashboard     → Vue d'ensemble
/admin/tasks         → Liste des tâches
/admin/create-task   → Créer une tâche
/admin/users         → Gestion des utilisateurs
```

### 👤 Pages Utilisateur (Après connexion)
```
/user/dashboard      → Mon dashboard
/user/tasks          → Mes tâches
/user/task-details/:id → Détails d'une tâche
```

---

## 🎯 Fonctionnalités Principales

### Site Vitrine
✅ Navigation responsive avec menu mobile
✅ Hero section avec CTA
✅ Section fonctionnalités (6 cards)
✅ Section services détaillés
✅ Formulaire de contact
✅ Footer complet avec liens et réseaux sociaux
✅ Design moderne avec Tailwind CSS
✅ Animations fluides

### Task Manager
✅ Authentification JWT
✅ Gestion de tâches (CRUD)
✅ Assignation d'utilisateurs
✅ Priorités et statuts
✅ Checklists de sous-tâches
✅ Upload de fichiers
✅ Tableaux de bord
✅ Graphiques et statistiques
✅ Export de rapports Excel

---

## 🔑 Comptes de Test

Pour tester rapidement, créez des comptes via `/signup` ou utilisez ces identifiants si configurés :

### Admin
```
Email: admin@example.com
Password: admin123
```

### Member
```
Email: user@example.com
Password: user123
```

---

## 📱 Test de Responsivité

Le site s'adapte automatiquement à toutes les tailles d'écran :

### 📱 Mobile (< 768px)
- Menu hamburger
- Layout vertical
- Cards en colonne unique

### 💻 Tablette (768px - 1024px)
- Grille 2 colonnes
- Menu desktop simplifié

### 🖥️ Desktop (> 1024px)
- Grille 3-4 colonnes
- Layout optimal

---

## 🎨 Personnalisation Rapide

### Changer les Couleurs
Modifiez dans `src/index.css` :
```css
@theme {
  --color-primary: #1368ec; /* Votre couleur principale */
}
```

### Changer le Logo
Remplacez "TM" dans :
- `src/components/layouts/PublicNavbar.jsx`
- `src/components/layouts/Footer.jsx`

### Modifier les Textes
Éditez directement les fichiers dans `src/pages/Landing/`

---

## 🐛 Résolution de Problèmes

### Le backend ne démarre pas
```bash
# Vérifiez que MongoDB est démarré
# Vérifiez le fichier .env
# Vérifiez les ports disponibles
```

### Le frontend affiche une erreur
```bash
# Nettoyez le cache
rm -rf node_modules
npm install

# Redémarrez le serveur de développement
npm run dev
```

### Erreur de connexion à l'API
```bash
# Vérifiez que le backend est démarré
# Vérifiez l'URL dans axiosInstance.js
# Vérifiez CORS dans server.js
```

---

## 📊 Prochaines Étapes

Une fois le site fonctionnel, vous pouvez :

1. ✅ Tester toutes les pages
2. ✅ Créer des comptes admin et utilisateur
3. ✅ Créer des tâches de test
4. ✅ Personnaliser les textes et images
5. ✅ Configurer l'envoi d'emails
6. ✅ Déployer sur un serveur (Vercel, Netlify, etc.)

---

## 🚀 Déploiement

### Frontend (Vercel/Netlify)
```bash
npm run build
# Uploadez le dossier dist/
```

### Backend (Railway/Render/Heroku)
```bash
# Poussez sur Git
# Configurez les variables d'environnement
# Déployez
```

---

## 💡 Conseils

- Testez d'abord en local avant de déployer
- Sauvegardez régulièrement votre base de données
- Utilisez des variables d'environnement pour les secrets
- Optimisez les images avant de les uploader
- Testez sur différents navigateurs

---

## 📞 Support

Besoin d'aide ? Contactez-nous !

📧 Email : contact@taskmanager.com
📱 Téléphone : +33 1 23 45 67 89
🌐 Site : http://localhost:5173

---

**Bon développement ! 🎉**

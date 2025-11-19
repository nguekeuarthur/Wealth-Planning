# 🌐 Site Vitrine + Task Manager

## 📋 Description du Projet

Ce projet combine un **site vitrine professionnel** avec un **système de gestion de tâches** complet. Les visiteurs découvrent d'abord le site vitrine avant d'accéder à la plateforme de gestion via l'onglet "Connexion".

---

## 🎨 Structure du Site

### Site Vitrine (Public)
- **Page d'accueil** (`/`) - Landing page avec hero section et présentation des fonctionnalités
- **À propos** (`/about`) - Histoire, valeurs, équipe et chiffres clés
- **Services** (`/services`) - Détails des fonctionnalités et processus
- **Contact** (`/contact`) - Formulaire de contact et informations

### Système de Gestion (Authentifié)
- **Connexion** (`/connexion`) - Point d'entrée vers le task manager
- **Dashboard Admin** - Gestion complète des tâches et utilisateurs
- **Dashboard Utilisateur** - Suivi des tâches assignées

---

## 🚀 Démarrage Rapide

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend/Task-Manager
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

---

## 📂 Nouvelles Pages Créées

### Pages Landing
- `src/pages/Landing/Home.jsx` - Page d'accueil
- `src/pages/Landing/About.jsx` - À propos
- `src/pages/Landing/Services.jsx` - Services
- `src/pages/Landing/Contact.jsx` - Contact

### Composants
- `src/components/layouts/PublicLayout.jsx` - Layout pour pages publiques
- `src/components/layouts/PublicNavbar.jsx` - Navigation publique
- `src/components/layouts/Footer.jsx` - Pied de page

---

## 🎯 Fonctionnalités du Site Vitrine

### ✨ Design Moderne
- Interface élégante avec Tailwind CSS
- Animations fluides
- Design responsive (mobile, tablette, desktop)
- Dégradés de couleurs professionnels

### 📱 Navigation Intuitive
- Menu sticky en haut de page
- Navigation mobile avec menu hamburger
- Liens vers toutes les sections
- Bouton CTA "Connexion" visible

### 🎨 Sections Clés
- **Hero Section** - Présentation impactante avec CTA
- **Fonctionnalités** - 6 cards avec icônes
- **Services** - Descriptions détaillées
- **Statistiques** - Chiffres clés animés
- **Footer** - Liens, réseaux sociaux, contact

---

## 🔄 Routes du Projet

```javascript
// Routes Publiques (avec navbar + footer)
/                 → Home
/about            → À propos
/services         → Services
/contact          → Contact

// Routes Auth
/connexion        → Login (point d'entrée vers le task manager)
/signup           → Inscription

// Routes Admin (protégées)
/admin/dashboard  → Dashboard Admin
/admin/tasks      → Gestion des tâches
/admin/create-task → Création de tâche
/admin/users      → Gestion des utilisateurs

// Routes User (protégées)
/user/dashboard   → Dashboard Utilisateur
/user/tasks       → Mes tâches
/user/task-details/:id → Détails d'une tâche
```

---

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans `src/index.css` :
- **Primary** : Bleu (#1368ec)
- **Secondary** : Gris foncé (#111827)
- Utilisez les classes Tailwind pour personnaliser

### Contenu
Modifiez facilement :
- **Textes** : Dans chaque fichier de page
- **Images** : Ajoutez dans `src/assets/images/`
- **Logos** : Remplacez "TM" dans les composants navbar/footer

---

## 📧 Configuration du Formulaire de Contact

Le formulaire dans `Contact.jsx` est actuellement en mode simulation. Pour le connecter :

1. Créez une route backend `/api/contact`
2. Configurez un service d'email (Nodemailer, SendGrid, etc.)
3. Remplacez la fonction `handleSubmit` dans `Contact.jsx`

---

## 🔐 Sécurité

- Authentification JWT
- Routes protégées par rôle
- Validation côté client et serveur
- Hashage des mots de passe avec bcrypt

---

## 📱 Responsive Design

Le site est entièrement responsive :
- **Mobile** : Navigation hamburger, layout vertical
- **Tablette** : Grilles 2 colonnes
- **Desktop** : Grilles 3-4 colonnes, layout optimal

---

## 🛠️ Technologies Utilisées

### Frontend
- React 19
- Vite
- TailwindCSS 4
- React Router v7
- React Icons
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT
- Multer

---

## 📦 Prochaines Étapes

- [ ] Ajouter une section FAQ
- [ ] Intégrer Google Maps dans Contact
- [ ] Ajouter des témoignages clients
- [ ] Créer une page Tarifs
- [ ] Mettre en place l'envoi d'emails
- [ ] Ajouter des animations au scroll
- [ ] Optimiser les images
- [ ] Configuration SEO

---

## 👨‍💻 Support

Pour toute question ou assistance :
- Email : contact@taskmanager.com
- Téléphone : +33 1 23 45 67 89

---

## 📄 Licence

© 2025 Task Manager. Tous droits réservés.

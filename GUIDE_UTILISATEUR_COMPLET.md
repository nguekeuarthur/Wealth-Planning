# 📘 Guide Utilisateur Complet - Geneva Wealth Partners

## 🎯 Table des Matières

1. [Introduction](#introduction)
2. [Qu'est-ce que Geneva Wealth Partners ?](#quest-ce-que-geneva-wealth-partners)
3. [Comment Accéder à la Plateforme](#comment-accéder-à-la-plateforme)
4. [Les Différents Rôles Utilisateurs](#les-différents-rôles-utilisateurs)
5. [Guide par Rôle](#guide-par-rôle)
6. [Fonctionnalités Principales](#fonctionnalités-principales)
7. [Questions Fréquentes (FAQ)](#questions-fréquentes-faq)
8. [Résolution des Problèmes](#résolution-des-problèmes)
9. [Glossaire](#glossaire)

---

## 📖 Introduction

Bienvenue dans le guide utilisateur complet de **Geneva Wealth Partners**. Ce document a été conçu pour vous accompagner pas à pas dans l'utilisation de la plateforme, que vous soyez administrateur, membre de l'équipe, partenaire ou client.

### 🎓 À qui s'adresse ce guide ?

- **Débutants complets** : Aucune connaissance technique requise
- **Nouveaux utilisateurs** : Vous venez de recevoir vos identifiants
- **Utilisateurs existants** : Vous souhaitez découvrir de nouvelles fonctionnalités
- **Administrateurs** : Vous devez former de nouveaux membres

---

## 🏢 Qu'est-ce que Geneva Wealth Partners ?

**Geneva Wealth Partners** est une plateforme complète qui combine :

### 1️⃣ Un Site Vitrine Public
Présente les services de conseil en structuration patrimoniale et fiscale pour :
- Entrepreneurs
- Investisseurs
- Particuliers souhaitant créer une société en Suisse ou à l'étranger

### 2️⃣ Une Plateforme de Gestion Interne
Un système complet de gestion qui permet de :
- ✅ Gérer des projets clients
- 📋 Suivre des tâches
- 💬 Communiquer en temps réel
- 📄 Partager des documents
- 💰 Gérer des factures
- 📊 Générer des rapports
- 📅 Planifier des rendez-vous

### 🌍 Disponible en 4 Langues
- 🇫🇷 Français
- 🇬🇧 Anglais
- 🇩🇪 Allemand
- 🇮🇹 Italien

---

## 🔐 Comment Accéder à la Plateforme

### Étape 1 : Ouvrir le Site
1. Ouvrez votre navigateur web (Chrome, Firefox, Safari, Edge)
2. Tapez l'adresse du site : `http://localhost:5173` (en développement)
3. Vous arrivez sur la page d'accueil publique

### Étape 2 : Se Connecter
1. Cliquez sur **"Connexion"** dans le menu en haut à droite
2. Vous serez redirigé vers la page de connexion
3. Entrez vos identifiants :
   - **Email** : L'adresse email fournie par votre administrateur
   - **Mot de passe** : Le mot de passe temporaire ou permanent
4. Cliquez sur **"Se Connecter"**

### 🔑 Première Connexion
Lors de votre première connexion, il est recommandé de :
1. Changer votre mot de passe temporaire
2. Compléter votre profil (photo, téléphone, etc.)
3. Explorer le tableau de bord

### 🚪 Se Déconnecter
Pour vous déconnecter :
1. Cliquez sur votre photo de profil en haut à droite
2. Sélectionnez **"Déconnexion"**
3. Vous serez redirigé vers la page publique

---

## 👥 Les Différents Rôles Utilisateurs

La plateforme propose **4 types de rôles** avec des permissions différentes :

### 1. 👑 Administrateur (Admin)
**Qui ?** Le dirigeant, le directeur général, le responsable IT

**Pouvoirs :**
- ✅ Accès complet à toutes les fonctionnalités
- 👤 Créer, modifier et supprimer des utilisateurs
- 📊 Voir tous les projets, tâches et données
- 💼 Gérer les clients et partenaires
- 📈 Accéder aux statistiques complètes
- ⚙️ Configurer les paramètres système
- 💰 Gérer toutes les factures
- 🎯 Vue patrimoine globale

**Accès :** Dashboard admin (`/admin`)

---

### 2. 👨‍💼 Membre de l'Équipe (Member)
**Qui ?** Employés, conseillers, gestionnaires de patrimoine

**Pouvoirs :**
- 📋 Voir et gérer ses propres tâches
- 💬 Communiquer avec l'équipe et les clients
- 📄 Upload et télécharger des documents
- 📅 Gérer ses rendez-vous
- ✉️ Recevoir et envoyer des messages
- 📊 Voir les projets auxquels il est assigné
- 🔔 Recevoir des notifications

**Accès :** Dashboard membre (`/user`)

---

### 3. 🤝 Partenaire (Partner)
**Qui ?** Partenaires externes, notaires, avocats, experts-comptables

**Pouvoirs :**
- 📊 Voir les projets où il collabore
- 💬 Communiquer avec l'équipe Geneva Wealth Partners
- 📄 Partager des documents
- 📋 Consulter les tâches qui le concernent
- ✉️ Échanger via la messagerie

**Accès :** Dashboard partenaire (`/partner`)

---

### 4. 👤 Client (Client/Collaborator)
**Qui ?** Clients finaux utilisant les services

**Pouvoirs :**
- 👁️ Voir ses propres projets
- 💬 Communiquer avec son conseiller
- 📄 Télécharger ses documents
- 📅 Voir ses rendez-vous
- 💰 Consulter ses factures
- ✉️ Envoyer des messages à l'équipe

**Accès :** Dashboard client (`/collaborator`)

---

## 📚 Guide par Rôle

---

## 👑 GUIDE ADMINISTRATEUR

### 🏠 Tableau de Bord Admin

Après connexion, vous accédez au **Dashboard Admin** qui affiche :

#### 📊 Statistiques en un Coup d'Œil
- **Projets Actifs** : Nombre de projets en cours
- **Factures** : Montant total et statut
- **Tâches en Attente** : Tâches non terminées
- **Messages Non Lus** : Nombre de messages reçus

#### 📈 Graphiques
- **Projets par Statut** : Répartition (En attente, En cours, Terminé)
- **Factures par Statut** : Montants (Payées, En attente, En retard)
- **Catégories** : Distribution par type de projet

---

### 👤 Gestion des Utilisateurs

#### ➕ Créer un Nouvel Utilisateur

1. Dans le menu latéral, cliquez sur **"Équipe"**
2. Cliquez sur le bouton **"+ Ajouter un membre"**
3. Remplissez le formulaire :
   - **Nom complet** : Prénom et nom
   - **Email** : Adresse email professionnelle (servira d'identifiant)
   - **Mot de passe** : Mot de passe temporaire (l'utilisateur devra le changer)
   - **Rôle** : Choisir entre Admin, Member, Partner, Client
   - **Téléphone** : Numéro de téléphone (optionnel)
4. Cliquez sur **"Créer"**
5. L'utilisateur reçoit un email avec ses identifiants

#### ✏️ Modifier un Utilisateur

1. Dans **"Équipe"**, trouvez l'utilisateur
2. Cliquez sur l'icône **crayon** (✏️)
3. Modifiez les informations souhaitées
4. Cliquez sur **"Enregistrer"**

#### 🗑️ Supprimer un Utilisateur

1. Dans **"Équipe"**, trouvez l'utilisateur
2. Cliquez sur l'icône **corbeille** (🗑️)
3. Confirmez la suppression
4. ⚠️ **Attention** : Cette action est irréversible

#### 🔍 Rechercher un Utilisateur

Utilisez la barre de recherche en haut de la liste pour filtrer par :
- Nom
- Email
- Rôle

---

### 📊 Gestion des Projets

#### ➕ Créer un Nouveau Projet

1. Cliquez sur **"Projets"** dans le menu
2. Cliquez sur **"+ Nouveau Projet"**
3. Remplissez les informations :
   - **Nom du Projet** : Titre descriptif
   - **Description** : Détails du projet
   - **Client** : Sélectionnez le client concerné
   - **Catégorie** : Type de projet
     - Création d'entreprise
     - Domiciliation
     - Ouverture de compte bancaire
     - Structuration patrimoniale
     - Optimisation fiscale
     - Autre
   - **Date de début** : Date de lancement
   - **Date de fin estimée** : Date prévue de clôture
   - **Budget** : Montant en CHF
   - **Membres de l'équipe** : Assignez les collaborateurs
4. Cliquez sur **"Créer le Projet"**

#### 👁️ Voir les Détails d'un Projet

1. Cliquez sur un projet dans la liste
2. Vous accédez à la page détaillée avec :
   - **Informations générales** : Statut, dates, budget
   - **Tâches** : Liste des tâches du projet
   - **Documents** : Fichiers associés
   - **Messagerie** : Discussion du projet
   - **Équipe** : Membres assignés
   - **Jalons** : Étapes clés (milestones)

#### ✏️ Modifier un Projet

1. Dans les détails du projet, cliquez sur **"Modifier"**
2. Changez les informations nécessaires
3. Cliquez sur **"Enregistrer"**

#### 🗑️ Supprimer un Projet

1. Dans les détails du projet, cliquez sur **"Supprimer"**
2. Confirmez la suppression
3. ⚠️ Toutes les tâches et documents associés seront supprimés

---

### 📋 Gestion des Tâches

#### ➕ Créer une Tâche

**Méthode 1 : Depuis un Projet**
1. Ouvrez le projet concerné
2. Dans l'onglet **"Tâches"**, cliquez sur **"+ Nouvelle Tâche"**
3. Remplissez :
   - **Nom de la tâche**
   - **Description**
   - **Assigné à** : Choisir un membre
   - **Priorité** : Faible, Moyen, Élevé
   - **Date de début**
   - **Date de fin**
   - **Statut** : En attente, En cours, Terminé
4. Cliquez sur **"Créer"**

**Méthode 2 : Depuis le Menu Tâches**
1. Cliquez sur **"Tâches"** dans le menu
2. Cliquez sur **"+ Nouvelle Tâche"**
3. Sélectionnez le projet associé
4. Remplissez les informations
5. Cliquez sur **"Créer"**

#### ✅ Suivre l'Avancement des Tâches

Les tâches sont organisées par statut :
- **En attente** (⏳) : Tâches non commencées
- **En cours** (🔄) : Tâches en progression
- **Terminé** (✅) : Tâches complétées

Vous pouvez glisser-déposer les tâches entre les colonnes pour changer leur statut.

#### 🔔 Notifications de Tâches

Vous recevez des notifications quand :
- Une tâche vous est assignée
- Une tâche assignée est modifiée
- Une échéance approche (48h avant)
- Une tâche est marquée terminée

---

### 💰 Gestion des Factures

#### ➕ Créer une Facture

1. Cliquez sur **"Factures"** dans le menu
2. Cliquez sur **"+ Nouvelle Facture"**
3. Remplissez :
   - **Numéro de facture** : Généré automatiquement ou manuel
   - **Client** : Sélectionnez le client
   - **Projet associé** : (optionnel)
   - **Montant** : En CHF
   - **Date d'émission**
   - **Date d'échéance**
   - **Description** : Services facturés
   - **Statut** : En attente, Payée, En retard
4. Cliquez sur **"Créer"**

#### 📥 Exporter les Factures

1. Dans la liste des factures
2. Cliquez sur **"Exporter"**
3. Choisissez le format : PDF ou Excel
4. Le fichier se télécharge automatiquement

#### 💳 Marquer une Facture comme Payée

1. Trouvez la facture dans la liste
2. Cliquez sur le menu **"Actions"** (⋮)
3. Sélectionnez **"Marquer comme payée"**
4. La facture passe au statut "Payée" ✅

---

### 📄 Gestion des Documents

#### 📤 Uploader un Document

**Méthode 1 : Depuis un Projet**
1. Ouvrez le projet
2. Onglet **"Documents"**
3. Cliquez sur **"+ Ajouter un Document"**
4. Sélectionnez le fichier sur votre ordinateur
5. Ajoutez une description (optionnel)
6. Cliquez sur **"Upload"**

**Formats acceptés :**
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- Images (.jpg, .png)
- Taille maximale : 10 MB

#### 📥 Télécharger un Document

1. Trouvez le document dans la liste
2. Cliquez sur l'icône **téléchargement** (⬇️)
3. Le fichier se télécharge automatiquement

#### 🗑️ Supprimer un Document

1. Cliquez sur l'icône **corbeille** (🗑️)
2. Confirmez la suppression
3. ⚠️ Le document est supprimé définitivement

---

### 💬 Messagerie

#### ✉️ Envoyer un Message

**Message lié à un Projet :**
1. Ouvrez le projet
2. Onglet **"Messagerie"**
3. Tapez votre message dans la zone de texte
4. Ajoutez des pièces jointes si nécessaire (📎)
5. Cliquez sur **"Envoyer"**

**Message Direct (Inbox) :**
1. Cliquez sur **"Messages"** dans le menu
2. Cliquez sur **"+ Nouveau Message"**
3. Sélectionnez le destinataire
4. Tapez votre message
5. Cliquez sur **"Envoyer"**

#### 🔔 Notifications de Messages

Vous êtes notifié en temps réel quand :
- Vous recevez un nouveau message
- Quelqu'un répond à votre message
- Un message est envoyé dans un projet que vous suivez

Le nombre de messages non lus apparaît sur l'icône 💬

---

### 📅 Gestion des Rendez-vous

#### ➕ Créer un Rendez-vous

1. Cliquez sur **"Rendez-vous"** dans le menu
2. Cliquez sur **"+ Nouveau Rendez-vous"**
3. Remplissez :
   - **Titre** : Objet du rendez-vous
   - **Client** : Client concerné
   - **Date et heure** : Date/heure du rendez-vous
   - **Durée** : En minutes
   - **Lieu** : Adresse ou "Visio"
   - **Notes** : Détails supplémentaires
   - **Participants** : Membres de l'équipe
4. Cliquez sur **"Créer"**

#### 📧 Rappels de Rendez-vous

Des rappels automatiques sont envoyés :
- 24 heures avant
- 1 heure avant

---

### 📊 Vue Patrimoine

La **Vue Patrimoine** est un tableau de bord exclusif pour les administrateurs offrant une vision globale de l'activité.

#### Accès
1. Cliquez sur **"Patrimoine"** dans le menu admin

#### 📈 Contenu

**Statistiques Clés :**
- Projets Actifs
- Factures (montant total en CHF)
- Tâches en Attente
- Messages Non Lus

**Graphiques :**
- **Projets par Statut** : Camembert des statuts
- **Factures par Statut** : Liste avec montants
- **Catégories** : Distribution des projets

**Sections :**
- **Rappels des Tâches** : Tâches urgentes et en attente
- **Discussions Récentes** : Derniers 7 jours
- **Documents Récents** : Derniers 7 jours

---

### 📈 Rapports et Statistiques

#### 📊 Générer un Rapport

1. Cliquez sur **"Rapports"** dans le menu
2. Choisissez le type de rapport :
   - Rapport d'activité
   - Rapport financier
   - Rapport de projet
3. Sélectionnez la période
4. Cliquez sur **"Générer"**
5. Le rapport se génère et peut être exporté en PDF ou Excel

---

## 👨‍💼 GUIDE MEMBRE DE L'ÉQUIPE

### 🏠 Votre Tableau de Bord

Après connexion, vous accédez à votre dashboard personnel qui affiche :

#### 📊 Vos Statistiques
- **Mes Tâches** : Nombre de tâches assignées
- **Tâches Terminées** : Progression
- **Messages Non Lus** : Communications reçues
- **Rendez-vous du Jour** : Planning

#### 📋 Vos Tâches

Les tâches qui vous sont assignées sont visibles en trois colonnes :
- **À Faire** : Tâches en attente
- **En Cours** : Tâches que vous traitez
- **Terminées** : Tâches complétées

---

### ✅ Gérer Vos Tâches

#### 📝 Voir les Détails d'une Tâche

1. Cliquez sur une tâche
2. Vous voyez :
   - Description complète
   - Projet associé
   - Dates (début, fin)
   - Priorité
   - Documents liés
   - Commentaires

#### 🔄 Changer le Statut d'une Tâche

**Méthode 1 : Glisser-Déposer**
- Faites glisser la carte de tâche vers la colonne souhaitée

**Méthode 2 : Menu Déroulant**
1. Ouvrez la tâche
2. Changez le statut dans le menu déroulant
3. Cliquez sur **"Enregistrer"**

#### 💬 Commenter une Tâche

1. Ouvrez la tâche
2. Section **"Commentaires"** en bas
3. Tapez votre commentaire
4. Cliquez sur **"Ajouter"**
5. Les autres membres sont notifiés

#### 📎 Ajouter une Pièce Jointe

1. Ouvrez la tâche
2. Cliquez sur **"📎 Ajouter un fichier"**
3. Sélectionnez le fichier
4. Cliquez sur **"Upload"**

---

### 📊 Vos Projets

#### 👁️ Voir Vos Projets

1. Cliquez sur **"Projets"** dans le menu
2. Vous voyez tous les projets où vous êtes assigné
3. Cliquez sur un projet pour voir les détails

#### 💬 Communiquer sur un Projet

1. Ouvrez le projet
2. Onglet **"Chat"**
3. Tapez votre message
4. Tous les membres du projet voient le message

---

### 📄 Documents

#### 📥 Télécharger un Document

1. Ouvrez le projet ou la tâche
2. Onglet **"Documents"**
3. Cliquez sur l'icône **téléchargement** (⬇️)

#### 📤 Uploader un Document

1. Ouvrez le projet
2. Onglet **"Documents"**
3. Cliquez sur **"+ Ajouter"**
4. Sélectionnez le fichier
5. Cliquez sur **"Upload"**

---

### 💬 Messagerie

#### 📨 Envoyer un Message

**Dans un Projet :**
- Utilisez le chat du projet (tous les membres voient)

**Message Privé :**
1. Cliquez sur **"Messages"**
2. Sélectionnez **"+ Nouveau Message"**
3. Choisissez le destinataire
4. Tapez votre message
5. Cliquez sur **"Envoyer"**

#### 🔔 Voir les Messages Non Lus

1. Cliquez sur l'icône **Messages** (💬)
2. Les messages non lus sont en gras
3. Cliquez dessus pour lire et répondre

---

### 📅 Vos Rendez-vous

#### 👁️ Voir Vos Rendez-vous

1. Cliquez sur **"Rendez-vous"** dans le menu
2. Vue calendrier ou liste
3. Les rendez-vous où vous êtes participant sont affichés

#### ✏️ Modifier un Rendez-vous

Si vous avez créé le rendez-vous :
1. Cliquez sur le rendez-vous
2. Cliquez sur **"Modifier"**
3. Changez les informations
4. Cliquez sur **"Enregistrer"**

---

### 👤 Votre Profil

#### ✏️ Modifier Votre Profil

1. Cliquez sur votre photo en haut à droite
2. Sélectionnez **"Profil"**
3. Vous pouvez modifier :
   - Photo de profil
   - Nom
   - Email
   - Téléphone
   - Mot de passe
4. Cliquez sur **"Enregistrer"**

#### 📸 Changer Votre Photo

1. Dans votre profil
2. Cliquez sur votre photo actuelle
3. Sélectionnez une nouvelle image
4. Cliquez sur **"Upload"**

---

## 🤝 GUIDE PARTENAIRE

### 🏠 Votre Tableau de Bord

En tant que partenaire, vous accédez à un dashboard dédié avec :

#### 📊 Vos Statistiques
- **Projets Collaboratifs** : Projets où vous collaborez
- **Tâches Partagées** : Tâches qui vous concernent
- **Messages** : Communications avec Geneva Wealth Partners

---

### 📊 Vos Projets de Collaboration

#### 👁️ Voir les Projets

1. Cliquez sur **"Projets"** dans le menu
2. Vous voyez uniquement les projets où vous êtes ajouté comme partenaire
3. Cliquez sur un projet pour voir les détails

#### 💬 Communiquer avec l'Équipe

1. Ouvrez le projet
2. Onglet **"Chat"**
3. Tapez votre message
4. L'équipe Geneva Wealth Partners reçoit votre message

---

### 📄 Partager des Documents

#### 📤 Uploader un Document

1. Ouvrez le projet de collaboration
2. Onglet **"Documents"**
3. Cliquez sur **"+ Ajouter"**
4. Sélectionnez le fichier
5. Ajoutez une description
6. Cliquez sur **"Upload"**

Exemples :
- Contrats signés
- Attestations
- Rapports d'expertise
- Documents notariés

---

### 💬 Messagerie

Vous pouvez échanger avec l'équipe Geneva Wealth Partners :

1. Cliquez sur **"Messages"**
2. Les conversations liées aux projets collaboratifs
3. Répondez aux messages ou créez-en de nouveaux

---

## 👤 GUIDE CLIENT

### 🏠 Votre Espace Client

Bienvenue dans votre espace personnel ! Ici vous pouvez :
- Suivre vos projets
- Communiquer avec votre conseiller
- Accéder à vos documents
- Consulter vos factures

---

### 📊 Vos Projets

#### 👁️ Voir Vos Projets

1. Après connexion, vous voyez vos projets actifs
2. Cliquez sur un projet pour voir :
   - État d'avancement
   - Description
   - Documents associés
   - Messagerie avec votre conseiller

#### 📈 Suivre l'Avancement

Chaque projet affiche :
- **Statut** : En cours, Terminé, En attente
- **Progression** : Pourcentage d'avancement
- **Prochaines Étapes** : Actions à venir

---

### 💬 Communiquer avec Votre Conseiller

#### ✉️ Envoyer un Message

**Dans un Projet :**
1. Ouvrez le projet
2. Onglet **"Chat"**
3. Tapez votre question ou message
4. Votre conseiller reçoit une notification

**Message Direct :**
1. Cliquez sur **"Messages"**
2. Sélectionnez votre conseiller
3. Tapez votre message
4. Cliquez sur **"Envoyer"**

#### 🔔 Recevoir des Réponses

Vous êtes notifié quand :
- Votre conseiller répond
- Le statut de votre projet change
- Un nouveau document est ajouté

---

### 📄 Vos Documents

#### 📥 Télécharger un Document

1. Ouvrez votre projet
2. Onglet **"Documents"**
3. Liste des documents disponibles :
   - Contrats
   - Attestations
   - Relevés
   - Rapports
4. Cliquez sur **"Télécharger"** (⬇️)

#### 📤 Fournir un Document

Si votre conseiller vous demande un document :
1. Ouvrez le projet
2. Onglet **"Documents"**
3. Cliquez sur **"+ Ajouter"**
4. Sélectionnez le fichier (pièce d'identité, justificatif, etc.)
5. Cliquez sur **"Upload"**

---

### 💰 Vos Factures

#### 👁️ Consulter Vos Factures

1. Cliquez sur **"Factures"** dans le menu
2. Vous voyez toutes vos factures :
   - Numéro
   - Montant en CHF
   - Date d'émission
   - Date d'échéance
   - Statut (Payée, En attente, En retard)

#### 📥 Télécharger une Facture

1. Trouvez la facture
2. Cliquez sur **"Télécharger PDF"**
3. Le fichier se télécharge

#### 💳 Payer une Facture

Les instructions de paiement sont indiquées sur la facture :
- Coordonnées bancaires
- Référence de paiement
- Montant exact

Après paiement, informez votre conseiller qui mettra à jour le statut.

---

### 📅 Vos Rendez-vous

#### 👁️ Voir Vos Rendez-vous

1. Cliquez sur **"Rendez-vous"**
2. Vous voyez vos rendez-vous prévus avec :
   - Date et heure
   - Lieu (bureau ou visio)
   - Conseiller assigné
   - Objet du rendez-vous

#### 🔔 Rappels

Vous recevez des rappels :
- 24 heures avant
- 1 heure avant

---

## 🎯 Fonctionnalités Principales

### 🔔 Système de Notifications

#### Types de Notifications

Vous recevez des notifications pour :
- ✉️ **Nouveaux messages**
- 📋 **Tâches assignées**
- 📅 **Rendez-vous à venir**
- 📊 **Changements de statut de projet**
- 📄 **Nouveaux documents**
- 💰 **Factures**

#### Où Voir les Notifications ?

1. **Icône cloche** (🔔) en haut à droite
2. Un badge rouge indique le nombre de nouvelles notifications
3. Cliquez pour voir la liste
4. Cliquez sur une notification pour voir les détails

#### Réglages

1. Cliquez sur votre profil
2. **"Paramètres"**
3. **"Notifications"**
4. Activez/désactivez les types de notifications

---

### 💬 Chat en Temps Réel

#### Fonctionnalités

- **Messages instantanés** : Pas besoin de rafraîchir
- **Pièces jointes** : Partagez des fichiers
- **Historique** : Toutes les conversations sauvegardées
- **Indicateurs de lecture** : Voir si le message est lu

#### Utilisation

**Chat de Projet :**
- Visible par tous les membres du projet
- Idéal pour discussions de groupe

**Messages Privés :**
- Conversation 1-à-1
- Confidentialité assurée

---

### 📊 Tableaux de Bord Personnalisés

Chaque rôle a un dashboard adapté :

- **Admin** : Vue globale de l'entreprise
- **Member** : Tâches et projets personnels
- **Partner** : Projets collaboratifs
- **Client** : Projets et factures

---

### 🔍 Recherche Globale

#### Utiliser la Recherche

1. Barre de recherche en haut (🔍)
2. Tapez votre recherche
3. Résultats filtrés par catégorie :
   - Projets
   - Tâches
   - Documents
   - Utilisateurs
   - Messages

#### Filtres Avancés

- **Par Date** : Rechercher dans une période
- **Par Statut** : Filtre "En cours", "Terminé", etc.
- **Par Utilisateur** : Voir les éléments d'une personne

---

### 🌐 Multilingue

#### Changer de Langue

1. Cliquez sur le **drapeau** en haut à droite
2. Sélectionnez la langue :
   - 🇫🇷 Français
   - 🇬🇧 English
   - 🇩🇪 Deutsch
   - 🇮🇹 Italiano
3. L'interface change instantanément

#### Langues Disponibles

Toute l'interface est traduite :
- Menus
- Boutons
- Messages système
- Emails de notification

---

### 📱 Responsive Design

La plateforme s'adapte à tous les appareils :

#### 💻 Ordinateur
- Interface complète
- Toutes les fonctionnalités
- Multi-fenêtres

#### 📱 Tablette
- Interface optimisée
- Navigation tactile
- Menus adaptés

#### 📱 Smartphone
- Version mobile
- Menu hamburger (☰)
- Fonctionnalités essentielles

---

## ❓ Questions Fréquentes (FAQ)

### 🔐 Connexion et Compte

**Q : J'ai oublié mon mot de passe, que faire ?**
R : Cliquez sur "Mot de passe oublié ?" sur la page de connexion. Entrez votre email et suivez les instructions reçues par email.

**Q : Puis-je changer mon mot de passe ?**
R : Oui ! Allez dans votre profil → Paramètres → Sécurité → Changer le mot de passe.

**Q : Mon compte est bloqué, pourquoi ?**
R : Après 5 tentatives de connexion échouées, le compte est temporairement bloqué (15 minutes). Contactez l'administrateur si le problème persiste.

**Q : Puis-je avoir plusieurs comptes ?**
R : Non, chaque utilisateur a un seul compte lié à son email professionnel.

---

### 📊 Projets et Tâches

**Q : Comment savoir quelles tâches sont prioritaires ?**
R : Les tâches ont des codes couleur selon la priorité :
- 🔴 Rouge : Priorité élevée
- 🟡 Jaune : Priorité moyenne
- 🟢 Vert : Priorité faible

**Q : Puis-je créer un projet moi-même ?**
R : Seuls les administrateurs peuvent créer des projets. Les membres peuvent suggérer des projets via la messagerie.

**Q : Que se passe-t-il si je manque une échéance ?**
R : La tâche passe automatiquement en "En retard" et votre manager reçoit une notification.

**Q : Puis-je déléguer une tâche ?**
R : Seuls les administrateurs peuvent réassigner des tâches. Contactez votre manager.

---

### 💬 Communication

**Q : Les messages sont-ils confidentiels ?**
R : 
- Messages de projet : Visibles par tous les membres du projet
- Messages privés : Visibles uniquement par l'émetteur et le destinataire
- Administrateurs : Peuvent voir tous les messages

**Q : Puis-je supprimer un message envoyé ?**
R : Non, les messages ne peuvent pas être supprimés pour conserver l'historique. Soyez attentif avant d'envoyer.

**Q : Comment savoir si mon message a été lu ?**
R : Une coche bleue (✓) apparaît quand le destinataire a lu le message.

---

### 📄 Documents

**Q : Quels types de fichiers puis-je uploader ?**
R : PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Images (.jpg, .png, .gif). Taille max : 10 MB.

**Q : Puis-je modifier un document uploadé ?**
R : Non, vous devez uploader une nouvelle version. Supprimez l'ancienne si nécessaire.

**Q : Où sont stockés mes documents ?**
R : Sur des serveurs sécurisés avec backup quotidien. Vos documents sont chiffrés.

**Q : Combien de temps sont conservés les documents ?**
R : Selon la réglementation suisse : minimum 10 ans pour les documents financiers et juridiques.

---

### 💰 Factures

**Q : Comment payer une facture ?**
R : Les instructions de paiement (IBAN, référence) sont sur la facture PDF. Effectuez un virement bancaire.

**Q : Puis-je payer par carte de crédit ?**
R : Actuellement, seuls les virements bancaires sont acceptés.

**Q : J'ai payé mais la facture est toujours "En attente" ?**
R : Le statut est mis à jour manuellement après vérification du paiement (1-3 jours ouvrables).

**Q : Puis-je obtenir une facture rectificative ?**
R : Contactez votre conseiller ou l'administrateur pour toute modification de facture.

---

### 🔔 Notifications

**Q : Je reçois trop de notifications, comment les réduire ?**
R : Allez dans Paramètres → Notifications → Désactivez les types non essentiels.

**Q : Puis-je recevoir les notifications par email ?**
R : Oui, activez les "Notifications par email" dans les paramètres.

**Q : Les notifications sont-elles instantanées ?**
R : Oui, grâce à la technologie WebSocket, les notifications sont en temps réel.

---

### 🌐 Technique

**Q : Quels navigateurs sont supportés ?**
R : Chrome (recommandé), Firefox, Safari, Edge. Versions récentes uniquement.

**Q : Puis-je utiliser l'application sur mobile ?**
R : Oui, le site est responsive. Une application mobile native est prévue prochainement.

**Q : Le site est-il sécurisé ?**
R : Oui :
- Connexion HTTPS chiffrée
- Authentification JWT
- Données chiffrées en base
- Backups quotidiens
- Conformité RGPD

**Q : Mes données sont-elles sauvegardées ?**
R : Oui, backup automatique quotidien + backup hebdomadaire. Conservation de 30 jours.

---

## 🔧 Résolution des Problèmes

### ❌ Problèmes de Connexion

#### Problème : "Email ou mot de passe incorrect"

**Solutions :**
1. Vérifiez que Caps Lock n'est pas activé
2. Vérifiez l'orthographe de votre email
3. Utilisez "Mot de passe oublié ?" si nécessaire
4. Contactez l'administrateur

---

#### Problème : "Compte temporairement bloqué"

**Solution :**
Attendez 15 minutes ou contactez l'administrateur pour débloquer immédiatement.

---

#### Problème : La page ne charge pas

**Solutions :**
1. Rafraîchissez la page (F5 ou Ctrl+R)
2. Videz le cache du navigateur (Ctrl+Shift+Delete)
3. Essayez un autre navigateur
4. Vérifiez votre connexion internet

---

### 📱 Problèmes d'Affichage

#### Problème : L'interface est mal affichée

**Solutions :**
1. Zoom du navigateur à 100% (Ctrl+0)
2. Mettez à jour votre navigateur
3. Désactivez les extensions de navigateur
4. Essayez le mode navigation privée

---

#### Problème : Les images ne s'affichent pas

**Solutions :**
1. Vérifiez votre connexion internet
2. Rafraîchissez la page
3. Videz le cache du navigateur
4. Vérifiez que les images ne sont pas bloquées

---

### 📄 Problèmes de Documents

#### Problème : "Échec de l'upload"

**Solutions :**
1. Vérifiez la taille du fichier (max 10 MB)
2. Vérifiez le format (PDF, Word, Excel, Image)
3. Renommez le fichier (évitez les caractères spéciaux)
4. Essayez avec un autre fichier
5. Vérifiez votre connexion internet

---

#### Problème : Le document ne se télécharge pas

**Solutions :**
1. Clic droit → "Enregistrer sous"
2. Vérifiez que les pop-ups ne sont pas bloquées
3. Vérifiez l'espace disque disponible
4. Essayez un autre navigateur

---

### 💬 Problèmes de Messagerie

#### Problème : Les messages n'arrivent pas en temps réel

**Solutions :**
1. Rafraîchissez la page
2. Vérifiez votre connexion internet
3. Videz le cache du navigateur
4. Reconnectez-vous

---

#### Problème : "Impossible d'envoyer le message"

**Solutions :**
1. Vérifiez que le message n'est pas vide
2. Vérifiez votre connexion internet
3. Attendez quelques secondes et réessayez
4. Si les pièces jointes sont trop lourdes, réduisez la taille

---

### 🔔 Problèmes de Notifications

#### Problème : Je ne reçois pas de notifications

**Solutions :**
1. Vérifiez les paramètres de notification (Profil → Paramètres → Notifications)
2. Autorisez les notifications du navigateur
3. Vérifiez que le son n'est pas coupé
4. Reconnectez-vous

---

### 🆘 Contacter le Support

Si aucune solution ne fonctionne :

**📧 Email :** support@genevawealth.ch
**☎️ Téléphone :** +41 22 XXX XX XX
**💬 Chat :** Utilisez la messagerie interne pour contacter l'administrateur

**Informations à fournir :**
- Votre nom et email
- Description du problème
- Captures d'écran si possible
- Navigateur et système d'exploitation
- Actions effectuées avant le problème

---

## 📖 Glossaire

### Termes Techniques

**API (Application Programming Interface)**
Interface permettant à différents logiciels de communiquer entre eux.

**Backend**
Partie serveur de l'application, invisible pour l'utilisateur, qui gère la logique et la base de données.

**Frontend**
Partie visible de l'application, l'interface utilisateur.

**Dashboard**
Tableau de bord affichant les informations importantes.

**JWT (JSON Web Token)**
Système d'authentification sécurisé utilisé pour les connexions.

**MongoDB**
Base de données utilisée pour stocker toutes les informations.

**Node.js**
Technologie utilisée pour le backend.

**React**
Bibliothèque JavaScript utilisée pour créer l'interface utilisateur.

**Socket.io**
Technologie permettant la communication en temps réel (chat, notifications).

**Responsive**
Interface qui s'adapte à tous les appareils (PC, tablette, mobile).

---

### Termes Métier

**Structuration Patrimoniale**
Organisation optimale de votre patrimoine (immobilier, financier, professionnel).

**Optimisation Fiscale**
Réduction légale de la charge fiscale grâce à des stratégies adaptées.

**Domiciliation**
Service permettant d'avoir une adresse commerciale prestigieuse pour votre entreprise.

**Offshore**
Société créée hors de Suisse, souvent pour optimiser la fiscalité.

**Onshore (Inshore)**
Société créée en Suisse.

**SCI (Société Civile Immobilière)**
Structure juridique pour gérer un patrimoine immobilier.

**SCCV (Société Civile de Construction-Vente)**
Structure pour les opérations de promotion immobilière.

**Holding**
Société détenant des participations dans d'autres sociétés.

**Family Office**
Service de gestion globale du patrimoine familial.

---

### Termes de l'Application

**Milestone (Jalon)**
Étape clé importante dans un projet.

**Task (Tâche)**
Action à réaliser dans un projet.

**Inbox**
Boîte de réception des messages privés.

**Upload**
Téléverser, envoyer un fichier vers le serveur.

**Download**
Télécharger un fichier depuis le serveur.

**Notification**
Alerte vous informant d'un événement.

**Statut**
État actuel (En attente, En cours, Terminé, etc.).

**Priorité**
Niveau d'importance (Faible, Moyen, Élevé).

**Assigné**
Personne responsable d'une tâche.

**Deadline (Échéance)**
Date limite pour terminer une tâche ou un projet.

---

## 🎓 Bonnes Pratiques

### ✅ Pour Tous les Utilisateurs

1. **Changez votre mot de passe régulièrement**
   - Au moins tous les 3 mois
   - Utilisez un mot de passe fort (12+ caractères, majuscules, minuscules, chiffres, symboles)

2. **Déconnectez-vous sur ordinateur partagé**
   - Toujours se déconnecter après utilisation
   - Ne pas cocher "Se souvenir de moi" sur ordinateur public

3. **Vérifiez vos notifications quotidiennement**
   - Consultez le matin
   - Répondez rapidement aux messages urgents

4. **Mettez à jour votre profil**
   - Photo professionnelle
   - Informations de contact à jour

5. **Organisez vos documents**
   - Nommez clairement vos fichiers
   - Ajoutez des descriptions

---

### ✅ Pour les Membres de l'Équipe

1. **Mettez à jour vos tâches régulièrement**
   - Changez le statut dès progression
   - Ajoutez des commentaires sur l'avancement

2. **Communiquez proactivement**
   - Signalez les problèmes rapidement
   - Demandez de l'aide si nécessaire

3. **Respectez les échéances**
   - Planifiez votre travail
   - Alertez si une échéance est impossible à tenir

4. **Documentez votre travail**
   - Ajoutez des notes sur les tâches
   - Uploadez les documents importants

---

### ✅ Pour les Administrateurs

1. **Faites des sauvegardes régulières**
   - Exportez les données importantes
   - Vérifiez les backups automatiques

2. **Gérez les accès**
   - Désactivez les comptes d'anciens employés
   - Vérifiez régulièrement les permissions

3. **Suivez les métriques**
   - Consultez les rapports hebdomadaires
   - Identifiez les goulots d'étranglement

4. **Formez les nouveaux utilisateurs**
   - Organisez des sessions d'onboarding
   - Partagez ce guide

5. **Maintenez la plateforme**
   - Vérifiez les erreurs dans les logs
   - Appliquez les mises à jour

---

## 📞 Support et Assistance

### 🆘 Comment Obtenir de l'Aide

#### 1️⃣ Documentation
Consultez ce guide en premier lieu.

#### 2️⃣ Messagerie Interne
Contactez l'administrateur via la messagerie.

#### 3️⃣ Email
support@genevawealth.ch

#### 4️⃣ Téléphone
+41 22 XXX XX XX (Lun-Ven, 9h-18h)

---

### 📧 Informations à Fournir

Pour une résolution rapide, mentionnez :
- **Nom et email**
- **Rôle** (Admin, Member, Partner, Client)
- **Description du problème**
- **Captures d'écran** (si applicable)
- **Navigateur et OS** (ex: Chrome sur Windows 11)
- **Étapes pour reproduire le problème**

---

## 🚀 Prochaines Fonctionnalités

Fonctionnalités en développement :

### 📱 Application Mobile Native
- iOS et Android
- Notifications push
- Mode hors-ligne

### 📊 Rapports Avancés
- Tableaux de bord personnalisables
- Export automatique
- Analyses prédictives

### 🤖 Intelligence Artificielle
- Suggestions de tâches
- Détection d'anomalies
- Résumés automatiques

### 🔗 Intégrations
- Calendrier (Google, Outlook)
- Cloud storage (Dropbox, Google Drive)
- Outils comptables

### 🎥 Visioconférence
- Appels vidéo intégrés
- Partage d'écran
- Enregistrement de réunions

---

## 📅 Mises à Jour

**Version actuelle : 2.0**
**Dernière mise à jour : Décembre 2024**

### Historique des Versions

**v2.0 (Décembre 2024)**
- Ajout du tableau de bord Patrimoine
- Support multilingue (FR, EN, DE, IT)
- Amélioration des performances
- Nouveau design moderne

**v1.5 (Octobre 2024)**
- Système de notifications en temps réel
- Chat amélioré avec pièces jointes
- Gestion des rendez-vous

**v1.0 (Août 2024)**
- Version initiale
- Gestion de projets et tâches
- Messagerie basique
- Upload de documents

---

## 📝 Conclusion

Félicitations ! Vous avez maintenant toutes les clés pour utiliser efficacement la plateforme **Geneva Wealth Partners**.

### 🎯 Points Clés à Retenir

1. **Votre rôle détermine vos accès** : Admin, Member, Partner ou Client
2. **La communication est centralisée** : Messages, chat projet, notifications
3. **Tout est sauvegardé** : Aucune perte de données
4. **Support disponible** : N'hésitez pas à demander de l'aide
5. **Plateforme évolutive** : Nouvelles fonctionnalités régulièrement

### 🌟 Conseils Finaux

- **Explorez** : N'ayez pas peur de cliquer et découvrir
- **Pratiquez** : L'utilisation devient naturelle avec le temps
- **Communiquez** : Utilisez les outils de messagerie
- **Organisez-vous** : Gérez vos tâches et documents
- **Restez à jour** : Consultez les notifications régulièrement

---

### 📞 Besoin d'Aide ?

**N'hésitez jamais à contacter le support !**

📧 support@genevawealth.ch
☎️ +41 22 XXX XX XX
💬 Messagerie interne

---

**Geneva Wealth Partners**
*Votre partenaire de confiance en structuration patrimoniale et fiscale*

---

*Document créé le 18 décembre 2024*
*Version 1.0*
*© 2024 Geneva Wealth Partners. Tous droits réservés.*

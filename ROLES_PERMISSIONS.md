# Système de Rôles et Permissions - Wealth Planning

## Vue d'ensemble des rôles

Le système Wealth Planning implémente 5 rôles principaux avec des permissions spécifiques :

---

## 1. Admin (Administrateur)

**Permissions complètes** - Accès total au système

### Fonctionnalités :
- ✅ Gestion complète des projets
- ✅ Gestion des utilisateurs (création, modification, suppression)
- ✅ Gestion des équipes
- ✅ Gestion des factures (création, modification, suppression)
- ✅ Gestion des contrats
- ✅ Accès à tous les messages et communications
- ✅ Vue sur tous les documents
- ✅ Gestion des tâches et milestones
- ✅ Notifications système

### Menu Navigation :
- Tableau de bord
- Projets
- Utilisateurs
- Équipes
- Factures
- Contrats
- Notifications

---

## 2. Client

**Accès limité** - Vue orientée client

### Fonctionnalités :
- ✅ Accès à SES projets uniquement
- ✅ Vue des factures qui lui sont destinées
- ✅ Accès aux tâches liées à ses projets
- ✅ Accès aux milestones de ses projets
- ✅ Vue des fichiers tagés "client"
- ✅ Messages avec Admin et Collaborateur assigné
- ❌ Ne voit PAS les autres membres du projet
- ❌ Ne voit JAMAIS les Partenaires impliqués
- ❌ Ne voit PAS les messages entre Admin/Collaborateur et Partenaires

### Visibilité des membres de projet :
- ✅ Admin (vous)
- ✅ Collaborateur assigné
- ❌ Partenaires (cachés)

### Menu Navigation :
- Tableau de bord
- Mes projets
- Tâches
- Factures
- Documents (tagés client)
- Messages (Admin + Collaborateur)

---

## 3. Partenaire (Partner)

**Accès technique** - Collaborateur externe

### Fonctionnalités :
- ✅ Accès aux projets où il est impliqué
- ✅ Messages avec Admin
- ✅ Messages avec Collaborateur (si impliqué dans le même projet)
- ✅ Accès aux tâches du projet
- ✅ Accès aux Milestones
- ✅ Vue des fichiers tagés "Partenaire"
- ❌ Ne voit JAMAIS les messages entre Admin/Collaborateur et Client
- ❌ Ne voit PAS les factures destinées aux clients
- ❌ Ne voit PAS les clients du projet

### Visibilité :
- ✅ Admin
- ✅ Autres Partenaires du projet
- ✅ Collaborateur (si assigné)
- ❌ Clients (cachés)

### Menu Navigation :
- Tableau de bord
- Mes projets
- Tâches
- Documents (tagés partenaire)
- Messages (Admin + Collaborateur)

---

## 4. Collaborateur (Collaborator)

**Accès étendu** - Bras droit de l'Admin

### Fonctionnalités :
- ✅ Accès à TOUS les projets
- ✅ Accès à TOUTES les tâches
- ✅ Accès à TOUS les Milestones
- ✅ Vue des factures (MODE LECTURE SEULE)
- ✅ Messages avec Clients
- ✅ Messages avec Admin
- ✅ Accès à tous les documents (client + partenaire)
- ❌ Ne peut PAS créer/modifier/supprimer des factures
- ❌ Ne voit PAS les messages entre Partenaires et Admin

### Visibilité des messages :
- ✅ Chat Client/Admin (lecture et écriture)
- ❌ Chat Partenaire/Admin (caché)

### Permissions spéciales :
- Vue complète sauf modification des factures
- Peut assister l'Admin dans la gestion quotidienne
- Point de contact pour les clients
- **Accès en lecture seule aux factures** : peut consulter mais ne peut ni créer, ni modifier, ni supprimer

### Restrictions factures implémentées :
- ❌ Bouton "Créer une facture" masqué dans l'interface
- ❌ Boutons "Modifier" et "Supprimer" masqués dans la liste des factures
- ❌ Menu contextuel affiche "Mode lecture seule" avec message explicatif
- ✅ Bouton "Voir" disponible pour consultation uniquement
- ✅ API backend bloque toute tentative de création/modification/suppression

### Restrictions chat implémentées :
- ❌ Ne voit PAS les conversations où un Partenaire est participant
- ❌ Ne peut PAS créer de conversation incluant un Partenaire
- ✅ Accès complet aux conversations avec Clients et Admin
- ✅ Filtrage automatique côté backend et frontend

### Menu Navigation :
- Tableau de bord
- Projets (tous)
- Tâches
- Factures (lecture seule)
- Documents (tous)
- Messages (Client + Admin)

---

## 5. Member (Membre/Employé)

**Accès basique** - Employé interne

### Fonctionnalités :
- ✅ Vue de son propre tableau de bord
- ✅ Gestion de ses tâches assignées
- ✅ Notifications personnelles
- ❌ Accès limité aux autres sections

### Menu Navigation :
- Tableau de bord
- Mes tâches
- Notifications

---

## Matrice de permissions

| Fonctionnalité | Admin | Client | Partenaire | Collaborateur | Member |
|----------------|-------|--------|------------|---------------|--------|
| Voir tous les projets | ✅ | ❌ | ❌ | ✅ | ❌ |
| Voir ses projets | ✅ | ✅ | ✅ | ✅ | ❌ |
| Gérer les factures | ✅ | ❌ | ❌ | 👁️ | ❌ |
| Voir factures clients | ✅ | ✅ | ❌ | 👁️ | ❌ |
| Tâches du projet | ✅ | ✅ | ✅ | ✅ | ✅ |
| Messages avec Client | ✅ | ✅ | ❌ | ✅ | ❌ |
| Messages avec Partenaire | ✅ | ❌ | ✅ | ❌ | ❌ |
| Documents tagés client | ✅ | ✅ | ❌ | ✅ | ❌ |
| Documents tagés partenaire | ✅ | ❌ | ✅ | ✅ | ❌ |
| Voir Partenaires dans projet | ✅ | ❌ | ✅ | ✅ | ❌ |
| Voir Clients dans projet | ✅ | ✅ | ❌ | ✅ | ❌ |

**Légende :**
- ✅ Accès complet
- 👁️ Lecture seule
- ❌ Pas d'accès

---

## Règles de sécurité importantes

### Isolation des communications :
1. Les messages Client ↔ Admin/Collaborateur sont **isolés** des Partenaires
2. Les messages Partenaire ↔ Admin sont **isolés** des Clients et Collaborateurs
3. Le Collaborateur ne voit **jamais** les échanges Admin ↔ Partenaire

### Visibilité des membres dans les projets :
1. **Client** : Voit uniquement Admin + Collaborateur assigné (Partenaires cachés)
2. **Partenaire** : Voit Admin + autres Partenaires + Collaborateur (Clients cachés)
3. **Collaborateur** : Voit Admin + Clients (Partenaires cachés)
4. **Admin** : Voit tous les membres

### Documents et fichiers :
- Les documents sont **tagés** selon le rôle autorisé à les voir
- Tags disponibles : "client", "partenaire", "interne"
- Système de filtrage automatique selon le rôle connecté

---

## Implémentation technique

### Routes protégées :
Toutes les routes sont protégées par le composant `PrivateRoute` qui vérifie :
1. L'authentification de l'utilisateur
2. Le rôle autorisé pour la route
3. Redirection vers login si non autorisé

### Structure des menus :
Chaque rôle a son propre menu défini dans `utils/data.js` :
- `SIDE_MENU_DATA` - Admin
- `SIDE_MENU_CLIENT_DATA` - Client
- `SIDE_MENU_PARTNER_DATA` - Partenaire
- `SIDE_MENU_COLLABORATOR_DATA` - Collaborateur
- `SIDE_MENU_USER_DATA` - Member

### Composant SideMenu :
Le composant `SideMenu` utilise un switch pour afficher le bon menu selon le rôle :
```javascript
switch(user?.role) {
  case 'admin': setSideMenuData(SIDE_MENU_DATA); break;
  case 'client': setSideMenuData(SIDE_MENU_CLIENT_DATA); break;
  case 'partner': setSideMenuData(SIDE_MENU_PARTNER_DATA); break;
  case 'collaborator': setSideMenuData(SIDE_MENU_COLLABORATOR_DATA); break;
  default: setSideMenuData(SIDE_MENU_USER_DATA);
}
```

---

## À implémenter côté Backend

Pour que ce système fonctionne complètement, le backend doit :

### 1. Filtrage des membres de projet
```javascript
// Exemple de logique backend
if (user.role === 'client') {
  projectMembers = projectMembers.filter(m => 
    m.role === 'admin' || m.role === 'collaborator'
  );
} else if (user.role === 'partner') {
  projectMembers = projectMembers.filter(m => 
    m.role === 'admin' || m.role === 'partner' || m.role === 'collaborator'
  );
}
```

### 2. Filtrage des messages
```javascript
// Messages pour Client : seulement avec Admin et Collaborateur
// Messages pour Partenaire : seulement avec Admin et autres Partenaires
// Messages pour Collaborateur : seulement avec Admin et Clients
```

### 3. Filtrage des documents
```javascript
// Vérifier les tags des documents
if (user.role === 'client') {
  documents = documents.filter(d => d.tags.includes('client'));
} else if (user.role === 'partner') {
  documents = documents.filter(d => d.tags.includes('partenaire'));
}
```

### 4. Protection des factures
```javascript
// Collaborateur : lecture seule
if (user.role === 'collaborator' && req.method !== 'GET') {
  return res.status(403).json({ message: 'Permission refusée' });
}

// Partenaire : aucun accès
if (user.role === 'partner') {
  return res.status(403).json({ message: 'Permission refusée' });
}
```

---

## Notes de développement

- Les routes sont maintenant configurées dans `App.jsx`
- Les menus sont configurés dans `utils/data.js`
- Le composant `SideMenu` gère l'affichage dynamique
- Le composant `PrivateRoute` protège les routes selon les rôles
- **Important** : Implémenter les contrôles côté backend pour garantir la sécurité

---

*Dernière mise à jour : 10 décembre 2025*

# Guide de Dépannage - Wealth Planning

## Problème : "Une erreur s'est produite" après merge

### ✅ Checklist de vérification

#### 1. **Réinstaller les dépendances**

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend/Task-Manager
rm -rf node_modules package-lock.json
npm install
```

#### 2. **Vérifier le fichier `.env`**

Assure-toi que le fichier `backend/.env` contient **TOUTES** ces variables :

```env
# MongoDB
MONGO_URI=mongodb+srv://ondoloic238_db_user:oXfH2YFlqvm0pXrf@clusterwealthplanning.sj0u4ev.mongodb.net/wealth-planning?retryWrites=true&w=majority&appName=ClusterWealthPlanning

# JWT
JWT_SECRET=ton_secret_jwt_ici
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES_DAYS=7

# Email (Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=9c92d7001@smtp-brevo.com
SMTP_PASS=4QcAXVFjBkSP3gtI
EMAIL_FROM="Wealth Planning <edimaevina@gmail.com>"

# URLs
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
PORT=8000

# Sécurité
PASSWORD_RESET_TOKEN_MINUTES=15
EMAIL_VERIFICATION_EXPIRES_HOURS=24
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCK_DURATION_MIN=5
```

⚠️ **Important** : Remplace `JWT_SECRET` par une valeur aléatoire sécurisée (ex: `openssl rand -base64 32`)

#### 3. **Vérifier les logs du backend**

Démarre le backend et regarde les messages :

```bash
cd backend
npm run dev
```

Tu devrais voir :
- ✅ `MongoDB connected to database: wealth-planning`
- ✅ `Server running on port 8000` (ou le port configuré)

Si tu vois des erreurs, copie-les ici.

#### 4. **Vérifier la connexion MongoDB**

Dans mongosh ou MongoDB Compass, connecte-toi et vérifie :

```javascript
use wealth-planning
db.users.countDocuments()
```

Si ça ne fonctionne pas, vérifie que l'URI MongoDB dans `.env` est correcte.

#### 5. **Vérifier les ports**

- **Backend** : Port défini dans `backend/.env` (PORT=8000)
- **Frontend** : Vérifie dans `frontend/Task-Manager/src/utils/apiPaths.js` que `BASE_URL` correspond au port du backend

```javascript
export const BASE_URL = "http://localhost:8000"; // Doit correspondre au PORT du backend
```

#### 6. **Tester la connexion**

1. Démarre le backend : `cd backend && npm run dev`
2. Démarre le frontend : `cd frontend/Task-Manager && npm run dev`
3. Ouvre la console du navigateur (F12)
4. Essaie de te connecter
5. Regarde les erreurs dans :
   - Console du navigateur (onglet Console)
   - Console du backend (terminal)
   - Onglet Network du navigateur (voir la requête qui échoue)

#### 7. **Erreurs courantes**

##### "Cannot find module 'X'"
→ Réinstalle les dépendances (étape 1)

##### "MongoDB connection error"
→ Vérifie `MONGO_URI` dans `.env` et que MongoDB Atlas est accessible

##### "JWT_SECRET is not defined"
→ Ajoute `JWT_SECRET` dans `.env`

##### "Port already in use"
→ Change le `PORT` dans `.env` ou tue le processus qui utilise le port :
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

##### "CORS error"
→ Vérifie que `CLIENT_URL` dans `.env` correspond à l'URL du frontend

#### 8. **Mode debug**

Pour voir plus de détails, ajoute dans `backend/.env` :
```env
NODE_ENV=development
```

Cela affichera les stack traces complètes des erreurs.

### 🔍 Diagnostic avancé

Si le problème persiste, envoie :
1. Les logs complets du backend (console)
2. Les erreurs de la console du navigateur
3. La réponse de l'API (onglet Network → clic sur la requête → onglet Response)

### 📞 Contact

Si rien ne fonctionne, partage :
- Le message d'erreur exact
- Les logs du backend
- La version de Node.js (`node --version`)
- Le système d'exploitation


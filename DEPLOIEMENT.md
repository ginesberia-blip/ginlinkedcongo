# 🚀 GinLinkedCongo — Guide de déploiement complet
**Fondateur : Gines Ishtadeva Beria**

---

## 📁 Structure du projet

```
ginlinkedcongo/
├── frontend/
│   ├── index.html          ← Site web principal
│   └── src/
│       ├── styles/main.css ← Styles complets
│       └── main.js         ← JavaScript frontend
├── backend/
│   ├── server.js           ← Serveur Node.js/Express
│   ├── schema.sql          ← Structure base de données
│   └── routes/
│       ├── auth.js         ← Inscription / Connexion
│       ├── users.js        ← Profils utilisateurs
│       ├── opportunites.js ← Emplois, stages, freelance
│       └── groupes.js      ← Groupes thématiques
├── package.json
├── .env.example            ← Variables d'environnement (modèle)
└── DEPLOIEMENT.md          ← Ce fichier
```

---

## Option A : Déploiement sur Vercel (gratuit, recommandé)

### 1. Prérequis
- Compte GitHub : https://github.com
- Compte Vercel : https://vercel.com (gratuit)
- Compte Neon (PostgreSQL gratuit) : https://neon.tech

### 2. Créer la base de données PostgreSQL (Neon — gratuit)
1. Aller sur https://neon.tech → Créer un compte
2. Créer un nouveau projet → Copier l'URL de connexion
3. Dans l'interface Neon, ouvrir l'éditeur SQL
4. Copier-coller tout le contenu de `backend/schema.sql` → Exécuter

### 3. Mettre le projet sur GitHub
```bash
# Sur votre ordinateur, installer Git si pas encore fait
# Télécharger Git : https://git-scm.com

git init
git add .
git commit -m "Initial commit — GinLinkedCongo par Gines Ishtadeva Beria"

# Créer un repo sur github.com, puis :
git remote add origin https://github.com/VOTRE_USERNAME/ginlinkedcongo.git
git push -u origin main
```

### 4. Déployer sur Vercel
1. Aller sur https://vercel.com → Se connecter avec GitHub
2. Cliquer "Add New Project" → Sélectionner votre repo `ginlinkedcongo`
3. Dans les paramètres :
   - **Framework** : Other
   - **Root Directory** : laisser vide
   - **Build Command** : laisser vide
   - **Output Directory** : laisser vide
4. Ajouter les **Variables d'environnement** (onglet "Environment Variables") :
   ```
   DATABASE_URL = postgresql://... (votre URL Neon)
   JWT_SECRET   = (générer avec: openssl rand -hex 64)
   NODE_ENV     = production
   ```
5. Cliquer **Deploy** → Votre site sera en ligne en 2 minutes !

### 5. Domaine personnalisé (optionnel)
- Acheter un domaine sur https://www.namecheap.com ou https://www.cloudns.net
- Dans Vercel → Settings → Domains → Ajouter votre domaine

---

## Option B : Déploiement sur Render (gratuit)

### 1. Créer un compte sur https://render.com

### 2. Base de données (Render PostgreSQL — gratuit 90 jours)
1. New → PostgreSQL → Remplir le nom → Create
2. Copier l'"Internal Database URL"
3. Dans le Shell de Render, exécuter : `psql $DATABASE_URL < backend/schema.sql`

### 3. Web Service
1. New → Web Service → Connecter votre repo GitHub
2. Paramètres :
   - **Name** : ginlinkedcongo
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
3. Ajouter les variables d'environnement comme Vercel

---

## Option C : Déploiement sur un VPS (DigitalOcean, OVH, etc.)

### 1. Se connecter au serveur
```bash
ssh root@VOTRE_IP_SERVEUR
```

### 2. Installer Node.js et PostgreSQL
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs postgresql postgresql-contrib

# Démarrer PostgreSQL
systemctl start postgresql
systemctl enable postgresql
```

### 3. Créer la base de données
```bash
sudo -u postgres psql
CREATE DATABASE ginlinkedcongo;
CREATE USER glc_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE ginlinkedcongo TO glc_user;
\q

# Importer le schéma
psql -U glc_user -d ginlinkedcongo -f /chemin/backend/schema.sql
```

### 4. Déployer l'application
```bash
git clone https://github.com/VOTRE_USERNAME/ginlinkedcongo.git
cd ginlinkedcongo
npm install

# Créer le fichier .env
cp .env.example .env
nano .env  # Remplir les valeurs
```

### 5. Démarrer avec PM2 (gestionnaire de processus)
```bash
npm install -g pm2
pm2 start backend/server.js --name ginlinkedcongo
pm2 save
pm2 startup
```

### 6. Configurer Nginx (reverse proxy)
```bash
apt install nginx -y
nano /etc/nginx/sites-available/ginlinkedcongo
```

Contenu du fichier Nginx :
```nginx
server {
    listen 80;
    server_name ginlinkedcongo.com www.ginlinkedcongo.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/ginlinkedcongo /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 7. HTTPS avec Let's Encrypt (gratuit)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d ginlinkedcongo.com -d www.ginlinkedcongo.com
```

---

## 🔧 Développement local

```bash
# 1. Cloner le projet
git clone https://github.com/VOTRE_USERNAME/ginlinkedcongo.git
cd ginlinkedcongo

# 2. Installer les dépendances
npm install

# 3. Copier et remplir les variables d'environnement
cp .env.example .env

# 4. Créer la base de données locale
createdb ginlinkedcongo
psql ginlinkedcongo -f backend/schema.sql

# 5. Démarrer en mode développement
npm run dev

# Le site sera accessible sur http://localhost:3000
```

---

## 📱 Application Mobile (React Native — étape suivante)

Pour créer l'app mobile Android & iOS :
```bash
npx create-expo-app GinLinkedCongoMobile
cd GinLinkedCongoMobile
# Développer les écrans mobiles
# Publier sur Google Play Store et Apple App Store
```

---

## 📞 Support

Pour toute question sur le déploiement, contacter :
**Gines Ishtadeva Beria** — Fondateur de GinLinkedCongo
Email : contact@ginlinkedcongo.com

---

*© 2025 GinLinkedCongo — Fondé et dirigé par Gines Ishtadeva Beria*
*Congo-Brazzaville · Afrique · Diaspora*

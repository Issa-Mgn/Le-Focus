# 📰 Le Focus - Frontend

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

Site web moderne de presse et d'actualités basé à Porto-Novo, Bénin. Interface responsive et performante avec React + Vite.

## 🌐 Démo

- **Site en ligne** : [https://lefocusinfos.netlify.app](https://lefocusinfos.netlify.app)
- **Backend API** : [https://le-focus-backend.onrender.com](https://le-focus-backend.onrender.com)

## ✨ Fonctionnalités

### 🎨 Interface Publique
- ✅ Page d'accueil avec articles en vedette
- ✅ Navigation par 15 catégories (Politique, Économie, Société, etc.)
- ✅ Recherche d'articles en temps réel
- ✅ Page de détail avec galerie d'images et lecteur audio
- ✅ Système de marque-pages (favoris)
- ✅ Partage social natif (WhatsApp, Facebook, etc.)
- ✅ Téléchargement PDF des articles
- ✅ Section commentaires
- ✅ Formulaire de contact (WhatsApp)
- ✅ Commande d'insertions publicitaires

### 🔐 Dashboard Administrateur
- ✅ Authentification sécurisée (JWT)
- ✅ Gestion complète des articles (CRUD)
- ✅ Éditeur d'articles avec upload d'images/PDF
- ✅ Statistiques et analytics
- ✅ Graphiques de performance
- ✅ Partage direct depuis le dashboard

## 🛠️ Technologies

### Core
- **React 19.2.0** - Bibliothèque UI
- **Vite 7.2.4** - Build tool ultra-rapide
- **React Router 7.9.6** - Routing
- **Tailwind CSS 3.4.1** - Framework CSS utility-first

### UI & Animations
- **Framer Motion 12.23.24** - Animations fluides
- **Lucide React 0.555.0** - Icônes modernes
- **Recharts 3.5.1** - Graphiques interactifs

### Utilitaires
- **React Helmet Async 2.0.5** - Meta tags dynamiques
- **clsx & tailwind-merge** - Gestion des classes CSS

## 📦 Installation

### Prérequis
- Node.js >= 18.x
- npm ou yarn

### Étapes

```bash
# Cloner le repository
git clone https://github.com/Issa-Mgn/Le-Focus.git
cd Le-Focus/focus

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Preview du build
npm run preview
```

## 🌍 Variables d'environnement

Aucune variable d'environnement n'est requise pour le frontend. L'URL de l'API est configurée dans `src/services/api.js`.

## 📁 Structure du projet

```
focus/
├── public/              # Fichiers statiques
│   ├── logo.jpg
│   └── _redirects      # Redirects Netlify
├── src/
│   ├── assets/         # Images et ressources
│   ├── components/     # Composants réutilisables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ArticleCard.jsx
│   │   ├── Loader.jsx
│   │   └── ...
│   ├── pages/          # Pages de l'application
│   │   ├── Home.jsx
│   │   ├── ArticleDetail.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ...
│   ├── context/        # React Context (Auth)
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   │   └── api.js
│   ├── data/           # Données mockées
│   ├── layouts/        # Layouts (Main, Admin)
│   ├── App.jsx         # Composant principal
│   └── main.jsx        # Point d'entrée
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🎨 Configuration Tailwind

Le projet utilise une palette de couleurs personnalisée :

```javascript
primary: {
  500: '#E60000', // Rouge principal
  600: '#CC0000', // Rouge hover
  // ...
}
```

## 🚀 Déploiement

### Netlify (Recommandé)

1. Push sur GitHub
2. Connecter le repo à Netlify
3. Configuration automatique détectée
4. Déploiement continu activé

### Build Command
```bash
npm run build
```

### Publish Directory
```
dist
```

## 📱 Fonctionnalités Mobiles

- ✅ Design 100% responsive
- ✅ Menu hamburger optimisé
- ✅ Partage natif (Web Share API)
- ✅ Images optimisées
- ✅ Performance excellente (Lighthouse 90+)

## 🔧 Scripts NPM

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Preview du build
npm run lint     # Linter ESLint
```

## 🎯 Optimisations

- ⚡ Code splitting automatique
- 🖼️ Lazy loading des images
- 📦 Cache localStorage pour les articles
- 🚀 Bundle optimisé < 500KB
- 🎨 CSS purge en production

## 📞 Contact

**Wabi MIGAN** - Directeur Général  
- 📱 MTN : +229 01 96 76 87 17
- 📱 CELTIIS : +229 01 40 49 60 90
- 📧 Email : miganwabi@gmail.com
- 📍 Adresse : Adjna Nord, Porto-Novo, Bénin

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

Développé avec ❤️ par [L!txx Company](https://litxxcompany.netlify.app/)

---

© 2026 Le Focus. Tous droits réservés.

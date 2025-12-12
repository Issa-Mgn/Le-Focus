
# Prompt pour le Développement Backend (Node.js)

**Rôle :** Tu es un expert en développement backend avec Node.js, Express, et l'intégration de services tiers (Supabase, ImageKit, Cloudinary).

**Contexte :**
Je développe un site d'actualités appelé "Le Focus" (frontend en React déjà existant). Je souhaite créer une API RESTful robuste pour gérer le contenu du site.

**Stack Technique Requise :**
- **Runtime :** Node.js
- **Framework :** Express.js
- **Base de données :** Supabase (PostgreSQL)
- **Gestion Images :** ImageKit (upload et optimisation)
- **Gestion PDF :** Cloudinary (stockage des journaux PDF)
- **Hébergement prévu :** Render

**Fonctionnalités & Endpoints Requis :**

### 1. Gestion des Articles
L'API doit permettre de créer, lire, mettre à jour et supprimer des articles.
- **Entité Article** :
  - `id` (UUID)
  - `title` (String)
  - `slug` (String, unique)
  - `excerpt` (Text)
  - `content` (Rich Text / HTML)
  - `category` (String: "Politique", "Économie", "Société", etc.)
  - `author` (String)
  - `cover_image_url` (String - URL ImageKit)
  - `gallery_image_urls` (Array of Strings - URLs ImageKit)
  - `pdf_url` (String - URL Cloudinary, optionnel)
  - `views` (Integer, default 0)
  - `is_featured` (Boolean)
  - `created_at` / `updated_at`

- **Endpoints** :
  - `GET /api/articles` (Support pagination & filtres par catégorie)
  - `GET /api/articles/:id` (Incrémente le compteur de vues)
  - `POST /api/articles` (Upload images vers ImageKit et PDF vers Cloudinary, puis save DB)
  - `PUT /api/articles/:id`
  - `DELETE /api/articles/:id`

### 2. Gestion des Commandes d'Insertion (Publicité/Abonnement)
- **Entité Order** :
  - `id` (UUID)
  - `type` (Enum: 'insertion', 'abonnement', 'publi_reportage', 'publi_redaction')
  - `client_info` (JSON: name, company, email, phone)
  - `details` (JSON: zone, format, duration, quantities...)
  - `total_price` (Number)
  - `status` (Enum: 'pending', 'confirmed', 'paid')
  - `created_at`

- **Endpoints** :
  - `POST /api/orders` (Création d'une nouvelle demande)
  - `GET /api/orders` (Pour le dashboard admin)
  - `PATCH /api/orders/:id/status` (Mise à jour du statut)

### 3. Gestion des Uploads (Services)
- Utiliser le SDK `imagekit` pour uploader les images (cover + gallerie) et récupérer les URLs optimisées.
- Utiliser le SDK `cloudinary` pour uploader les fichiers PDF lourds.
- L'API doit gérer le multipart/form-data (via `multer`).

**Instructions pour la génération de code :**
1. Fournis la structure du projet (MVC ou Clean Architecture).
2. Fournis le code de configuration pour Supabase, ImageKit et Cloudinary (`config/`).
3. Crée les migrations/schémas SQL pour Supabase.
4. Écris les contrôleurs et les routes pour les Articles et les Commandes.
5. Inclus un fichier `.env.example` avec les clés nécessaires.

**Sécurité :**
- Prévoir une authentification basique (ou JWT) pour les routes d'administration (votre choix, propose la meilleure solution simple).
- Validation des données entrantes (Zod ou Joi).

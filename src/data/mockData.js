// Article Management with localStorage
const STORAGE_KEY = 'le_focus_articles';

// Initialize with mock data if empty
const initializeArticles = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        const initialArticles = [
            {
                id: 1,
                title: "L'Impact de l'Intelligence Artificielle sur l'Économie Moderne",
                excerpt: "Une analyse approfondie de la façon dont l'IA transforme les secteurs financiers et industriels.",
                content: "L'intelligence artificielle (IA) n'est plus un concept futuriste. Elle est devenue une réalité qui transforme profondément notre économie. Des secteurs entiers sont bouleversés par cette révolution technologique qui promet d'augmenter la productivité tout en soulevant des questions éthiques importantes.",
                author: "Jean Dupont",
                date: "2023-11-28",
                category: "Technologie",
                images: [
                    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
                ],
                views: getRandomViews(),
                downloads: 340,
                publishedAt: new Date('2023-11-28').getTime()
            },
            {
                id: 2,
                title: "Les Défis du Développement Durable en Afrique",
                excerpt: "Exploration des initiatives vertes et des obstacles à surmonter pour un avenir durable.",
                content: "Le continent africain est à la croisée des chemins en matière de développement durable.",
                author: "Marie Claire",
                date: "2023-11-25",
                category: "Environnement",
                images: [
                    "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800"
                ],
                views: getRandomViews(),
                downloads: 210,
                publishedAt: new Date('2023-11-25').getTime()
            },
            {
                id: 3,
                title: "La Révolution de la Finance Décentralisée",
                excerpt: "Comment la DeFi redéfinit les échanges monétaires mondiaux.",
                content: "La finance décentralisée offre de nouvelles opportunités...",
                author: "Paul Martin",
                date: "2023-11-20",
                category: "Finance",
                images: [
                    "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800"
                ],
                views: getRandomViews(),
                downloads: 450,
                publishedAt: new Date('2023-11-20').getTime()
            },
            {
                id: 4,
                title: "L'Art de la Négociation en Affaires",
                excerpt: "Techniques et stratégies pour réussir vos négociations commerciales.",
                content: "La négociation est un art qui s'apprend...",
                author: "Sophie Bernard",
                date: "2023-11-15",
                category: "Business",
                images: [
                    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800"
                ],
                views: getRandomViews(),
                downloads: 120,
                publishedAt: new Date('2023-11-15').getTime()
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialArticles));
        return initialArticles;
    }
    return JSON.parse(stored);
};

// Get all articles
export const getArticles = () => {
    return initializeArticles();
};

// Get article by ID
export const getArticleById = (id) => {
    const articles = getArticles();
    return articles.find(article => article.id === parseInt(id));
};

// Helper to generate random views
const getRandomViews = () => Math.floor(Math.random() * (5000 - 100 + 1)) + 100;

// Add new article
export const addArticle = (articleData) => {
    const articles = getArticles();
    const newArticle = {
        ...articleData,
        id: Date.now(),
        publishedAt: Date.now(),
        views: getRandomViews(), // Random views between 100 and 5000
        downloads: 0
    };
    articles.unshift(newArticle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    return newArticle;
};

// Update article
export const updateArticle = (id, articleData) => {
    const articles = getArticles();
    const index = articles.findIndex(article => article.id === parseInt(id));
    if (index !== -1) {
        articles[index] = { ...articles[index], ...articleData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
        return articles[index];
    }
    return null;
};

// Delete article
export const deleteArticle = (id) => {
    const articles = getArticles();
    const filtered = articles.filter(article => article.id !== parseInt(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
};

// Get articles by category
export const getArticlesByCategory = (category) => {
    const articles = getArticles();
    return articles.filter(article =>
        article.category.toLowerCase() === category.toLowerCase()
    );
};

// Search articles
export const searchArticles = (query) => {
    const articles = getArticles();
    const lowerQuery = query.toLowerCase();
    return articles.filter(article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery) ||
        article.category.toLowerCase().includes(lowerQuery)
    );
};

// Get stats
export const getStats = () => {
    const articles = getArticles();
    return {
        totalViews: articles.reduce((sum, article) => sum + article.views, 0),
        totalDownloads: articles.reduce((sum, article) => sum + article.downloads, 0),
        activeArticles: articles.length,
        monthlyGrowth: 12.5
    };
};

export const categories = [
    "Politique",
    "Économie",
    "Société",
    "Culture",
    "Technologie",
    "Sport",
    "Environnement",
    "Finance",
    "Business",
    "Santé",
    "Éducation",
    "International",
    "Sciences",
    "Art de vivre",
    "Opinions"
];

// Admin credentials
export const ADMIN_PASSWORD = "admin123";

/**
 * Configuration centralisée pour les optimisations de performance
 * Modifier ces valeurs pour ajuster les performances selon vos besoins
 */

export const PERFORMANCE_CONFIG = {
    // Configuration du cache
    cache: {
        // Durée de vie du cache en millisecondes (15 minutes par défaut)
        duration: 15 * 60 * 1000,

        // Clé du cache dans localStorage
        key: 'focus_articles_cache',

        // Activer/désactiver le cache
        enabled: true,
    },

    // Configuration des images
    images: {
        // Optimisation pour les listes d'articles
        list: {
            width: 1200,      // Largeur maximale en pixels
            quality: 85,      // Qualité de compression (0-100)
            format: 'auto',   // Format (auto, webp, jpg, png)
        },

        // Optimisation pour les détails d'articles
        detail: {
            width: 1600,
            quality: 90,
            format: 'auto',
        },

        // Optimisation pour les miniatures
        thumbnail: {
            width: 400,
            quality: 75,
            format: 'auto',
        },

        // Lazy loading
        lazyLoading: true,

        // Décodage asynchrone
        asyncDecoding: true,
    },

    // Configuration du préchargement
    preload: {
        // Nombre d'images à précharger avant/après l'image actuelle
        adjacentImages: 1,

        // Précharger les images au survol
        onHover: false,

        // Précharger les images critiques (above the fold)
        criticalImages: true,
    },

    // Configuration de la performance
    performance: {
        // Activer le monitoring des performances
        monitoring: process.env.NODE_ENV === 'development',

        // Afficher le widget de debug
        debugWidget: process.env.NODE_ENV === 'development',

        // Logger les métriques dans la console
        consoleLogging: process.env.NODE_ENV === 'development',

        // Intervalle de mise à jour du monitoring (ms)
        updateInterval: 2000,
    },

    // Configuration des animations
    animations: {
        // Durée des transitions d'images (ms)
        imageTransition: 500,

        // Durée du carrousel automatique (ms)
        carouselInterval: 5000,

        // Réduire les animations sur connexion lente
        reducedMotion: false,
    },

    // Configuration réseau
    network: {
        // Timeout pour les requêtes API (ms)
        timeout: 10000,

        // Nombre de tentatives en cas d'échec
        retries: 3,

        // Délai entre les tentatives (ms)
        retryDelay: 1000,
    },
};

/**
 * Obtenir la configuration optimale selon la connexion
 */
export const getOptimalConfig = () => {
    // Détecter la qualité de connexion si disponible
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            const effectiveType = connection.effectiveType;

            // Connexion lente (2G, slow-3G)
            if (effectiveType === '2g' || effectiveType === 'slow-2g') {
                return {
                    ...PERFORMANCE_CONFIG,
                    images: {
                        ...PERFORMANCE_CONFIG.images,
                        list: { width: 800, quality: 70, format: 'auto' },
                        detail: { width: 1200, quality: 75, format: 'auto' },
                    },
                    animations: {
                        ...PERFORMANCE_CONFIG.animations,
                        reducedMotion: true,
                    },
                };
            }

            // Connexion moyenne (3G)
            if (effectiveType === '3g') {
                return {
                    ...PERFORMANCE_CONFIG,
                    images: {
                        ...PERFORMANCE_CONFIG.images,
                        list: { width: 1000, quality: 80, format: 'auto' },
                        detail: { width: 1400, quality: 85, format: 'auto' },
                    },
                };
            }
        }
    }

    // Connexion rapide ou inconnue - configuration par défaut
    return PERFORMANCE_CONFIG;
};

/**
 * Vérifier si le mode économie de données est activé
 */
export const isDataSaverEnabled = () => {
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return connection?.saveData === true;
    }
    return false;
};

/**
 * Obtenir la configuration adaptée au mode économie de données
 */
export const getDataSaverConfig = () => {
    if (isDataSaverEnabled()) {
        return {
            ...PERFORMANCE_CONFIG,
            images: {
                ...PERFORMANCE_CONFIG.images,
                list: { width: 600, quality: 60, format: 'auto' },
                detail: { width: 1000, quality: 70, format: 'auto' },
            },
            preload: {
                ...PERFORMANCE_CONFIG.preload,
                adjacentImages: 0,
                onHover: false,
                criticalImages: false,
            },
            animations: {
                ...PERFORMANCE_CONFIG.animations,
                reducedMotion: true,
                carouselInterval: 8000,
            },
        };
    }

    return getOptimalConfig();
};

export default PERFORMANCE_CONFIG;

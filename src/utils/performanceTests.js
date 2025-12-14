/**
 * Tests de performance pour vérifier que les optimisations fonctionnent
 * Exécuter dans la console du navigateur
 */

// Test 1: Vérifier le cache localStorage
export const testCache = () => {
    console.group('🧪 Test 1: Cache localStorage');

    const cache = localStorage.getItem('focus_articles_cache');

    if (cache) {
        const { timestamp, data } = JSON.parse(cache);
        const age = Date.now() - timestamp;
        const ageMinutes = Math.round(age / 60000);

        console.log('✅ Cache trouvé');
        console.log(`📅 Âge du cache: ${ageMinutes} minutes`);
        console.log(`📦 Nombre d'articles: ${data?.length || 0}`);
        console.log(`⏰ Expire dans: ${15 - ageMinutes} minutes`);
    } else {
        console.log('❌ Aucun cache trouvé');
    }

    console.groupEnd();
};

// Test 2: Vérifier le lazy loading des images
export const testLazyLoading = () => {
    console.group('🧪 Test 2: Lazy Loading');

    const images = document.querySelectorAll('img');
    let lazyCount = 0;
    let asyncCount = 0;

    images.forEach(img => {
        if (img.loading === 'lazy') lazyCount++;
        if (img.decoding === 'async') asyncCount++;
    });

    console.log(`📊 Total d'images: ${images.length}`);
    console.log(`✅ Images avec lazy loading: ${lazyCount} (${Math.round(lazyCount / images.length * 100)}%)`);
    console.log(`✅ Images avec async decoding: ${asyncCount} (${Math.round(asyncCount / images.length * 100)}%)`);

    if (lazyCount === images.length) {
        console.log('🎉 Toutes les images utilisent le lazy loading!');
    } else {
        console.warn(`⚠️ ${images.length - lazyCount} images n'utilisent pas le lazy loading`);
    }

    console.groupEnd();
};

// Test 3: Mesurer les performances de chargement
export const testLoadPerformance = () => {
    console.group('🧪 Test 3: Performance de chargement');

    if (window.performance && window.performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');

        console.log(`⏱️ DOM Content Loaded: ${Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)}ms`);
        console.log(`⏱️ Page Load Complete: ${Math.round(navigation.loadEventEnd - navigation.loadEventStart)}ms`);
        console.log(`📦 Total Resources: ${resources.length}`);

        const images = resources.filter(r => r.initiatorType === 'img');
        const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);

        console.log(`🖼️ Images chargées: ${images.length}`);
        console.log(`💾 Taille totale: ${Math.round(totalSize / 1024)}KB`);

        // Évaluation
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        if (loadTime < 2000) {
            console.log('🎉 Excellent! Temps de chargement < 2s');
        } else if (loadTime < 3000) {
            console.log('✅ Bon! Temps de chargement < 3s');
        } else {
            console.warn('⚠️ Peut être amélioré. Temps de chargement > 3s');
        }
    }

    console.groupEnd();
};

// Test 4: Vérifier l'optimisation des URLs d'images
export const testImageOptimization = () => {
    console.group('🧪 Test 4: Optimisation des URLs');

    const images = document.querySelectorAll('img');
    let optimizedCount = 0;

    images.forEach(img => {
        const src = img.src;
        // Vérifier si l'URL contient des paramètres d'optimisation
        if (src.includes('w=') || src.includes('q=') || src.includes('fm=')) {
            optimizedCount++;
        }
    });

    console.log(`📊 Total d'images: ${images.length}`);
    console.log(`✅ Images optimisées: ${optimizedCount} (${Math.round(optimizedCount / images.length * 100)}%)`);

    if (optimizedCount > 0) {
        console.log('🎉 Les URLs d\'images sont optimisées!');
    } else {
        console.warn('⚠️ Aucune optimisation d\'URL détectée');
    }

    console.groupEnd();
};

// Test 5: Vérifier la connexion réseau
export const testNetworkConnection = () => {
    console.group('🧪 Test 5: Connexion réseau');

    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            console.log(`📡 Type de connexion: ${connection.effectiveType}`);
            console.log(`⬇️ Downlink: ${connection.downlink} Mbps`);
            console.log(`⏱️ RTT: ${connection.rtt}ms`);
            console.log(`💾 Mode économie: ${connection.saveData ? 'Activé' : 'Désactivé'}`);

            // Recommandations
            if (connection.effectiveType === '4g') {
                console.log('🎉 Excellente connexion! Toutes les optimisations peuvent être utilisées.');
            } else if (connection.effectiveType === '3g') {
                console.log('✅ Bonne connexion. Optimisations moyennes recommandées.');
            } else {
                console.warn('⚠️ Connexion lente. Optimisations agressives recommandées.');
            }
        }
    } else {
        console.log('ℹ️ API Network Information non disponible');
    }

    console.groupEnd();
};

// Test 6: Vérifier le préchargement
export const testPreloading = () => {
    console.group('🧪 Test 6: Préchargement');

    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');

    console.log(`⚡ Ressources préchargées (preload): ${preloadLinks.length}`);
    console.log(`🔮 Ressources anticipées (prefetch): ${prefetchLinks.length}`);

    if (preloadLinks.length > 0) {
        console.log('Ressources préchargées:');
        preloadLinks.forEach(link => {
            console.log(`  - ${link.href} (${link.as})`);
        });
    }

    console.groupEnd();
};

// Exécuter tous les tests
export const runAllTests = () => {
    console.clear();
    console.log('%c🚀 Tests de Performance - Le Focus', 'font-size: 20px; font-weight: bold; color: #DC2626;');
    console.log('%c═══════════════════════════════════════', 'color: #DC2626;');
    console.log('');

    testCache();
    console.log('');

    testLazyLoading();
    console.log('');

    testLoadPerformance();
    console.log('');

    testImageOptimization();
    console.log('');

    testNetworkConnection();
    console.log('');

    testPreloading();
    console.log('');

    console.log('%c═══════════════════════════════════════', 'color: #DC2626;');
    console.log('%c✅ Tests terminés!', 'font-size: 16px; font-weight: bold; color: #16A34A;');
    console.log('');
    console.log('💡 Conseil: Exécutez ces tests après chaque modification pour vérifier les performances.');
};

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
    window.performanceTests = {
        testCache,
        testLazyLoading,
        testLoadPerformance,
        testImageOptimization,
        testNetworkConnection,
        testPreloading,
        runAllTests,
    };

    console.log('%c📊 Tests de performance disponibles!', 'font-size: 14px; color: #DC2626; font-weight: bold;');
    console.log('Exécutez: %cwindow.performanceTests.runAllTests()', 'color: #2563EB; font-weight: bold;');
}

export default runAllTests;

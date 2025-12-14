// Hook personnalisé pour surveiller les performances de chargement
import { useEffect, useState } from 'react';

export const usePerformanceMonitor = () => {
    const [metrics, setMetrics] = useState({
        loadTime: 0,
        imageCount: 0,
        cacheHit: false,
        totalSize: 0
    });

    useEffect(() => {
        // Mesurer le temps de chargement de la page
        const loadTime = performance.now();

        // Vérifier si les données viennent du cache
        const cacheHit = localStorage.getItem('focus_articles_cache') !== null;

        // Observer les performances
        if (window.performance && window.performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');

            const images = resources.filter(r => r.initiatorType === 'img');
            const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);

            setMetrics({
                loadTime: Math.round(loadTime),
                imageCount: images.length,
                cacheHit,
                totalSize: Math.round(totalSize / 1024) // En KB
            });
        }

        // Log dans la console pour le développement
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Performance Metrics:', {
                '⏱️ Load Time': `${Math.round(loadTime)}ms`,
                '🖼️ Images Loaded': images?.length || 0,
                '💾 Cache Hit': cacheHit ? '✅ Yes' : '❌ No',
                '📦 Total Size': `${Math.round((totalSize || 0) / 1024)}KB`
            });
        }
    }, []);

    return metrics;
};

// Fonction utilitaire pour afficher les stats de performance
export const logPerformanceStats = () => {
    if (window.performance && window.performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');

        console.group('🚀 Performance Statistics');
        console.log('⏱️ DOM Content Loaded:', Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) + 'ms');
        console.log('🎨 Page Load Complete:', Math.round(navigation.loadEventEnd - navigation.loadEventStart) + 'ms');
        console.log('📦 Total Resources:', resources.length);
        console.log('🖼️ Images:', resources.filter(r => r.initiatorType === 'img').length);
        console.log('📜 Scripts:', resources.filter(r => r.initiatorType === 'script').length);
        console.log('🎨 Stylesheets:', resources.filter(r => r.initiatorType === 'link').length);

        const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
        console.log('💾 Total Transfer Size:', Math.round(totalSize / 1024) + 'KB');
        console.groupEnd();
    }
};

export default usePerformanceMonitor;

import React, { useState, useEffect } from 'react';
import { X, Activity, Image, Database, Clock } from 'lucide-react';

/**
 * Widget de debug pour afficher les métriques de performance en temps réel
 * À utiliser uniquement en développement
 */
const PerformanceDebugWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    imageCount: 0,
    cacheHit: false,
    totalSize: 0,
    domContentLoaded: 0,
    resourceCount: 0
  });

  useEffect(() => {
    // Ne s'affiche qu'en développement
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      if (window.performance && window.performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        const images = resources.filter(r => r.initiatorType === 'img');
        const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
        const cacheHit = localStorage.getItem('focus_articles_cache') !== null;

        setMetrics({
          loadTime: Math.round(performance.now()),
          imageCount: images.length,
          cacheHit,
          totalSize: Math.round(totalSize / 1024),
          domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) : 0,
          resourceCount: resources.length
        });
      }
    };

    // Mettre à jour les métriques au chargement
    updateMetrics();

    // Mettre à jour toutes les 2 secondes
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  // Ne rien afficher en production
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {/* Bouton toggle */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-primary-500 to-primary-500-temp text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Performance Metrics"
      >
        <Activity size={20} />
      </button>

      {/* Widget */}
      {isVisible && (
        <div className="fixed bottom-20 left-4 z-50 bg-neutral-900/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-white/10 min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="text-primary-400" size={18} />
              <h3 className="font-bold text-sm">Performance Metrics</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Metrics */}
          <div className="space-y-3 text-xs">
            {/* Load Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-blue-400" />
                <span className="text-neutral-300">Load Time</span>
              </div>
              <span className="font-mono font-bold text-blue-400">
                {metrics.loadTime}ms
              </span>
            </div>

            {/* DOM Content Loaded */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-green-400" />
                <span className="text-neutral-300">DOM Ready</span>
              </div>
              <span className="font-mono font-bold text-green-400">
                {metrics.domContentLoaded}ms
              </span>
            </div>

            {/* Images */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image size={14} className="text-purple-400" />
                <span className="text-neutral-300">Images</span>
              </div>
              <span className="font-mono font-bold text-purple-400">
                {metrics.imageCount}
              </span>
            </div>

            {/* Resources */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-yellow-400" />
                <span className="text-neutral-300">Resources</span>
              </div>
              <span className="font-mono font-bold text-yellow-400">
                {metrics.resourceCount}
              </span>
            </div>

            {/* Total Size */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-orange-400" />
                <span className="text-neutral-300">Total Size</span>
              </div>
              <span className="font-mono font-bold text-orange-400">
                {metrics.totalSize}KB
              </span>
            </div>

            {/* Cache Status */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-neutral-300">Cache Status</span>
              <span className={`font-bold ${metrics.cacheHit ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.cacheHit ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <p className="text-[10px] text-neutral-500">
              Dev Mode Only • Updates every 2s
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceDebugWidget;

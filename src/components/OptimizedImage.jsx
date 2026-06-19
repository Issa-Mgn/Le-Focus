import React, { useState, useEffect } from 'react';

/**
 * Composant d'image optimisée avec lazy loading et placeholder
 * Améliore les performances de chargement et l'expérience utilisateur
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'blur',
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    // Précharger l'image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      onError?.();
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  // Placeholder pendant le chargement
  if (!isLoaded && !hasError) {
    return (
      <div 
        className={`${className} bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse`}
        style={{ minHeight: '200px' }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Image de fallback en cas d'erreur
  if (hasError) {
    return (
      <div 
        className={`${className} bg-gradient-to-br from-neutral-300 to-neutral-400 flex items-center justify-center`}
      >
        <svg 
          className="w-16 h-16 text-neutral-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default OptimizedImage;

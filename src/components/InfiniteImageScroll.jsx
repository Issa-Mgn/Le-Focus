import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, ImageIcon, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InfiniteImageScroll = ({ article }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());

  if (!article) return null;

  // Préparer la liste des images (Couverture + Galerie)
  const images = article.images && article.images.length > 0 
    ? article.images 
    : (article.image ? [article.image] : ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600']);

  // Précharger les images adjacentes pour une navigation fluide
  useEffect(() => {
    const preloadImage = (index) => {
      if (index >= 0 && index < images.length && !loadedImages.has(index)) {
        const img = new Image();
        img.src = images[index];
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
      }
    };

    // Précharger l'image actuelle et les images adjacentes
    preloadImage(currentIndex);
    preloadImage(currentIndex - 1);
    preloadImage(currentIndex + 1);
  }, [currentIndex, images, loadedImages]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = images.length - 1;
      if (nextIndex >= images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  // Défilement automatique des images
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000); 
    return () => clearInterval(timer);
  }, [currentIndex, images.length]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="bg-neutral-900 pb-8">
      <div className="container-custom py-6">
         <h2 className="text-xl md:text-2xl font-serif font-bold text-white flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-primary-400">Dernier Article :</span> 
            <span className="truncate">{article.title}</span>
         </h2>
      </div>

      <div className="relative w-full h-[450px] overflow-hidden group cursor-grab active:cursor-grabbing">
        
        {/* Carrousel d'images */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Image de fond avec lazy loading */}
            <div className="absolute inset-0">
              <img 
                src={images[currentIndex]} 
                alt={`${article.title} - Image ${currentIndex + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 to-transparent"></div>
            </div>

            {/* Contenu superposé (qui bouge avec le slide) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="container-custom w-full px-4 md:px-8">
                    <div className="max-w-4xl mx-auto text-center md:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/90 text-white text-xs font-bold uppercase tracking-wider mb-6 drop-shadow-md backdrop-blur-md border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                            {article.category || 'A la Une'}
                        </div>

                        {/* Titre */}
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-lg">
                            {article.title}
                        </h2>

                        {/* Résumé */}
                        <p className="text-neutral-200 text-base md:text-lg mb-6 line-clamp-2 max-w-2xl drop-shadow-md">
                            {article.excerpt}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-6 text-white/90">
                            <Link to={`/article/${article.id}`}>
                                <button className="flex items-center gap-2 bg-white text-neutral-950 px-8 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors shadow-lg hover:shadow-white/20 active:scale-95 transform whitespace-nowrap">
                                    Lire l'article
                                    <ArrowUpRight size={18} />
                                </button>
                            </Link>

                            {images.length > 1 && (
                                <div className="flex items-center gap-2 text-sm font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 whitespace-nowrap">
                                    <ImageIcon size={16} />
                                    <span>Image {currentIndex + 1} / {images.length}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </AnimatePresence>


        {/* Navigation Arrows (Only if multiple images) */}
        {images.length > 1 && (
          <>
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-neutral-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 md:-translate-x-4 md:group-hover:translate-x-0"
              onClick={() => paginate(-1)}
              aria-label="Image précédente"
            >
              <ArrowLeft size={24} />
            </button>
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-neutral-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 md:translate-x-4 md:group-hover:translate-x-0"
              onClick={() => paginate(1)}
              aria-label="Image suivante"
            >
              <ArrowRight size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Voir image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfiniteImageScroll;


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
         <motion.h2 
           className="text-xl md:text-2xl font-serif font-bold text-white flex items-center gap-3"
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
         >
            <motion.span 
              className="w-2 h-2 rounded-full bg-primary-500"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            />
            <span className="text-primary-400">Actualités:</span> 
            <span className="truncate">{article.title}</span>
         </motion.h2>
      </div>

      <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden group cursor-grab active:cursor-grabbing">
        
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
              {/* Overlay Gradient - Réduit pour mieux voir l'image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
            </div>

            {/* Contenu superposé - En bas à gauche */}
            <div className="absolute bottom-0 left-0 right-0 pb-8 md:pb-12">
                <div className="container-custom w-full px-4 md:px-8">
                    <div className="max-w-3xl text-left">
                        {/* Badge - Amélioré */}
                        <motion.div 
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500/95 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider mb-4 drop-shadow-lg border border-primary-500/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                            {article.category || 'À la Une'}
                        </motion.div>

                        {/* Titre - Amélioré */}
                        <motion.h2 
                          className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mb-3 leading-tight drop-shadow-2xl"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                            {article.title}
                        </motion.h2>

                        {/* Résumé - Amélioré */}
                        <motion.p 
                          className="text-neutral-200 text-sm md:text-base mb-5 line-clamp-2 max-w-2xl drop-shadow-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                            {article.excerpt}
                        </motion.p>

                        {/* Actions - Amélioré */}
                        <motion.div 
                          className="flex flex-wrap items-center gap-3 text-white/90"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                            <Link to={`/article/${article.id}`}>
                                <motion.button 
                                  className="flex items-center gap-2 bg-white text-neutral-950 px-6 py-3 rounded-full font-bold hover:bg-neutral-100 transition-all shadow-xl hover:shadow-2xl hover:shadow-white/20 active:scale-95 transform whitespace-nowrap text-sm md:text-base"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                    Lire l'article
                                    <ArrowUpRight size={18} />
                                </motion.button>
                            </Link>

                            {images.length > 1 && (
                                <div className="flex items-center gap-2 text-xs md:text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20 whitespace-nowrap shadow-lg">
                                    <ImageIcon size={16} />
                                    <span>Image {currentIndex + 1} / {images.length}</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
          </motion.div>
        </AnimatePresence>


        {/* Navigation Arrows (Only if multiple images) - Amélioré */}
        {images.length > 1 && (
          <>
            <motion.button 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-neutral-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-xl"
              onClick={() => paginate(-1)}
              aria-label="Image précédente"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={24} />
            </motion.button>
            <motion.button 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-neutral-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-xl"
              onClick={() => paginate(1)}
              aria-label="Image suivante"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight size={24} />
            </motion.button>

            {/* Dots Indicator - Amélioré */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-primary-500' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
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

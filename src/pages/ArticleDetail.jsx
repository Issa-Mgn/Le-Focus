import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Download, ArrowLeft, ArrowRight, Share2, Loader2, X, Check, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import ArticleDetailSkeleton from '../components/ArticleDetailSkeleton';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ArticleDetail Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h2>
                <p className="text-neutral-600 mb-4">Impossible d'afficher cet article.</p>
                <div className="bg-neutral-100 p-4 rounded text-xs font-mono overflow-auto mb-6">
                    {this.state.error?.toString()}
                </div>
                <Link to="/" className="text-primary-600 font-bold hover:underline">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ArticleDetailContent = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [downloading, setDownloading] = React.useState(false);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = React.useState(0);
  const [isCopied, setIsCopied] = React.useState(false);
  const navigate = useNavigate();

    useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      try {
        console.log("Fetching article", id);
        const data = await api.articles.getById(id);
        const allData = await api.articles.getAll();
        
        console.log("Details fetched:", data);
        
        if (data) {
           setArticle(data);
           await api.articles.incrementViews(id);
        }

        if (Array.isArray(allData) && data) {
           const similar = allData
            .filter(a => a.category === data.category && a.id != id)
            .slice(0, 3);
           setSimilarArticles(similar);
        }
      } catch (error) {
        console.error("Failed to fetch article details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
    window.scrollTo(0, 0);
  }, [id]);



  const [isSharing, setIsSharing] = React.useState(false); 

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        // Tentative de partage natif
        // Note: Cela ne fonctionne que via HTTPS ou localhost
        await navigator.share({
          title: article.title,
          url: window.location.href,
        });
      } else {
        // Si le navigateur ne supporte pas (souvent car connexion HTTP non sécurisée sur mobile)
        alert("Le menu de partage n'est pas disponible. Vérifiez que vous êtes en HTTPS ou utilisez un navigateur compatible.");
      }
    } catch (error) {
      // Ignorer l'erreur si l'utilisateur annule (AbortError)
      if (error.name !== 'AbortError') {
        console.error('Erreur de partage :', error);
        alert("Une erreur est survenue lors de l'ouverture du menu de partage.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Defensive checks & Derived state
  const safeImages = article && Array.isArray(article.images) ? article.images : (article && article.image ? [article.image] : []);
  const safeAuthor = article ? (article.author || 'Anonyme') : 'Anonyme';
  const safeCategory = article ? (article.category || 'Actualité') : 'Actualité';
  const safeDate = article ? (article.date || '') : '';

  const nextImage = React.useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % (safeImages.length || 1));
  }, [safeImages.length]);

  const prevImage = React.useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + (safeImages.length || 1)) % (safeImages.length || 1));
  }, [safeImages.length]);

  // Lightbox functions
  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev + 1) % (safeImages.length || 1));
  };

  const prevLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev - 1 + (safeImages.length || 1)) % (safeImages.length || 1));
  };

  // Add keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowLeft') {
          prevLightboxImage();
        } else if (e.key === 'ArrowRight') {
          nextLightboxImage();
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      } else {
        if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, lightboxOpen]);

  const handleDownload = () => {
    if (article && article.pdf) {
      setDownloading(true);
      
      // Increment download count
      api.articles.incrementDownloads(article.id);

      // Simulate download delay
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = article.pdf;
        link.download = `${article.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloading(false);
      }, 1500);
    } else {
      alert("Aucun fichier PDF disponible pour cet article.");
    }
  };

  if (loading) {
    return <ArticleDetailSkeleton />;
  }

  if (!article) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Article non trouvé</h2>
        <Link to="/" className="text-primary-600 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-20">
      {/* Header Image */}
      {/* Header Image Carousel */}
      <div className="h-[50vh] relative w-full overflow-hidden group">
        <div 
          className="w-full h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {safeImages.length > 0 ? safeImages.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`${article.title || 'Article'} - ${index + 1}`} 
              className="w-full h-full object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ minWidth: '100%' }}
              onClick={() => openLightbox(index)}
              title="Cliquez pour agrandir"
            />
          )) : (
             <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                <span className="text-4xl">Sans Image</span>
             </div>
          )}
        </div>
        
        {/* Carousel Controls */}
        {safeImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg z-30"
              aria-label="Image précédente"
            >
              <ArrowLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg z-30"
              aria-label="Image suivante"
            >
              <ArrowRight size={24} />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {safeImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter & Expand */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
              <button
                onClick={() => openLightbox(currentImageIndex)}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                title="Agrandir l'image"
              >
                <Maximize2 size={16} />
              </button>
              <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentImageIndex + 1} / {safeImages.length}
              </div>
            </div>
          </>
        )}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent z-10 cursor-pointer"
          onClick={() => openLightbox(currentImageIndex)}
          title="Cliquez pour agrandir"
        ></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white container-custom z-20">

          <span className="block text-primary-400 font-bold tracking-wider uppercase mb-4">{safeCategory}</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6 max-w-4xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-white/90">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${safeAuthor}&background=random`} alt={safeAuthor} />
              </div>
              <span className="font-medium">{safeAuthor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{safeDate}</span>
            </div>
          </div>
        </div>
      </div>


      <div className="container-custom relative z-10 -mt-10">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto overflow-hidden">
          {/* Actions Bar */}
          <div className="flex justify-between items-center border-b border-neutral-100 pb-8 mb-8">
            <div className="flex gap-4">
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Télécharger PDF
                  </>
                )}
              </button>
            </div>
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className="text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-2"
              title="Partager l'article"
            >
              {isSharing ? (
                <Loader2 size={20} className="animate-spin text-primary-600" />
              ) : isCopied ? (
                <Check size={20} className="text-green-600" />
              ) : (
                <Share2 size={20} />
              )}
              {isCopied && <span className="text-sm text-green-600 font-medium">Lien copié !</span>}
            </button>
          </div>

          {/* Content */}
          <article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-primary-600 hover:prose-a:text-primary-700 break-words w-full">
            <p className="lead text-xl text-neutral-600 mb-8 font-serif italic break-words">
              {article.excerpt}
            </p>
            <div className="text-neutral-800 leading-relaxed space-y-6">
              {/* Display paragraphs if available, otherwise fallback to content */}
              {article.paragraphs && article.paragraphs.length > 0 ? (
                article.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed break-words">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-lg leading-relaxed break-words">{article.content}</p>
              )}
            </div>
          </article>
        </div>

        {/* Similar Articles */}
        {similarArticles.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold font-serif mb-8 border-l-4 border-primary-600 pl-4">
              Articles Similaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Other Articles Section */}
        <OtherArticlesSection currentArticleId={article.id} />
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-primary-400 transition-colors z-50"
            aria-label="Fermer"
          >
            <X size={32} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm z-50">
            {lightboxImageIndex + 1} / {safeImages.length}
          </div>

          {/* Navigation Buttons */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full backdrop-blur-sm transition-all shadow-lg z-50"
                aria-label="Image précédente"
              >
                <ArrowLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full backdrop-blur-sm transition-all shadow-lg z-50"
                aria-label="Image suivante"
              >
                <ArrowRight size={32} />
              </button>
            </>
          )}

          {/* Image */}
          <motion.img
            key={lightboxImageIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={safeImages[lightboxImageIndex]}
            alt={`${article.title} - ${lightboxImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-3 rounded-full text-sm backdrop-blur-sm z-50">
            <span className="hidden sm:inline">Utilisez les flèches ← → pour naviguer • </span>
            Appuyez sur ESC pour fermer
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ArticleDetail = () => {
    return (
        <ErrorBoundary>
            <ArticleDetailContent />
        </ErrorBoundary>
    );
};

// Component for Other Articles Section
const OtherArticlesSection = ({ currentArticleId }) => {
  const [showAll, setShowAll] = React.useState(false);
  const [otherArticles, setOtherArticles] = React.useState([]);
  
  useEffect(() => {
    const fetchOthers = async () => {
      try {
        const allArticles = await api.articles.getAll();
        if (Array.isArray(allArticles)) {
            const filtered = allArticles
                .filter(a => a.id != currentArticleId)
                .sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));
            setOtherArticles(filtered);
        }
      } catch (e) {
        console.error("Failed to fetch other articles", e);
      }
    };
    fetchOthers();
  }, [currentArticleId]);

  const displayedArticles = showAll ? otherArticles : otherArticles.slice(0, 6);

  if (otherArticles.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t-2 border-neutral-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-800 rounded-full"></div>
            <h2 className="text-4xl font-bold font-serif text-neutral-900">
              Autres <span className="gradient-text">Articles</span>
            </h2>
          </div>
          <p className="text-neutral-600">Découvrez plus d'articles qui pourraient vous intéresser</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>

      {otherArticles.length > 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">
              {showAll ? 'Voir moins' : `Voir plus (${otherArticles.length - 6} articles)`}
            </span>
            <ArrowRight 
              size={20} 
              className={`transition-transform ${showAll ? 'rotate-90' : ''}`}
            />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ArticleDetail;

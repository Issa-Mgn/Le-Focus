import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Bookmark, Calendar, Download, Share2 } from 'lucide-react';
import { api } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Loader from '../components/Loader';
import AudioPlayer from '../components/AudioPlayer';
import CommentsSection from '../components/CommentsSection';
import { useBookmarks } from '../hooks/useBookmarks';
import SpinnerSmall from '../components/SpinnerSmall';

const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [otherArticles, setOtherArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      try {
        const data = await api.articles.getById(id);
        const allData = await api.articles.getAll();
        if (data) {
          setArticle(data);
          api.articles.incrementViews(id);
        }
        if (Array.isArray(allData)) {
          setOtherArticles(allData.filter((item) => String(item.id) !== String(id)).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch article details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader />;

  if (!article) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="font-serif text-[26px] font-black">Article non trouvé</h1>
        <Link to="/" className="mt-5 inline-block text-primary-700">Retour à l'accueil</Link>
      </div>
    );
  }

  const images = article.images?.length ? article.images : [article.image || fallbackImage];
  const safeAuthor = article.author || 'Wabi MIGAN';
  const safeCategory = article.category || 'Actualité';
  const isSaved = isBookmarked(article.id);

  const handleDownload = async () => {
    if (!article.pdf) {
      alert('Aucun fichier PDF disponible pour cet article.');
      return;
    }
    setDownloading(true);
    try {
      api.articles.incrementDownloads(article.id);
      window.open(article.pdf, '_blank');
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      // Vérifier si l'API Web Share est disponible
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: window.location.href
        });
      } else {
        // Fallback pour PC : Copier le lien
        await navigator.clipboard.writeText(window.location.href);
        alert('✅ Lien copié dans le presse-papier !\n\nVous pouvez maintenant le coller sur WhatsApp, Facebook, etc.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Erreur de partage:', err);
        // En cas d'erreur, essayer de copier dans le presse-papier
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('✅ Lien copié dans le presse-papier !');
        } catch (clipErr) {
          alert('❌ Impossible de partager. Copiez manuellement le lien depuis la barre d\'adresse.');
        }
      }
    } finally {
      setTimeout(() => setSharing(false), 500);
    }
  };

  const handleBookmark = async () => {
    setBookmarking(true);
    try {
      toggleBookmark(article);
    } finally {
      setTimeout(() => setBookmarking(false), 500);
    }
  };

  const prevImage = () => setCurrentImageIndex((index) => (index - 1 + images.length) % images.length);
  const nextImage = () => setCurrentImageIndex((index) => (index + 1) % images.length);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Meta tags pour le partage sur les réseaux sociaux */}
      <Helmet>
        <title>{article.title} - Le Focus</title>
        <meta name="description" content={article.excerpt || article.title} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.title} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Le Focus" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || article.title} />
        <meta name="twitter:image" content={images[0]} />
        
        {/* WhatsApp */}
        <meta property="og:image:alt" content={article.title} />
      </Helmet>

      <section className="relative h-[420px] overflow-hidden bg-black sm:h-[470px]">
        <div className="flex h-full transition-transform duration-500" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`${article.title} ${index + 1}`} className="h-full min-w-full object-contain" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-black/55 text-white" aria-label="Image précédente">
              <ArrowLeft size={24} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-black/55 text-white" aria-label="Image suivante">
              <ArrowRight size={24} />
            </button>
            <div className="absolute right-5 top-5 bg-black/55 px-3 py-2 font-display text-sm font-bold text-white">
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0">
          <div className="container-custom pb-8 sm:pb-12">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-primary-400">{safeCategory}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-[25px] font-black leading-tight text-white sm:text-[34px]">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-5 font-serif text-[13px] text-white/90">
              <span>Par {safeAuthor}</span>
              <span className="inline-flex items-center gap-2">
                <Calendar size={17} />
                {article.date}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="container-custom relative -mt-8 max-w-4xl">
        <article className="bg-white px-5 py-8 sm:px-10 sm:py-10">
          <div className="mb-9 flex items-center justify-between gap-4">
            <div className="flex gap-3">
              <button 
                onClick={handleDownload} 
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-neutral-50 px-4 py-3 font-display text-sm text-neutral-700 disabled:opacity-60"
              >
                {downloading ? <SpinnerSmall size={16} /> : <Download size={16} />}
                PDF
              </button>
              <button 
                onClick={handleBookmark} 
                disabled={bookmarking}
                className="inline-flex items-center gap-2 bg-neutral-50 px-4 py-3 font-display text-sm text-neutral-700 disabled:opacity-60"
              >
                {bookmarking ? (
                  <SpinnerSmall size={16} />
                ) : (
                  <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                )}
                {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </button>
            </div>
            <button 
              onClick={handleShare} 
              disabled={sharing}
              className="p-3 text-neutral-500 hover:text-primary-700 disabled:opacity-60" 
              aria-label="Partager"
            >
              {sharing ? <SpinnerSmall size={21} /> : <Share2 size={21} />}
            </button>
          </div>

          <AudioPlayer text={`${article.excerpt || ''}. ${article.paragraphs?.join(' ') || article.content || ''}`} title="" />

          <p className="mb-8 border-l-2 border-primary-600 pl-5 font-serif text-[17px] italic leading-7 text-neutral-600">
            {article.excerpt}
          </p>

          <div className="font-serif text-[16px] leading-8 text-neutral-800">
            {article.paragraphs?.length ? (
              article.paragraphs.map((paragraph, index) => <p key={index} className="mb-7">{paragraph}</p>)
            ) : (
              <p>{article.content}</p>
            )}
          </div>
        </article>

        <CommentsSection articleId={article.id} />

        {otherArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-8 font-serif text-[24px] font-black text-neutral-950">À lire aussi</h2>
            <div className="grid gap-8">
              {otherArticles.map((item) => <ArticleCard key={item.id} article={item} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ArticleDetail;

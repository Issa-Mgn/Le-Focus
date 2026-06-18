import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { categories } from '../data/mockData';
import ArticleCard from '../components/ArticleCard';
import Loader from '../components/Loader';
import CustomAlert from '../components/CustomAlert';

const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600';

const Home = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await api.articles.getAll();
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch articles', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const sortedArticles = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
  const featuredArticle = sortedArticles[0];
  const articleCards = sortedArticles.slice(0, 6);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) {
      setAlert({ show: true, type: 'error', message: 'Entrez une adresse email valide.' });
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setNewsletterEmail('');
      setAlert({ show: true, type: 'success', message: 'Merci ! Vous êtes inscrit(e) à la newsletter.' });
    }, 900);
  };

  return (
    <div className="bg-white text-neutral-950">
      <style>{`
        .loader-spinner {
          width: 44.8px;
          height: 44.8px;
          color: #E60000;
          position: relative;
          background: radial-gradient(11.2px, currentColor 94%, transparent);
        }

        .loader-spinner:before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: 
            radial-gradient(10.08px at bottom right, transparent 94%, currentColor) top left,
            radial-gradient(10.08px at bottom left, transparent 94%, currentColor) top right,
            radial-gradient(10.08px at top right, transparent 94%, currentColor) bottom left,
            radial-gradient(10.08px at top left, transparent 94%, currentColor) bottom right;
          background-size: 22.4px 22.4px;
          background-repeat: no-repeat;
          animation: loader-spin 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
        }

        @keyframes loader-spin {
          33% {
            inset: -11.2px;
            transform: rotate(0deg);
          }
          66% {
            inset: -11.2px;
            transform: rotate(90deg);
          }
          100% {
            inset: 0;
            transform: rotate(90deg);
          }
        }
      `}</style>
      <CustomAlert show={alert.show} type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />

      {featuredArticle && (
        <div className="bg-[#151515] py-3 text-white">
          <div className="container-custom flex min-w-0 items-center gap-2 font-serif text-[12px]">
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary-500">À LA UNE</span>
            <span className="text-neutral-500">—</span>
            <span className="truncate text-neutral-300">{featuredArticle.title}</span>
          </div>
        </div>
      )}

      <section className="bg-[#151515]">
        {featuredArticle ? (
          <div className="container-custom px-0 sm:px-6 lg:px-8">
            <div className="relative h-[410px] overflow-hidden md:h-[450px]">
              <img
                src={featuredArticle.images?.[0] || featuredArticle.image || fallbackImage}
                alt={featuredArticle.title}
                className="absolute inset-0 h-full w-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-9 sm:px-8 sm:pb-12">
                <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.18em] text-primary-500">
                  {featuredArticle.category}
                </span>
                <h1 className="max-w-3xl font-serif text-[24px] font-black leading-tight text-white sm:text-[34px]">
                  {featuredArticle.title}
                </h1>
                <p className="mt-3 max-w-3xl font-serif text-[14px] leading-6 text-white sm:text-[16px]">
                  {featuredArticle.excerpt}
                </p>
                <Link to={`/article/${featuredArticle.id}`} className="mt-6 inline-block bg-white px-6 py-3 font-display text-sm font-bold text-neutral-950 hover:bg-neutral-100">
                  Lire la suite
                </Link>
              </div>
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                <span className="h-1.5 w-8 bg-primary-600" />
                <span className="h-1.5 w-2 rounded-full bg-white/45" />
              </div>
            </div>
          </div>
        ) : (
          <div className="container-custom py-20 text-center text-neutral-400">Aucun article à la une pour le moment.</div>
        )}
      </section>

      <section className="border-b border-neutral-200 bg-white py-4">
        <div className="container-custom overflow-x-auto">
          <div className="flex min-w-max gap-4 font-display text-[12px] text-neutral-500">
            {categories.map((category) => (
              <Link key={category} to={`/category/${category.toLowerCase()}`} className="whitespace-nowrap hover:text-primary-600">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-12 sm:py-14">
        <div className="container-custom">
          <p className="editorial-kicker">À lire absolument</p>
          <h2 className="mt-3 font-serif text-[28px] font-black leading-tight text-neutral-950 sm:text-[32px]">Nos articles</h2>

          <div className="mt-9 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="loader-spinner"></div>
              </div>
            ) : articleCards.length > 0 ? (
              articleCards.map((article) => <ArticleCard key={article.id} article={article} />)
            ) : (
              <p className="py-12 text-neutral-500">Aucun article disponible pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#151515] py-16 text-white">
        <div className="container-custom text-center">
          <p className="editorial-kicker">Restez informé</p>
          <h2 className="mt-4 font-serif text-[24px] font-black leading-tight sm:text-[28px]">La newsletter du Focus</h2>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-[15px] leading-6 text-neutral-400">
            Chaque semaine, l'essentiel de l'actualité dans votre boîte mail.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-8 flex max-w-xl">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="votre@email.com"
              className="min-w-0 flex-1 border border-neutral-700 bg-neutral-800 px-5 py-3 font-display text-sm text-white outline-none placeholder:text-neutral-500 focus:border-primary-600"
            />
            <button disabled={isSubscribing} className="bg-primary-600 px-7 font-display text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-70">
              OK
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

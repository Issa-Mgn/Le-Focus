import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { categories } from '../data/mockData';
import ArticleCard from '../components/ArticleCard';
import ArticleCardSkeleton from '../components/ArticleCardSkeleton';
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
  const articleCards = sortedArticles.slice(0, 4);

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
      <CustomAlert show={alert.show} type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />

      {featuredArticle && (
        <div className="bg-[#151515] py-4 text-white">
          <div className="container-custom flex min-w-0 items-center gap-2 font-serif text-[14px]">
            <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-primary-500">À LA UNE</span>
            <span className="text-neutral-500">—</span>
            <span className="truncate text-neutral-300">{featuredArticle.title}</span>
          </div>
        </div>
      )}

      <section className="bg-[#111]">
        {featuredArticle ? (
          <div className="container-custom px-0 sm:px-6 lg:px-8">
            <div className="relative h-[520px] overflow-hidden sm:h-[650px]">
              <img
                src={featuredArticle.images?.[0] || featuredArticle.image || fallbackImage}
                alt={featuredArticle.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-10 sm:px-8 sm:pb-14">
                <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.18em] text-primary-500">
                  {featuredArticle.category}
                </span>
                <h1 className="max-w-3xl font-serif text-[31px] font-black leading-tight text-white sm:text-6xl">
                  {featuredArticle.title}
                </h1>
                <p className="mt-3 max-w-3xl font-serif text-[20px] leading-7 text-white sm:text-2xl sm:leading-9">
                  {featuredArticle.excerpt}
                </p>
                <Link to={`/article/${featuredArticle.id}`} className="mt-6 inline-block bg-white px-7 py-4 font-display text-sm font-bold text-neutral-950 hover:bg-neutral-100">
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
          <div className="container-custom py-24 text-center text-neutral-400">Aucun article à la une pour le moment.</div>
        )}
      </section>

      <section className="border-b border-neutral-200 bg-white py-4">
        <div className="container-custom overflow-x-auto">
          <div className="flex min-w-max gap-4 font-display text-[13px] text-neutral-500">
            {categories.slice(0, 8).map((category) => (
              <Link key={category} to={`/category/${category.toLowerCase()}`} className="whitespace-nowrap hover:text-primary-700">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="container-custom">
          <p className="editorial-kicker">À lire absolument</p>
          <h2 className="mt-3 font-serif text-[42px] font-black leading-none text-neutral-950 sm:text-5xl">Nos articles</h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => <ArticleCardSkeleton key={i} />)
            ) : articleCards.length > 0 ? (
              articleCards.map((article) => <ArticleCard key={article.id} article={article} />)
            ) : (
              <p className="py-12 text-neutral-500">Aucun article disponible pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#151515] py-20 text-white">
        <div className="container-custom text-center">
          <p className="editorial-kicker">Restez informé</p>
          <h2 className="mt-4 font-serif text-[34px] font-black leading-tight sm:text-5xl">La newsletter du Focus</h2>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-[20px] leading-8 text-neutral-400">
            Chaque semaine, l'essentiel de l'actualité dans votre boîte mail.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-8 flex max-w-3xl">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="votre@email.com"
              className="min-w-0 flex-1 border border-neutral-700 bg-neutral-800 px-5 py-4 font-display text-white outline-none placeholder:text-neutral-500 focus:border-primary-600"
            />
            <button disabled={isSubscribing} className="bg-primary-700 px-8 font-display font-bold text-white hover:bg-primary-800 disabled:opacity-70">
              OK
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { categories } from '../data/mockData';
import ArticleCard from '../components/ArticleCard';
import CustomAlert from '../components/CustomAlert';

const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600';

const Home = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
  // Exclure l'article à la une de la liste des articles affichés
  const articleCards = sortedArticles.slice(1, 7);

  // Auto-défilement des images toutes les 5 secondes
  useEffect(() => {
    if (!featuredArticle?.images || featuredArticle.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === featuredArticle.images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredArticle]);

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

      <section className="bg-[#151515]">
        {featuredArticle ? (
          <div className="relative h-[410px] overflow-hidden md:h-[500px]">
            {/* Carrousel d'images */}
            <div 
              className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `translateX(-${currentImageIndex * 100}%)`
              }}
            >
              {(featuredArticle.images || [featuredArticle.image || fallbackImage]).map((image, index) => (
                <div key={index} className="relative h-full w-full flex-shrink-0 bg-neutral-900">
                  <img
                    src={image}
                    alt={`${featuredArticle.title} - ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            
            {/* Badge À LA UNE */}
            <div className="absolute top-5 left-5 z-10">
              <span className="bg-primary-500 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg">
                À LA UNE
              </span>
            </div>

            {/* Contenu en bas */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 md:px-8 md:pb-8">
              <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                  <h2 className="font-serif text-2xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 font-serif text-sm text-neutral-200 md:text-lg lg:mt-4">
                    {featuredArticle.summary}
                  </p>
                  <Link
                    to={`/article/${featuredArticle.id}`}
                    className="mt-4 inline-block bg-primary-500 px-8 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-600 lg:mt-6"
                  >
                    Lire
                  </Link>
                </div>
              </div>
            </div>

            {/* Indicateurs de pagination */}
            {featuredArticle.images?.length > 1 && (
              <div className="absolute bottom-5 right-5 z-10 flex gap-2 md:bottom-8 md:right-8">
                {featuredArticle.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'w-8 bg-primary-500' 
                        : 'w-2 bg-white/45 hover:bg-white/70'
                    }`}
                    aria-label={`Image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="container-custom py-20 text-center text-neutral-400">Aucun article à la une pour le moment.</div>
        )}
      </section>

      <section className="border-b border-neutral-200 bg-white py-4">
        <div className="container-custom overflow-x-auto">
          <div className="flex min-w-max gap-4 font-display text-[12px] text-neutral-500">
            {categories.map((category) => (
              <Link key={category} to={`/category/${category.toLowerCase()}`} className="whitespace-nowrap hover:text-primary-500">
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
              className="min-w-0 flex-1 border border-neutral-700 bg-neutral-800 px-5 py-3 font-display text-sm text-white outline-none placeholder:text-neutral-500 focus:border-primary-500"
            />
            <button disabled={isSubscribing} className="bg-primary-500 px-7 font-display text-sm font-bold text-white hover:bg-primary-500-temp disabled:opacity-70">
              OK
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

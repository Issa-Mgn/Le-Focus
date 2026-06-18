import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { api } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import ArticleCardSkeleton from '../components/ArticleCardSkeleton';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const allData = await api.articles.getAll();
        const lowerQuery = query.toLowerCase();
        setArticles(
          Array.isArray(allData)
            ? allData.filter((article) =>
                (article.title || '').toLowerCase().includes(lowerQuery) ||
                (article.excerpt || '').toLowerCase().includes(lowerQuery) ||
                (article.category || '').toLowerCase().includes(lowerQuery)
              )
            : []
        );
      } catch (error) {
        console.error(error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [query]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="editorial-kicker">Recherche</p>
          <h1 className="page-title">Résultats</h1>
          <p className="mt-4 font-serif text-[24px] text-neutral-500">{articles.length} résultat(s) pour "{query}"</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-custom max-w-4xl">
          {isLoading || articles.length > 0 ? (
            <div className="grid gap-8">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <ArticleCardSkeleton key={i} />)
                : articles.map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          ) : (
            <div className="grid min-h-[45vh] place-items-center text-center">
              <div>
                <SearchIcon className="mx-auto mb-5 text-neutral-300" size={54} />
                <p className="font-serif text-[28px] text-neutral-600">Aucun résultat trouvé</p>
                <Link to="/articles" className="mt-6 inline-block font-serif text-[23px] text-primary-800">Voir les articles</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResults;

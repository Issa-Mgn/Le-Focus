import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import ArticleCardSkeleton from '../components/ArticleCardSkeleton';
import { Search as SearchIcon } from 'lucide-react';

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
            if (Array.isArray(allData)) {
                const lowerQuery = query.toLowerCase();
                const filtered = allData.filter(article => 
                    (article.title || '').toLowerCase().includes(lowerQuery) ||
                    (article.excerpt || '').toLowerCase().includes(lowerQuery) ||
                    (article.category && article.category.toLowerCase().includes(lowerQuery))
                );
                setArticles(filtered);
            }
        } catch (e) {
            console.error(e);
            setArticles([]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchArticles();
  }, [query]);

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-custom">
        <div className="mb-8">
          <Link to="/" className="text-primary-600 hover:underline mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon className="text-neutral-400" size={32} />
            <h1 className="text-3xl font-bold text-neutral-900">
              Résultats de recherche
            </h1>
          </div>
          <p className="text-neutral-600">
            {articles.length} résultat(s) pour "{query}"
          </p>
        </div>

        {(isLoading || articles.length > 0) ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-5xl mx-auto">
            {isLoading ? (
               Array.from({ length: 6 }).map((_, i) => (
                 <ArticleCardSkeleton key={i} />
               ))
            ) : articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="mx-auto text-neutral-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-neutral-700 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-neutral-500">
              Essayez avec d'autres mots-clés
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

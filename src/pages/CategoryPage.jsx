import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import ArticleCardSkeleton from '../components/ArticleCardSkeleton';
import { Folder } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams();
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const allData = await api.articles.getAll();
        if (Array.isArray(allData)) {
            const filtered = allData.filter(a => 
                (a.category || '').toLowerCase() === category.toLowerCase()
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
  }, [category]);

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-custom">
        <div className="mb-8">
          <Link to="/" className="text-primary-600 hover:underline mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Folder className="text-primary-600" size={32} />
            <h1 className="text-3xl font-bold text-neutral-900">
              {categoryName}
            </h1>
          </div>
          <p className="text-neutral-600">
            {articles.length} article(s) dans cette catégorie
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
            <Folder className="mx-auto text-neutral-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-neutral-700 mb-2">
              Aucun article dans cette catégorie
            </h3>
            <p className="text-neutral-500">
              Revenez plus tard pour découvrir de nouveaux contenus
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

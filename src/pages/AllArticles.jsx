import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import ArticleCardSkeleton from '../components/ArticleCardSkeleton';

const AllArticles = () => {
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

  const sortedArticles = [...articles].sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="editorial-kicker">Tous nos articles</p>
          <h1 className="page-title">Publications</h1>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <ArticleCardSkeleton key={i} />)
            ) : (
              sortedArticles.map((article) => <ArticleCard key={article.id} article={article} />)
            )}
          </div>

          {!isLoading && sortedArticles.length === 0 && (
            <div className="py-24 text-center font-serif text-[20px] text-neutral-500">Aucun article trouvé</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AllArticles;

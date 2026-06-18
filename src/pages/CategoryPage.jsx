import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import ArticleCardSkeleton from '../components/ArticleCardSkeleton';

const CategoryPage = () => {
  const { category } = useParams();
  const categoryName = decodeURIComponent(category || '').charAt(0).toUpperCase() + decodeURIComponent(category || '').slice(1);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const allData = await api.articles.getAll();
        setArticles(
          Array.isArray(allData)
            ? allData.filter((article) => (article.category || '').toLowerCase() === category.toLowerCase())
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
  }, [category]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="editorial-kicker">Rubrique</p>
          <h1 className="page-title">{categoryName}</h1>
          <p className="mt-4 font-serif text-[24px] text-neutral-500">{articles.length} article(s)</p>
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
            <div className="py-24 text-center font-serif text-[27px] text-neutral-500">Aucun article dans cette catégorie.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;

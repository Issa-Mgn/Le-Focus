import React from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { useBookmarks } from '../hooks/useBookmarks';

const Bookmarks = () => {
  const { bookmarks } = useBookmarks();

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="editorial-kicker">Vos sauvegardes</p>
          <h1 className="page-title">Ma Liste</h1>
          <p className="mt-2 font-serif text-[16px] text-neutral-500">{bookmarks.length} articles</p>
        </div>
      </section>

      {bookmarks.length > 0 ? (
        <section className="py-10">
          <div className="container-custom grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
        </section>
      ) : (
        <section className="grid min-h-[55vh] place-items-center px-5 text-center">
          <div>
            <p className="font-serif text-[20px] text-neutral-500">Aucun article sauvegardé.</p>
            <Link to="/articles" className="mt-8 inline-block font-serif text-[16px] text-primary-800 hover:text-primary-900">
              Voir les articles
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Bookmarks;

import React from 'react';
import { Link } from 'react-router-dom';

const suggestions = ['Politique', 'Économie', 'Société', 'Culture', 'Sport'];

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="editorial-kicker">Erreur 404</p>
          <h1 className="page-title">Page introuvable</h1>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-custom max-w-2xl text-center">
          <p className="font-serif text-[80px] font-black leading-none text-neutral-200 sm:text-[120px]">404</p>
          <h2 className="mt-6 font-serif text-[24px] font-black text-neutral-950">Cette page n'existe pas</h2>
          <p className="mx-auto mt-4 max-w-lg font-serif text-[16px] leading-8 text-neutral-600">
            La page que vous recherchez a peut-être été déplacée ou n'est plus disponible.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/" className="btn-primary w-full sm:w-auto">Retour à l'accueil</Link>
            <Link to="/articles" className="btn-secondary w-full sm:w-auto">Voir les articles</Link>
          </div>

          <div className="mt-16 border-t border-neutral-200 pt-8">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Explorer par rubrique
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {suggestions.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="font-serif text-[15px] text-neutral-700 underline decoration-neutral-300 underline-offset-4 hover:text-primary-600"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;

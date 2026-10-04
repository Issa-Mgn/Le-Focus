import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Eye } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';

const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=900';

const ArticleCard = ({ article }) => {
  const [imageError, setImageError] = React.useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const coverImage = article.images?.[0] || article.image || fallbackImage;
  const isSaved = isBookmarked(article.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    toggleBookmark(article);
  };

  return (
    <Link to={`/article/${article.id}`} className="block bg-white">
      <article className="card">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <img
            src={imageError ? fallbackImage : coverImage}
            alt={article.title}
            onError={() => setImageError(true)}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <span className="absolute left-0 top-4 bg-primary-500 px-3.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-white">
            {article.category || 'Actualité'}
          </span>
        </div>

        <div className="px-5 pb-5 pt-5">
          <div className="mb-3 flex items-center gap-4 font-display text-[12px] font-medium text-neutral-500">
            <span>{article.date}</span>
            <span className="inline-flex items-center gap-1">
              <Eye size={13} />
              {article.views || 0}
            </span>
          </div>

          <h3 className="mb-2.5 font-serif text-[18px] font-black leading-snug text-neutral-950">
            {article.title}
          </h3>
          <p className="line-clamp-2 text-[14px] leading-relaxed text-neutral-600">
            {article.excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-neutral-900 font-display text-[11px] font-bold text-white">
                {(article.author || 'Wabi MIGAN')
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span className="font-display text-[12px] font-semibold text-neutral-700">{article.author || 'Wabi MIGAN'}</span>
            </div>

            <button
              type="button"
              onClick={handleBookmark}
              className="grid h-9 w-9 place-items-center text-neutral-400 transition-colors duration-150 hover:text-primary-600"
              aria-label={isSaved ? 'Retirer des sauvegardes' : 'Sauvegarder'}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;

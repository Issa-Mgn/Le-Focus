import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Eye, Clock } from 'lucide-react';

const ArticleCard = ({ article, featured = false }) => {
  const [imageError, setImageError] = React.useState(false);
  const coverImage = article.images ? article.images[0] : article.image;
  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800';
  
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-neutral-100 card-hover flex flex-col h-[380px]"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container - Hauteur réduite et compacte */}
      <div className="relative overflow-hidden h-[180px] flex-shrink-0">
        <motion.img 
          src={imageError ? fallbackImage : coverImage} 
          alt={article.title} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
          decoding="async"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <motion.div 
          className="absolute top-3 left-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg"
          whileHover={{ scale: 1.1 }}
        >
          {article.category}
        </motion.div>
        
        {/* Quick Read Button (appears on hover) */}
        <motion.div
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
        >
          <Link 
            to={`/article/${article.id}`}
            className="flex items-center gap-1.5 bg-white text-neutral-900 px-3 py-1.5 rounded-full font-bold text-xs shadow-xl hover:bg-neutral-100 transition-colors"
          >
            <Clock size={14} />
            Lire
          </Link>
        </motion.div>
      </div>

      {/* Content - Hauteur flexible avec flex-1 */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="flex-1">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-[10px] text-neutral-500 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={12} className="text-primary-600" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Eye size={12} className="text-primary-600" />
              {(article.views || 0).toLocaleString()}
            </span>
          </div>
          
          {/* Title */}
          <Link to={`/article/${article.id}`}>
            <h3 className="font-serif font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors leading-tight text-base line-clamp-2">
              {article.title}
            </h3>
          </Link>
          
          {/* Excerpt */}
          <p className="text-neutral-600 leading-relaxed text-xs line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden ring-2 ring-primary-100">
              <img 
                src={`https://ui-avatars.com/api/?name=${article.author}&background=DC2626&color=fff&bold=true`} 
                alt={article.author}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-[10px] text-neutral-500 font-medium">Par</p>
              <p className="text-xs font-bold text-neutral-900">{article.author}</p>
            </div>
          </div>
          
          {/* Read More Link */}
          <Link 
            to={`/article/${article.id}`}
            className="flex items-center gap-1.5 text-primary-700 font-bold text-xs hover:gap-2 transition-all group/link"
          >
            Lire 
            <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </motion.div>
  );
};

export default ArticleCard;

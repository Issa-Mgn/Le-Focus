import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import ArticleCardSkeleton from '../components/ArticleCardSkeleton';
import { Filter, Grid, List } from 'lucide-react';

const AllArticles = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'oldest'
  
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await api.articles.getAll();
        if (Array.isArray(data)) setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);
  
  // Sort articles based on selected option
  const sortedArticles = [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.publishedAt - a.publishedAt;
      case 'oldest':
        return a.publishedAt - b.publishedAt;
      case 'popular':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  return (
    <div className="animate-fade-in min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-neutral-950 via-neutral-900 to-primary-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Tous nos <span className="text-primary-400">Articles</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed">
              Explorez l'ensemble de nos publications et analyses
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Article Count */}
            <div className="text-neutral-600 font-medium">
              <span className="text-2xl font-bold text-primary-700">{sortedArticles.length}</span> articles disponibles
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-neutral-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white font-medium"
                >
                  <option value="recent">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="popular">Plus populaires</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid/List */}
      <section className="py-16">
        <div className="container-custom">
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 gap-3 sm:gap-6 max-w-5xl mx-auto'
                : 'flex flex-col gap-6 max-w-3xl mx-auto'
            }
          >
            {isLoading ? (
               Array.from({ length: 6 }).map((_, i) => (
                 <ArticleCardSkeleton key={i} />
               ))
            ) : sortedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>

          {sortedArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-neutral-500">Aucun article trouvé</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AllArticles;

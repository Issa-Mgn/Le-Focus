
import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { useBookmarks } from '../hooks/useBookmarks';

const Bookmarks = () => {
    const { bookmarks, toggleBookmark } = useBookmarks();

    return (
        <div className="min-h-screen bg-neutral-50 pt-32 pb-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary-100 rounded-2xl text-primary-600">
                            <Bookmark size={32} />
                        </div>
                        <h1 className="text-4xl font-bold font-serif text-neutral-900">
                            Ma Liste de <span className="gradient-text">Lecture</span>
                        </h1>
                    </div>
                    <p className="text-lg text-neutral-600 max-w-2xl">
                        Retrouvez ici tous les articles que vous avez sauvegardés pour les lire plus tard.
                    </p>
                </motion.div>

                {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                layout
                            >
                                <div className="relative group">
                                    <ArticleCard article={article} />
                                    {/* Quick remove button */}
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleBookmark(article);
                                        }}
                                        className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white hover:text-red-600 hover:scale-110"
                                        title="Retirer de la liste"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-neutral-100 text-center px-4"
                    >
                        <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6 text-neutral-300">
                            <Bookmark size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Votre liste est vide</h2>
                        <p className="text-neutral-500 mb-8 max-w-md">
                            Vous n'avez pas encore sauvegardé d'articles. Explorez nos catégories pour trouver des sujets qui vous intéressent.
                        </p>
                        <Link to="/articles">
                            <motion.button
                                className="btn-primary flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Explorer les articles
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Bookmarks;

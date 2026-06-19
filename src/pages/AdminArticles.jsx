import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Calendar, Search, Filter, ChevronRight, FileText } from 'lucide-react';
import { api } from '../services/api';
import CustomAlert from '../components/CustomAlert';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  const fetchArticles = async () => {
    try {
      const data = await api.articles.getAll();
      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load articles", error);
      setArticles([]);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      try {
        await api.articles.delete(id);
        setAlert({
          show: true,
          type: 'success',
          message: 'Article supprimé avec succès'
        });
        // Refresh list
        fetchArticles();
      } catch (error) {
        console.error("Failed to delete article", error);
        setAlert({
          show: true,
          type: 'error',
          message: 'Impossible de supprimer l\'article'
        });
      }
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Tous', ...new Set(articles.map(a => a.category))];

  return (
    <div className="space-y-8">
      <CustomAlert 
        show={alert.show} 
        type={alert.type} 
        message={alert.message} 
        onClose={() => setAlert({ ...alert, show: false })} 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Articles</h1>
          <p className="text-neutral-500">Gérez l'ensemble de vos publications</p>
        </div>
        <Link 
          to="/admin/new-article"
          className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-500-temp transition-colors flex items-center gap-2"
        >
          <FileText size={20} />
          Nouvel Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Article</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Catégorie</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Auteur</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Stats</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredArticles.map((article) => (
                <motion.tr 
                  key={article.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                        {article.images && article.images[0] ? (
                          <img src={article.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <FileText size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 line-clamp-1">{article.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                          <Calendar size={12} />
                          {article.date}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-500-temp">
                      {article.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 overflow-hidden">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${article.author}&background=random`} 
                          alt={article.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-neutral-700">{article.author}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {article.views?.toLocaleString() || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/article/${article.id}`}
                        className="p-2 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Voir"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        to={`/admin/edit/${article.id}`}
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredArticles.length === 0 && (
          <div className="p-12 text-center text-neutral-500">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Aucun article trouvé</p>
            <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticles;

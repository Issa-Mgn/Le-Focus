import React, { useState, useEffect } from 'react';
import { getArticles } from '../data/mockData';

const DebugArticles = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const loadedArticles = getArticles();
    setArticles(loadedArticles);
    console.log('📚 Articles chargés:', loadedArticles);
  }, []);

  const clearLocalStorage = () => {
    if (window.confirm('Voulez-vous vraiment supprimer tous les articles ?')) {
      localStorage.removeItem('focus_articles');
      setArticles([]);
      window.location.reload();
    }
  };

  const randomizeViews = () => {
    if (window.confirm('Voulez-vous randomiser les vues de tous les articles ?')) {
      const updatedArticles = articles.map(article => ({
        ...article,
        views: Math.floor(Math.random() * (5000 - 100 + 1)) + 100
      }));
      localStorage.setItem('focus_articles', JSON.stringify(updatedArticles));
      setArticles(updatedArticles);
      alert('Vues mises à jour !');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Debug - Articles localStorage</h1>
            <div className="flex gap-4">
              <button
                onClick={randomizeViews}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Randomiser Vues
              </button>
              <button
                onClick={clearLocalStorage}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Vider localStorage
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Articles</p>
              <p className="text-3xl font-bold text-blue-900">{articles.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Taille localStorage</p>
              <p className="text-3xl font-bold text-green-900">
                {localStorage.getItem('focus_articles') 
                  ? (new Blob([localStorage.getItem('focus_articles')]).size / 1024).toFixed(2) + ' KB'
                  : '0 KB'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liste des articles */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Liste des Articles</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedArticle?.id === article.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <p className="font-bold text-sm mb-1">{article.title}</p>
                  <p className="text-xs text-neutral-500">
                    ID: {article.id} | {article.images?.length || 0} images
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Détails de l'article sélectionné */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Détails de l'Article</h2>
            {selectedArticle ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Titre</p>
                  <p className="font-bold">{selectedArticle.title}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-500">Catégorie</p>
                  <p>{selectedArticle.category}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-500">Auteur</p>
                  <p>{selectedArticle.author}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-500">Date</p>
                  <p>{selectedArticle.date}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-500 mb-2">
                    Images ({selectedArticle.images?.length || 0})
                  </p>
                  {selectedArticle.images && selectedArticle.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedArticle.images.map((img, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <img
                            src={img}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Error';
                            }}
                          />
                          <p className="text-xs p-2 bg-neutral-50">
                            {img.substring(0, 30)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-400">Aucune image</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-500">PDF</p>
                  <p className="text-xs break-all">
                    {selectedArticle.pdf ? selectedArticle.pdf.substring(0, 100) + '...' : 'Aucun PDF'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-500">Contenu</p>
                  <p className="text-sm text-neutral-600 max-h-40 overflow-y-auto">
                    {selectedArticle.content}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-neutral-400 text-center py-20">
                Sélectionnez un article pour voir les détails
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugArticles;

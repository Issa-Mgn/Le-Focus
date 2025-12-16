import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Download, FileText, TrendingUp, MoreHorizontal, Edit } from 'lucide-react';
import AdminDashboardSkeleton from '../components/AdminDashboardSkeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalDownloads: 0,
    activeArticles: 0,
    monthlyGrowth: 0
  });
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allArticles = await api.articles.getAll();
        
        if (Array.isArray(allArticles)) {
          // Calculate stats
          const totalViews = allArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);
          const totalDownloads = allArticles.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
          
          setArticles(allArticles.slice(0, 5)); // Get 5 recent articles
          setStats({
            totalViews: totalViews,
            totalDownloads: totalDownloads,
            activeArticles: allArticles.length,
            monthlyGrowth: 12 // Hardcoded for now, implies growth
          });

          // Generate Chart Data by Category
          // Since we don't have daily traffic logs, we visualize content distribution/popularity by category
          const categoryStats = allArticles.reduce((acc, article) => {
            const cat = article.category || 'Autres';
            if (!acc[cat]) {
              acc[cat] = { name: cat, vues: 0, downloads: 0 };
            }
            acc[cat].vues += (article.views || 0);
            acc[cat].downloads += (article.downloads || 0);
            return acc;
          }, {});

          // Sort by views and take top categories
          const generatedChartData = Object.values(categoryStats)
            .sort((a, b) => b.vues - a.vues)
            .slice(0, 7);
            
          setChartData(generatedChartData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tableau de Bord</h1>
          <p className="text-neutral-500">Bienvenue, Mr Wabi MIGAN.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Vues Totales" 
          value={stats.totalViews.toLocaleString()} 
          icon={Eye} 
          trend="+12%" 
          color="blue"
        />
        <StatsCard 
          title="Téléchargements" 
          value={stats.totalDownloads.toLocaleString()} 
          icon={Download} 
          trend="+5%" 
          color="green"
        />
        <StatsCard 
          title="Articles Actifs" 
          value={stats.activeArticles.toLocaleString()} 
          icon={FileText} 
          trend="+1" 
          color="purple"
        />
        <StatsCard 
          title="Croissance" 
          value={`${stats.monthlyGrowth}%`} 
          icon={TrendingUp} 
          trend="+2.5%" 
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
          <h3 className="text-lg font-bold mb-6">Analyses par Catégorie</h3>
          <div className="h-80 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="vues" name="Vues" fill="#D32F2F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="downloads" name="Téléchargements" fill="#212121" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
          <h3 className="text-lg font-bold mb-6">Performance des Articles</h3>
          <div className="space-y-6">
            {articles.slice(0, 5).map((article, index) => (
              <div key={article.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <span className="text-neutral-400 font-bold w-6 flex-shrink-0">0{index + 1}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-neutral-900 truncate block" title={article.title}>
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1">
                      <span>{article.views || 0} vues</span>
                      <span>{article.downloads || 0} téléchargements</span>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-24 bg-neutral-100 rounded-full h-2 overflow-hidden flex-shrink-0">
                  <div 
                    className="bg-primary-600 h-full rounded-full" 
                    style={{ width: `${Math.min(((article.views || 0) / 100), 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Articles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">Articles Récents</h3>
          <button className="text-primary-600 text-sm font-medium hover:underline">Voir tout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
              <tr>
                <th className="px-4 md:px-6 py-4 font-medium text-xs md:text-sm">Titre</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Auteur</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Date</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Statut</th>
                <th className="px-4 md:px-6 py-4 font-medium text-xs md:text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 font-medium text-neutral-900">
                     <div className="truncate max-w-[120px] sm:max-w-xs text-xs md:text-sm" title={article.title}>{article.title}</div>
                     <div className="md:hidden text-[10px] text-neutral-500 mt-1">{article.date || article.publishedAt}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600 hidden md:table-cell">{article.author}</td>
                  <td className="px-6 py-4 text-neutral-600 hidden sm:table-cell">{article.date || article.publishedAt}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Publié
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/edit/${article.id}`}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Modifier l'article"
                      >
                        <Edit size={16} className="md:w-[18px] md:h-[18px]" />
                      </Link>
                      <button className="hidden sm:block p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
          <Icon size={24} className="text-primary-600" />
        </div>
        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <h3 className="text-neutral-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  );
};

export default AdminDashboard;

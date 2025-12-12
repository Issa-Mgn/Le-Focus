import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Settings, LogOut, X  } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import logo from '../assets/logo.jpg';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const links = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Articles', path: '/admin/articles', icon: FileText },
    { name: 'Nouvel Article', path: '/admin/new-article', icon: PlusCircle },
    { name: 'Paramètres', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
      <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded overflow-hidden">
            <img src={logo} alt="Le Focus" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-serif font-bold">Le Focus</span>
        </Link>
        {/* Mobile Close Button */}
        <button onClick={onClose} className="md:hidden text-neutral-400 hover:text-white">
          <X size={20} className="rotate-180" />
        </button>
      </div>
      <div className="px-6 py-2">
        <p className="text-xs text-neutral-500 uppercase tracking-widest">Espace Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary-700 text-white shadow-lg shadow-primary-900/20" 
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronDown, Home, Info, Mail, Menu, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mockData';
import logo from '../assets/logo.jpg';

const navLinks = [
  { to: '/', label: 'Accueil', Icon: Home },
  { to: '/articles', label: 'Articles', Icon: BookOpen },
  { to: '/contact', label: 'Contact', Icon: Mail },
  { to: '/about', label: 'À propos', Icon: Info },
  { to: '/bookmarks', label: 'Ma Liste', Icon: Bookmark },
];

const Logo = () => (
  <img 
    src={logo} 
    alt="Le Focus" 
    className="h-10 w-auto object-contain"
  />
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (location.pathname.startsWith('/admin')) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowSearch(false);
    setIsOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <div className="container-custom flex h-[76px] items-center justify-between md:h-[82px]">
        <Link to="/" onClick={() => setIsOpen(false)} aria-label="Le Focus - Accueil">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-display text-[13px] font-medium transition hover:text-primary-500 ${active ? 'text-primary-500' : 'text-neutral-700'}`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 font-display text-[13px] font-medium text-neutral-700 transition hover:text-primary-500"
            >
              Rubriques <ChevronDown size={15} strokeWidth={1.8} />
            </button>
            <div className="invisible absolute left-1/2 top-full grid w-[300px] -translate-x-1/2 translate-y-3 grid-cols-2 gap-x-6 gap-y-4 border border-neutral-200 bg-white p-6 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="font-display text-[13px] text-neutral-600 transition hover:text-primary-500"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            onClick={() => {
              setShowSearch((value) => !value);
              setIsOpen(false);
            }}
            className="grid h-10 w-10 place-items-center text-neutral-700 transition hover:text-primary-500"
            aria-label={showSearch ? 'Fermer la recherche' : 'Rechercher'}
          >
            {showSearch ? <X size={22} strokeWidth={2} /> : <Search size={22} strokeWidth={2} />}
          </button>

          <Link
            to="/order-insertion"
            className="hidden bg-primary-500 px-5 py-3 font-display text-[12px] font-bold text-white transition hover:bg-primary-500-temp md:inline-block"
          >
            Commander
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsOpen((value) => !value);
              setShowSearch(false);
            }}
            className="grid h-10 w-10 place-items-center text-neutral-900 transition hover:text-primary-500 md:hidden"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isOpen ? <X size={27} strokeWidth={2} /> : <Menu size={27} strokeWidth={2} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-neutral-100 bg-white"
          >
            <form onSubmit={handleSearch} className="container-custom flex items-center gap-3 py-4">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                placeholder="Rechercher un article..."
                className="focus-input h-12 flex-1 text-sm"
              />
              <button type="submit" className="h-12 bg-primary-500 px-6 font-bold uppercase text-white hover:bg-primary-500-temp">
                OK
              </button>
              <button type="button" onClick={() => setShowSearch(false)} className="grid h-12 w-10 place-items-center text-neutral-500" aria-label="Fermer">
                <X size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-neutral-100 bg-white md:hidden"
          >
            <div className="container-custom py-5">
              <div className="divide-y divide-neutral-100">
                {navLinks.map((link) => {
                  const active = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 py-4 font-display text-[15px] font-semibold ${active ? 'text-primary-500' : 'text-neutral-700'}`}
                    >
                      <link.Icon size={22} strokeWidth={1.8} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/order-insertion"
                onClick={() => setIsOpen(false)}
                className="mt-5 block bg-primary-500 px-6 py-4 text-center font-display text-sm font-bold text-white hover:bg-primary-500"
              >
                Commander une insertion
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

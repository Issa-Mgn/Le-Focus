import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, Home, Info, Mail, Menu, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/articles', label: 'Articles', icon: BookOpen },
  { to: '/contact', label: 'Contact', icon: Mail },
  { to: '/about', label: 'À propos', icon: Info },
  { to: '/bookmarks', label: 'Ma Liste', icon: Bookmark },
];

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="flex h-[54px] w-[54px] items-center justify-center bg-primary-700 text-[31px] font-black leading-none text-white sm:h-[68px] sm:w-[68px]">
      <span className="font-serif">F</span>
    </div>
    <div>
      <div className="font-serif text-[27px] font-black leading-none text-neutral-950 sm:text-[32px]">
        Le Focus
      </div>
      <div className="mt-2 font-display text-[10px] font-medium uppercase tracking-[0.32em] text-neutral-500 sm:text-[11px]">
        Porto-Novo • Journal
      </div>
    </div>
  </div>
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white shadow-[0_3px_10px_rgba(0,0,0,0.06)]">
      <div className="container-custom flex h-[86px] items-center justify-between sm:h-[96px]">
        <Link to="/" onClick={() => setIsOpen(false)} aria-label="Le Focus - Accueil">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setShowSearch((value) => !value);
              setIsOpen(false);
            }}
            className="grid h-11 w-11 place-items-center text-neutral-700 transition hover:text-primary-700"
            aria-label={showSearch ? 'Fermer la recherche' : 'Rechercher'}
          >
            {showSearch ? <X size={27} strokeWidth={2} /> : <Search size={27} strokeWidth={2} />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen((value) => !value);
              setShowSearch(false);
            }}
            className="grid h-11 w-11 place-items-center text-neutral-900 transition hover:text-primary-700"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isOpen ? <X size={31} strokeWidth={2} /> : <Menu size={31} strokeWidth={2} />}
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
            <form onSubmit={handleSearch} className="container-custom flex items-center gap-3 py-5">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                placeholder="Rechercher un article..."
                className="focus-input h-14 flex-1 text-base"
              />
              <button type="submit" className="h-14 bg-primary-700 px-7 font-bold uppercase text-white hover:bg-primary-800">
                OK
              </button>
              <button type="button" onClick={() => setShowSearch(false)} className="grid h-12 w-10 place-items-center text-neutral-500" aria-label="Fermer">
                <X size={22} />
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
            className="overflow-hidden border-t border-neutral-100 bg-white"
          >
            <div className="container-custom py-5">
              <div className="divide-y divide-neutral-100">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 py-4 font-display text-[15px] font-semibold ${active ? 'text-primary-700' : 'text-neutral-700'}`}
                    >
                      <Icon size={19} strokeWidth={1.7} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/order-insertion"
                onClick={() => setIsOpen(false)}
                className="mt-5 block bg-primary-700 px-6 py-4 text-center font-display text-sm font-bold text-white hover:bg-primary-800"
              >
                Commander une insertion
              </Link>
              {isAuthenticated && (
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="mt-4 block text-center text-sm text-neutral-500">
                  Administration
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

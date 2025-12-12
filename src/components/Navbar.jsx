import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown, Sparkles } from 'lucide-react';
import { categories } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setIsOpen(false);
    }
  };

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <motion.nav 
      className={clsx(
        "fixed w-full z-50 transition-all duration-500",
        scrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-lg py-3" 
          : "bg-white/90 backdrop-blur-md py-5 shadow-sm"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            className="relative"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {/* <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary-600/30 group-hover:shadow-xl group-hover:shadow-primary-600/40 transition-shadow">
              <img src={logo} alt="Le Focus" className="w-full h-full object-cover" />
            </div> */}
          </motion.div>
          <div>
            <span className="text-2xl font-serif font-bold tracking-tight text-neutral-900 block">
              Le Focus
            </span>
            {/* <span className="text-xs text-neutral-500 font-medium tracking-wider uppercase">
              Journal d'Excellence
            </span> */}
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-bold text-neutral-600 hover:text-primary-700 transition-colors uppercase tracking-wide relative group"
          >
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-primary-700 transition-colors uppercase tracking-wide group"
            >
              Catégories
              <ChevronDown 
                size={16} 
                className={clsx(
                  "transition-transform duration-300",
                  showCategories && "rotate-180"
                )} 
              />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            
            <AnimatePresence>
              {showCategories && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-4 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-3 min-w-[220px] overflow-hidden"
                >
                  {categories.map((category, index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/category/${category.toLowerCase()}`}
                        className="block px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-all relative group"
                        onClick={() => setShowCategories(false)}
                      >
                        <span className="relative z-10">{category}</span>
                        <div className="absolute left-0 top-0 h-full w-1 bg-primary-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/about"
            className="text-sm font-bold text-neutral-600 hover:text-primary-700 transition-colors uppercase tracking-wide relative group"
          >
            À propos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/contact"
            className="text-sm font-bold text-neutral-600 hover:text-primary-700 transition-colors uppercase tracking-wide relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.form 
                onSubmit={handleSearch} 
                className="flex items-center gap-2"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="px-5 py-2.5 border-2 border-neutral-200 rounded-full focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 w-64 font-medium"
                  autoFocus
                />
                <motion.button 
                  type="button" 
                  onClick={() => setShowSearch(false)} 
                  className="p-2.5 text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </motion.form>
            ) : (
              <motion.button 
                onClick={() => setShowSearch(true)} 
                className="p-2.5 text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search size={20} />
              </motion.button>
            )}
          </AnimatePresence>
          
          {/* Order Insertion Button */}
          <Link to="/order-insertion">
            <motion.button 
              className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full font-bold text-sm shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Commander une insertion
            </motion.button>
          </Link>
          

        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="md:hidden p-2 text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 w-full bg-white border-t border-neutral-100 shadow-2xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-6 px-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 font-medium"
                />
                <motion.button 
                  type="submit" 
                  className="p-3 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={20} />
                </motion.button>
              </form>

              {/* Order Insertion Button - Mobile */}
              <Link
                to="/order-insertion"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <motion.button 
                  className="w-full px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  Commander une insertion
                </motion.button>
              </Link>

              
              <Link
                to="/"
                className="text-lg font-bold text-neutral-800 py-3 px-4 hover:bg-neutral-50 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              
              {/* Categories Dropdown for Mobile */}
              <div className="border-t border-neutral-100 pt-4">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="w-full flex items-center justify-between text-lg font-bold text-neutral-800 py-3 px-4 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                  <span>Catégories</span>
                  <ChevronDown 
                    size={20} 
                    className={clsx(
                      "transition-transform duration-300",
                      showCategories && "rotate-180"
                    )} 
                  />
                </button>
                
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-2 space-y-1">
                        {categories.map((category) => (
                          <Link
                            key={category}
                            to={`/category/${category.toLowerCase()}`}
                            className="block text-neutral-700 py-3 px-4 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors font-medium"
                            onClick={() => {
                              setIsOpen(false);
                              setShowCategories(false);
                            }}
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/about"
                className="text-lg font-bold text-neutral-800 py-3 px-4 hover:bg-neutral-50 rounded-xl transition-colors border-t border-neutral-100"
                onClick={() => setIsOpen(false)}
              >
                À propos
              </Link>

              <Link
                to="/contact"
                className="text-lg font-bold text-neutral-800 py-3 px-4 hover:bg-neutral-50 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

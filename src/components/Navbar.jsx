import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Search, ChevronDown, Sparkles, Info, FolderClosed, FolderOpen, Unplug, BookOpen, Home } from 'lucide-react';
import { categories } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { scrollYProgress } = useScroll();

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

  const navLinks = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/articles', label: 'Articles', icon: FolderOpen },
    { to: '/contact', label: 'Contact', icon: Unplug },
    { to: '/about', label: 'À propos', icon: Info },
  ];

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.nav 
        className={clsx(
          "fixed w-full z-50 transition-all duration-500",
          scrolled 
            ? "bg-white/80 backdrop-blur-2xl shadow-xl border-b border-neutral-200/50 py-2" 
            : "bg-white/70 backdrop-blur-xl py-4 shadow-md"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="container-custom">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {/* Animated Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Logo Container with F */}
                <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-serif font-black text-white">F</span>
                </div>
              </motion.div>
              
              <div className="flex flex-col">
                <motion.span 
                  className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  Le Focus
                </motion.span>
                <span className="text-[10px] md:text-xs text-neutral-500 font-semibold tracking-widest uppercase">
                  
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Accueil */}
              {navLinks.slice(0, 2).map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative group px-4 py-2"
                  >
                    <motion.div
                      className={clsx(
                        "flex items-center gap-2 text-sm font-bold transition-colors relative z-10",
                        isActive 
                          ? "text-primary-700" 
                          : "text-neutral-600 hover:text-primary-700"
                      )}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon size={16} className={isActive ? "animate-pulse" : ""} />
                      <span className="uppercase tracking-wide">{link.label}</span>
                    </motion.div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover Background */}
                    <motion.div
                      className="absolute inset-0 bg-primary-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-0"
                      whileHover={{ scale: 1.05 }}
                    />
                  </Link>
                );
              })}

              {/* Categories Mega Menu - MAINTENANT ICI */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowCategories(!showCategories)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors uppercase tracking-wide group relative",
                    showCategories ? "text-primary-700" : "text-neutral-600 hover:text-primary-700"
                  )}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FolderClosed size={16} />
                  <span>Catégories</span>
                  <motion.div
                    animate={{ rotate: showCategories ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                  
                  {/* Hover Background */}
                  <motion.div
                    className="absolute inset-0 bg-primary-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-0"
                    whileHover={{ scale: 1.05 }}
                  />
                </motion.button>
                
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-200/50 p-4 min-w-[280px] grid grid-cols-2 gap-2"
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      {categories.map((category, index) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            to={`/category/${category.toLowerCase()}`}
                            className="block px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all relative group overflow-hidden"
                            onClick={() => setShowCategories(false)}
                          >
                            <span className="relative z-10">{category}</span>
                            <motion.div
                              className="absolute left-0 top-0 h-full w-1 bg-primary-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"
                              whileHover={{ scaleY: 1 }}
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact et À propos */}
              {navLinks.slice(2).map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative group px-4 py-2"
                  >
                    <motion.div
                      className={clsx(
                        "flex items-center gap-2 text-sm font-bold transition-colors relative z-10",
                        isActive 
                          ? "text-primary-700" 
                          : "text-neutral-600 hover:text-primary-700"
                      )}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon size={16} className={isActive ? "animate-pulse" : ""} />
                      <span className="uppercase tracking-wide">{link.label}</span>
                    </motion.div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover Background */}
                    <motion.div
                      className="absolute inset-0 bg-primary-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-0"
                      whileHover={{ scale: 1.05 }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
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
                      className="px-5 py-2.5 border-2 border-neutral-200 rounded-full focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 w-64 font-medium bg-white/80 backdrop-blur-sm"
                      autoFocus
                    />
                    <motion.button 
                      type="button" 
                      onClick={() => setShowSearch(false)} 
                      className="p-2.5 text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 rounded-full transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.button 
                    onClick={() => setShowSearch(true)} 
                    className="p-3 text-neutral-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Search size={20} />
                    <motion.div
                      className="absolute inset-0 bg-primary-100 rounded-full opacity-0 group-hover:opacity-100 -z-10"
                      whileHover={{ scale: 1.2 }}
                    />
                  </motion.button>
                )}
              </AnimatePresence>
              
              {/* CTA Button */}
              <Link to="/order-insertion">
                <motion.button 
                  className="relative px-6 py-3 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 text-white rounded-full font-bold text-sm shadow-lg shadow-primary-600/30 overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Commander
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-700"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              className="lg:hidden p-2 text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-neutral-200/50 shadow-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-6 px-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
                {/* Search Mobile */}
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 font-medium bg-white"
                  />
                  <motion.button 
                    type="submit" 
                    className="p-3 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search size={20} />
                  </motion.button>
                </form>

                {/* CTA Mobile */}
                <Link
                  to="/order-insertion"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.button 
                    className="w-full px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.95 }}
                  >
                    Commander une insertion
                  </motion.button>
                </Link>

                {/* Nav Links Mobile */}
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={clsx(
                        "flex items-center gap-3 text-lg font-bold py-3 px-4 rounded-xl transition-all",
                        isActive 
                          ? "bg-primary-50 text-primary-700" 
                          : "text-neutral-800 hover:bg-neutral-50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={20} />
                      {link.label}
                    </Link>
                  );
                })}
                
                {/* Categories Mobile */}
                <div className="border-t border-neutral-100 pt-3">
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="w-full flex items-center justify-between text-lg font-bold text-neutral-800 py-3 px-4 hover:bg-neutral-50 rounded-xl transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <BookOpen size={20} />
                      Catégories
                    </span>
                    <motion.div
                      animate={{ rotate: showCategories ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
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
                        <div className="pl-4 pt-2 space-y-1 grid grid-cols-2 gap-2">
                          {categories.map((category) => (
                            <Link
                              key={category}
                              to={`/category/${category.toLowerCase()}`}
                              className="block text-neutral-700 py-3 px-4 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors font-medium text-sm"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;

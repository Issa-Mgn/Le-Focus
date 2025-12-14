import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { categories } from '../data/mockData';
import ArticleCard from '../components/ArticleCard';
import InfiniteImageScroll from '../components/InfiniteImageScroll';
import CustomAlert from '../components/CustomAlert';
import ArticleCardSkeleton from '../components/ArticleCardSkeleton';

import { ArrowRight } from 'lucide-react';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Trier les articles par date de publication (plus récent en premier)
  const sortedArticles = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));


  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await api.articles.getAll();
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.warn("API did not return an array of articles:", data);
          setArticles([]);
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();

    // Charger les tests de performance en mode développement
    if (process.env.NODE_ENV === 'development') {
      import('../utils/performanceTests').then(module => {
        window.performanceTests = module;
        console.log('%c📊 Tests de performance chargés!', 'color: #DC2626; font-weight: bold;');
        console.log('Exécutez: %cwindow.performanceTests.runAllTests()', 'color: #2563EB; font-weight: bold;');
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Veuillez entrer une adresse email valide'
      });
      return;
    }

    setIsSubscribing(true);

    // Simulate API call
    setTimeout(() => {
      // Get existing subscribers
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      
      // Check if already subscribed
      const emailExists = subscribers.some(sub => sub.email === newsletterEmail);
      if (emailExists) {
        setAlert({
          show: true,
          type: 'warning',
          message: 'Cette adresse email est déjà inscrite à notre newsletter'
        });
        setIsSubscribing(false);
        return;
      }

      // Add new subscriber
      subscribers.push({
        email: newsletterEmail,
        subscribedAt: new Date().toISOString(),
        active: true
      });
      
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      
      setAlert({
        show: true,
        type: 'success',
        message: '🎉 Merci de votre inscription ! Vous recevrez bientôt nos actualités.'
      });
      
      setNewsletterEmail('');
      setIsSubscribing(false);
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden">
      <CustomAlert 
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* Hero Section with Parallax Effect */}
      {/* <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-primary-950"> */}
        {/* Animated Background */}
        {/* <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" 
               style={{
                 transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                 transition: 'transform 0.3s ease-out'
               }}
          />
        </div> */}
        
        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent"></div>
         */}
        {/* Floating Elements */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div> */}
        
        {/* Content */}
        {/* <div className="container-custom relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          > */}
            {/* <motion.div 
              className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-primary-600/20 backdrop-blur-sm border border-primary-500/30 text-primary-300 text-sm font-bold uppercase tracking-wider mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={16} className="animate-pulse" />
              Journal d'Informations et D'investigations paraissant à Porto-Novo   
            </motion.div> */}
            
            {/* <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold leading-tight mb-6 text-white">
              <span className="block mb-2">L'Information</span>
              <span className="bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
                Qui Fait la Différence
              </span>
            </h1> */}
            
            {/* <p className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed max-w-3xl mx-auto font-light">
              Des analyses pointues, des reportages exclusifs et une vision claire sur les enjeux qui façonnent notre monde.
            </p> */}
            
            {/* <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/articles">
                <motion.button 
                  className="btn-primary group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Découvrir nos articles
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link> */}
              
              {/* <a href="#newsletter">
                <motion.button 
                  className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  S'abonner à la newsletter
                </motion.button>
              </a>
            </div>
          </motion.div> */}

          {/* Stats */}
          {/* <motion.div 
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { label: 'Articles', value: '500+', icon: Award },
              { label: 'Lecteurs', value: '50K+', icon: TrendingUp },
              { label: 'Pays', value: '25+', icon: Zap }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <stat.icon className="mx-auto mb-3 text-primary-400 group-hover:text-primary-300 transition-colors" size={32} />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div> */}
        {/* </div> */}

        {/* Scroll Indicator */}
        {/* <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <motion.div 
              className="w-1.5 h-1.5 bg-white rounded-full mx-auto"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div> */}
      {/* </section> */}

      {/* LATEST ARTICLE IMAGES CAROUSEL */}
      {isLoading ? (
        <div className="bg-white pb-8 border-b border-neutral-100">
          {/* Header Skeleton */}
          <div className="container-custom py-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-2 h-2 rounded-full bg-primary-500"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="w-24 h-6 bg-neutral-200 rounded animate-pulse" />
              <div className="flex-1 h-6 bg-neutral-200 rounded animate-pulse max-w-md" />
            </div>
          </div>

          {/* Carousel Skeleton */}
          <div className="relative w-full h-[450px] md:h-[500px] bg-neutral-800 overflow-hidden">
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Content Skeleton - En bas à gauche */}
            <div className="absolute bottom-0 left-0 right-0 pb-8 md:pb-12">
              <div className="container-custom w-full px-4 md:px-8">
                <div className="max-w-3xl">
                  {/* Badge Skeleton */}
                  <motion.div 
                    className="inline-flex items-center gap-2 mb-4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" />
                    <div className="w-24 h-6 bg-white/20 rounded-full backdrop-blur-sm" />
                  </motion.div>
                  
                  {/* Title Skeleton */}
                  <div className="space-y-3 mb-3">
                    <motion.div 
                      className="w-full max-w-xl h-8 md:h-10 bg-white/20 rounded-lg backdrop-blur-sm relative overflow-hidden"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                    <motion.div 
                      className="w-2/3 max-w-md h-8 md:h-10 bg-white/20 rounded-lg backdrop-blur-sm relative overflow-hidden"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Excerpt Skeleton */}
                  <div className="space-y-2 mb-5">
                    <div className="w-full max-w-2xl h-4 bg-white/15 rounded" />
                    <div className="w-3/4 max-w-xl h-4 bg-white/15 rounded" />
                  </div>
                  
                  {/* Buttons Skeleton */}
                  <div className="flex flex-wrap items-center gap-3">
                    <motion.div 
                      className="px-6 py-3 bg-white/90 rounded-full relative overflow-hidden"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-32 h-5 bg-neutral-300 rounded" />
                    </motion.div>
                    <div className="px-4 py-2.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
                      <div className="w-24 h-4 bg-white/20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows Skeleton */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-50">
              <div className="w-6 h-6" />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-50">
              <div className="w-6 h-6" />
            </div>

            {/* Dots Skeleton */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1.5 rounded-full ${i === 1 ? 'w-8 bg-primary-500' : 'w-1.5 bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>
      ) : sortedArticles.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <InfiniteImageScroll article={sortedArticles[0]} />
        </motion.div>
      ) : null}

      {/* Categories Section */}
      <section className="py-16 bg-white border-b border-neutral-100 overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-serif mb-4">Explorez par Catégories</h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full"></div>
          </motion.div>

          {/* Scrolling Categories Container */}
          <div className="relative cursor-grab active:cursor-grabbing">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrolling Animation with Drag */}
            <motion.div
              className="flex gap-4"
              drag="x"
              dragConstraints={{ left: -2000, right: 0 }}
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
              whileHover={{ 
                transition: { duration: 0 } // Pause animation on hover
              }}
              whileTap={{ 
                cursor: "grabbing",
                transition: { duration: 0 } // Pause animation while dragging
              }}
            >
              {/* Duplicate categories for infinite scroll effect */}
              {[...categories, ...categories, ...categories].map((category, index) => (
                <Link
                  key={`${category}-${index}`}
                  to={`/category/${category.toLowerCase()}`}
                  className="flex-shrink-0 px-8 py-4 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-700 font-bold hover:from-primary-600 hover:to-primary-700 hover:text-white transition-all shadow-sm hover:shadow-lg hover:scale-105 whitespace-nowrap border border-neutral-200 hover:border-primary-600"
                  draggable="false"
                >
                  {category}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      {/* Latest Articles Grid */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-800 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-neutral-900">
                  Dernières <span className="gradient-text">Publications</span>
                </h2>
              </div>
              <p className="text-neutral-600">Restez informé des dernières actualités</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-5xl mx-auto">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => <ArticleCardSkeleton key={i} />)
            ) : sortedArticles.length > 0 ? (
              sortedArticles.slice(0, 4).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))
            ) : (
             <div className="col-span-full text-center py-12">
               <p className="text-neutral-500 font-medium">Aucun article publié pour le moment.</p>
             </div>
            )}
          </div>

          {sortedArticles.length > 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mt-12"
            >
              <Link to="/articles">
                <motion.button
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">
                    Voir tous les articles ({sortedArticles.length})
                  </span>
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center"></div>
        </div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        
        
        {/* Simple Analytics Strip */}
        <div className="container-custom relative z-10 py-12">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-24">
            {[
              { label: 'Lecteurs Mensuels', value: '50K+' },
              { label: 'Articles Publiés', value: '500+' },
              { label: 'Pays Couverts', value: '10+' },
              { label: 'Années d\'Expérience', value: '20+' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-400 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

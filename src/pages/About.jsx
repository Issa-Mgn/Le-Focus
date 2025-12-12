import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, Heart, TrendingUp, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-neutral-950 via-neutral-900 to-primary-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              À Propos de <span className="text-primary-400">Le Focus</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed">
              Journal d'Informations et d'Investigations Paraissant à Porto-Novo
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-serif font-bold mb-6">Notre Mission</h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                Le Focus est un journal d'investigation et d'information qui s'engage à fournir des analyses approfondies et des reportages exclusifs sur les enjeux qui façonnent notre société.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                Nous croyons en un journalisme indépendant, rigoureux et accessible à tous. Notre équipe de journalistes expérimentés travaille sans relâche pour vous apporter l'information qui compte vraiment.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Basés à Porto-Novo, nous couvrons l'actualité locale, nationale et internationale avec un regard critique et objectif.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800" 
                alt="Notre équipe"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold mb-4">Nos Valeurs</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Les principes qui guident notre travail quotidien
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Excellence',
                description: 'Nous visons l\'excellence dans chaque article, chaque enquête, chaque reportage.'
              },
              {
                icon: Heart,
                title: 'Intégrité',
                description: 'L\'honnêteté et la transparence sont au cœur de notre démarche journalistique.'
              },
              {
                icon: Target,
                title: 'Précision',
                description: 'Nous vérifions méticuleusement nos sources pour garantir l\'exactitude de nos informations.'
              },
              {
                icon: Users,
                title: 'Proximité',
                description: 'Nous sommes à l\'écoute de nos lecteurs et de leurs préoccupations.'
              },
              {
                icon: TrendingUp,
                title: 'Innovation',
                description: 'Nous adoptons les nouvelles technologies pour mieux servir nos lecteurs.'
              },
              {
                icon: Globe,
                title: 'Ouverture',
                description: 'Nous offrons une perspective globale tout en restant ancrés localement.'
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-neutral-100"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="text-primary-700" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary-700">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Articles publiés' },
              { value: '50K+', label: 'Lecteurs mensuels' },
              { value: '25+', label: 'Pays couverts' },
              { value: '10+', label: 'Années d\'expérience' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

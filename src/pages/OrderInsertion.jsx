import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, DollarSign, Mail, Phone, User, Building, CheckCircle, Send, Calculator, Layers, Type, Globe, Loader2 } from 'lucide-react';
import CustomAlert from '../components/CustomAlert';
import { api } from '../services/api';

// Pricing Data configuration from the image
const PRICING_DATA = {
  abonnement: {
    zones: [
      { id: 'benin', label: 'Autres localités du Bénin' },
      { id: 'cedeao', label: 'Espace CEDEAO' },
      { id: 'afrique', label: 'Afrique' },
      { id: 'monde', label: 'Europe - Amérique - Asie - Océanie' }
    ],
    durations: [
      { id: '1', label: '1 Mois' },
      { id: '3', label: '3 Mois' },
      { id: '6', label: '6 Mois' },
      { id: '12', label: '12 Mois' }
    ],
    prices: {
      benin: { '1': 9000, '3': 24000, '6': 48000, '12': 95000 },
      cedeao: { '1': 15000, '3': 45000, '6': 90000, '12': 180000 },
      afrique: { '1': 20000, '3': 60000, '6': 120000, '12': 240000 },
      monde: { '1': 35000, '3': 105000, '6': 210000, '12': 420000 }
    }
  },
  insertion: {
    options: {
      color: [
        { id: '1page', label: '1 Page' },
        { id: '1/2', label: '1/2 Page' },
        { id: '1/4', label: '1/4 Page' },
        { id: '1/8', label: '1/8 Page' },
        { id: '1/16', label: '1/16 Page' }
      ],
      bw: [
        { id: '1page', label: '1 Page' },
        { id: '1/2', label: '1/2 Page' },
        { id: '1/4', label: '1/4 Page' },
        { id: '1/8', label: '1/8 Page' }
      ]
    },
    // [1-10 parutions, 11-40 parutions, >40 parutions]
    prices: {
      color: {
        '1page': [200000, 150000, 100000],
        '1/2': [120000, 90000, 75000],
        '1/4': [95000, 60000, 50000],
        '1/8': [60000, 45000, 30000],
        '1/16': [45000, 30000, 20000]
      },
      bw: {
        '1page': [200000, 150000, 150000],
        '1/2': [100000, 70000, 50000],
        '1/4': [60000, 40000, 25000],
        '1/8': [40000, 25000, 15000]
      }
    }
  },
  publi_redaction: {
    // A - Texte proposé par l'annonceur
    proposed: {
      color: {
        '1page': [200000, 150000, 100000],
        '1/2': [140000, 100000, 60000],
        '1/4': [80000, 70000, 40000],
        '1/8': [40000, 25000, 15000],
        '1/16': [20000, 15000, 5000]
      },
      bw: {
        '1page': [150000, 120000, 100000],
        '1/2': [120000, 90000, 60000],
        '1/4': [75000, 65000, 40000]
      }
    },
    // B - Texte rédigé par la rédaction
    redaction: {
      color: {
        '1page': [250000, 200000, 150000],
        '1/2': [150000, 110000, 75000],
        '1/4': [110000, 75000, 50000]
      },
      bw: {
        '1page': [200000, 150000, 100000],
        '1/2': [150000, 120000, 55000],
        '1/4': [100000, 80000, 35000]
      }
    }
  },
  publi_reportage: {
    types: [
      { id: 'emplois', label: 'Emplois (demande ou offres)' },
      { id: 'immobilier', label: 'Immobilier (maison, parcelles...)' },
      { id: 'divers', label: 'Annonces diverses (Baptême, mariage...)' },
      { id: 'deces', label: 'Annonce de décès' }
    ],
    // Price per line
    prices: {
      emplois: { one: 500, multiple: 400 },
      immobilier: { one: 800, multiple: 700 },
      divers: { one: 1000, multiple: 800 },
      deces: { one: 700, multiple: 700 } // Special logic for photos handled separately
    }
  }
};

const OrderInsertion = () => {
  const [orderType, setOrderType] = useState('insertion'); // insertion, abonnement, publi_redaction, publi_reportage
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    // Specific fields
    zone: 'benin',
    duration: '1',
    format: '1page',
    isColor: true,
    quantity: 1, // Number of insertions
    redactionType: 'proposed', // proposed, redaction
    reportageType: 'emplois',
    hasPhoto: false, // For deces
    linesEstimate: 10 // For reportage estimate
  });

  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate price effect
  useEffect(() => {
    let price = 0;
    const { zone, duration, format, isColor, quantity, redactionType, reportageType, hasPhoto, linesEstimate } = formData;

    if (orderType === 'abonnement') {
      price = PRICING_DATA.abonnement?.prices[zone]?.[duration] || 0;
    } 
    else if (orderType === 'insertion') {
      // Determine quantity bracket index: 0 (1-10), 1 (11-40), 2 (>40)
      let bracket = 0;
      if (quantity > 40) bracket = 2;
      else if (quantity > 10) bracket = 1;

      const colorKey = isColor ? 'color' : 'bw';
      const unitPrice = PRICING_DATA.insertion?.prices[colorKey][format]?.[bracket] || 0;
      price = unitPrice * quantity;
    }
    else if (orderType === 'publi_redaction') {
      let bracket = 0;
      if (quantity > 40) bracket = 2;
      else if (quantity > 10) bracket = 1;

      const colorKey = isColor ? 'color' : 'bw';
      const source = PRICING_DATA.publi_redaction?.[redactionType];
      
      // Safety check as some formats don't exist in BW or Redaction
      const unitPrice = source?.[colorKey]?.[format]?.[bracket] || 0;
      price = unitPrice * quantity;
    }
    else if (orderType === 'publi_reportage') {
      const priceKey = quantity > 1 ? 'multiple' : 'one';
      const baseLinePrice = PRICING_DATA.publi_reportage?.prices[reportageType]?.[priceKey] || 0;
      
      let linePrice = baseLinePrice;
      if (reportageType === 'deces' && hasPhoto) {
        // Line says "+ 40% du tarif avec photo"
        linePrice = linePrice * 1.4; 
      }
      
      price = linePrice * linesEstimate * quantity; // Total lines across all parutions
    }

    setTotalPrice(price);
  }, [formData, orderType]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.orders.create({
        ...formData,
        orderType,
        calculatedPrice: totalPrice
      });

      setAlert({
        show: true,
        type: 'success',
        message: '✅ Commande reçue ! Nous vous contacterons pour la validation et le paiement.'
      });
      
      // Optional: reset form
      // setFormData({ ...initialState }); 
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        type: 'error',
        message: '❌ Une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-neutral-900 to-primary-900 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] z-0"></div>
      <div className="absolute top-20 left-20 w-[300px] h-[300px] bg-primary-400/10 rounded-full blur-[80px] z-0"></div>

      <CustomAlert 
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="container-custom relative z-10 py-20 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-6">
            <Globe size={14} className="text-primary-400" />
            Portée Nationale & Internationale
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Commander une <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">Publicité</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Configurez votre insertion ou abonnement selon la grille tarifaire officielle du journal Le Focus.
            Visibilité garantie.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Configuration */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Service Type Selector */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-neutral-100"
            >
              <h2 className="text-xl font-bold font-serif text-neutral-900 mb-6 flex items-center gap-3">
                <Layers className="text-primary-600" />
                Choisir le type de service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'insertion', label: 'Insertion Publicitaire', desc: 'Espaces publicitaires standards', icon: Layers },
                  { id: 'abonnement', label: 'Abonnement', desc: 'Recevez le journal périodiquement', icon: Globe },
                  { id: 'publi_reportage', label: 'Publi-Reportage', desc: 'Articles dédiés et annonces', icon: FileText },
                  { id: 'publi_redaction', label: 'Publi-Rédaction', desc: 'Contenu rédigé sur mesure', icon: Type },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setOrderType(type.id)}
                    className={`relative overflow-hidden group p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                      orderType === type.id
                        ? 'border-primary-600 bg-primary-50/50'
                        : 'border-neutral-100 bg-white hover:border-primary-200 hover:shadow-lg'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      orderType === type.id ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-500 group-hover:bg-primary-50 group-hover:text-primary-600'
                    }`}>
                      <type.icon size={24} />
                    </div>
                    <div className="font-bold text-neutral-900 text-lg mb-1">{type.label}</div>
                    <div className="text-sm text-neutral-500 group-hover:text-neutral-700">{type.desc}</div>
                    
                    {orderType === type.id && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute top-4 right-4 text-primary-600"
                      >
                        <CheckCircle size={20} />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Dynamic Form Fields */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit} 
              className="bg-white rounded-3xl shadow-xl p-8 border border-neutral-100"
            >
              <h3 className="text-xl font-bold font-serif mb-8 flex items-center gap-3 pb-4 border-b border-neutral-100">
                <Calculator className="text-primary-600" />
                Configuration de l'offre
              </h3>

              <div className="space-y-8">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={orderType}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* ABONNEMENT FIELDS */}
                    {orderType === 'abonnement' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-bold text-neutral-900 mb-2">Zone Géographique</label>
                          <select name="zone" value={formData.zone} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 transition-all outline-none">
                            {PRICING_DATA.abonnement.zones.map(z => (
                              <option key={z.id} value={z.id}>{z.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-base font-bold text-neutral-900 mb-2">Durée d'abonnement</label>
                          <select name="duration" value={formData.duration} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 transition-all outline-none">
                            {PRICING_DATA.abonnement.durations.map(d => (
                              <option key={d.id} value={d.id}>{d.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* INSERTION FIELDS */}
                    {orderType === 'insertion' && (
                      <div className="space-y-6">
                        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                          <label className="block text-base font-bold text-neutral-900 mb-3">Mode d'impression</label>
                          <div className="flex gap-4">
                            <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.isColor ? 'border-primary-600 bg-white shadow-md' : 'border-neutral-200 hover:border-neutral-300'}`}>
                              <input type="radio" name="isColor" checked={formData.isColor} onChange={() => setFormData({...formData, isColor: true})} className="hidden" />
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>
                              <span className="font-bold text-neutral-900 text-lg">Couleur</span>
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${!formData.isColor ? 'border-neutral-800 bg-neutral-800 text-white shadow-md' : 'border-neutral-200 hover:border-neutral-300'}`}>
                              <input type="radio" name="isColor" checked={!formData.isColor} onChange={() => setFormData({...formData, isColor: false})} className="hidden" />
                              <div className="w-4 h-4 rounded-full bg-neutral-400"></div>
                              <span className="font-bold text-lg">Noir & Blanc</span>
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-base font-bold text-neutral-900 mb-2">Format de l'annonce</label>
                            <select name="format" value={formData.format} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none">
                              {(formData.isColor ? PRICING_DATA.insertion.options.color : PRICING_DATA.insertion.options.bw).map(f => (
                                <option key={f.id} value={f.id}>{f.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-base font-bold text-neutral-900 mb-2">Nombre de parutions</label>
                            <input 
                              type="number" 
                              name="quantity" 
                              min="1" 
                              value={formData.quantity} 
                              onChange={handleChange} 
                              className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none"
                            />
                            <p className="text-sm text-primary-600 font-medium mt-2">
                              {formData.quantity > 40 ? '✅ Tarif > 40 parutions appliqué' : formData.quantity > 10 ? '✅ Tarif 11-40 parutions appliqué' : 'Tarif standard 1-10 parutions'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PUBLI-REDACTION */}
                    {orderType === 'publi_redaction' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-base font-bold text-neutral-900 mb-2">Type de rédaction</label>
                                <select name="redactionType" value={formData.redactionType} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none">
                                    <option value="proposed">A - Texte proposé par l'annonceur</option>
                                    <option value="redaction">B - Texte rédigé par la rédaction</option>
                                </select>
                            </div>
                            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                                <label className="block text-base font-bold text-neutral-900 mb-3">Mode d'impression</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.isColor ? 'border-primary-600 bg-white shadow-md' : 'border-neutral-200 hover:border-neutral-300'}`}>
                                        <input type="radio" name="isColor" checked={formData.isColor} onChange={() => setFormData({...formData, isColor: true})} className="hidden" />
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>
                                        <span className="font-bold text-neutral-900 text-lg">Couleur</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${!formData.isColor ? 'border-neutral-800 bg-neutral-800 text-white shadow-md' : 'border-neutral-200 hover:border-neutral-300'}`}>
                                        <input type="radio" name="isColor" checked={!formData.isColor} onChange={() => setFormData({...formData, isColor: false})} className="hidden" />
                                        <div className="w-4 h-4 rounded-full bg-neutral-400"></div>
                                        <span className="font-bold text-lg">Noir & Blanc</span>
                                    </label>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-base font-bold text-neutral-900 mb-2">Format</label>
                                    <select name="format" value={formData.format} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none">
                                    <option value="1page">1 Page</option>
                                    <option value="1/2">1/2 Page</option>
                                    <option value="1/4">1/4 Page</option>
                                    {formData.redactionType === 'proposed' && formData.isColor && (
                                        <>
                                        <option value="1/8">1/8 Page</option>
                                        <option value="1/16">1/16 Page</option>
                                        </>
                                    )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-base font-bold text-neutral-900 mb-2">Nombre de parutions</label>
                                    <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none" />
                                </div>
                             </div>
                        </div>
                    )}

                    {/* PUBLI-REPORTAGE */}
                    {orderType === 'publi_reportage' && (
                        <div className="space-y-6">
                            <div>
                            <label className="block text-base font-bold text-neutral-900 mb-2">Catégorie</label>
                            <select name="reportageType" value={formData.reportageType} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none">
                                {PRICING_DATA.publi_reportage.types.map(t => (
                                <option key={t.id} value={t.id}>{t.label}</option>
                                ))}
                            </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-bold text-neutral-900 mb-2">Nombre de parutions</label>
                                <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-base font-bold text-neutral-900 mb-2">Estimation Lignes</label>
                                <input type="number" name="linesEstimate" min="1" value={formData.linesEstimate} onChange={handleChange} className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none" />
                            </div>
                            </div>
                            {formData.reportageType === 'deces' && (
                            <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100">
                                <input 
                                type="checkbox" 
                                name="hasPhoto" 
                                id="hasPhoto"
                                checked={formData.hasPhoto} 
                                onChange={(e) => setFormData({...formData, hasPhoto: e.target.checked})} 
                                className="w-5 h-5 accent-primary-600 rounded cursor-pointer"
                                />
                                <label htmlFor="hasPhoto" className="text-base font-bold text-primary-900 cursor-pointer select-none">Inclure une photo avec l'annonce (+40%)</label>
                            </div>
                            )}
                        </div>
                    )}

                  </motion.div>
                </AnimatePresence>

                <div className="h-px bg-neutral-100 my-8"></div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-bold text-lg text-neutral-900 mb-6 flex items-center gap-2">
                    <User className="text-primary-600" size={20} />
                    Vos Coordonnées
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom complet *" required className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-neutral-400" />
                    </div>
                    <div>
                      <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Entreprise (Optionnel)" className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-neutral-400" />
                    </div>
                    <div>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email professionnel *" required className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-neutral-400" />
                    </div>
                    <div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone mobile *" required className="w-full p-4 rounded-xl text-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-neutral-400" />
                    </div>
                  </div>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows="4" 
                    placeholder="Message complémentaire ou précisions sur votre commande..." 
                    className="w-full p-4 rounded-xl text-lg mt-6 bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 outline-none resize-none transition-all placeholder:text-neutral-400"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-5 text-lg font-bold shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 flex items-center justify-center gap-3 mt-8 rounded-xl overflow-hidden relative group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={22} />}
                  <span className="relative z-10">Envoyer la Commande</span>
                </motion.button>
              </div>
            </motion.form>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <motion.div 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-neutral-900/95 backdrop-blur-xl text-white p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"></div>
                
                <h3 className="text-xl font-bold font-serif mb-8 flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-primary-500/20 rounded-lg">
                    <DollarSign className="text-primary-400" size={20} />
                  </div>
                  Estimation
                </h3>

                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex justify-between items-center text-neutral-400 text-sm">
                    <span>Type de service</span>
                    <span className="text-white font-medium capitalize bg-white/10 px-3 py-1 rounded-full">{orderType.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="h-px bg-white/10 my-4"></div>
                  
                  {orderType === 'abonnement' ? (
                    <>
                      <div className="flex justify-between items-center text-neutral-400">
                        <span>Zone</span>
                        <span className="text-white font-bold uppercase text-right max-w-[150px]">{PRICING_DATA.abonnement.zones.find(z => z.id === formData.zone)?.label}</span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-400">
                        <span>Durée</span>
                        <span className="text-white font-bold">{PRICING_DATA.abonnement.durations.find(d => d.id === formData.duration)?.label}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-neutral-400">
                        <span>Quantité</span>
                        <span className="text-white font-bold">{formData.quantity} parutions</span>
                      </div>
                      {(orderType === 'insertion' || orderType === 'publi_redaction') && (
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Format</span>
                          <span className="text-white font-bold">
                            {formData.format} <span className="text-neutral-500 text-sm font-normal ml-1">({formData.isColor ? 'Couleur' : 'N&B'})</span>
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 relative z-10">
                  <div className="text-sm text-neutral-400 mb-1">Total Estimé HT</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
                        {totalPrice.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-lg text-neutral-400 font-medium">FCFA</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 italic">
                    *Ce montant est une estimation. Le prix final sera confirmé par notre service commercial.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-lg"
              >
                <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-full">
                        <Phone size={16} />
                    </div>
                    Besoin d'assistance ?
                </h4>
                <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                  Notre équipe commerciale est disponible pour vous guider dans le choix de votre format publicitaire.
                </p>
                <a href="tel:+2290196768717" className="flex items-center justify-center gap-2 text-primary-700 font-bold bg-primary-50 py-3 rounded-xl hover:bg-primary-100 transition-colors">
                  Contacter le support
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInsertion;

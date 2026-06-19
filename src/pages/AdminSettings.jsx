import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Globe, Shield, Bell, Mail } from 'lucide-react';
import CustomAlert from '../components/CustomAlert';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Le Focus',
    defaultAuthor: 'Wabi MIGAN',
    contactEmail: 'contact@lefocus.com',
    enableNewsletter: true,
    articlesPerPage: 9
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    const savedSettings = localStorage.getItem('focus_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('focus_settings', JSON.stringify(settings));
      setIsLoading(false);
      setAlert({
        show: true,
        type: 'success',
        message: 'Paramètres enregistrés avec succès !'
      });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <CustomAlert 
        show={alert.show} 
        type={alert.type} 
        message={alert.message} 
        onClose={() => setAlert({ ...alert, show: false })} 
      />

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Paramètres</h1>
        <p className="text-neutral-500">Gérez la configuration générale de votre site</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
            <div className="p-2 bg-primary-50 text-primary-500 rounded-lg">
              <Globe size={20} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Général</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Nom du site</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Email de contact</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Author Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
            <div className="p-2 bg-primary-50 text-primary-500 rounded-lg">
              <User size={20} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Auteur par défaut</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Nom de l'auteur</label>
              <p className="text-xs text-neutral-500 mb-2">Ce nom sera utilisé par défaut lors de la création d'un nouvel article.</p>
              <input
                type="text"
                name="defaultAuthor"
                value={settings.defaultAuthor}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium"
              />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-500-temp transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>Enregistrement...</>
            ) : (
              <>
                <Save size={20} />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;

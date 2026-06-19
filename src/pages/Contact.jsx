import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import CustomAlert from '../components/CustomAlert';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Créer le message pour WhatsApp
      const message = `Bonjour, je suis ${formData.name}.\n\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/2290196768717?text=${encodedMessage}`;
      
      // Ouvrir WhatsApp
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      setAlert({ show: true, type: 'success', message: 'Redirection vers WhatsApp...' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setAlert({ show: true, type: 'error', message: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <CustomAlert show={alert.show} type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="editorial-kicker">Écrivez-nous</p>
          <h1 className="page-title">Contact</h1>
        </div>
      </section>

      <section className="border-b border-neutral-200 py-10 sm:py-12">
        <div className="container-custom max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="mb-3 block font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Nom</label>
              <input name="name" value={formData.name} onChange={handleChange} className="focus-input h-14" required />
            </div>
            <div>
              <label className="mb-3 block font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="focus-input h-14" required />
            </div>
            <div>
              <label className="mb-3 block font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={7} className="focus-input resize-none" required />
            </div>
            <button disabled={isSubmitting} className="mt-5 block bg-primary-500 px-6 py-4 text-center font-display text-sm font-bold text-white hover:bg-primary-500-temp">
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              Envoyer
            </button>
          </form>

          <div className="mt-12 border-t border-neutral-200 pt-8 font-serif text-[16px] leading-8 text-neutral-600">
            <h2 className="mb-4 text-[22px] font-black text-neutral-950">Autres moyens de nous joindre</h2>
            <p><strong>Email :</strong> miganwabi@gmail.com</p>
            <p><strong>Tel :</strong> +229 01 96 76 87 17</p>
            <p><strong>Adresse :</strong> Adjna Nord, Porto-Novo, Bénin</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

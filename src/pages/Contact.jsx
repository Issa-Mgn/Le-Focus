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
      const response = await fetch('https://formspree.io/f/xldqkeeb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erreur lors de l’envoi');
      setAlert({ show: true, type: 'success', message: 'Votre message a été envoyé avec succès.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setAlert({ show: true, type: 'error', message: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
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

      <section className="border-b border-neutral-200 py-12 sm:py-16">
        <div className="container-custom max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="mb-4 block font-display text-sm font-bold uppercase tracking-[0.12em] text-neutral-500">Nom</label>
              <input name="name" value={formData.name} onChange={handleChange} className="focus-input h-20" required />
            </div>
            <div>
              <label className="mb-4 block font-display text-sm font-bold uppercase tracking-[0.12em] text-neutral-500">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="focus-input h-20" required />
            </div>
            <div>
              <label className="mb-4 block font-display text-sm font-bold uppercase tracking-[0.12em] text-neutral-500">Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={8} className="focus-input resize-none" required />
            </div>
            <button disabled={isSubmitting} className="inline-flex min-w-[184px] items-center justify-center gap-2 bg-[#151515] px-10 py-5 font-display text-lg font-bold text-white hover:bg-primary-800 disabled:opacity-60">
              {isSubmitting && <Loader2 size={20} className="animate-spin" />}
              Envoyer
            </button>
          </form>

          <div className="mt-16 border-t border-neutral-200 pt-12 font-serif text-[25px] leading-10 text-neutral-600">
            <h2 className="mb-5 text-[30px] font-black text-neutral-950">Autres moyens de nous reach</h2>
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

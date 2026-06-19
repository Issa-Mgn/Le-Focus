import React, { useState } from 'react';
import CustomAlert from '../components/CustomAlert';

const services = [
  'Insertion publicitaire',
  'Abonnement',
  'Publi-reportage',
  'Publi-rédaction',
  'Annonce diverse',
];

const OrderInsertion = () => {
  const [formData, setFormData] = useState({
    service: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = [
      '*Nouvelle demande - Le Focus*',
      '',
      `Type de service: ${formData.service}`,
      `Nom: ${formData.name}`,
      `Email: ${formData.email}`,
      `Téléphone: ${formData.phone}`,
      '',
      `Message: ${formData.message || 'Aucun détail supplémentaire'}`,
    ].join('\n');

    window.open(`https://wa.me/2290196768717?text=${encodeURIComponent(message)}`, '_blank');
    setAlert({ show: true, type: 'success', message: 'Redirection vers WhatsApp...' });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <CustomAlert show={alert.show} type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="editorial-kicker">Tarifs 2026</p>
          <h1 className="page-title max-w-3xl">Commander une insertion</h1>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container-custom max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="mb-3 block font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Type de service *</label>
              <select name="service" value={formData.service} onChange={handleChange} required className="focus-input h-14 text-base">
                <option value="">Sélectionner...</option>
                {services.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-3 block font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Nom *</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="focus-input h-14" />
              </div>
              <div>
                <label className="mb-3 block font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Email *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required className="focus-input h-14" />
              </div>
            </div>

            <div>
              <label className="mb-3 block font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Téléphone *</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="focus-input h-14" />
            </div>

            <div>
              <label className="mb-3 block font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Message / détails supplémentaires</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={7} className="focus-input resize-none" />
            </div>

            <button className="w-full bg-primary-500 px-8 py-5 font-display text-base font-bold text-white hover:bg-primary-500-temp">
              Envoyer la demande
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default OrderInsertion;

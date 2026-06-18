import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';

const Footer = () => {
  const categories = ['Politique', 'Économie', 'Société', 'Culture', 'Sport'];
  const socials = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-[#151515] text-neutral-400">
      <div className="container-custom py-16 sm:py-20">
        <div className="max-w-xl">
          <div className="mb-7 flex items-center gap-4">
            <div className="grid h-[62px] w-[62px] place-items-center bg-primary-700 font-serif text-[32px] font-black text-white">F</div>
            <div>
              <h2 className="font-serif text-[30px] font-black leading-none text-white">Le Focus</h2>
              <p className="mt-3 font-display text-[11px] uppercase tracking-[0.28em] text-neutral-600">Porto-Novo</p>
            </div>
          </div>

          <p className="font-serif text-[23px] leading-9 text-neutral-400">
            Journal d'informations et d'enquêtes. L'actualité en profondeur depuis Porto-Novo.
          </p>

          <div className="mt-7 flex gap-4">
            {socials.map((social) => (
              <a key={social.label} href="#" aria-label={social.label} className="grid h-12 w-12 place-items-center bg-neutral-800 text-neutral-500 transition hover:bg-primary-700 hover:text-white">
                <social.icon size={21} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="editorial-kicker mb-6 !text-neutral-500">Rubriques</h3>
            <div className="space-y-5 font-serif text-[24px] text-neutral-400">
              {categories.map((category) => (
                <Link key={category} to={`/category/${category.toLowerCase()}`} className="block transition hover:text-white">
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="editorial-kicker mb-6 !text-neutral-500">Contact</h3>
            <div className="space-y-5 font-serif text-[23px] text-neutral-400">
              <a href="mailto:miganwabi@gmail.com" className="flex items-center gap-4 transition hover:text-white">
                <Mail size={19} className="text-primary-600" />
                miganwabi@gmail.com
              </a>
              <a href="tel:+2290196768717" className="flex items-center gap-4 transition hover:text-white">
                <Phone size={19} className="text-primary-600" />
                +229 01 96 76 87 17
              </a>
              <div className="flex items-center gap-4">
                <MapPin size={19} className="text-primary-600" />
                Adjna Nord, Porto-Novo
              </div>
            </div>
          </div>

          <div>
            <h3 className="editorial-kicker mb-6 !text-neutral-500">Newsletter</h3>
            <p className="mb-6 font-serif text-[23px] text-neutral-400">Recevez nos articles directement.</p>
            <form className="flex items-center border-b border-neutral-700 pb-3">
              <input className="min-w-0 flex-1 bg-transparent py-3 font-display text-base text-white outline-none placeholder:text-neutral-600" placeholder="Votre email" />
              <button type="submit" className="text-primary-500 transition hover:text-primary-400" aria-label="S'inscrire">
                <Send size={24} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-neutral-800 pt-9 text-center font-serif text-[18px] text-neutral-700">
          <p>© 2026 Le Focus. Tous droits réservés.</p>
          <div className="mt-7 flex justify-center gap-7 font-display text-sm">
            <Link to="/privacy" className="hover:text-neutral-400">Confidentialité</Link>
            <Link to="/terms" className="hover:text-neutral-400">Conditions</Link>
          </div>
          <p className="mt-8 font-display text-sm">
            Réalisé par <a href="https://litxxcompany.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400">L!txx</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

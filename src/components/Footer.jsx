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
      <div className="container-custom py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[1.25fr_1fr_1.15fr_1.2fr]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center bg-primary-500 font-serif text-[22px] font-black text-white">F</div>
              <div>
                <h2 className="font-serif text-[19px] font-black leading-none text-white">Le Focus</h2>
                <p className="mt-2 font-display text-[9px] uppercase tracking-[0.24em] text-neutral-600">Porto-Novo</p>
              </div>
            </div>

            <p className="font-serif text-[14px] leading-6 text-neutral-400">
              Journal d'informations et d'enquêtes. L'actualité en profondeur depuis Porto-Novo.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a key={social.label} href="#" aria-label={social.label} className="grid h-9 w-9 place-items-center bg-neutral-800 text-neutral-500 transition hover:bg-primary-500 hover:text-white">
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="editorial-kicker mb-5 !text-neutral-500">Rubriques</h3>
            <div className="space-y-3 font-serif text-[14px] text-neutral-400">
              {categories.map((category) => (
                <Link key={category} to={`/category/${category.toLowerCase()}`} className="block transition hover:text-white">
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="editorial-kicker mb-5 !text-neutral-500">Contact</h3>
            <div className="space-y-3 font-serif text-[14px] text-neutral-400">
              <a href="mailto:miganwabi@gmail.com" className="flex items-center gap-3 transition hover:text-white">
                <Mail size={16} className="text-primary-500" />
                miganwabi@gmail.com
              </a>
              <a href="tel:+2290196768717" className="flex items-center gap-3 transition hover:text-white">
                <Phone size={16} className="text-primary-500" />
                +229 01 96 76 87 17
              </a>
              <a href="tel:+2290140496090" className="flex items-center gap-3 transition hover:text-white">
                <Phone size={16} className="text-primary-500" />
                +229 01 40 49 60 90
              </a>
              <a 
                href="https://wa.me/2290196768717" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition "
              >  
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" color="#E60000">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-primary-500" />
                Adjna Nord, Porto-Novo
              </div>
            </div>
          </div>

          <div>
            <h3 className="editorial-kicker mb-5 !text-neutral-500">Newsletter</h3>
            <p className="mb-5 font-serif text-[14px] text-neutral-400">Recevez nos articles directement.</p>
            <form className="flex items-center border-b border-neutral-700 pb-2">
              <input className="min-w-0 flex-1 bg-transparent py-2 font-display text-sm text-white outline-none placeholder:text-neutral-600" placeholder="Votre email" />
              <button type="submit" className="text-primary-500 transition hover:text-primary-400" aria-label="S'inscrire">
                <Send size={19} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-7 text-center">
          <p className="font-serif text-[13px] text-neutral-700">© 2026 Le Focus. Tous droits réservés.</p>
          <p className="mt-3 font-display text-xs text-neutral-700">
            Réalisé par <a href="https://litxxcompany.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400">L!txx</a>
          </p>
          <div className="mt-3 flex justify-center gap-6 font-display text-xs text-neutral-700">
            <Link to="/privacy" className="hover:text-neutral-400">Confidentialité</Link>
            <Link to="/terms" className="hover:text-neutral-400">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

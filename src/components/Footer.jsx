import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import MailchimpSubscribe from "react-mailchimp-subscribe";
import logo from '../assets/logo.jpg';

const MAILCHIMP_URL = "http://eepurl.com/juwIPk";

// Composant de formulaire personnalisé pour gérer les états de Mailchimp
const CustomForm = ({ status, message, onValidated }) => {
  let email;
  const submit = () =>
    email &&
    email.value.indexOf("@") > -1 &&
    onValidated({
      EMAIL: email.value,
    });

  return (
    <div className="flex flex-col gap-3">
        <div className="relative">
        <input
            ref={node => (email = node)}
            type="email"
            placeholder="Votre email"
            className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all placeholder:text-neutral-500"
        />
        </div>
        <motion.button
            onClick={submit}
            disabled={status === "sending"}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Send size={16} />
            {status === "sending" ? "Envoi..." : "S'abonner"}
        </motion.button>
        
        {/* Feedback Messages */}
        {status === "error" && (
            <div className="text-red-400 text-xs mt-2" dangerouslySetInnerHTML={{ __html: message }} />
        )}
        {status === "success" && (
            <div className="text-green-400 text-xs mt-2">Merci ! Votre inscription est confirmée.</div>
        )}
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-800 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-20 border-b border-neutral-800">
          {/* Brand Column */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <motion.div 
                className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary-600/30"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img src={logo} alt="Le Focus" className="w-full h-full object-cover" />
              </motion.div>
              <div>
                <span className="text-2xl font-serif font-bold block">Le Focus</span>
                <span className="text-xs text-neutral-400 font-medium tracking-wider uppercase">
                  Journal d'Excellence
                </span>
              </div>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Votre source d'information privilégiée pour une analyse approfondie de l'actualité économique, politique et sociale.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`p-3 bg-neutral-800 rounded-xl ${social.color} transition-all hover:bg-neutral-700 hover:-translate-y-1`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-800 rounded-full"></div>
              Rubriques
            </h3>
            <ul className="space-y-3">
              {['Politique', 'Économie', 'Société', 'Culture', 'Technologie', 'Sport'].map((item, index) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={`/category/${item.toLowerCase()}`} 
                    className="text-neutral-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary-500 group-hover:w-4 transition-all"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-800 rounded-full"></div>
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-neutral-400">
                <Mail size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <a href="mailto:miganwabi@gmail.com" className="hover:text-primary-400 transition-colors">
                  contact@lefocus.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-neutral-400">
                <MapPin size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <span>Quartier Adjna Nord <br />Porto-Novo, Bénin</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-400">
                <Phone size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <a href="tel:+2290196768717 " className="hover:text-primary-400 transition-colors">
                  Appelez-nous
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-800 rounded-full"></div>
              Newsletter
            </h3>
            <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
              Restez informé des dernières actualités.
            </p>
            
            {/* Mailchimp Integration */}
            <MailchimpSubscribe
                url={MAILCHIMP_URL}
                render={({ subscribe, status, message }) => (
                    <CustomForm
                        status={status}
                        message={message}
                        onValidated={formData => subscribe(formData)}
                    />
                )}
            />

            <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500">
              <Sparkles size={12} className="text-primary-500" />
              <span>Gratuit et sans spam</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="py-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-neutral-500">
            &copy; {currentYear} <span className="text-white font-semibold">Le Focus</span>. Tous droits réservés.
          </p>
          <div className="flex gap-3 text-sm">
            <Link to="/privacy" className="text-neutral-500 hover:text-primary-400 transition-colors">
              Cookies
            </Link>
            <Link to="/terms" className="text-neutral-500 hover:text-primary-400 transition-colors">
              Conditions 
            </Link>
            <Link to="/cookies" className="text-neutral-500 hover:text-primary-400 transition-colors">
              Confidentialité
            </Link>
            <Link to="/admin" className="text-neutral-500 hover:text-primary-400 transition-colors">
            </Link>
          </div>
        </motion.div>

        {/* Developer Credit */}
        <motion.div 
          className="pb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-xs text-neutral-600">
            Réalisé par <a href="https://litxxcompany.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-400 transition-colors font-medium">L!txx</a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

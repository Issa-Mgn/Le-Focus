import React from 'react';
import { Link } from 'react-router-dom';

const values = [
  ['Excellence', 'Nous recherchons la qualité dans chaque article.'],
  ['Intégrité', 'Honnêteté et transparence guident notre travail.'],
  ['Proximité', "Nous sommes à l'écoute de nos lecteurs."],
];

const About = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="editorial-kicker">Notre histoire</p>
          <h1 className="page-title">À propos du Focus</h1>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container-custom max-w-3xl">
          <div className="font-serif text-[16px] leading-8 text-neutral-600">
            <h2 className="mb-5 text-[24px] font-black leading-tight text-neutral-950" >Le journal de Porto-Novo</h2>
            <p className="mb-6">
              Le Focus est un journal d'information et   d'investigation paraissant à Porto-Novo, au Bénin. Nous couvrons
              l'actualité avec rigueur et indépendance.
            </p>
            <p className="mb-6">
              Notre mission : vous informer sans concession. Politique, économie, société, culture, nous analysons les
              sujets qui comptent pour vous.
            </p>
            <p>
              Basés au coeur de Porto-Novo, nous gardons un regard critique sur l'actualité locale et internationale.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {values.map(([title, description]) => (
              <div key={title} className="border-t-2 border-primary-500 bg-white px-6 py-6">
                <h3 className="font-serif text-[20px] font-black text-neutral-950">{title}</h3>
                <p className="mt-3 font-serif text-[15px] leading-7 text-neutral-600">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-[24px] font-black text-neutral-950">Nous contacter</h2>
            <p className="mt-3 font-serif text-[16px] text-neutral-600">Une question ? Écrivez-nous.</p>
            <Link to="/contact" className="mt-6 inline-block bg-[#E60000] px-7 py-4 font-display text-sm font-bold text-white hover:bg-primary-500-temp">
              Page Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

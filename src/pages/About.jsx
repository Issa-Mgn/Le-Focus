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
          <h1 className="page-title">À Propos du Focus</h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-custom max-w-4xl">
          <div className="font-serif text-[25px] leading-10 text-neutral-600">
            <h2 className="mb-7 text-[33px] font-black leading-tight text-neutral-950">Le journal de Porto-Novo</h2>
            <p className="mb-8">
              Le Focus est un journal d'information et d'investigation paraissant à Porto-Novo, au Bénin. Nous couvrons
              l'actualité avec rigueur et indépendance.
            </p>
            <p className="mb-8">
              Notre mission : vous informer sans concession. Politique, économie, société, culture — nous analysons les
              sujets qui comptent pour vous.
            </p>
            <p>
              Basés au cœur de Porto-Novo, nous gardons un regard critique sur l'actualité locale et internationale.
            </p>
          </div>

          <div className="mt-14 space-y-10">
            {values.map(([title, description]) => (
              <div key={title} className="border-t-4 border-primary-800 bg-white px-8 py-8">
                <h3 className="font-serif text-[28px] font-black text-neutral-950">{title}</h3>
                <p className="mt-4 font-serif text-[20px] leading-8 text-neutral-600">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="font-serif text-[36px] font-black text-neutral-950">Nous contacter</h2>
            <p className="mt-5 font-serif text-[25px] text-neutral-600">Une question ? Écrivez-nous.</p>
            <Link to="/contact" className="mt-7 inline-block bg-[#151515] px-9 py-5 font-display text-lg font-bold text-white hover:bg-primary-800">
              Page Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

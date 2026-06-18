import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-grow pt-[76px] md:pt-[82px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FogReveal from '../common/FogReveal';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF5]">
      {/* Atmospheric Organic Mist Reveal Effect on Page Load / Refresh */}
      <FogReveal key={location.pathname} />

      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

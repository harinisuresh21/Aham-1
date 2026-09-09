import React from 'react';
import HeroContent from './HeroContent';
import HeroVisual from './HeroVisual';
import HeroStats from './HeroStats';
import desktopBg from '../../../assets/hero-bg-desktop.png';
import mobileBg from '../../../assets/hero-bg-mobile.png';

const Hero = () => {
  return (
    <section aria-label="Introduction" className="relative bg-[#FDFAF5] flex flex-col w-full overflow-hidden">
      {/* Hero Main Area */}
      <div className="relative w-full flex flex-col md:flex-row min-h-[640px] md:h-[clamp(580px,72vw,680px)] lg:h-[clamp(640px,52vw,780px)] bg-[#FDFAF5] overflow-visible">

        {/* 1. Background Layer — Natural Forest & Cream Backdrop */}
        <div className="absolute inset-0 bg-[#FDFAF5] overflow-hidden" style={{ zIndex: 0 }}>
          <picture className="w-full h-full block">
            <source media="(min-width: 768px)" srcSet={desktopBg} />
            <img
              src={mobileBg}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-bottom md:object-[center_bottom] pointer-events-none"
            />
          </picture>

          {/* Mobile gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFAF5]/90 via-[#FDFAF5]/50 to-transparent md:hidden pointer-events-none" />

          {/* Desktop gradient overlay */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FDFAF5]/90 via-[#FDFAF5]/40 to-transparent w-[60%] lg:w-[50%] pointer-events-none" />

          {/* Bottom seamless blend overlay for Hero image */}
          <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 lg:h-72 bg-gradient-to-t from-[#FDFAF5] via-[#FDFAF5]/85 to-transparent pointer-events-none" />
        </div>

        {/* 2. Content Container — 2-Column Split Layout */}
        <div
          className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[clamp(32px,5vw,80px)] flex flex-col md:flex-row h-full pt-20 sm:pt-24 md:pt-14 pb-12 md:pb-0 items-center overflow-visible"
          style={{ position: 'relative' }}
        >
          {/* Left Column: Typography & Content */}
          <div
            className="w-full md:w-[52%] lg:w-[48%] xl:w-[46%] h-full flex flex-col justify-center order-1 pb-6 md:pb-0"
            style={{ position: 'relative', zIndex: 20 }}
          >
            <HeroContent />
          </div>

          {/* Right Column: Clean, Static Turmeric Bottle Presentation */}
          <div
            className="w-full md:w-[48%] lg:w-[52%] xl:w-[54%] h-full flex items-center justify-center md:items-center md:justify-end order-2 mt-4 md:mt-0 overflow-visible"
            style={{ position: 'relative', zIndex: 30 }}
          >
            <HeroVisual />
          </div>

        </div>
      </div>

      {/* 3. Statistics Panel (Seamless integration at the bottom) */}
      <div
        className="w-full px-4 lg:px-8 -mt-8 sm:-mt-10 md:-mt-8 lg:-mt-12 max-w-[1400px] mx-auto pb-8 sm:pb-12"
        style={{ position: 'relative', zIndex: 20 }}
      >
        <HeroStats />
      </div>

      {/* Soft gradient bleed into next section for seamless continuity */}
      <div className="w-full h-8 bg-gradient-to-b from-transparent to-[#FDFAF5] pointer-events-none" />
    </section>
  );
};

export default Hero;

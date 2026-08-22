import React from 'react';
import HeroContent from './HeroContent';
import HeroVisual from './HeroVisual';
import HeroStats from './HeroStats';
import desktopBg from '../../../assets/hero-bg-desktop.png';
import mobileBg from '../../../assets/hero-bg-mobile.png';

const Hero = () => {
  return (
    <section aria-label="Introduction" className="relative bg-[#F8F4EA] flex flex-col w-full">
      {/* Hero Main Area */}
      <div className="relative w-full flex flex-col md:flex-row h-[clamp(720px,95vh,820px)] md:h-[clamp(560px,70vw,640px)] lg:h-[clamp(640px,50vw,760px)] md:min-h-0 bg-[#FDFAF5]">

        {/* Background Layer — clipped */}
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
          {/* Mobile gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFAF5]/90 via-[#FDFAF5]/50 to-transparent md:hidden pointer-events-none"></div>
          {/* Desktop/Tablet gradient */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FDFAF5]/85 via-[#FDFAF5]/30 to-transparent w-[60%] lg:w-[50%] pointer-events-none"></div>
        </div>

        {/* Content Container — no z-index so children can independently z-stack against siblings */}
        <div
          className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[clamp(32px,5vw,80px)] flex flex-col md:flex-row h-full pt-24 sm:pt-28 md:pt-16 pb-14 md:pb-0 items-center"
          style={{ position: 'relative' }}
        >
          {/* Left Column: Content */}
          <div
            className="w-full md:w-[52%] lg:w-[48%] xl:w-[46%] h-full flex flex-col justify-center order-1 pb-8 md:pb-0"
            style={{ position: 'relative', zIndex: 20 }}
          >
            <HeroContent />
          </div>

          {/* Right Column: Product Visual
              zIndex: 40 < header's z-50, so product renders BEHIND the glass navbar */}
          <div
            className="w-full md:w-[48%] lg:w-[52%] xl:w-[54%] h-full flex items-center justify-center md:items-center md:justify-end order-2 mt-6 md:mt-0"
            style={{ position: 'relative', zIndex: 40 }}
          >
            <HeroVisual />
          </div>

        </div>
      </div>

      {/* Statistics Panel */}
      <div
        className="w-full px-4 lg:px-8 -mt-10 sm:-mt-12 md:-mt-8 lg:-mt-12 max-w-[1400px] mx-auto"
        style={{ position: 'relative', zIndex: 20 }}
      >
        <HeroStats />
      </div>
    </section>
  );
};

export default Hero;
